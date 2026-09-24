// self.addEventListener("push", (e) => {
//     const data = e.data?.json() ?? {};

//     e.waitUntil(
//         self.registration.showNotification(data.title, {
//             body: data.body,
//             icon: "/pwa/icon-192.svg",
//         }),
//     );
// });

const CACHE_VERSION = 5;

self.addEventListener("install", (e) => {
    // e.waitUntil();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
    const req = e.request;

    // Don't cache.
    if (req.method !== "GET") return;
    if (req.url.includes("/api/")) return;
    if (new URL(req.url).pathname.endsWith("html")) return;

    e.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((resp) => {
                const copy = resp.clone();
                caches.open(String(CACHE_VERSION)).then((cache) => {
                    cache.put(req, copy);
                });
                return resp;
            });
        }),
    );
});
