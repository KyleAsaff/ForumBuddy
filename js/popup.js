// Google Analytics 
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

// add fade class
Handlebars.registerHelper("addClasses", function() {
    if (this.visible === true) {
        return '';
    } else {
        return 'fade';
    }
});

Handlebars.registerHelper("Desc", function(longDesc, shortDesc) {
    if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
        return longDesc;
    else
        return shortDesc;
});

Handlebars.registerHelper("avi", function() {
    if (localStorage.getItem("fb_userinfo") === null)
        return "/icons/profiledefault_thumb.jpg";

    if (localDataStore.get("fb_userinfo").enabled === false)
        return "/icons/profiledefault_thumb.jpg";
    else
        return localDataStore.get("fb_userinfo").avi;
});

Handlebars.registerHelper("user", function() {
    if (localStorage.getItem("fb_userinfo") === null)
        return "Not Logged In";

    if (localDataStore.get("fb_userinfo").enabled === false)
        return "Not Logged In";
    else
        return localDataStore.get("fb_userinfo").username;
});

// get the state of the switch and apply it
Handlebars.registerHelper("switch", function() {
    if (localStorage.getItem("fb_posts-switch") === "show")
        return "checked";
    else
        return "";
});

function disableforAnimation() {
    if ($(':animated').length) {
        return false;
    }
}

// Function for when new items get added to the list, update old items ID in timeline
function newItem() {
    sortReplies();
    var repliesCopy = localDataStore.get("replies");
    var numItems = localDataStore.get("replies").length - (parseInt($('.timeline').children().last().attr('id')) + 1);
    if (numItems < 1)
        return false;
    else {
        $(".post").each(function(index) {
            var newID = parseInt($(this).attr("id")) + numItems;
            $(this).attr("id", newID);
        });
        console.log("original " + localDataStore.get("replies"));
        console.log("original " + numItems);
        for (var i = 0; i < numItems; i++) {

            if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
                var desc = localDataStore.get("replies")[i].postDesc;
            else
                var desc = localDataStore.get("replies")[i].postDescLong;

            if (i < numItems) {
                var fade = ""
                if (!localDataStore.get("replies")[i].visible)
                    fade = "fade";
                $(".timeline").prepend("\
                    <div class='post " + fade + "' id='" + i + "' style='display: none;'>\
                        <div class='posttop'>\
                            <span class='postdate'>\
                                <span class='date'>" + localDataStore.get("replies")[i].postDate + "</span>\
                                <span class='Time'>" + localDataStore.get("replies")[i].postTime + "</span>\
                                <a class='close' >x</a>\
                            </span>\
                        </div>\
                    <div class='postbody'>\
                            <span class='postinfo'>\
                                <a class='author' href='" + localDataStore.get("replies")[i].postAuthorLink + "' target='_blank'><span class='icon'>U</span>" + localDataStore.get("replies")[i].postAuthor + "</a>\
                                <a class='title' href='" + localDataStore.get("replies")[i].postLink + "' target='_blank'>" + localDataStore.get("replies")[i].threadTitle + "</a>\
                                <a class='desc'>" + desc + "</a>\
                            </span>\
                        </div>\
                    </div>");
                $("#" + i).slideDown("slow");
            }
        };
    }
}

// create a variable for read posts switch if doesnt exist
if (localStorage.getItem("fb_posts-switch") === null) {
    localStorage.setItem("fb_posts-switch", "show");
}
/* When document ready */
$(document).ready(function() {

    if (window.addEventListener) {
        window.addEventListener("storage", newItem, false);
    } else {
        window.attachEvent("onstorage", newItem);
    }

    var template = Handlebars.compile($('#template').html());
    var data = template(localDataStore.get("replies"));
    $('div.container').append(data);


    if (localDataStore.get("fb_userinfo").enabled === false)
        $('.timeline').hide();
    else
        $('.timeline').show();

    if (localDataStore.get("fb_userinfo").mentions === false)
        $('.timeline').hide();
    else
        $('.timeline').show();

    if (localDataStore.get("fb_userinfo").mentions === true) {
        if (localDataStore.get("fb_userinfo").enabled === false)
            $('.timeline').hide();
        else
            $('.timeline').show();
    }

    // handles clicking the x button on the post
    $(document).on('click', '.close', function() {
        console.log("i was clicked")
        if ($(':animated').length) {
            return false;
        }
        $('#myonoffswitch').prop('disabled', true);
        var postNode = this.parentNode.parentNode.parentNode;
        var id = $(postNode).attr('id');
        var tempArray = localDataStore.get("replies");

        // post fade on click
        $('#myonoffswitch').prop('disabled', true);
        if (tempArray[id].visible === true) {
            $("#" + id).fadeTo("slow", 0.4, function() {
                $("#" + id).addClass("fade");
                $('#myonoffswitch').prop('disabled', false);
            });
            tempArray[id].visible = false;
        } else {
            $("#" + id).fadeTo("slow", 1.0, function() {
                $("#" + id).removeClass("fade");
                $('#myonoffswitch').prop('disabled', false);
            });
            tempArray[id].visible = true;

        }

        // get switch state from local storage (on click)
        if (localStorage.getItem("fb_posts-switch") === "show") {
            $(".fade").show();
        } else {

            $('#' + id).animate({
                opacity: 0.0
            }, 400, function() {
                $('#' + id).hide();
                $('#' + id).addClass('fade');
                $('#' + id).css({
                    opacity: 0.4
                });
                $('#myonoffswitch').prop('disabled', false);
            });
        }
        // store new visible state
        localDataStore.set("replies", tempArray);
    });

    // Handles clicking the "mark all read button"
    $("#read").on('click', function() {
        if ($(':animated').length) {
            return false;
        }
        $('#myonoffswitch').prop('disabled', true);
        var tempArray = localDataStore.get("replies");

        for (i = 0; i < tempArray.length; i++)
            tempArray[i].visible = false;

        if (localStorage.getItem("fb_posts-switch") === "show") {
            $('.post').fadeTo("slow", 0.4, function() {
                $('#myonoffswitch').prop('disabled', false);
                $('.post').addClass('fade');
            });
        } else {

            $('.post').animate({
                opacity: 0.0
            }, 400, function() {
                $('.post').hide();
                $('.post').addClass('fade');
                $('.post').css({
                    opacity: 0.4
                });
                $('#myonoffswitch').prop('disabled', false);
            });
        }
        localDataStore.set("replies", tempArray);

    });

    // Handles clicking the "mark all unread button"
    $("#unread").on('click', function() {
        if ($(':animated').length) {
            return false;
        }
        $('#myonoffswitch').prop('disabled', true);
        var tempArray = localDataStore.get("replies");


        for (i = 0; i < tempArray.length; i++)
            tempArray[i].visible = true;

        if (localStorage.getItem("fb_posts-switch") === "hide") {
            $('.post').css({
                opacity: 0.0
            });
        }
        $('.post').show();
        $('.post').animate({
            opacity: 1.0
        }, 400, function() {
            $('.post').removeClass('fade');
            $('#myonoffswitch').prop('disabled', false);
        });
        localDataStore.set("replies", tempArray);
    });


    // handles clicking on the link -> mark as read
    $(document).on('click', '.title', function() {
        var postNode = this.parentNode.parentNode.parentNode;
        var id = $(postNode).attr('id');
        var tempArray = localDataStore.get("replies");

        $("#" + id).addClass("fade");
        tempArray[id].visible = false;

        // get switch state from local storage (on click)
        if (localStorage.getItem("fb_posts-switch") === "show") {
            $('#myonoffswitch').prop('checked', true);
            $(".fade").show();
        } else {
            $('#myonoffswitch').prop('checked', false);
            $(".fade").hide();
        }

        // store new visible state
        localDataStore.set("replies", tempArray);
    });

    // get switch state from local storage (on load)
    if (localStorage.getItem("fb_posts-switch") === "show") {
        $('#myonoffswitch').prop('checked', true);
        $(".fade").show();
    } else {
        $('#myonoffswitch').prop('checked', false);
        $(".fade").hide();
    }

    // store switch state in local storage on click
    $("#myonoffswitch").on('click', function() {
        if ($(':animated').length) {
            return false;
        }
        if ($('#myonoffswitch').prop('checked')) {
            $(".fade").show();
            localStorage.setItem("fb_posts-switch", "show");
        } else {
            $(".fade").hide();
            localStorage.setItem("fb_posts-switch", "hide");
        }
    });
    // pop out window on click
    $("#popout").on("click", function() {
        chrome.windows.create({
            url: "/src/browser_action/popup.html",
            width: 396,
            height: 573,
            type: "popup"
        });
        window.close()
    });

});