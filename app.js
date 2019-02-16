var express = require('express');
var app = express();
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/scripts'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

var myDb = require('./mongodbapi');



app.get('/', function (req, res) {
    res.sendFile('index.html');
});




http.listen(3000, function(){
  console.log('listening on port 3000');
});


io.on('connection', function(socket){
	//adding items
  socket.on('myEvent', function(item){
  myDb.insertActivity(item);
  io.emit('serverEvent', item);
	});

  	//chat

});


app.get("/initialLoad", (req, res, next) => {
	var items = myDb.retrieveActivity().then(function(result){
		res.send(result);
	});
});








