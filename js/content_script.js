/* content_script.js
 *
 * Injects the forum buddy icon 
 * into the forum page by donators usernames.
 */

// Custom localstorage methods for parsing JSON data
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
        }
    }
};

// Function to get donators from external JSON
function donators() {
    var jsonURL = "https://kylesbox.com/donators.json";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonURL, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            localDataStore.set("fb_donators", xhr.responseText);
            xhr = null;
        }
    };
    xhr.send();
}

// Inject icon by donators names
function insertBadge() {
    donators();

    // If URL cannot be reached, nothing is stored, quit function
    if(localDataStore.get("fb_donators") === "")
        return false;

    var x = $('#options option:selected').text();
    var iconURL = chrome.extension.getURL("icons/icon2_128.png");

    var data = localDataStore.get("fb_donators");
    data = $.parseJSON(data);

    $("img.onlinestatus").each(function(index) {
        var match = $(this).attr('title');
        var $this = $(this);
        $.each(data.donators, function(i, item) {
            var username = data.donators[i].username;

            if (match.indexOf(username + " ") > -1) {
                $($this).next().find(".report").first().after('<a class="forumbuddy" title="Forum Buddy Supporter"><img src=' + iconURL + ' alt="" height="24px" width="22px"></a>');
            }

        });
    });
}

// Inject icon by donators names
function insertBlackBadge() {
    donators();

    // If URL cannot be reached, nothing is stored, quit function
    if(localDataStore.get("fb_donators") === "")
        return false;

    var x = $('#options option:selected').text();
    var iconURL = chrome.extension.getURL("icons/icon2_128.png");

    var data = localDataStore.get("fb_donators");
    data = $.parseJSON(data);

    $("a.postuseravatar").each(function(index) {
        var match = $(this).attr('title');
        var $this = $(this);

        $.each(data.donators, function(i, item) {
            var username = data.donators[i].username;

            if (match.indexOf(username + " ") > -1) {
                var badge = '<a class="forumbuddy" title="Forum Buddy Supporter"><img src=' + iconURL + ' alt="" height="24px" width="22px"></a>';
                ($this).parent().append(badge);
            }

        });
    });
}

// run injection on ready
$(document).ready(function() {

    if ($(this).find(".searchbutton").attr("src") === "images/BP-Black/buttons/search.png")
        insertBlackBadge();
    else
        insertBadge();
    var pathname = $(location).attr('href');

    //watch put a watch on threads replied to
    $("#vB_Editor_001_save").click(function() {
        chrome.runtime.sendMessage({
            greeting: "submitreply",
            threadid: $("input[name=t]").val(),
            // threadtitle: $('body').text().match(/s\.prop39="([^"]*)"/)[1]
            threadtitle: "thread_title"
        }, function(response) {
           // console.log(response.received);
        });
    });

    $("#qr_submit").click(function() {

        chrome.runtime.sendMessage({
            greeting: "quickreply",
            threadid: $("#qr_threadid").val(),
            //threadtitle: $('body').text().match(/s\.prop39="([^"]*)"/)[1]
            threadtitle: "thread_title"
        }, function(response) {
           //console.log(response.received);
        });
    });
});