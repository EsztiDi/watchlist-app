// Sources:
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("watchlists-store")
      .then((cache) =>
        cache.addAll([
          "/",
          "/lists",
          "/create",
          "/account",
          "/login",
          "/about",
          "/logo.png",
          "/movieIcon.png",
          "/tmdb-logo.svg",
        ])
      )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
