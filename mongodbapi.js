const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';


//database api
module.exports = {

insertActivity: function (item){
	mongo.connect(url, {useNewUrlParser:true}, function (err, client){
  		client.db('firstdb').collection('firstCollection').insertOne({activity: item.activity,
  																	  time: item.time,
  																	  location: item.location,
  																	  website: item.website},(err, result) => {});
	}); 
},

retrieveActivity: function (){
	return new Promise((resolve, reject) => {
		mongo.connect(url, {useNewUrlParser:true}, function (err, client){
			client.db('firstdb').collection('firstCollection').find().toArray((err, items) => {resolve(items)});
		});
	});
}

}