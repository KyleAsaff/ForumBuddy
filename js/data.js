/*!
 * data.js
 * contains methods for retreiving object data from localStorage
 */

var localDataStore = {
    // Get item
    get: function(key) {
        if (localStorage.getItem(key) === null)
            return false;
        return (JSON.parse(localStorage.getItem(key)));
    },
    // Get value at specific index of array
    getIndexOf: function(key, index) {
        if (localStorage.getItem(key) === null)
            return false;
        else
            return (JSON.parse(localStorage.getItem(key))[index]);
    },

    // Create new Item 
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Adds new items to the front of an array in localStorage
    appendToFront: function(key, data) {

        var t = data.constructor,
            tmp, tmp2 = [],
            concat;

        switch (t) {

            case Array:
                tmp = localStorage.getItem(key);
                tmp = (tmp === null) ? [] : JSON.parse(tmp);
                $.each(data, function(index, post) {
                    tmp2.push(post);
                });
                concat = tmp2.concat(tmp);
                localStorage.setItem(key, JSON.stringify(concat));
                break;

            case post:
                tmp = localStorage.getItem(key);
                tmp = (tmp === null) ? [] : JSON.parse(tmp);
                tmp.push(data);
                localStorage.setItem(key, JSON.stringify(tmp));
                break;

            case thread:
                tmp = localStorage.getItem(key);
                tmp = (tmp === null) ? [] : JSON.parse(tmp);
                tmp.push(data);
                localStorage.setItem(key, JSON.stringify(tmp));
                break;
        }
    }
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
    } else if (localDataStore.get("fb_userinfo").enabled === false) {
        chrome.browserAction.setBadgeText({
            text: ""
        });
    } else if (localDataStore.get("fb_userinfo").mentions === false) {
        chrome.browserAction.setBadgeText({
            text: ""
        });
    } else if (localDataStore.get("fb_userinfo").mentions === true && localDataStore.get("fb_userinfo").enabled === false) {
        chrome.browserAction.setBadgeText({
            text: ""
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: unreadmessages.toString()
        });
    }
}

// Function to sort replies by date
function sortReplies() {
    tempArray = localDataStore.get("replies");
    if (tempArray === false)
        return false;
    tempArray.sort(function(a, b) {

        var c = new Date(a.postDate + " " + a.postTime);
        var d = new Date(b.postDate + " " + b.postTime);
        return d - c;
    });
    localDataStore.set("replies", tempArray);
}


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
    var date = (mm + '-' + dd + '-' + yyyy);
    return date;

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
    return date;
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

function thread(url, title) {
    this.url = url;
    this.title = title;
    this.offset = 0;
}

// Object to hold the user information
function userinfo(forum, username, avi, enabled, mentions, mentions_longdesc) {
    this.forum = forum;
    this.username = username;
    this.avi = avi;
    this.enabled = enabled;
    this.mentions = mentions;
    this.mentions_longdesc = mentions_longdesc;
    //this.offset = offset;
}

// Function to initalize getting user information
function initalize() {
    var url = "http://forum.bodybuilding.com/";
    var aviurl = "http://forum.bodybuilding.com/profile.php?do=editavatar";

    // if (localStorage.getItem("fb_userinfo") === null) {
    $.get(aviurl, function(data) {
        //var $page = $(data);

        // find username in the page source
        var myregex = /s\.prop42="([^"]*)"/;
        var matchArray = myregex.exec(data);

        // find avi in the page source
        var avisrc = $(data).find("div.image-fit img").attr('src');

        //quit statement, not logged in
        if (matchArray[1] === "") {
            localStorage.removeItem("fb_userinfo");
            return false;
        }

        var username = matchArray[1];
        var avi = url + $(data).find(".primary img").attr("src");

        if (localStorage.getItem("fb_userinfo") === null)
            var tempuserinfo = new userinfo(url, username, avi, true, true, true, true);
        else {
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;

            var tempuserinfo = new userinfo(url, username, avi, enabled, mentions, mentions_longdesc);
        }

        localDataStore.set("fb_userinfo", tempuserinfo);
    });
}

// Function to check the threads the user recently posted in
function minePosts() {
    // if user is not logged in return quit fetchPosts
    if (localStorage.getItem("fb_userinfo") === null)
        return false;

    // if user turned his account to disable quit fetchPosts
    if (localDataStore.get("fb_userinfo").enabled === false)
        return false;

    // if user turned posts off quit fetchPosts
    if (localDataStore.get("fb_userinfo").mentions === false)
        return false;

    var url = "http://forum.bodybuilding.com/";
    var user = localDataStore.get("fb_userinfo").username;
    var mineBuffer = [];

    $.each(localDataStore.get("threads"), function(index) {

        var offsetThread = parseInt((this).offset);
        offsetThread = offsetThread + 1;

        var mineURL = (this).url;

        var tempStorage = localDataStore.get("threads");
        tempStorage[index].offset = offsetThread;

        localDataStore.set("threads", tempStorage);

        $.get(mineURL, function(data) {

            var myregex = /s\.prop39="([^"]*)"/;
            var threadTitle = myregex.exec(data)[1];

            var black = false;
            if($(data).find(".searchbutton").attr("src") === "images/BP-Black/buttons/search.png")
                black = true;


            $(data).find("#posts").children().each(function() {
                var fullpost = $(this).find(".postcontent").text();
                if (fullpost.indexOf(user) > 1) {
                    var postDateBuffer = $(this).find("span.date").clone().children().remove().end().text();
                    var dateLength = postDateBuffer.length;

                    if(black === false)
                        postDateBuffer = postDateBuffer.substring(0, dateLength - 2);
                    if(black === true)
                        postDateBuffer = postDateBuffer.substring(0, dateLength - 1);

                    var postTimeBuffer = $(this).find("span.time").text();
                    var threadTitleBuffer = threadTitle;
                    var threadTitleLinkBuffer = url + $(this).find(".postcounter").attr("href");
                    var postAuthorLinkBuffer = url + $(this).find(".username").attr("href");
                    var postAuthorBuffer = $(this).find(".username").text();
                    var postIDBuffer = $(this).attr("id");
                    var postLinkBuffer = url + $(this).find(".postcounter").attr("href");
                    var postDescLongBuffer = $(this).find(".postcontent").clone().children().remove().end().text();
                    postDescLongBuffer = postDescLongBuffer.trim().replace(/\n\s*\n/g, '\n');

                    var threadRepliesBuffer = 0;
                    var threadViewsBuffer = 0;
                    if (postDescLongBuffer.length > 48)
                        var postDescBuffer = postDescLongBuffer.substring(0, 47) + " ...";
                    else
                        var postDescBuffer = postDescLongBuffer;

                    var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, postDescBuffer, postDescLongBuffer, postLinkBuffer);
                    
                    // Convert date into real date
                    if (postBuffer.postDate === "Yesterday")
                        postBuffer.postDate = getYesterday();
                    if (postBuffer.postDate === "Today")
                        postBuffer.postDate = getToday();

                    if (postBuffer.postAuthor !== user)
                        mineBuffer.push(postBuffer);
                }
            });
            for (var i = 0; i < mineBuffer.length; i++) {
                var newPost = mineBuffer[i];
                var filtered = $(localDataStore.get("replies")).filter(function() {
                    return this.postID === mineBuffer[i].postID;
                });
                // if post not yet stored in replies, add it
                if (filtered.length === 0)
                    localDataStore.appendToFront("replies", newPost);
            }
        });
    });

    // Remove thread from storage after 6 hours
    var updateThreads = localDataStore.get("threads");
    var shallowCopy = $.extend({}, updateThreads);
    $.each(shallowCopy, function(index) {
        if ((this).offset > 1440) {
            updateThreads.splice(index);
            localDataStore.set("threads", updateThreads);
        }
    });
    sortReplies();
    onStorage("replies");
}


// function to query, store, and fetch posts
function fetchPosts() {

    // if user is not logged in return quit fetchPosts
    if (localStorage.getItem("fb_userinfo") === null)
        return false;

    // if user turned his account to disable quit fetchPosts
    if (localDataStore.get("fb_userinfo").enabled === false)
        return false;

    // if user turned posts off quit fetchPosts
    if (localDataStore.get("fb_userinfo").mentions === false)
        return false;

    if (localStorage.getItem("offset") === null)
        localStorage.setItem("offset", 0);

    if (localStorage.getItem("refresh") === null)
        localStorage.setItem("refresh", 0);

    var offset = localStorage.getItem("offset");
    var refresh = localStorage.getItem("refresh");

    // add 1 to the offset and store new offset
    offset = parseInt(offset) + 1;

    localStorage.setItem("offset", offset);

    // Reset offset after it reaches 99
    if (parseInt(offset) > 98) {
        localStorage.setItem("offset", 0);
        offset = 0;
    }

    // Reset refresh after it reaches 99
    if (parseInt(refresh) > 98) {
        localStorage.setItem("refresh", 0);
        refresh = 0;
    }

    var user = localDataStore.get("fb_userinfo").username;
    var repliesBuffer = [];
    var url = "http://forum.bodybuilding.com/";
    var findVariable = ".blockbody";

    // get data from search query
    var query = "http://forum.bodybuilding.com/search.php?do=process&query=" + offset + "+posted+by+" + user + "+" + refresh + "&exactname=1&titleonly=0&searchdate=0&beforeafter=after&contenttypeid=1&sortby=dateline&order=descending&sortorder=descending&searchfromtype=vBForum%3APost&showposts=1&starteronly=0&searchthreadid=0&forumchoice[]=&childforums=1&replyless=0&type[]=1#top";
    $.get(query, function(data) {


        // check if user is using default or black skin
        if ($(data).find('#searchbits').length > 0) {
            findVariable = "#searchbits";
        }

        $(data).find(findVariable).children().each(function() {

            // Put everything in the first result of search query in a buffer
            var postDateBuffer = $(this).find("span.date").clone().children().remove().end().text();
            var dateLength = postDateBuffer.length;
            postDateBuffer = postDateBuffer.substring(0, dateLength - 1);

            var postTimeBuffer = $(this).find("span.time").text();
            var threadTitleBuffer = $(this).find("div.username_container h2 a:first").text();
            var threadTitleLinkBuffer = url + $(this).find("div.username_container h2 a:first").attr("href");
            var postAuthorLinkBuffer = url + $(this).find("div.username_container a:last").attr("href");
            var postAuthorBuffer = $(this).find("div.username_container a:last").text();
            var postIDBuffer = $(this).attr("id");
            var postLinkBuffer = url + $(this).find("h3.posttitle a:first").attr("href");
            var postDescBuffer = $(this).find("h3.posttitle a:first").text();
            var threadRepliesBuffer = $(this).find("dl.userstats dd:first").text();
            var threadViewsBuffer = $(this).find("dl.userstats dd:last").text();
            var postDescLongBuffer = $(this).find("blockquote.postcontent").text().trim().replace(/\n\s*\n/g, '\n');

            // Create a post object with the buffer data (true = long descriptions, false = short descriptions)
            var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, postDescBuffer, postDescLongBuffer, postLinkBuffer);

            // If you are the post author, dont add to localstore
            if (postBuffer.postAuthor === user)
                return true;

            // Convert date into real date
            if (postBuffer.postDate === "Yesterday")
                postBuffer.postDate = getYesterday();
            if (postBuffer.postDate === "Today")
                postBuffer.postDate = getToday();

            // fail safe if cant get post from page
            if (postBuffer.postAuthor === "")
                return false;

            // fill new array of data to concat with data in localstore

            repliesBuffer.push(postBuffer);
        });
        for (var i = 0; i < repliesBuffer.length; i++) {
            var newPost = repliesBuffer[i];

            var filtered = $(localDataStore.get("replies")).filter(function() {
                return this.postID === repliesBuffer[i].postID;
            });

            // if post not yet stored in replies, add it
            if (filtered.length === 0)
                localDataStore.appendToFront("replies", newPost);
        }
    });

    sortReplies();
    onStorage("replies");
}