/* content_script.js
 *
 * Injects the forum buddy icon into the forum page by donators usernames.
 *
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

// Function to get donators from external json
function donators() {
    var jsonURL = "http://kylesbox.com/donators.json";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonURL, true);
    //xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {

            localDataStore.set("fb_donators", xhr.responseText);
        }
    };
    xhr.send();
}

// Inject icon by donators names
function myfunc() {
    donators();
    var x = $('#options option:selected').text();
    var iconURL = chrome.extension.getURL("icons/icon2_128.png");

    var log = $('.usertittle').html();

    var data = localDataStore.get("fb_donators");
    var data = $.parseJSON(data);

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

// run injection on ready
$(document).ready(myfunc)