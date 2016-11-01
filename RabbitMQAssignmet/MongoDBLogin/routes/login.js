/**
 * http://usejsdoc.org/
 */

var express = require('express');
var mq_client = require('../rpc/client');


exports.doLogin = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var msg_payload = {username:username,password: password};
	var json_responses;
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		if(err){
			json_responses = {
					"statusCode" : 401,
					"success": false
				};
				res.send(json_responses);
				res.end();
		}
		if(results){
			console.log(results);
			req.session.username = results.username;
			json_responses = {
				"statusCode" : 200,
				"success" : true
			};
			res.send(json_responses);
			res.end();
		}
});
	
	/*mongo.connect(mongoLoginURL, function() {
		var coll = mongo.collection('login');
		coll.findOne({
			username : username,
			password : password
		}, function(err, user) {
			if (user) {
				req.session.username = user.username;
				json_responses = {
					"statusCode" : 200,
					"success" : true
				};
				res.send(json_responses);
			} else {
				json_responses = {
					"statusCode" : 401,
					"success": false
				};
				res.send(json_responses);
			}
		});
	});*/
};

exports.doSignup = function(req,res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var json_responses;
	var msg_payload = {username:username,password: password,email: email};
	mq_client.make_request('signup_queue',msg_payload, function(err,results){
		if(err){
			json_responses = {
					"statusCode" : 401,
					"success": false
				};
				res.send(json_responses);
				res.end();
		}
		if(results){
			//req.session.username = results.username;
			json_responses = {
				"statusCode" : 200,
				"success" : true
			};
			res.send(json_responses);
			res.end();
		}
});
	
	/*mongo.connect(mongoLoginURL, function() {
		var coll = mongo.collection('login');
		var data = {
				username : username,
				password : password,
				email : email
			};
		coll.save(data, function(err, docs) {
			console.log(docs);
			if (docs.insertedCount > 0 ) {
				json_responses = {
					"statusCode" : 200,
					"success" : true
				};
				res.send(json_responses);
				res.end();
			} else {
				json_responses = {
					"statusCode" : 401,
					"success": false
				};
				res.send(json_responses);
				res.end();
			}
		});
	});*/
};