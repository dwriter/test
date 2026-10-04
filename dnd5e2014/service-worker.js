const CACHE='dnd5e2014-player-v4.4.0';
const ASSETS=["./","./index.html","./manifest.json","./css/app.css?v=4.4.0","./js/loader.js?v=4.4.0","./js/bundle-gz-01.part?v=4.4.0","./js/bundle-gz-02.part?v=4.4.0","./js/bundle-gz-03.part?v=4.4.0","./js/bundle-gz-04a.part?v=4.4.0","./js/bundle-gz-04b.part?v=4.4.0","./js/bundle-gz-05.part?v=4.4.0","./js/bundle-gz-06.part?v=4.4.0","./js/bundle-gz-07a.part?v=4.4.0","./js/bundle-gz-07b.part?v=4.4.0","./js/bundle-gz-08a.part?v=4.4.0","./js/bundle-gz-08b.part?v=4.4.0","./js/bundle-gz-09.part?v=4.4.0","../icon-192.png","../icon-512.png"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put('./index.html',copy));
      return resp;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return resp;
  }).catch(()=>caches.match(e.request)));
});