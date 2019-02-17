const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';


//database api
module.exports = {



insertTrip: function (item){
	mongo.connect(url, {useNewUrlParser:true}, function (err, client){
  		client.db('firstdb').collection('secondCollection').insertOne({key: item.key,
  																	  dest: item.dest,
  																	  from: item.from,
  																	  to: item.to},(err, result) => {});
	}); 
},

insertActivity: function (item){
	mongo.connect(url, {useNewUrlParser:true}, function (err, client){
  		client.db('firstdb').collection('firstCollection').insertOne({key: item.key,
  																	  activity: item.activity,
  																	  time: item.time,
  																	  location: item.location,
  																	  website: item.website},(err, result) => {});
	}); 
},

retrieveTrip: function (uniqueKey){
	return new Promise((resolve, reject) => {
		mongo.connect(url, {useNewUrlParser:true}, function (err, client){
			client.db('firstdb').collection('secondCollection').find({ key: uniqueKey }).toArray((err, items) => {resolve(items)});
		});
	});
},

retrieveActivity: function (uniqueKey){
	return new Promise((resolve, reject) => {
		mongo.connect(url, {useNewUrlParser:true}, function (err, client){
			client.db('firstdb').collection('firstCollection').find({ key: uniqueKey }).toArray((err, items) => {resolve(items)});
		});
	});
},

deleteActivity: function (item){
	mongo.connect(url, {useNewUrlParser:true}, function (err, client){
		client.db('firstdb').collection('firstCollection').deleteOne({ key: item.key, activity:item.activity, time: item.time });
	});
}



}