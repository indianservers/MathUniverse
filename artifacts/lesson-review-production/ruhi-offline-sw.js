/* global self, caches, crypto, fetch, URL, Response, Headers */
const prefix='ruhi-offline-v6-';
const releaseVersion='__RUHI_OFFLINE_VERSION__';
const cacheName=prefix+releaseVersion;
const manifestURL=()=>new URL('ruhi-offline-assets.json',self.registration.scope);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const response=await fetch(manifestURL(),{cache:'no-store'});if(!response.ok)throw new Error('Offline manifest unavailable.');
 const manifest=await response.json();
 if(manifest.schema!==1||manifest.version!==releaseVersion||!/^[a-f0-9]{64}$/.test(manifest.version)||!Array.isArray(manifest.assets)||manifest.assets.length>2000||!Number.isFinite(manifest.bytes)||manifest.bytes>512*1024*1024)throw new Error('Invalid offline manifest.');
 const cache=await caches.open(cacheName);
 try{
  let next=0;await Promise.all(Array.from({length:4},async()=>{while(next<manifest.assets.length){const asset=manifest.assets[next++],url=new URL(asset.path,self.registration.scope);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope)||/\/(?:datasets|reports)\/|training\.worker-/.test(url.pathname)||!Number.isFinite(asset.size)||asset.size<0||asset.size>64*1024*1024)throw new Error('Unsafe offline asset.');const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Missing offline asset: '+asset.path);const bytes=await r.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',bytes),actual=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');if(bytes.byteLength!==asset.size||actual!==asset.sha256)throw new Error('Offline asset integrity mismatch: '+asset.path);const headers=new Headers(r.headers);headers.delete('content-encoding');headers.delete('content-length');headers.delete('vary');await cache.put(url,new Response(bytes,{status:200,headers}));}}));
  await cache.put(manifestURL(),new Response(JSON.stringify(manifest),{headers:{'content-type':'application/json'}}));
 }catch(error){await caches.delete(cacheName);throw error;}
 // Updates wait for existing clients to close; never reload unsaved work.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await Promise.all((await caches.keys()).filter(key=>key.startsWith(prefix)&&key!==cacheName).map(key=>caches.delete(key)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope)||/\/(?:datasets|reports)\/|training\.worker-/.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(cacheName);
  if(request.mode==='navigate'){const shell=await cache.match(new URL('index.html',self.registration.scope));if(shell)return shell;}
  const cached=await cache.match(request,{ignoreSearch:true,ignoreVary:true});return cached??fetch(request);
 })());
});
