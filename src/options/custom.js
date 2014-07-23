var usercp = "http://forum.bodybuilding.com/profile.php?do=editavatar";
var url = "http://forum.bodybuilding.com/";

console.log("test");
jQuery(document).ready(function( $ ) {
    $(".refresh_btn").click(function() {
        $.get(usercp, function(data) {
            var $page = $(data);

            // Get the first 20 search results
            // var $block = $page.find("".blockbody").children().slice(0, 20);"
            //console.log(data);

            var regex = /\?prop.42="([^']+)"/;
            var test = data.match(regex);

			var myregex = /s\.prop42="([^"]*)"/;
			var matchArray = myregex.exec(data);

			var avisrc = $page.find("div.image-fit img").attr('src');

			if(matchArray[1] === "")
				console.log("novalue");

			console.log($page.find(".primary img").attr("src"));
            console.log(matchArray[1]);
            console.log($page.find("::before"));
        });
    });
});