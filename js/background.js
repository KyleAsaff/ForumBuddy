/*!
 * background.js
 * Crawls the search results for whenever your username is mentioned on the forums
 */

if (window.addEventListener) {
    window.addEventListener("storage", onStorage, false);
} else {
    window.attachEvent("onstorage", onStorage);
};

function onStorage(data) {
    badgeColor = "#646464";
    chrome.browserAction.setBadgeBackgroundColor({
        color: badgeColor
    });
    var unreadmessages = 0;
    var tempArray = localDataStore.get("replies");

    for (i = 0; i < tempArray.length; i++) {
        if (tempArray[i].visible === true)
            unreadmessages++;
    }
    if (unreadmessages === 0) {
        chrome.browserAction.setBadgeText({
            text: ""
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: unreadmessages.toString()
        });
    }
};

// Function to change "yesterday" or "today" into real date
function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var date = (mm + '/' + dd + '/' + yyyy);
    return (date);
}

function getYesterday() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var dd = yesterday.getDate();
    var mm = yesterday.getMonth() + 1;
    var yyyy = yesterday.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var date = (mm + '-' + dd + '-' + yyyy);
    return (date);
}
// Object for storing post data
function post(postID, threadTitle, threadTitleLink, threadReplies, threadViews, postAuthor, postAuthorLink, postDate, postTime, postDesc, postDescLong, postLink) {
    // this.raw = raw;
    this.postID = postID;
    this.threadTitle = threadTitle;
    this.threadTitleLink = threadTitleLink;
    this.threadReplies = threadReplies;
    this.threadViews = threadViews;
    this.postAuthor = postAuthor;
    this.postAuthorLink = postAuthorLink;
    this.postDate = postDate;
    this.postTime = postTime;
    this.postDesc = postDesc;
    this.postLink = postLink;
    this.postDescLong = postDescLong;
    this.visible = true;
}

var url = "http://forum.bodybuilding.com/";
var repliesBuffer = [];
var user = "nilekyle";

// create an offset value in local storage if none
if (localStorage.getItem("offset") === null)
    localStorage.setItem("offset", 0);


// store local storage value in offset
var offset = localStorage.getItem("offset");

// function to query, store, and fetch posts
function fetchPosts() {
    // add 1 to the offset and store new offset
    offset = parseInt(offset) + 1;
    localStorage.setItem("offset", offset);

    // Reset offset after it reaches 99
    if (parseInt(offset) > 98) {
        localStorage.setItem("offset", 0);
        offset = 0;
    }

    // get data from search query
    var query = "http://forum.bodybuilding.com/search.php?do=process&query=" + offset + "+posted+by+" + user + "&exactname=1&titleonly=0&searchdate=0&beforeafter=after&contenttypeid=1&sortby=dateline&order=descending&sortorder=descending&searchfromtype=vBForum%3APost&showposts=1&starteronly=0&searchthreadid=0&forumchoice[]=&childforums=1&replyless=0&type[]=1#top";
    $.get(query, function(data) {

        var $page = $(data);

        // Get the first 20 search results
        var $block = $page.find(".blockbody").children().slice(0, 20);

        $.each($block, function(index, rawBuffer) {
            var $rawBuffer = $(rawBuffer);

            // Put everything in the first result of search query in a buffer
            var postDateBuffer = $rawBuffer.find("span.date").clone().children().remove().end().text();
            var dateLength = postDateBuffer.length;
            postDateBuffer = postDateBuffer.substring(0, dateLength - 1);

            var postTimeBuffer = $rawBuffer.find("span.time").text();
            var threadTitleBuffer = $rawBuffer.find("div.username_container h2 a:first").text();
            var threadTitleLinkBuffer = url + $rawBuffer.find("div.username_container h2 a:first").attr("href");
            var postAuthorLinkBuffer = url + $rawBuffer.find("div.username_container a:last").attr("href");
            var postAuthorBuffer = $rawBuffer.find("div.username_container a:last").text();
            var postIDBuffer = $rawBuffer.attr("id");
            var postLinkBuffer = url + $rawBuffer.find("h3.posttitle a:first").attr("href");
            var postDescBuffer = $rawBuffer.find("h3.posttitle a:first").text();
            var threadRepliesBuffer = $rawBuffer.find("dl.userstats dd:first").text();
            var threadViewsBuffer = $rawBuffer.find("dl.userstats dd:last").text();
            var postDescLongBuffer = $rawBuffer.find("blockquote.postcontent").text().trim().replace(/\n\s*\n/g, '\n');

            // Create a post object with the buffer data
            var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, postDescBuffer, postDescLongBuffer, postLinkBuffer);

            // If you are the post author, dont add to localstore
            if (postBuffer.postAuthor === user)
                return true;

            // Convert date into real date
            if (postBuffer.postDate === "Yesterday")
                postBuffer.postDate = getYesterday();
            if (postBuffer.postDate === "Today")
                postBuffer.postDate = new getToday();

            // fail safe if cant get post from page
            if (postBuffer.postAuthor === "")
                return false;

            // fill new array of data to concat with data in localstore
            if (postBuffer.postID === localDataStore.getIndexOf("replies", 0).postID) {
                localDataStore.appendToFront("replies", repliesBuffer);
                repliesBuffer = [];
                return false;
            } else
                repliesBuffer.push(postBuffer);
        });

        // append replies buffer to local storage if there is
        if (repliesBuffer !== null) {
            localDataStore.appendToFront("replies", repliesBuffer);
            repliesBuffer = [];
        }
    });

    //Logs for debugging
    console.log(offset);
    console.log(query);
    console.log(localDataStore.get("replies"));

    onStorage("replies");
}

fetchPosts();
setInterval(fetchPosts, 60 * 800);