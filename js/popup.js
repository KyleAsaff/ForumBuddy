/*!
 * popup.js
 * Functions and actions for everything involving 
 * the browser action popup
 */

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
        return "/css/images/profiledefault_thumb.jpg";

    if (localDataStore.get("fb_userinfo").enabled === false)
        return "/css/images/profiledefault_thumb.jpg";
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
    var repliesCopy = localDataStore.get("replies");
    var numItems = localDataStore.get("replies").length - $(".post").length;
    var added = 0;
    var fade;
    var desc;
    // Quit function if there are no items to add
    if (numItems < 1)
        return false;
    // Iterate through each post and find out if you need to append or prepend a new post
    $(".post").each(function(index) {
            if($(this).find("a.title").attr("href") === repliesCopy[index+added].postLink) {
                // increment ID because a new post was added
                $(this).attr("id", index+added);
            }
            // Satement to dynamically add new posts at the start or the middle of the news feed
            else {
                added++;
                $(this).attr("id", index+added);
                if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
                    desc = repliesCopy[index].postDescLong;
                else
                    desc = repliesCopy[index].postDesc;
                    fade = "";
                if (!repliesCopy[index].visible)
                    fade = "fade";
                $(".timeline").prepend("\
                    <div class='post " + fade +"' id='" + (index) + "'style='display: none;'>\
                        <div class='posttop'>\
                            <span class='postdate'>\
                                <span class='date'>" + repliesCopy[index].fullDate + "</span>\
                                <a class='close' >x</a>\
                            </span>\
                        </div>\
                    <div class='postbody'>\
                            <span class='postinfo'>\
                                <a class='author' href='" + repliesCopy[index].postAuthorLink + "' target='_blank'><span class='icon'>U</span>" + repliesCopy[index].postAuthor + "</a>\
                                <a class='title' href='" + repliesCopy[index].postLink + "' target='_blank'>" + repliesCopy[index].threadTitle + "</a>\
                                <a class='desc'>" + desc + "</a>\
                            </span>\
                        </div>\
                    </div>");
                $("#" + index).slideDown("slow");
            }
            // Statement to dynamically add notifications from the end of the array
            if(index === repliesCopy.length-numItems-1) {
                for(var k = added; k<numItems; k++) {
                if ((localDataStore.get("fb_userinfo").mentions_longdesc) === true)
                    desc = repliesCopy[index+k+1].postDescLong;
                else
                    desc = repliesCopy[index+k+1].postDesc;
                fade = "";
                if (!repliesCopy[index+k+1].visible)
                    fade = "fade";
                $(".timeline").append("\
                    <div class='post " + fade +"' id='" + (index+k+1) + "'style='display: none;'>\
                        <div class='posttop'>\
                            <span class='postdate'>\
                                <span class='date'>" + repliesCopy[index+k+1].fullDate + "</span>\
                                <a class='close' >x</a>\
                            </span>\
                        </div>\
                    <div class='postbody'>\
                            <span class='postinfo'>\
                                <a class='author' href='" + repliesCopy[index+k+1].postAuthorLink + "' target='_blank'><span class='icon'>U</span>" + repliesCopy[index+k+1].postAuthor + "</a>\
                                <a class='title' href='" + repliesCopy[index+k+1].postLink + "' target='_blank'>" + repliesCopy[index+k+1].threadTitle + "</a>\
                                <a class='desc'>" + desc + "</a>\
                            </span>\
                        </div>\
                    </div>");
                $("#" + (index+k+1)).slideDown("slow");
                }
            }
    });
}

// Sort items before inserting them
function sortNewItem() {
    sortReplies(function(){
        newItem();
    });
}


// Function to dynamicly resize timeline
function sizeContent() {
    var newHeight = $(window).height() - $(".header").height() - $(".footer").height() - 23 + "px";

    $(".scrollcontainer").css("height", newHeight);
    $(".scrollcontainer").css("max-width", "100%");
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
        window.addEventListener("storage", sortNewItem, false);
    } else {
        window.attachEvent("onstorage", sortNewItem);
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
        window.close();
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
    });

    // If the user is running the popout, make the timeline dynamic
    if (localDataStore.get("popout") === true) {
        $("#popout").hide();
        $(window).load(sizeContent);
      $(window).resize(sizeContent);
    }
});