const CACHE_NAME = 'stadiumpulse-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/app.js',
    '/js/ui.js',
    '/js/state.js',
    '/js/intelligence.js',
    '/js/simulations.js',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
