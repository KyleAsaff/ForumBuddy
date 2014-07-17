$(document).ready(function() {
    var template = Handlebars.compile($('#template').html());
    var temp = template(localDataStore.get("replies"));
    console.log(temp);
    $('div.container').append(temp);
})
