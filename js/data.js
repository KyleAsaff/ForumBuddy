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

// Update badge number when a new post is added to storage
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
function sortReplies(callback) {
    tempArray = localDataStore.get("replies");
    if (tempArray === false)
        return false;
    tempArray.sort(function(a, b) {

        var c = new Date(a.fullDate);
        var d = new Date(b.fullDate);
        return d - c;
    });
    localDataStore.set("replies", tempArray);
    if (callback) callback();
}


// Function to change "today" into real date
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

// Function to change "yesterday" into real date
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

// Function to convert GMT time to minute.js GMT time
function formatGMT(zone) {
    timezone = String(zone);
    if(timezone === "-12") return "-12:00";
    if(timezone === "-11") return "-11:00";
    if(timezone === "-10") return "-10:00";
    if(timezone === "-9.5") return "-09:30";
    if(timezone === "-9") return "-09:00";
    if(timezone === "-8") return "-08:00";
    if(timezone === "-7") return "-07:00";
    if(timezone === "-6") return "-06:00";
    if(timezone === "-5") return "-05:00";
    if(timezone === "-4.5") return "-04:30";
    if(timezone === "-4") return "-04:00";
    if(timezone === "-3.5") return "-03:30";
    if(timezone === "-3") return "-03:00";
    if(timezone === "-2") return "-02:00";
    if(timezone === "-1") return "-01:00";
    if(timezone === "-0") return "00:00";
    if(timezone === "+0") return "00:00";
    if(timezone === "+1") return "+01:00";
    if(timezone === "+2") return "+02:00";
    if(timezone === "+3") return "+03:00";
    if(timezone === "+3.5") return "+03:30";
    if(timezone === "+4") return "+04:00";
    if(timezone === "+4.5") return "+04:30";
    if(timezone === "+5") return "+05:00";
    if(timezone === "+5.5") return "+05:30";
    if(timezone === "+5.75") return "+05:45";
    if(timezone === "+6") return "+06:00";
    if(timezone === "+6.5") return "+06:30";
    if(timezone === "+6.75") return "+06:45";
    if(timezone === "+7") return "+07:00";
    if(timezone === "+8") return "+08:00";
    if(timezone === "+8.75") return "+08:45";
    if(timezone === "+9") return "+09:00";
    if(timezone === "+9.5") return "+09:30";
    if(timezone === "+10") return "+10:00";
    if(timezone === "+10.5") return "+10:30";
    if(timezone === "+11") return "+11:00";
    if(timezone === "+11.5") return "+11:30";
    if(timezone === "+12") return "+12:00";
    if(timezone === "+12.45") return "+12:45";
    if(timezone === "+13") return "+13:00";
    if(timezone === "+14") return "+14:00";
}

// Object for storing post data
function post(postID, threadTitle, threadTitleLink, threadReplies, threadViews, postAuthor, postAuthorLink, postDate, postTime, fullDate, postDesc, postDescLong, postLink) {
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
    this.fullDate = fullDate;
    this.postDesc = postDesc;
    this.postLink = postLink;
    this.postDescLong = postDescLong;
    this.visible = true;
}

// Object to store thread info
function thread(url, title) {
    this.url = url;
    this.title = title;
    this.offset = 0;
}

// Object to hold the user information
function userinfo(forum, username, avi, defaultGMT, userGMT, enabled, mentions, mentions_longdesc) {
    this.forum = forum;
    this.username = username;
    this.avi = avi;
    this.defaultGMT = defaultGMT;
    this.userGMT = userGMT;
    this.enabled = enabled;
    this.mentions = mentions;
    this.mentions_longdesc = mentions_longdesc;
    //this.offset = offset;
}

// Function to initalize getting user information
function initalize(callback) {
    var url = "http://forum.bodybuilding.com/";
    var aviurl = "http://my.bodybuilding.com/photos/view/type/profile";
    var defaultGMT = formatGMT(-7);

    $.get(aviurl, function(data) {

        // find username in the page source
        var myregex = /s\.prop42="([^"]*)"/;
        var matchArray = myregex.exec(data);

        // find avi in the page source
        var avisrc = $(data).find('div.profile-imgbox:first .profile-imgbox-pic a img').attr('src');

        //quit statement, not logged in
        if (matchArray === null) {
            localStorage.removeItem("fb_userinfo");
            if(callback) callback();
            return false;
        }

        var username = matchArray[1];
        if (avisrc === undefined) {
            avisrc = "/icons/profiledefault_thumb.jpg";
            var avi = avisrc;
        } else
            var avi = avisrc;

        // Get the time difference for when cookies removed
        $.get(url, function(data) {
            var matchArray = /\bGMT +(.+?)(?=\. )/.exec(data);;
            if (matchArray) {
                var userGMT = formatGMT(matchArray[1]);
            }
            else
                var userGMT = formatGMT(defaultGMT);

            if (localStorage.getItem("fb_userinfo") === null)
                var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, true, true, true, true);
            else {
                var enabled = localDataStore.get("fb_userinfo").enabled;
                var mentions = localDataStore.get("fb_userinfo").mentions;
                var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;

                var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, mentions_longdesc);
            }
            localDataStore.set("fb_userinfo", tempuserinfo);
            if(callback) callback();
        });
    });
}

// Function to check server status of fetch server
function checkServerStatus(callback)
{
    var img = document.body.appendChild(document.createElement("img"));
    img.src = "http://kylesbox.com/forumbuddy/fetch/ping.gif?" + (new Date());
        img.onload = function()
    {
        localStorage.setItem("serverStatus", "online");
        //console.log("online");
    };
        img.onerror = function()
    {
        localStorage.setItem("serverStatus", "offline");
        //console.log("offline");
    };
    $("img").remove();
    if(callback) callback();
}


// Function to check the threads the user recently posted in
function minePosts(callback) {
    // if user is not logged in return quit fetchPosts
    if (localStorage.getItem("fb_userinfo") === null) {
        return false;
    }

    // if user turned his account to disable quit fetchPosts
    if (localDataStore.get("fb_userinfo").enabled === false) {
        return false;
    }

    // if user turned posts off quit fetchPosts
    if (localDataStore.get("fb_userinfo").mentions === false) {
        return false;
    }

    var url = "http://forum.bodybuilding.com/";
    var user = localDataStore.get("fb_userinfo").username;
    var mineBuffer = [];

    $.each(localDataStore.get("threads"), function(index) {

        var offsetThread = parseInt((this).offset);
        offsetThread = offsetThread + 1;
/*
        if(localStorage.getItem("serverStatus") === "online")
        var mineURL = "http://www.kylesbox.com/forumbuddy/fetch/fetch.php?url=" + (this).url;
        // var mineURL = "http://translate.google.com/translate?hl=en&sl=fr&tl=en&u=" + encodeURIComponent((this).url);
        // https://translate.googleusercontent.com/translate_c?depth=1&hl=en&rurl=translate.google.com&sl=fr&tl=en&u=http%3A%2F%2Fforum.bodybuilding.com%2Fshowthread.php%3Ft%3D161918853%26page%3D100000
        else {
            var mineURL = "http://" + (this).url;
            return false;
        } */

        var mineURL = (this).url;

        var tempStorage = localDataStore.get("threads");
        tempStorage[index].offset = offsetThread;

        localDataStore.set("threads", tempStorage);

        $.get(mineURL, function(data) {
            var myregex = /s\.prop39="([^"]*)"/;
            var threadTitle = myregex.exec(data)[1];

            var black = false;
            if ($(data).find(".searchbutton").attr("src") === "images/BP-Black/buttons/search.png")
                black = true;


            $(data).find("#posts").children().each(function() {
                var fullpost = $(this).find(".postcontent").text();
                if (fullpost.indexOf(user) > 1) {
                    var postDateBuffer = $(this).find("span.date").clone().children().remove().end().text();
                    var dateLength = postDateBuffer.length;

                    if (black === false)
                        postDateBuffer = postDateBuffer.substring(0, dateLength - 2);
                    if (black === true)
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

                    // Convert date into real date
                    if (postDateBuffer === "Yesterday")
                        postDateBuffer = getYesterday();
                    if (postDateBuffer === "Today")
                        postDateBuffer = getToday();

                    if(localDataStore.get("fb_userinfo") !== false) { 
                        var userGMT = localDataStore.get("fb_userinfo").userGMT;
                        var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
                    }
                    else{ 
                        var userGMT = "00:00";
                        var defaultGMT = "00:00";
                    }

                    // fail safe if cant get post from page
                    if (postAuthorBuffer === "")
                        return false;

                    /* uncomment this and erase next 2 lines when proxy issue is resolved
                    var fullDate = postDateBuffer + " " + postTimeBuffer + " " + defaultGMT;

                    var fullDateBuffer = moment(fullDate, "MM-DD-YYYY hh:mm A Z").zone(userGMT).format("MM-DD-YYYY hh:mm A"); */

                    var fullDate = postDateBuffer + " " + postTimeBuffer;

                    var fullDateBuffer = moment(fullDate, "MM-DD-YYYY hh:mm A").format("MM-DD-YYYY hh:mm A");

                    var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, fullDateBuffer, postDescBuffer, postDescLongBuffer, postLinkBuffer);

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
        if ((this).offset > 2880) {
            updateThreads.splice(index);
            localDataStore.set("threads", updateThreads);
        }
    });
    sortReplies();
    onStorage("replies");
    if (callback) callback();
}


// function to query, store, and fetch posts
function fetchPosts(callback) {

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

            // If you are the post author, dont add to localstore
            if (postAuthorBuffer === user)
                return true;

            // Convert date into real date
            if (postDateBuffer === "Yesterday")
                postDateBuffer = getYesterday();
            if (postDateBuffer === "Today")
                postDateBuffer = getToday();

            // fail safe if cant get post from page
            if (postAuthorBuffer === "")
                return false;

            var fullDate = postDateBuffer + " " + postTimeBuffer;

            var fullDateBuffer = moment(fullDate, "MM-DD-YYYY hh:mm A").format("MM-DD-YYYY hh:mm A");

            // Create a post object with the buffer data (true = long descriptions, false = short descriptions)
            var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, fullDateBuffer, postDescBuffer, postDescLongBuffer, postLinkBuffer);

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
    if (callback) callback();
}