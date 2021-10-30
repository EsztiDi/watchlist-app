// Sources:
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
// https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js"
);

// Cache api responses with a network-first strategy for 24 hours
workbox.routing.registerRoute(
  ({ url }) => {
    const pathname = url.pathname;
    // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
    // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
    if (pathname.startsWith("/api/auth/")) return false;
    if (pathname.startsWith("/api/")) return true;
    return false;
  },
  new workbox.strategies.NetworkFirst({
    cacheName: "apis",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 64,
      }),
    ],
  })
);

// Cache TMDb api responses with a cache-first strategy for 24 hours
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://api.themoviedb.org",
  new workbox.strategies.CacheFirst({
    cacheName: "tmdb-apis",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 64,
      }),
    ],
  })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache font files with a cache-first strategy for 1 year
workbox.routing.registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 32,
      }),
    ],
  })
);

// Cache page navigations (html) with a Network First strategy if the request is a navigation to a new page
// workbox.routing.registerRoute(
//   ({ request }) => request.mode === "navigate",
//   new workbox.strategies.NetworkFirst({
//     cacheName: "pages",
//     plugins: [
//       new workbox.cacheableResponse.CacheableResponsePlugin({
//         statuses: [200],
//       }),
//     ],
//   })
// );

// Cache CSS, JS, and Web Worker requests with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "style" || request.destination === "worker",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// Cache images with a cache-first strategy for 24 hours
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  })
);
