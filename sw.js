var cacheName = 'noter';
var filesList = [ '/', '/index.html', '/css/style.css', '/js/main.js' ];

// install the app by catching all files
function installContents(cacheInstance)
{
    return cacheInstance.addAll(filesList);
};

function installAll(eventInstance)
{
    alert("asdf");
    eventInstance.waitUntil( caches.open(cacheName).then(installContents(catche)));
    self.skipWaiting();
};

self.addEventListener('install', installAll);

// if cannot fetch files, use locals
function fetchFiles(eventInstance)
{
eventInstance.respondWith(
    caches.match(eventInstance.request).then(
        function(response) {
        return response || fetch(eventInstance.request);
        }
    )
);
};

self.addEventListener('fetch', fetchFiles);

