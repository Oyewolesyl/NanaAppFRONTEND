const CACHE_NAME = 'nana-app-v5-mobile-spacing-polish';

const CORE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/nana-3d-logo-card.png',
  '/nana-3d-logo-full.png',
  '/nana-3d-logo-main.svg',
  '/nana-3d-logo-with-text.svg',
  '/topnavlogo.svg',
  '/back.svg',
  '/caregiver.svg',
  '/doctor.svg',
  '/child1.svg',
  '/child2.svg',
  '/inactivechildpicture.svg',
];

self.addEventListener('install', (event) => {
  // Cache only the assets needed for the app shell and install experience.
  // Large/optional files such as bodymap.glb are cached at runtime when used.
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => (
        key === CACHE_NAME ? null : caches.delete(key)
      ))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(() => (
        event.request.mode === 'navigate'
          ? caches.match('/')
          : caches.match(event.request)
      ))
  );
});
