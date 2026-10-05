"""No third-party packages required. Build standalone HTML and offline cache list."""
from pathlib import Path
import re,json,base64,zipfile
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (root/m[1]).read_text()+'</style>',html)
html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+ (root/m[1]).read_text().replace('</script','<\\/script')+'</script>',html)
svg='data:image/svg+xml;base64,'+base64.b64encode((root/'assets/icon.svg').read_bytes()).decode()
html=html.replace('assets/icon.svg',svg)
(root/'standalone.html').write_text(html)
files=['./','./index.html','./manifest.webmanifest','./css/app.css',*[f'./js/{p.name}' for p in sorted((root/'js').glob('*.js'))],'./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./docs/SRD_CC_v5.1.pdf']
(root/'service-worker.js').write_text("""'use strict';
const PREFIX='dnd2014-'+new URL(self.registration.scope).pathname+'-',CACHE=PREFIX+'1.0.0';
const FILES="""+json.dumps(files)+""";
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error())))});
""")
with zipfile.ZipFile(root.parent/'dnd5e2014_companion.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  if p.is_file() and '__pycache__' not in str(p):z.write(p,Path(root.name)/p.relative_to(root))
print('Built standalone.html, service-worker.js, dnd5e2014_companion.zip')
