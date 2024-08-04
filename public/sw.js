importScripts("/epoxy/index.js");
importScripts("/libcurl/index.js");
importScripts("/ultraviolet/uv.bundle.js");
importScripts("/ultraviolet/uv.config.js");
importScripts(__uv$config.sw || "/ultraviolet/uv.sw.js");
importScripts("/scramjet/scramjet.codecs.js");
importScripts("/scramjet/scramjet.config.js");
importScripts("/scramjet/scramjet.bundle.js");
importScripts("/scramjet/scramjet.worker.js");

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        (async () => { 
            if (event.request.url.startsWith(origin + __uv$config.prefix)) {
                return await uv.fetch(event);
            } else if (scramjet.route(event)) {
                return await scramjet.fetch(event);
            }

            return await fetch(event.request);
        })()
    );
});