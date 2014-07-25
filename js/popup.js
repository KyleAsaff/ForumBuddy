// add fade class
Handlebars.registerHelper("addClasses", function() {
    if (this.visible === true) {
        return '';
    } else {
        console.log('dont fade');
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

// create a variable for read posts switch if doesnt exist
if (localStorage.getItem("fb_posts-switch") === null) {
    localStorage.setItem("fb_posts-switch", "show");
}
/* When document ready */
$(document).ready(function() {
    var template = Handlebars.compile($('#template').html());
    var data = template(localDataStore.get("replies"));
    console.log(data);
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
    $(".close").on('click', function() {
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
    $(".title").on('click', function() {
        var postNode = this.parentNode.parentNode.parentNode;
        var id = $(postNode).attr('id');
        var tempArray = localDataStore.get("replies");
        console.log(tempArray[id].visible);

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

});