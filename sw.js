// Offline cache. Bump VERSION whenever you change files so your phone picks up the update.
const VERSION = "mathlore-v2";
const FILES = ["./", "index.html", "css/styles.css", "js/app.js", "js/store.js", "js/data.js", "js/gen.js", "js/quizlet.js", "manifest.json", "icons/icon-180.png", "icons/icon-192.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("mathlore-") && k !== VERSION).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; }).catch(() => caches.match(e.request)));
});
