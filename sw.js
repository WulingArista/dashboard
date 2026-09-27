const CACHE = 'wuling-dashboard-v2'; // Versi dinaikkan menjadi v2 agar otomatis memperbarui cache lama
const FILES = ['./','./index.html','./manifest.json','./icon-192x192.png','./icon-512x512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Pengecualian: Abaikan request ke server luar
  if (e.request.url.includes('youtube.com') || 
      e.request.url.includes('youtube-nocookie.com') ||
      e.request.url.includes('script.google.com')) {
    return; // Berhenti di sini, biarkan browser menangani koneksi secara normal
  }

  // Logika cache asli Anda untuk file lokal
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
