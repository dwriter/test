'use strict';
const PREFIX='dnd2014-'+new URL(self.registration.scope).pathname+'-',CACHE=PREFIX+'1.0.0';
const FILES=["./", "./index.html", "./manifest.webmanifest", "./css/app.css", "./js/actions.js", "./js/app.js", "./js/character.js", "./js/content.js", "./js/dice.js", "./js/effects.js", "./js/rules.js", "./js/srd-data.js", "./js/storage.js", "./assets/icon.svg", "./assets/icon-192.png", "./assets/icon-512.png", "./docs/SRD_CC_v5.1.pdf"];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error())))});
