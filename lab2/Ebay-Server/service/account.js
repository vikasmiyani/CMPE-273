/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;
var fecha = require('fecha');

exports.accountDetails = function(msg,callback) {

		var user_id = msg.user_id;
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({_id:new ObjectID(user_id)}, function(err, user) {
				if(err){
					callback(err,null);
				}
				if(user){
					delete user.password;
					callback(null,user);
				}
			});
		});	
};
exports.accountUpdate = function(msg,callback) {
		var user_id = msg.user_id;
		var first_name = msg.first_name;
		var last_name = msg.last_name;
		var dob = msg.dob;
		var bdate = fecha.format(new Date(dob), 'YYYY-MM-DD HH:mm:ss');
		var email_id = msg.email_id;
		var contact_info = msg.contact_info;
		var address = msg.address;
		var city = msg.city;
		var zip = msg.zip;

		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			coll.updateOne({_id:new ObjectID(user_id)},{$set:{first_name:first_name,
				last_name:last_name,
				dob:dob,
				email_id:email_id,
				contact_info:contact_info,
				address:address,
				city:city,
				zip:zip}},function(err, user) {
				if(err){
					callback(err,null);
				}
				if(user){
					callback(null,user);
				}
			});
		});	
};


exports.sellingHis = function(msg,callback) {
	var user_id = msg.user_id;
	mongo.connect(config.mongo.dbURL, function() {
		var coll = mongo.collection('items');
		coll.find({"seller._id":new ObjectID(user_id)}).toArray(function(err, items) {
			if (err) {
				callback(err,null);
			} if(items) {			
				callback(null,items);	
			}
		});
	});	

};

exports.orderHis = function(msg,callback) {

	var user_id =msg.user_id;
	
	mongo.connect(config.mongo.dbURL, function() {
		var coll = mongo.collection('order');
		coll.find({"buyer":new ObjectID(user_id)}).toArray(function(err, items) {
			if(err){
				callback(err,null);
			}
			if(items){
				var result = [];
				for (var i = 0; i < items.length; i++) {
					for (var j = 0; j < items[i].ordered_items.length; j++) {
						result.push(items[i].ordered_items[j]);
					}	
				}
				callback(null,result);
			}
		});
	});	
};