var cacheName = 'noter';
var filesList = [ '/', '/index.html', '/css/style.css', '/js/main.js' ];

// install the app by catching all files
self.addEventListener('install', 
	function(eventInstance)
	{
	alert("adding install event");
	eventInstance.waitUntil(
	caches.open(cacheName).then(
	    function(cacheInstance)
	    {
	    return cacheInstance.addAll(filesList);
	    };
	    )
	);
	self.skipWaiting();
	};
);

// if cannot fetch files, use locals
self.addEventListener('fetch',
	function(eventInstance)
	{
alert("adding fetch event");
	eventInstance.respondWith(
	    caches.match(eventInstance.request).then(
		function(response) {
		return response || fetch(eventInstance.request);
		}
	    )
	);
	};
);

