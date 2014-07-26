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

// Update notifications
if (window.addEventListener) {
    window.addEventListener("storage", onStorage, false);
} else {
    window.attachEvent("onstorage", onStorage);
}

// Initalize and fetch posts every minute
initalize();
setTimeout(fetchPosts, 3000);
setInterval(fetchPosts, 60 * 800);