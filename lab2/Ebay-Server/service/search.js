/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;


exports.getsearchItem = function(msg,callback){
	
	var item = msg.item;
	var user_id = msg.user_id;
	mongo.connect(config.mongo.dbURL, function() {
		var coll = mongo.collection('items');
			coll.find({"seller._id":{ $ne: new ObjectID(user_id)},item_name:{'$regex':item},"isSold":{ $ne: 1}}).toArray( function(err, item) {
				if(err){
					callback(err,null);
				}
				if(item){
					callback(null,item);
				}
		});
	 });	
};