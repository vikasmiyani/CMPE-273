/**
 * http://usejsdoc.org/
 */
var MongoClient = require('mongodb').MongoClient
,Server = require('mongodb').Server;
var serverOptions = {
		  'auto_reconnect': true,
		  'poolSize': 200
		};
var db = null;
var connected = false;

var mongoclient = new MongoClient(new Server('localhost',27017,serverOptions));

exports.open = function(){

	mongoclient.open(function(err, mongoclient) {
		if(err){
			console.log("err in mongoclient");
		}
		var db1 = mongoclient.db("marketplace");
		connected = true;
		db = db1;
		console.log("new connection"+db);
	//	callback(db);
	});

	
};
exports.close = function(){
	  mongoclient.close();
};



exports.connect = function(url, callback) {
	MongoClient.connect(url, function(err, _db) {
		if (err) {
			throw new Error('Could not connect: ' + err);
		}
		db = _db;
		connected = true;
		console.log(connected + " is connected?");
		callback(db);
	});
};
/** Returns the collection on the selected database* */
exports.collection = function(name) {
	if (!connected) {
		throw new Error('Must connect to Mongo before calling "collection"');
	}
	return db.collection(name);
};


exports.db = db;