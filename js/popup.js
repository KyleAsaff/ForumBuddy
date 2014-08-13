// add fade class
Handlebars.registerHelper("addClasses", function() {
    if (this.visible === true) {
        return '';
    } else {
        return 'fade';
    }
});

// Helper to display short or long description
Handlebars.registerHelper("Desc", function(longDesc, shortDesc) {
    if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
        return longDesc;
    else
        return shortDesc;
});

// Helper to display default avi or user's avi
Handlebars.registerHelper("avi", function() {
    if (localStorage.getItem("fb_userinfo") === null)
        return "/icons/profiledefault_thumb.jpg";

    if (localDataStore.get("fb_userinfo").enabled === false)
        return "/icons/profiledefault_thumb.jpg";
    else
        return localDataStore.get("fb_userinfo").avi;
});

// Helper to display username or "not logged in"
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
        for (var i = 0; i < numItems; i++) {

            if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
                var desc = localDataStore.get("replies")[i].postDescLong;
            else
                var desc = localDataStore.get("replies")[i].postDesc;

            if (i < numItems) {
                var fade = ""
                if (!localDataStore.get("replies")[i].visible)
                    fade = "fade";
                $(".timeline").prepend("\
                    <div class='post " + fade + "' id='" + i + "' style='display: none;'>\
                        <div class='posttop'>\
                            <span class='postdate'>\
                                <span class='date'>" + localDataStore.get("replies")[i].fullDate + "</span>\
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

// Function to dynamicly resize timeline
function sizeContent() {
    var newHeight = $(window).height() - $(".header").height() - $(".footer").height() - 23 + "px";

    $(".scrollcontainer").css("height", newHeight);
}

// create a variable for read posts switch if doesnt exist
if (localStorage.getItem("fb_posts-switch") === null)
    localStorage.setItem("fb_posts-switch", "show");

if (localStorage.getItem("popout") === null)
    localStorage.setItem("popout", false);

// When document is ready
$(document).ready(function() {

    // Listen to dynamically add new posts if new post gets added to storage
    if (window.addEventListener) {
        window.addEventListener("storage", newItem, false);
    } else {
        window.attachEvent("onstorage", newItem);
    }

    // If the user is running the popout, make the timeline dynamic
    if (localDataStore.get("popout") === true) {
        $(window).load('resize', sizeContent);
        $(window).resize(sizeContent);
    }

    // Compile handlebars template and append data to template
    var template = Handlebars.compile($('#template').html());
    var data = template(localDataStore.get("replies"));
    $('div.container').append(data);

    // If user is disabled, hide timeline
    if (localDataStore.get("fb_userinfo").enabled === false)
        $('.timeline').hide();
    else
        $('.timeline').show();

    // If the user has mentions disabled, hide mentions
    if (localDataStore.get("fb_userinfo").mentions === false)
        $('.timeline').hide();
    else
        $('.timeline').show();

    // If user has mentions enabled but account disabled, hid mentions
    if (localDataStore.get("fb_userinfo").mentions === true) {
        if (localDataStore.get("fb_userinfo").enabled === false)
            $('.timeline').hide();
        else
            $('.timeline').show();
    }

    // Handles clicking the x button on the post
    $(document).on('click', '.close', function() {
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

    // Pop out window on click
    $("#popout").on("click", function() {
        chrome.windows.create({
            url: "/src/browser_action/popup.html",
            width: 396,
            height: 573,
            type: "popup"
        });
        window.close()
        chrome.browserAction.disable();
    });

    // Check for if user is refreshing or exiting popout
    var refresh = false;
    $(window).keydown(function(event) {
        // User presses F5 to refresh
        if (event.keyCode == 116) {
            refresh = true;
        }
    });

    // Disable/enable popup icon upon popout open or exit
    $(window).bind("beforeunload", function() {
        if (!refresh) {
            chrome.browserAction.enable();
            if (localDataStore.get("popout") === true)
                localStorage.setItem("popout", false);
            else
                localStorage.setItem("popout", true);
        }
    })
});