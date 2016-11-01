/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");
var bcrypt = require('bcryptjs');
var handle = require('shortid');
var config = require('./config');

exports.registerUser = function(msg,callback) {

	var user_data = msg;
	var email_id = msg.email_id;
	
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({email_id:email_id}, function(err, user) {
				if(err){
					callback(err,null);
				}
				if (user) {
					callback(err,null);
				} else {
					coll.insertOne(user_data,function(err,user){
						if(err){
							callback(err,null);
						}
						if(user){
							callback(null,user);
						}
					});
				}
			});
		});
};
