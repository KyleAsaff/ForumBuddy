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

	$(".close").on('click', function() {
		var postNode = this.parentNode.parentNode.parentNode;
		var id = $(postNode).attr('id');
		var tempArray = localDataStore.get("replies");
		console.log(tempArray[id].visible);

		// post fade on click
		if (tempArray[id].visible === true) {
			$("#" + id).addClass("fade");
			tempArray[id].visible = false;
		} else {
			$("#" + id).removeClass("fade");
			tempArray[id].visible = true;
		}

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

	// store switch state in local storage
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