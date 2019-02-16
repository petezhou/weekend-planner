var socket = io()

var uniqueKey;


$(document).ready(function() {

	$.get("/getKey", function(key, status){
    	uniqueKey = key;
    	$("#share").text("Share this link with your friends: http://localhost:3000/plan?wid=" + uniqueKey);
  	});


	$("#btn_trip").click(function(){
		var item = {
			key: uniqueKey,
    		dest: $("#trip_dest").val(),
    		from: $("#trip_from").val(),
    		to: $("#trip_to").val(),

  		}
		socket.emit('myTrip', item);

		location.href = 'http://localhost:3000/plan?wid=' + uniqueKey;

/*
		$.get("/plan?wid=" + uniqueKey, function(key, status){
			console.log("nothing");
		});
		*/
	});

});