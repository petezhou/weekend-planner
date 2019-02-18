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
    $("#trip_info").text(items[0].dest + " - " + items[0].from + " to " + items[0].to);
  });



  //EVENTS I/O
  $("#manual_add_btn").click(addItem);

  socket.on('serverEvent', function(item){
    if (item.key == uniqueKey){
      event_list.push(item);
      updateEvents();
    }
  });

  socket.on('serverDelete', function(lst){
    if (lst[0] == uniqueKey){
      event_list.splice(lst[1], 1);
      updateEvents();
    }
  });



  //CHAT 
  $("#send_btn").click(sendMessage);

  socket.on('serverChat', function(item){
    if (item.key == uniqueKey){
      var area = $('#chat_area');
      area.append($('<p>').text(item.username + ": " + item.message));
      area.scrollTop(area.prop("scrollHeight"));
    }
  })



});




//helper functions

function updateEvents(){
  $("#the_list").empty();
  event_list.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
  var i = 0;
  var curDay = "";
  event_list.forEach(function (item){
    //time stuff
    var dateTime = new Date(item.time);
    var date = formatDate(dateTime, "MMM d");
    var time = formatDate(dateTime, "h:mm a");
    if (date !== curDay){
      $("#the_list").append("<h4>"+date+"</h4>");
      curDay = date;
    }
    //location link stuff
    var loc = item.location;
    var locRep = loc.replace(/ /g, "+");
    var gmapsLink = "https://google.com/maps/place/"+locRep;

    //append the row
    $("#the_list").append("<tr class=an_event id=event_"+i+"><td>"+time+"</td><td>"+item.activity
                            +"</td><td><a href="+gmapsLink+" target='_blank'>"+item.location+"</a></td><td><button class=rmv>-</button></td></tr>");
    i++;
  });  

  //handler when elements are removed
  $(".rmv").click(function(){  
    var idx = $(this).parent().parent().attr('id').split('_')[1];  
    var removed = event_list[idx];
    var lst = [removed, idx]
    socket.emit("deleteMyEvent", lst);
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










