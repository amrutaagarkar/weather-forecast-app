self.addEventListener("install", e=>{
self.skipWaiting();
});

self.addEventListener("activate", e=>{
console.log("SW active");
});

self.addEventListener("push", e=>{
const data = e.data ? e.data.json() : {};

self.registration.showNotification(data.title || "Weather Alert",{
body: data.body || "Weather update",
vibrate:[200,100,200]
});
});
