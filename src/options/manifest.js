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
    }, {
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
        "text": "<div class='refresh_acc'><button type='button' class='refresh_btn'>Refresh</button></div><div class='loading'><img src='/icons/loading_gif.gif' alt='loading'></div>"
    }, {
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
        "text": "1.2.0"
    }, {
        "tab": "About",
        "group": "Information",
        "name": "information_desc",
        "type": "description",
       "text": "Forum Buddy is a web browser extension that notifies you whenever someone mentions or quotes your username on a forum. In this release of Forum Buddy, notifications only work for http://forum.bodybuilding.com/ but will support all vBulletin forums in the future. Additional features such as subscription and personal message notifications will be implemented in future releases."
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
    },{
        "tab": "About",
        "group": "Created By",
        "name": "bbuser_desc",
        "type": "description",
        "text": "nilekyle - Bodybuilding.com Uername"
    }, {
        "tab": "About",
        "group": "Created By",
        "name": "creatortwitter_desc",
        "type": "description",
        "text": "<a href='https://twitter.com/KyleAsaff' target='_blank'>@KyleAsaff</a> - Twitter"
    }, {
        "tab": "About",
        "group": "Created By",
        "name": "website_desc",
        "type": "description",
        "text": " <a href='http://kylesbox.com' target='_blank'>http://kylesbox.com</a> - Website"
    }, /*{
        "tab": "About",
        "group": "Report Bug",
        "name": "bugemail_desc",
        "type": "description",
        "text": "<a href='mailto:forumbuddyextension@gmail.com?Subject=Forum%20Buddy%20Bug%20Report' target='_top'>ForumBuddyExtension@gmail.com</a>"
    },*/ {
        "tab": "About",
        "group": "Report Bug",
        "name": "bbthread_desc",
        "type": "description",
        "text": "<a href='http://forum.bodybuilding.com/showthread.php?t=163235341' target='_blank'>http://forum.bodybuilding.com/showthread.php?t=163235341</a> - Official Thread"
    }, {
        "tab": "Donations",
        "group": "Donate",
        "name": "donations_desc",
        "type": "description",
       "text": "<div class='donate'><div class='donate_dsc'><p>Forum Buddy is 100% free for everyone and if you enjoy and wish to support the continuous integration of new features and updates, donations are always accepted and greatly appreciated. To show appreciation, <b>everyone who donates $1.00 or more will receive a Forum Buddy badge (as shown below) inside their username box to indicate that they use and support Forum Buddy.</b> The badge will be visible by everyone who has Forum Buddy installed in their browser. All donators will also get early access to all future releases of Forum Buddy. A lot of time and effort went into Forum Buddy and I would love to continue to update it with new features while keeping it 100% free. All donations go into the time and resources it takes to develop the extension.</p><p>If you wish to donate and receive a badge, just leave your forum username in the text box at the end of the donation screen. Thanks!<p></p></p></div><div class='donate_btn'><form target='_blank' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'><input type='hidden' name='cmd' value='_s-xclick'><input type='hidden' name='hosted_button_id' value='E9GRXMKGBPR6W'><input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif' border='0' name='submit' alt='PayPal - The safer, easier way to pay online!'><img alt='' border='0' src='https://www.paypalobjects.com/en_US/i/scr/pixel.gif' width='1' height='1'></form></div></div>"
        }, {
            "tab": "Donations",
            "group": "Supporter Badge",
            "name": "forumbuddy_badge",
            "type": "description",
            "text": "<div class ='badge_ex'><img src='images/badge_example.png' alt='badge'></div>"

        }

        ],
    "alignment": [

    ]
};




