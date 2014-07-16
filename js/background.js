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
        localStorage.setItem(key, JSON.stringify(value))
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
        }
    }
};

// Object for storing post data
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
var repliesBuffer = [];

// Search query
$.get("http://forum.bodybuilding.com/search.php?do=process&query=60+posted+by+nilekyle&exactname=1&titleonly=0&searchdate=0&beforeafter=after&contenttypeid=1&sortby=dateline&order=descending&sortorder=descending&searchfromtype=vBForum%3APost&showposts=1&starteronly=0&searchthreadid=0&forumchoice[]=&childforums=1&replyless=0&type[]=1#top", function(data) {

    var $page = $(data);

    // Get the first 20 search results
    var $block = $page.find(".blockbody").children().slice(0, 20);

    $.each($block, function(index, rawBuffer) {
        var $rawBuffer = $(rawBuffer);

        // Put everything in the first result of search query in a buffer
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

        // Create a post object with the buffer data
        var postBuffer = new post(postIDBuffer, threadTitleBuffer, threadTitleLinkBuffer, threadRepliesBuffer, threadViewsBuffer, postAuthorBuffer, postAuthorLinkBuffer, postDateBuffer, postTimeBuffer, postDescBuffer, postLinkBuffer);

        // fill new array of data to concat with data in localstore
        if (postBuffer.postID === localDataStore.getIndexOf("replies", 0).postID) {
            localDataStore.appendToFront("replies", repliesBuffer)
            repliesBuffer = [];
            return false;
        } else
            repliesBuffer.push(postBuffer);
    });

    // append replies buffer to local storage
    localDataStore.appendToFront("replies", repliesBuffer);
    repliesBuffer = [];

    $(".response").append($block).html();

    console.log(localDataStore.get("replies"));


});