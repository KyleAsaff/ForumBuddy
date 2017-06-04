/*!
 * data.js
 * Contains methods for retrieving object data from local storage
 */

// Custom variable for local storage
var localDataStore = {
    // Get item
    get: function (key) {
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

    // Create new item 
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // Adds new items to the front of an array in local storage
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
                tmp.unshift(data);
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

// Function to remove focus when opening a notification from tray
function openTemporaryWindowToRemoveFocus() {
   var win = window.open("about:blank", "emptyWindow", "width=1, height=1, top=-500, left=-500");
   win.close();
}

//Creates basic notification when a new post comes in 
function createNotification(postID, postAuthor, threadTitle, postDesc, postLink, callback) {
    var opt = {
        type: "basic",
        title: postAuthor,
        message: postDesc,
        contextMessage: threadTitle,
        iconUrl: "/icons/notification_mention.png",
    };

    // Create notification
    chrome.notifications.create(postLink, opt, function(notificationId) {
    });

    // Clear notification after 1 minute
    setTimeout(function() {
        chrome.notifications.clear(postLink, function(){
    });
    }, 60000);
    if(callback) callback();
}

//Adds the listener for all notifications
function listenNotification() {
    chrome.notifications.onClicked.addListener(function(notificationId) {
        chrome.tabs.create({url: notificationId});
        chrome.notifications.clear(notificationId, function(){
            openTemporaryWindowToRemoveFocus();
        });
        var repliesCopy = localDataStore.get("replies");
        for(i = 0; i<repliesCopy.length; i++) {
            if(repliesCopy[i].postLink === notificationId) {
                repliesCopy[i].visible = false;
                break;
            }
        }
        localDataStore.set("replies", repliesCopy);
        onStorage();
    });
}

// Update badge number when a new post is added to storage
// Call every time a change is made to replies in localstorage
function onStorage() {
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

// Stores all cookies in localstorage
function getCookie(callback) {
    chrome.cookies.get({ 'url': 'http://bodybuilding.com', 'name': 'bbthread_lastview'}, function(cookie) {
    if(cookie !== null)
        localDataStore.set("lastview", cookie);
        if (callback) callback();
    });
}

// Remove bbthread_lastview cookie
function removeCookie(callback) {
        chrome.cookies.remove({ 'url': 'http://bodybuilding.com', 'name': 'bbthread_lastview'}, function(cookie) {
            if (callback) callback();
        });
}

// sets all cookies stored from getAllCookies
function setCookie(callback) {
    var cookie = localDataStore.get("lastview");
        chrome.cookies.set({ 'url': "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path, 'name': cookie.name, 'value': cookie.value, 'domain': cookie.domain, 'path': cookie.path, 'secure': cookie.secure, 'httpOnly': cookie.httpOnly, 'expirationDate': cookie.expirationDate, 'storeId': cookie.storeId });
    if (callback) {
        callback();
    }
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
    this.notify = false;
}

// Object to store thread info
function thread(url, title) {
    this.url = url;
    this.title = title;
    this.offset = 0;
}

// Object to hold the user information
function userinfo(forum, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc) {
    this.forum = forum;
    this.username = username;
    this.avi = avi;
    this.defaultGMT = defaultGMT;
    this.userGMT = userGMT;
    this.enabled = enabled;
    this.mentions = mentions;
    this.popup_notification = popup_notification;
    this.mentions_longdesc = mentions_longdesc;
    //this.offset = offset;
}

// Function to disable popup notifications on inital quote retreival
function initalizePopupNotifications(callback) {
        // Set popup notifications to TRUE after inital quote retreival
        var url = localDataStore.get("fb_userinfo").url;
        var username = localDataStore.get("fb_userinfo").username;
        var avi = localDataStore.get("fb_userinfo").avi;
        var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
        var userGMT = localDataStore.get("fb_userinfo").userGMT;
        var enabled = localDataStore.get("fb_userinfo").enabled;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var popup_notification = true;
        var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;

        var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);
        localDataStore.set("fb_userinfo", tempuserinfo);

        if (callback) callback();
}

// Function to initalize getting user information
function initalize(callback) {
    var url = "http://forum.bodybuilding.com/";
    var aviurl = "http://forum.bodybuilding.com/profile.php?do=editavatar";
    var avi;
    var defaultGMT = formatGMT(-7);

    if (localStorage.getItem("popout") === null)
        localStorage.setItem("popout", false);


    $.get(aviurl, function(data) {

        // find username in the page source
        var matchArray = data.match(/s_omni.memberName = "(.*?)\"/) || data.match(/s.prop42="(.*?)\"/) ||  data.match(/s.eVar42="(.*?)\"/);

        var userGMT;

        // find avi in the page source
        var avisrc = data.match(/<img src="(.*?)" width="80" height="80" alt="Custom Avatar" border="0" \/>/);

        //quit statement, not logged in
        if (!matchArray) {
            console.log("not logged in");
            localStorage.removeItem("fb_userinfo");
            if(callback) callback();
            return false;
        }

        var username = matchArray[1];
        if (!avisrc) {
            avisrc = "/css/images/profiledefault_thumb.jpg";
            avi = avisrc;
        } else {
            avi = url+avisrc[1];
        }

        // Get the time difference for when cookies removed
        $.get(url, function(data) {
            var matchArray = /\bGMT +(.+?)(?=\. )/.exec(data);
            if (matchArray) {
                userGMT = formatGMT(matchArray[1]);
            }
            else
                userGMT = formatGMT(defaultGMT);

            var tempuserinfo;
            if (localStorage.getItem("fb_userinfo") === null)
                tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, true, true, false, true);
            else {
                var enabled = localDataStore.get("fb_userinfo").enabled;
                var mentions = localDataStore.get("fb_userinfo").mentions;
                var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
                var popup_notification = localDataStore.get("fb_userinfo").popup_notification;

                tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);
            }
            localDataStore.set("fb_userinfo", tempuserinfo);
            if(callback) callback();
        });
    });
}

// Function to check the threads the user recently posted in
function minePosts(callback) {

    var cbGenerator = callback.multiCb();
    
    // if user is not logged in return quit fetchPosts & delete quotes
    if (localStorage.getItem("fb_userinfo") === null) {
        if(localStorage.getItem("replies") !== null)
            localStorage.removeItem("replies");
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
        var offsetThread = parseInt((this).offset, 10);
        offsetThread = offsetThread + 1;
        
        var mineURL = (this).url;
        
        var tempStorage = localDataStore.get("threads");
        tempStorage[index].offset = offsetThread;
        
        localDataStore.set("threads", tempStorage);

        var whenDone = cbGenerator();
        
        $.get(mineURL, function(data) {
            data = $(data);
            var threadTitle;
            var threadTitleLinkBuffer = url + $(this).find(".postcounter").attr("href");
            
            var black = false;
            if (data.find(".searchbutton").attr("src") === "images/BP-Black/buttons/search.png") {
                black = true;
            }

            // if (black === true) {
            //     var myregex = /s\.prop39="([^"]*)"/;
            //     threadTitle = myregex.exec(data)[1];
            // }
            // else {
            //     threadTitle = data.find('.threadtitle').text();
            // }
            
            threadTitle = data.find('.threadtitle').text();
            
            data.find("#posts").children().each(function() {
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
                    var postDescBuffer;

                    if (postDescLongBuffer.length > 48)
                        postDescBuffer = postDescLongBuffer.substring(0, 47) + " ...";
                    else
                        postDescBuffer = postDescLongBuffer;
                    
                    // Convert date into real date
                    if (postDateBuffer === "Yesterday")
                        postDateBuffer = getYesterday();
                    if (postDateBuffer === "Today")
                        postDateBuffer = getToday();

                    var userGMT, defaultGMT;
                    if(localDataStore.get("fb_userinfo") !== false) {
                        userGMT = localDataStore.get("fb_userinfo").userGMT;
                        defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
                    }
                    else{
                        userGMT = "00:00";
                        defaultGMT = "00:00";
                    }
                    
                    // fail safe if cant get post from page
                    if (postAuthorBuffer === "")
                        return false;
                    
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
                if (filtered.length === 0) {
                    localDataStore.appendToFront("replies", newPost);
                //create a popup notification if no popout and if user has popup notifications enabled
                if (localDataStore.get("popout") === false && localDataStore.get("fb_userinfo").popup_notification === true)
                    createNotification(newPost.postID, newPost.postAuthor, newPost.threadTitle, newPost.postDesc, newPost.postLink);
                sortReplies();
                onStorage();
                }
            }
            data = null;
            whenDone();
        }); // end .get
    });// end outer .each
    
    // Remove thread from storage after 48 hours
    var updateThreads = localDataStore.get("threads");
    var shallowCopy = $.extend({}, updateThreads);
    $.each(shallowCopy, function(index) {
        if ((this).offset > 5760) {
            updateThreads.splice(index);
            localDataStore.set("threads", updateThreads);
        }
    });
    sortReplies();
}


// function to query, store, and fetch posts
function fetchPosts(callback) {
    if(callback)
        var cbGenerator = callback.multiCb();

    // if user is not logged in return quit fetchPosts
    if (localStorage.getItem("fb_userinfo") === null) {
        if(localStorage.getItem("replies") !== null)
            localStorage.removeItem("replies");
        return false;
    }

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
    offset = parseInt(offset, 10) + 1;

    localStorage.setItem("offset", offset);

    // Reset offset after it reaches 99
    if (parseInt(offset, 10) > 98) {
        localStorage.setItem("offset", 0);
        offset = 0;
    }

    // Reset refresh after it reaches 99
    if (parseInt(refresh, 10) > 98) {
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
        data = $(data);
        if (data.find('#searchbits').length > 0) {
            findVariable = "#searchbits";
        }
        var whenDone;
        if(callback)
            whenDone = cbGenerator();

        data.find(findVariable).children().each(function() {
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

        data.remove();
        data = null;

        for (var i = 0; i < repliesBuffer.length; i++) {
            var newPost = repliesBuffer[i];

            var filtered = $(localDataStore.get("replies")).filter(function() {
                return this.postID === repliesBuffer[i].postID;
            });

            // if post not yet stored in replies, add it
            if (filtered.length === 0) {
                localDataStore.appendToFront("replies", newPost);
                //create a popup notification if no popout and if user has popup notifications enabled
                if (localDataStore.get("popout") === false && localDataStore.get("fb_userinfo").popup_notification === true)
                    createNotification(newPost.postID, newPost.postAuthor, newPost.threadTitle, newPost.postDesc, newPost.postLink);
                sortReplies();
                onStorage();
            }
        }
        if(callback) {
            whenDone();
        }
    });
}
