var chromeDataStore = {
    get: function(name, callback) {
        // get sync data for key name and run callback
        // dataStore.get('variable', function(data) { /* do stuff with data  })
    },

    set: function(name, value) {
        // set sync data for name
        // dataStore.set('variable', 12345)
    },

    appendItem: function(key, data) {

        var t = data.constructor;
        var k = key;
        switch (t) {

            case Array:
                chrome.storage.local.get(key, function(result) {
                    var tmp = (result).saved;
                    //console.log(tmp);
                    tmp = (tmp === null) ? [] : tmp;
                    $.each(data, function(index, post) {
                        tmp.push(post);
                    });
                    chrome.storage.local.set({
                        "saved": tmp
                    });
                    chrome.storage.local.get("saved", function(result2) {
                        console.log(result2.saved);
                    });
                });

                break;
        }
    }
};

function post(postID, threadTitle, threadTitleLink, threadReplies, threadViews, postAuthor, postAuthorLink, postDate, postTime, postDesc, postLink) {
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
};

var url = "http://forum.bodybuilding.com/";
var replies = [];

$.get("http://forum.bodybuilding.com/search.php?do=process&query=1+posted+by+nilekyle&exactname=1&titleonly=0&searchdate=0&beforeafter=after&contenttypeid=1&sortby=dateline&order=descending&sortorder=descending&searchfromtype=vBForum%3APost&showposts=1&starteronly=0&searchthreadid=0&forumchoice[]=&childforums=1&replyless=0&type[]=1#top", function(data) {


    var $page = $(data);
    var $block = $page.find(".blockbody").children().slice(0, 20);

    $.each($block, function(index, rawBuffer) {
        var $rawBuffer = $(rawBuffer);
        if (replies.length > 0) {
            if ($rawBuffer.attr("id") === replies[replies.length - 1].id) {
                return false;
            };
        };
        var postDateBuffer = $rawBuffer.find("span.date").text().substr(0, 10);
        var postTimeBuffer = $rawBuffer.find("span.date").text().substr(10);
        var threadTitleBuffer = $rawBuffer.find("div.username_container h2 a:first").text();
        var threadTitleLinkBuffer = url + $rawBuffer.find("div.username_container h2 a:first").attr("href");
        var postAuthorLinkBuffer = url + $rawBuffer.find("div.username_container a:last").attr("href");
        var postAuthorBuffer = $rawBuffer.find("div.username_container a:last").text();
        var postIDBuffer = $rawBuffer.attr("id");
        var postLinkBuffer = url + $rawBuffer.find("h3.posttitle a:first").attr("href");
        var postDescBuffer = $rawBuffer.find("h3.posttitle a:first").text();
        var threadRepliesBuffer = $rawBuffer.find("dl.userstats dd:first").text();
        var threadViewsBuffer = $rawBuffer.find("dl.userstats dd:last").text();

        replies.push(new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, postDescBuffer, postLinkBuffer));

    });

    $(".response").append($block).html();

    chrome.storage.local.set({
        "saved": replies
    });

    chrome.storage.local.get("saved", function(result) {
        console.log(result.saved);
    });

    chromeDataStore.appendItem("saved", replies);

    chrome.storage.local.get("saved", function(result2) {
        console.log(result2.saved);
    });

});