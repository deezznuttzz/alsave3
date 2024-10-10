// public/service-worker.js

self.addEventListener('push', function (event) {
    const data = event.data.json();
    const title = data.title || 'Notification';
  
    const options = {
      body: data.body || 'You have a new message!',
      icon: '/icon.png',
      badge: '/badge.png',
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/') // Redirect to home or any other page when the user clicks the notification
    );
  });
  