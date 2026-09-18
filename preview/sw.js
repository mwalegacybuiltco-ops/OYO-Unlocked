const CACHE='oyo-shell-94ffabceb87c';const SHELL=["/","/assets/firebase-C6J1uOT9.js","/assets/index-CBkD3XGF.js","/assets/index-eRLYYPjp.css","/icon-192.png","/icon-512.png","/icon.svg","/index.html","/manifest.webmanifest","/worlds.webp"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('oyo-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin)return;
// Only public build assets are cached. Never cache auth, proofs, or API responses.
if(request.mode==='navigate'){event.respondWith(fetch(request).catch(()=>caches.match('/index.html')));return;}
if(SHELL.includes(url.pathname))event.respondWith(caches.match(url.pathname).then(cached=>cached||fetch(request)));
});