// Sources:
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open("my-watchlists-cache")
      .then((cache) =>
        cache.addAll([
          "/",
          "/about",
          "/offline",
          "/privacy",
          "/logo.png",
          "/movieIcon.png",
          "/tmdb-logo.svg",
          "/favicon.ico",
          "/dog_meme.jpg",
        ])
      )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((response) => response || fetch(e.request))
      .catch(() => {
        return caches.match("/offline");
      })
  );
});
