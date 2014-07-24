// SAMPLE
this.manifest = {
    "name": "Forum Buddy",
    "icon": "/icons/icon2_48.png",
    "settings": [{
            "tab": "Accounts",
            "group": "Active Accounts",
            "name": "forum_label",
            "type": "description",
            "text": "<div class='website'><span>forum.bodybuilding.com</span><button type='button' class='default_btn' disabled>Default</button></div>"
        }, {
            "tab": "Accounts",
            "group": "Active Accounts",
            "name": "active_avi",
            "type": "description",
            "text": "<div class='avi_div'><img class='avi' id='useravi' src=''></div><div class='userinfo_container'><div class='username' id='username'></div><div class='notifyfor'><span>Notify For: </span><div class='options'><label class='accopt_label'><input class='accopt_checkbox' type='checkbox' id='mentions' value='mentions_val'/>Mentions</label><label class='accopt_label disabled_label'><input class='accopt_checkbox' type='checkbox' id='subs' value='subs_val' disabled/>Subscriptions</label><label class='accopt_label disabled_label'><input class='accopt_checkbox' type='checkbox' id='pm' value='pm_val' disabled/>Personal Messages</label><label class='accopt_label disabled_label'><input class='accopt_checkbox' type='checkbox' id='reps' value='reps_val' disabled/>Recent Reputation</label></div></div></div>"
        },
        /*{
            "tab": "Accounts",
            "group": "Active Accounts",
            "name": "active_acc",
            "type": "description",
            "text": "<div class='username'>nilekyle</div><div class='notifyfor'><span>Notify For: </span><div class='options'><input type='checkbox' id='mentions' value='mentions_val'/><label for='mentions'>Mentions</label><input type='checkbox' id='subs' value='subs_val'/><label for='mentions'>Subscriptions</label><input type='checkbox' id='pm' value='pm_val'/><label for='pm'>Personal Messages</label><input type='checkbox' id='reps' value='reps_val'/><label for='reps'>Recent Reputation</label></div></div>"
        },
        /*{
        "tab": "Accounts",
        "group": "Active Accounts",
        "name": "account_options",
        "type": "description",
        "text": "<div class='options'><input type='checkbox' id='mentions' value='mentions_val'/><label for='mentions'>Mentions</label><input type='checkbox' id='subs' value='subs_val'/><label for='mentions'>Subscriptions</label><input type='checkbox' id='pm' value='pm_val'/><label for='pm'>Personal Messages</label><input type='checkbox' id='reps' value='reps_val'/><label for='reps'>Recent Reputation</label></div>"
    },*/
        {
            "tab": "Accounts",
            "group": "Active Accounts",
            "name": "disable_acc",
            "type": "description",
            "text": "<div class='button_acc'><div class='enable_acc'><button type='button' class='enable_btn'>Enable</button></div><div class='disable_acc'><button type='button' class='disable_btn'>Disable</button></div></div>"
        }, {
            "tab": "Accounts",
            "group": "Active Accounts",
            "name": "notloggedin",
            "type": "description",
            "text": "<div class='error_message'><div class='error_header'>Could Not Retreive Account Information</div><div class='error_body'>Please make sure you are logged in to forum.bodybuilding.com<br> and then press the Refresh button.</div></div>" /*"<td class='nodata'>Please make sure you are logged in</td>"*/
        }, {
            "tab": "Accounts",
            "group": "Update Accounts",
            "name": "refresh_acc",
            "type": "description",
            "text": "<div class='refresh_acc'><button type='button' class='refresh_btn'>Refresh</button></div>"
        },
        /*{
            "tab": "Accounts",
            "group": "Update Accounts",
            "name": "update_acc",
            "type": "button",
            //"label": "Refresh Accounts",
            "text": "Refresh"
        },*/
        {
            "tab": "News Feed Options",
            "group": "Active Accounts",
            "name": "forum_label",
            "type": "description",
            "text": "<div class='mentions_options'><input class='accopt_checkbox' type='checkbox' id='mentions_longdesc' value='mentions_val'/> Display full post</label></div>"
        }, {
            "tab": "About",
            "group": "Version",
            "name": "version_desc",
            "type": "description",
            "text": "1.0.0"
        }, {
            "tab": "About",
            "group": "Information",
            "name": "information_desc",
            "type": "description",
            "text": "Forum Buddy is a web browser extension that notifies you whenever someone mentions your username on a forum. In this release of this extension, notifications only works for http://forum.bodybuilding.com/ but in the future will support all vBulletin forums."
        }, {
            "tab": "About",
            "group": "Follow for Updates",
            "name": "fbtwitter_desc",
            "type": "description",
            "text": "<a href='https://twitter.com/ForumBuddy' target='_blank'>@ForumBuddy</a>"
        }, {
            "tab": "About",
            "group": "Created By",
            "name": "creatorname_desc",
            "type": "description",
            "text": "Kyle Asaff"
        }, {
            "tab": "About",
            "group": "Created By",
            "name": "creatortwitter_desc",
            "type": "description",
            "text": "<a href='https://twitter.com/KyleAsaff' target='_blank'>@Kyle Asaff</a> - Twitter"
        }, {
            "tab": "About",
            "group": "Created By",
            "name": "bbuser_desc",
            "type": "description",
            "text": "nilekyle - Bodybuilding.com Uername"
        }, {
            "tab": "About",
            "group": "Created By",
            "name": "website_desc",
            "type": "description",
            "text": " <a href='http://kylesbox.com' target='_blank'>http://kylesbox.com</a> - Website"
        }, {
            "tab": "About",
            "group": "Report Bug",
            "name": "bugemail_desc",
            "type": "description",
            "text": "forumbuddy@kylesbox.com"
        }, {
            "tab": "About",
            "group": "Report Bug",
            "name": "bbthread_desc",
            "type": "description",
            "text": "http://bodybuilding.com/ - Thread"
        }, {
            "tab": "Donations",
            "group": "Donate",
            "name": "donations_desc",
            "type": "description",
            "text": "plz donate"
        }
    ],
    "alignment": [

    ]
};