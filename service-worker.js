const CACHE_NAME ="talksy-ai-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/chat.html",
    "/chat.css",
    'app.js',
    "manifest.json",
    "logo.png"
];
self.addEventListener("install", event => {
    event.waitUntill(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event =>{
    event.respondWith(
        caches.match(event.request)
        .then(response=>{
            return response || fetch(event.request);
        })
    );
});