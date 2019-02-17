var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/scripts'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var myDb = require('./mongodbapi');
var uniqid = require('uniqid');




//index page
app.get('/', function (req, res) {
  res.sendFile('index.html');
});

app.get('/getKey', function (req, res){
  res.send(uniqid());
});




//planning page
app.get('/plan', function (req, res){
  res.sendFile(path.join(__dirname + '/view/plan.html'));
});

app.get("/loadWeekend", (req, res, next) => {
	var items = myDb.retrieveActivity(req.query.wid).then(function(result){
		res.send(result);
	});
});

app.get("/tripInfo", (req, res, next) => {
  //trip info at the top. this info will be needed for scraping 
  var items = myDb.retrieveTrip(req.query.wid).then(function(result){
    res.send(result);
  });
});




//any socket stuff
io.on('connection', function(socket){
  //start trip
  socket.on('myTrip', function(item){
    myDb.insertTrip(item);
  });

  //adding items
  socket.on('myEvent', function(item){
    myDb.insertActivity(item);
    io.emit('serverEvent', item);
  });

  //chat
  socket.on('myChat', function(item){
    io.emit('serverChat', item)
  });

});




http.listen(3000, function(){
  console.log('listening on port 3000');
});




