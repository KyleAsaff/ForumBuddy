///// Google Analytics /////////////////////////
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

function trackButton(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}

var buttons = document.querySelectorAll('button');
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
}
///////////////////////////////////////////////

// Runs checks on if the user disables their account or not
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

        $('#mentions_longdesc').prop('checked', mentions_longdesc);
        $('#mentions').prop('checked', mentions);

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

        if (localStorage.getItem("refresh") !== null) {
            var refresh = localStorage.getItem("refresh", refresh);
            refresh = parseInt(refresh) + 1;
            var refresh = localStorage.setItem("refresh", refresh);
        }

        initalize();
        localStorage.removeItem("replies");
        setTimeout(fetchPosts, 1000);
        setTimeout(accountEnabled, 2000);
        if (localStorage.getItem("fb_userinfo") !== null) {
            var avi = localDataStore.get("fb_userinfo").avi;
            var user = localDataStore.get("fb_userinfo").username;
            console.log(avi);
            $('#useravi').attr("src", avi);
            $('.username').replaceWith(user);
        }
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