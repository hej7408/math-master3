/* 오프라인 사용을 위한 간단한 서비스 워커 (캐시 우선, 실패 시 네트워크) */
const CACHE = 'mathdoctor-3.0.1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './css/base.css?v=3.0.1', './css/board.css?v=3.0.1', './css/place.css?v=3.0.1', './css/lab.css?v=3.0.1', './css/game.css?v=3.0.1', './css/quest.css?v=3.0.1',
  ...['standards-data', 'util', 'standards', 'problems-core', 'problems-num', 'problems-other', 'figures', 'comp', 'app', 'quest', 'board', 'place', 'lab', 'game', 'sheet', 'diagnose', 'about', 'main'].map((f) => `./js/${f}.js?v=3.0.1`),
  './assets/icon-192.png', './assets/icon-512.png', './assets/photos/mascot.jpg',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
