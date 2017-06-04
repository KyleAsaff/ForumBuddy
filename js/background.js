/*!
 * background.js
 * Crawls the search results for whenever your username is mentioned on the forums
 * calls functions from data.js
 */

var urlFormat = "http://forum.bodybuilding.com/showthread.php?t=163235341&page=500";

// Update notifications
if (window.addEventListener) {
    window.addEventListener("storage", onStorage, false);
} else {
    window.attachEvent("onstorage", onStorage);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url, newTread, currentThreads, filtered, index;
        if (request.greeting == "quickreply") {
            if (request.threadid === "undefined")
                return;
            url = "http://forum.bodybuilding.com/showthread.php?t=" + request.threadid + "&page=1000";
            newThread = new thread(url, request.threadtitle);
            currentThreads = localDataStore.get("threads");
            filtered = $(localDataStore.get("threads")).filter(function() {
                return this.url === url;
            });
            // if thread not yet stored in localstorage, add it
            if (filtered.length === 0)
                localDataStore.appendToFront("threads", newThread);
            else {
                // reset offset back to 0 if thread exists
                index = currentThreads.map(function(e) {
                    return e.url;
                }).indexOf(url);
                currentThreads[index].offset = 0;
                localDataStore.set("threads", currentThreads);
            }
        }
        if (request.greeting == "submitreply") {
            if (request.threadid === undefined)
                return false;
            url = "http://forum.bodybuilding.com/showthread.php?t=" + request.threadid + "&page=1000";
            newThread = new thread(url, request.threadtitle);
            filtered = $(localDataStore.get("threads")).filter(function() {
                return this.url === url;
            });
            // if thread not yet stored in localstorage, add it
            if (filtered.length === 0)
                localDataStore.appendToFront("threads", newThread);
            // reset offset back to 0 if thread exists
            else {
                index = currentThreads.map(function(e) {
                    return e.url;
                }).indexOf(url);
                currentThreads[index].offset = 0;
                localDataStore.set("threads", currentThreads);
            }
        }
        sendResponse({
            received: "received"
        });
    }
);

function instantReplies() {
    getCookie(function(){
        minePosts(function(){
            removeCookie(function(){
                setCookie();
            });
        });
    });
}

// Initalize and fetch posts every minute
initalize(function() {
    fetchPosts(function() {
        sortReplies();
        initalizePopupNotifications();
    });
    listenNotification();
});

setInterval(function() {
    chrome.storage.local.clear();
    fetchPosts();
}, 60000);

setInterval(function() {
    chrome.storage.local.clear();
    instantReplies();
}, 30000);
