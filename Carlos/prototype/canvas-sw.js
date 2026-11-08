/* Practice canvas: a minimal offline copy.
   Cache-first for the page, the manifest and the two icons, cached on install.
   Everything else goes straight to the network and is never cached: the live model call above all
   (a POST to another origin), the /api/coach relay, and any other request.
   Bump the version in CACHE whenever the page changes so phones pick up the new copy. */
var CACHE = "practice-canvas-v2-phone-1";
var FILES = ["./canvas-prototype-v2.html", "./canvas-manifest.webmanifest", "./canvas-icon-192.png", "./canvas-icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (n) { return n.indexOf("practice-canvas-") === 0 && n !== CACHE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

function isOurFile(url) {
  var u = new URL(url);
  if (u.origin !== self.location.origin) return false;
  return FILES.some(function (f) { return new URL(f, self.location.href).pathname === u.pathname; });
}

self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || !isOurFile(r.url)) return; // network only, pass-through: never cached
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(function (hit) { return hit || fetch(r); }));
});
