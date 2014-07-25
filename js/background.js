/*!
 * background.js
 * Crawls the search results for whenever your username is mentioned on the forums
 * calls functions from data.js
 */

if (window.addEventListener) {
    window.addEventListener("storage", onStorage, false);
} else {
    window.attachEvent("onstorage", onStorage);
}

initalize();

setTimeout(fetchPosts, 3000);

setInterval(fetchPosts, 60 * 800);