// add fade class
Handlebars.registerHelper("addClasses", function() {
	if (this.visible === true) {
		console.log('true');
		return '';
	} else {
		console.log('dont fade');
		return 'fade';
	}
});

if (localStorage.getItem("state") === null) {
	localStorage.setItem("state", "on");
}

$(document).ready(function() {
	var template = Handlebars.compile($('#template').html());
	var data = template(localDataStore.get("replies"));
	console.log(data);
	$('div.container').append(data);

	// handles clicking the x button on the post
	$(".close").on('click', function() {
		$('#myonoffswitch').prop('disabled', true);
		var postNode = this.parentNode.parentNode.parentNode;
		var id = $(postNode).attr('id');
		var tempArray = localDataStore.get("replies");
		console.log(tempArray[id].visible);

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
		if (localStorage.getItem("state") === "on") {
			$(".fade").show();
			//$('#myonoffswitch').prop('disabled', false);
		} else {
			$('#myonoffswitch').prop('checked', false);
			$("#" + id).fadeTo("slow", 0.0, function() {
				$(".fade").hide();
			});
			$('#myonoffswitch').prop('disabled', true);
			$("#" + id).fadeTo("fast", 0.4, function() {
				$('#myonoffswitch').prop('disabled', false);
			});
		}
		// store new visible state
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
		if (localStorage.getItem("state") === "on") {
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
	if (localStorage.getItem("state") === "on") {
		$('#myonoffswitch').prop('checked', true);
		$(".fade").show();
	} else {
		$('#myonoffswitch').prop('checked', false);
		$(".fade").hide();
	}

	// store switch state in local storage on click
	$("#myonoffswitch").on('click', function() {
		if ($('#myonoffswitch').prop('checked')) {
			$(".fade").show();
			localStorage.setItem("state", "on");
		} else {
			$(".fade").hide();
			localStorage.setItem("state", "off");
		}
	});



});