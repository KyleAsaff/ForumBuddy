function accountEnabled() {
    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var enabled = localDataStore.get("fb_userinfo").enabled;
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

    // fill page with data from storage
    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var enabled = localDataStore.get("fb_userinfo").enabled;
    }

    $('#useravi').attr("src", avi);
    $('.username').replaceWith(user);
    $('#mentions').prop('checked', mentions);

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
            var enabled = false;
        }

        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions);

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
            var enabled = true;
        }

        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions);

        localDataStore.set("fb_userinfo", tempuserinfo);

        accountEnabled();
    });

    // function for when mentions button
    $("#mentions").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            mentions = !(localDataStore.get("fb_userinfo").mentions);
        }
        var tempuserinfo = new userinfo(url, username, avi, enabled, mentions);

        localDataStore.set("fb_userinfo", tempuserinfo);

        $('#mentions').prop('checked', mentions);
    });

});