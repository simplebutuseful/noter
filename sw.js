var cacheName = 'noter';
var filesList = [ '/noter/', '/noter/index.html', '/noter/css/style.css', '/noter/js/main.js' ];

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
	    }
	    )
	);
	self.skipWaiting();
	}
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
	}
);

