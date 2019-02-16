var socket = io()

var event_list = []

$(document).ready(function() {
  //get from server
  $.get("/initialLoad", function(items, status){
    //console.log(items);
    event_list = items;
    updateEvents();
  });

  //buttons that send to server
  $("#manual_add_btn").click(function(){addItem()});

  //adding from server response
  socket.on('serverEvent', function(item){
    event_list.push(item);
    updateEvents();
    //$("#the_list").append($('<li>').text(item.activity));
  });


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



