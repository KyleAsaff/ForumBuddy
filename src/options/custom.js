function accountEnabled() {

    if (localStorage.getItem("fb_userinfo") === null) {
        $('.active_avi').hide();
        $('.disable_acc').hide();
        $('.error_message').show();
    }

    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var enabled = localDataStore.get("fb_userinfo").enabled;
        var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;

        $('.active_avi').show();
        $('.disable_acc').show();
        $('.error_message').hide();
    }


    if (enabled === false) {
        $('.active_avi').css({
            opacity: 0.7
        });
        $("#mentions").attr("disabled", true);

    } else {
        $('.active_avi').css({
            opacity: 1.0
        });
        $("#mentions").removeAttr("disabled");
    }
}

$(document).ready(function() {
    $('.error_message').hide();

    // fill page with data from storage
    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var enabled = localDataStore.get("fb_userinfo").enabled;
        var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
    }

    $('#useravi').attr("src", avi);
    $('.username').replaceWith(user);
    $('#mentions').prop('checked', mentions);
    $('#mentions_longdesc').prop('checked', mentions_longdesc);

    accountEnabled();

    // function for when the refresh button is clicked
    $(".refresh_btn").click(function() {
        initalize();
        localStorage.removeItem("replies");
        setTimeout(fetchPosts, 2000);

        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var user = localDataStore.get("fb_userinfo").username;
            console.log(avi);
            $('#useravi').attr("src", avi);
            $('.username').replaceWith(user);
        }
        accountEnabled();
    });

    // function for when the disabled button is clicked
    $(".disable_btn").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            var enabled = false;
        }

        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions, mentions_longdesc);

        localDataStore.set("fb_userinfo", tempuserinfo);

        accountEnabled();
    });

    // function for when the enable button is clicked
    $(".enable_btn").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            var enabled = true;
        }

        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions, mentions_longdesc);

        localDataStore.set("fb_userinfo", tempuserinfo, mentions_longdesc);

        accountEnabled();
    });

    // function for when mentions is checked
    $("#mentions").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            mentions = !(localDataStore.get("fb_userinfo").mentions);
        }
        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions, mentions_longdesc);

        localDataStore.set("fb_userinfo", tempuserinfo);

        $('#mentions').prop('checked', mentions);
    });

    // function for mentions long descriptions checkbox
    $("#mentions_longdesc").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            mentions_longdesc = !(localDataStore.get("fb_userinfo").mentions_longdesc);
        }

        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions, mentions_longdesc);

        localDataStore.set("fb_userinfo", tempuserinfo);

        $('#mentions_longdesc').prop('checked', mentions_longdesc);
    });

});