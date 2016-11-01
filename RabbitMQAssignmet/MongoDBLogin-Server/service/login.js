/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo"); 
var mongoLoginURL = "mongodb://localhost:27017/login";

exports.doLogin = function(msg,callback) {
	console.log("inside dologin");
	var username = msg.username;
	var password = msg.password;
	var json_responses;
	console.log(username+" "+password);
	mongo.connect(mongoLoginURL, function() {
		var coll = mongo.collection('login');
		coll.findOne({
			username : username,
			password : password
		}, function(err, user) {
			if(err){
				callback(err,null);
			}
			if (user) {
				
				callback(null,user);
			} 
		});
	});
};

exports.doSignup = function(msg,callback){
	var email = msg.email;
	var username = msg.username;
	var password = msg.password;
	mongo.connect(mongoLoginURL, function() {
		var coll = mongo.collection('login');
		var data = {
				username : username,
				password : password,
				email : email
			};
		coll.save(data, function(err, docs) {
			if(err){
				callback(err,null);
			}
			if (docs) {
				
				callback(null,docs);
			} 
		});
	});
};