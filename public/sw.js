/* FU-DEVER offline service worker (no build deps, plain JS).
 * Read-only strategy:
 * - Navigations: network-first, fallback to /offline when unreachable.
 * - Public GET API (blogs/resources/events/albums/projects/open-source/
 *   alumni/seasons/leaderboard/mentorship/fund stats): stale-while-revalidate.
 * - NEVER caches: auth/session endpoints, /admin, /api/v1/users,
 *   verifyToken, non-GET requests, cross-origin fetches.
 */
const SHELL_CACHE = 'dever-shell-v1';
const API_CACHE = 'dever-api-v1';
const OFFLINE_URL = '/offline';

const PUBLIC_API_PREFIXES = [
    '/api/v1/blogs',
    '/api/v1/resources',
    '/api/v1/events',
    '/api/v1/event',
    '/api/v1/resource',
    '/api/v1/album',
    '/api/v1/project',
    '/api/v1/open-source',
    '/api/v1/opensource-projects',
    '/api/v1/project-lab',
    '/api/v1/alumni',
    '/api/v1/seasons',
    '/api/v1/leetcode',
    '/api/v1/mentorship/mentors',
    '/api/v1/funds/public-stats',
    '/api/v1/fund/active-campaign',
];

const NEVER_CACHE = ['/api/v1/users', '/api/v1/auth', '/verifyToken', '/admin', '/api/v1/edit-profile'];

function isCacheableApi(url) {
    if (NEVER_CACHE.some((blocked) => url.pathname.startsWith(blocked))) return false;
    return PUBLIC_API_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(SHELL_CACHE)
            .then((cache) => cache.addAll(['/offline']))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.filter((key) => key !== SHELL_CACHE && key !== API_CACHE).map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => response)
                .catch(() => caches.match(OFFLINE_URL)),
        );
        return;
    }

    if (isCacheableApi(url)) {
        event.respondWith(
            caches.open(API_CACHE).then((cache) =>
                cache.match(request).then((cached) => {
                    const network = fetch(request).then((response) => {
                        if (response && response.ok) cache.put(request, response.clone());
                        return response;
                    });
                    return cached || network;
                }),
            ),
        );
    }
});
