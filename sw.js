// Ramadan PWA Service Worker
const CACHE_NAME = 'ramadan-2026-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Listen for scheduled notification messages from the main app
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    const { alerts } = e.data;
    alerts.forEach(alert => {
      const delay = new Date(alert.time) - new Date();
      if (delay > 0) {
        setTimeout(() => {
          self.registration.showNotification(alert.title, {
            body: alert.body,
            icon: './icon-192.png',
            badge: './icon-192.png',
            tag: alert.tag,
            renotify: true,
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
            actions: [
              { action: 'ok', title: '🤲 OK' }
            ]
          });
        }, delay);
      }
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(clientList => {
    if (clientList.length > 0) {
      clientList[0].focus();
    } else {
      clients.openWindow('./');
    }
  }));
});
