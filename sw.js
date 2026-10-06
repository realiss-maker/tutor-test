/* AI Language Tutor — минимальный service worker.
   Нужен, чтобы Chrome на Android предлагал полноценную установку (без адресной строки).
   Стратегия «сначала сеть, при отсутствии сети — кэш»: обновления index.html доходят сразу. */
const CACHE = 'ai-tutor-shell-v3.32.7';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // Unsplash, Google и т.д. — мимо кэша
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
