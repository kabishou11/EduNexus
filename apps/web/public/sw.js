// Service Worker for EduNexus PWA
// Version: 1.0.0

const CACHE_VERSION = 'v1';
const CACHE_NAME = `edunexus-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

// Cache strategies
const CACHE_FIRST = 'cache-first';
const NETWORK_FIRST = 'network-first';
const STALE_WHILE_REVALIDATE = 'stale-while-revalidate';

// Resources to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/kb',
  '/workspace',
  '/manifest.json',
];

// Cache size limits
const MAX_CACHE_SIZE = 50; // Maximum number of items per cache
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static resources');
      return cache.addAll(STATIC_CACHE_URLS);
    }).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(url);

  event.respondWith(
    handleFetch(request, strategy)
  );
});

// Get cache strategy based on URL
function getCacheStrategy(url) {
  const pathname = url.pathname;

  // Static assets - Cache First
  if (
    pathname.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return CACHE_FIRST;
  }

  // API requests - Network First
  if (pathname.startsWith('/api/')) {
    return NETWORK_FIRST;
  }

  // HTML pages - Network First
  if (
    pathname === '/' ||
    pathname.startsWith('/kb') ||
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/user-level')
  ) {
    return NETWORK_FIRST;
  }

  // Default - Stale While Revalidate
  return STALE_WHILE_REVALIDATE;
}

// Handle fetch with specified strategy
async function handleFetch(request, strategy) {
  switch (strategy) {
    case CACHE_FIRST:
      return cacheFirst(request);
    case NETWORK_FIRST:
      return networkFirst(request);
    case STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request);
    default:
      return fetch(request);
  }
}

// Cache First strategy
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

// Network First strategy
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match(OFFLINE_URL);
      if (offlinePage) {
        return offlinePage;
      }
    }

    return new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background Sync - handle offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB
    const db = await openDB();
    const offlineActions = await getOfflineActions(db);

    // Process each offline action
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        });

        // Remove synced action
        await removeOfflineAction(db, action.id);
      } catch (error) {
        console.error('[SW] Failed to sync action:', error);
      }
    }

    console.log('[SW] Offline data synced successfully');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'EduNexus';
  const options = {
    body: data.body || '您有新的通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.notification.tag);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message handler - communicate with clients
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return caches.open(CACHE_NAME);
      })
    );
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Helper functions for IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('edunexus-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-actions')) {
        db.createObjectStore('offline-actions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getOfflineActions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-actions'], 'readonly');
    const store = transaction.objectStore('offline-actions');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeOfflineAction(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-actions'], 'readwrite');
    const store = transaction.objectStore('offline-actions');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
