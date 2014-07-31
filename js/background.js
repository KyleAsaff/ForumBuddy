/*!
 * background.js
 * Crawls the search results for whenever your username is mentioned on the forums
 * calls functions from data.js
 */

/****************** Google Analytics ******************/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-53208960-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();
/*******************************************************/

var urlFormat = "http://forum.bodybuilding.com/showthread.php?t=163235341&page=500";

// Update notifications
if (window.addEventListener) {
    window.addEventListener("storage", onStorage, false);
} else {
    window.attachEvent("onstorage", onStorage);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {


        if (request.greeting == "quickreply") {
            if (request.threadid === "undefined")
                return;
            var url = "http://forum.bodybuilding.com/showthread.php?t=" + request.threadid + "&page=1000";
            var newThread = new thread(url);
            var currentThreads = localDataStore.get("threads");
            var filtered = $(localDataStore.get("threads")).filter(function() {
                return this.url === url;
            });
            // if thread not yet stored in localstorage, add it
            if (filtered.length === 0)
                localDataStore.appendToFront("threads", newThread);
        }
        if (request.greeting == "submitreply") {
            if (request.threadid === "undefined")
                return;
            var url = "http://forum.bodybuilding.com/showthread.php?t=" + request.threadid + "&page=1000";
            var newThread = new thread(url);
            var filtered = $(localDataStore.get("threads")).filter(function() {
                return this.url === url;
            });
            // if thread not yet stored in localstorage, add it
            if (filtered.length === 0)
                localDataStore.appendToFront("threads", newThread);

        }
        sendResponse({
            received: "received"
        });
    }
);

// Initalize and fetch posts every minute
initalize();
setTimeout(fetchPosts, 3000);
setInterval(fetchPosts, 60000);
setInterval(minePosts, 30000);