self.addEventListener("install", e=>{
self.skipWaiting();
});

self.addEventListener("activate", e=>{
console.log("Offline Weather Ready");
});

/* CACHE STATIC FILES */
const CACHE_NAME = "weather-app-cache";

const FILES = [
"/",
"/index.html",
"/style.css",
"/script.js"
];

self.addEventListener("install", e=>{
e.waitUntil(
caches.open(CACHE_NAME).then(cache=>{
return cache.addAll(FILES);
})
);
});

/* FETCH OFFLINE FALLBACK */
self.addEventListener("fetch", e=>{
e.respondWith(
fetch(e.request).catch(()=>{
return caches.match(e.request);
})
);
});
