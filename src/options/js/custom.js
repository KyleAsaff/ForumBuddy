/*!
 * custom.js
 * Holds the custom functions and actions for the options menu
 * 
 */

// Runs checks on if the user disables their account or not
function accountEnabled(callback) {
    if (localStorage.getItem("fb_userinfo") === null) {
        $('.active_avi').hide();
        $('.disable_acc').hide();
        $('.error_message').show();
    }

    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
        var enabled = localDataStore.get("fb_userinfo").enabled;
        var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;

        $('.active_avi').show();
        $('.disable_acc').show();
        $('.error_message').hide();

        $('#mentions_longdesc').prop('checked', mentions_longdesc);
        $('#mentions').prop('checked', mentions);
        $('#popup_notification').prop('checked', popup_notification);

        if (enabled === false) {
            $('.active_avi').css({
                opacity: 0.7
            });
            $("#mentions").attr("disabled", true);
            $("#popup_notification").attr("disabled", true);

        } else {
            $('.active_avi').css({
                opacity: 1.0
            });
            $("#mentions").removeAttr("disabled");
            $("#popup_notification").removeAttr("disabled");
        }
    }
    if(callback) callback();
}

$(document).ready(function() {
    $('.error_message').hide();

    // fill page with data from storage
    if (localStorage.getItem("fb_userinfo") !== null) {
        var avi = localDataStore.get("fb_userinfo").avi;
        var user = localDataStore.get("fb_userinfo").username;
        var mentions = localDataStore.get("fb_userinfo").mentions;
        var enabled = localDataStore.get("fb_userinfo").enabled;
        var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
        var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
        $('#useravi').attr("src", avi);
        $('.username').append(user);
        $('#mentions').prop('checked', mentions);
        $('#popup_notification').prop('checked', popup_notification);
        $('#mentions_longdesc').prop('checked', mentions_longdesc);
    }

    accountEnabled();

    // function for when the refresh button is clicked
    $(".refresh_btn").click(function() {

        $(".loading").show();

        if (localStorage.getItem("refresh") !== null) {
            var refresh = localStorage.getItem("refresh", refresh);
            refresh = parseInt(refresh, 10) + 1;
            refresh = localStorage.setItem("refresh", refresh);
        }

        // Remove all stored data on refresh
        localStorage.removeItem("replies");
        localStorage.removeItem("threads");
        localStorage.removeItem("fb_userinfo");

        // Function for refreshing account
        initalize(function() {
                accountEnabled(function() {
                fetchPosts(function() {
                    var avi = localDataStore.get("fb_userinfo").avi;
                    $('#popup_notification').prop('checked', true);
                    $('#useravi').attr("src", avi);
                    setTimeout(function() {
                        initalizePopupNotifications();
                    }, 10000);
                });
                $(".loading").hide();
            });
        });
    });

    // function for when the disabled button is clicked
    $(".disable_btn").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var url = localDataStore.get("fb_userinfo").url;
            var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
            var userGMT = localDataStore.get("fb_userinfo").userGMT;
            var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            var enabled = false;
            var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);

            localDataStore.set("fb_userinfo", tempuserinfo);
        }

        accountEnabled();
    });

    // function for when the enable button is clicked
    $(".enable_btn").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var url = localDataStore.get("fb_userinfo").url;
            var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
            var userGMT = localDataStore.get("fb_userinfo").userGMT;
            var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            var enabled = true;
            var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);

            localDataStore.set("fb_userinfo", tempuserinfo, mentions_longdesc);
        }

        accountEnabled();
    });

    // function for when mentions is checked
    $("#mentions").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
            var userGMT = localDataStore.get("fb_userinfo").userGMT;
            var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            mentions = !(localDataStore.get("fb_userinfo").mentions);
            var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);

            localDataStore.set("fb_userinfo", tempuserinfo);
        }

        $('#mentions').prop('checked', mentions);
    });

    // function for when popup notifications is checked
    $("#popup_notification").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var userGMT = localDataStore.get("fb_userinfo").userGMT;
            var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
            var mentions_longdesc = localDataStore.get("fb_userinfo").mentions_longdesc;
            var popup_notification = !(localDataStore.get("fb_userinfo").popup_notification);
            var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);

            localDataStore.set("fb_userinfo", tempuserinfo);
            $('#popup_notification').prop('checked', popup_notification);
        }
    });

    // function for mentions long descriptions checkbox
    $("#mentions_longdesc").click(function() {
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var username = localDataStore.get("fb_userinfo").username;
            var enabled = localDataStore.get("fb_userinfo").enabled;
            var url = localDataStore.get("fb_userinfo").url;
            var mentions = localDataStore.get("fb_userinfo").mentions;
            var popup_notification = localDataStore.get("fb_userinfo").popup_notification;
            var userGMT = localDataStore.get("fb_userinfo").userGMT;
            var defaultGMT = localDataStore.get("fb_userinfo").defaultGMT;
            mentions_longdesc = !(localDataStore.get("fb_userinfo").mentions_longdesc);
            var tempuserinfo = new userinfo(url, username, avi, defaultGMT, userGMT, enabled, mentions, popup_notification, mentions_longdesc);

            localDataStore.set("fb_userinfo", tempuserinfo);
        }

        $('#mentions_longdesc').prop('checked', mentions_longdesc);
    });

});