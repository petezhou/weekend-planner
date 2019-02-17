var socket = io()

var event_list = []
var uniqueKey = GetURLParameter("wid");


$(document).ready(function() {

  //get from server (REST)
  $.get("/loadWeekend?wid=" + uniqueKey, function(items, status){
    event_list = items;
    updateEvents();
  });

  $.get("/tripInfo?wid=" + uniqueKey, function(items, status){
    $("#trip_info").text(items[0].dest + ", " + items[0].from + " to " + items[0].to);
  });

  //EVENTS I/O
  $("#manual_add_btn").click(addItem);

  socket.on('serverEvent', function(item){
    if (item.key == uniqueKey){
      event_list.push(item);
      updateEvents();
    }
  });


  //CHAT 
  $("#send_btn").click(sendMessage);

  socket.on('serverChat', function(item){
    console.log("Here?");
    if (item.key == uniqueKey){
      var area = $('#chat_area');
      area.append($('<p>').text(item.username + ": " + item.message));
      area.scrollTop(area.prop("scrollHeight"));
    }
  })


});







function updateEvents(){
  event_list.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
  $("#the_list").empty();
  event_list.forEach(function (item){
    $("#the_list").append($('<p>').text(item.time + " - " + item.activity + " - " + item.location));
  });  
}


function addItem(){
  var item = {
    key: uniqueKey,
    activity: $("#activity").val(),
    time: $("#time").val(),
    location: $("#location").val(),
    website: "N/A"
  }
  socket.emit('myEvent', item);
  $("#activity").val("");
  $("#time").val("");
  $("#location").val("");
}


function sendMessage(){
  var item = {
    key: uniqueKey,
    username: $("#username").val(),
    message: $("#chat_input").val()
  }
  socket.emit("myChat", item);
  $("#chat_input").val("");
}




function GetURLParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam){
      return sParameterName[1];
    }
  }
}












