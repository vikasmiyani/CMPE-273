
var log = require("./log");
var passport = require("passport");
var bcrypt = require('bcryptjs');
var LocalStrategy = require("passport-local").Strategy;
var config = require('./config.js');
var mq_client = require('../rpc/client');

module.exports = function(passport) {
	
	passport.use('login', new LocalStrategy({
		usernameField : 'email_id',
	    passwordField:'password'
	}, function(username, password, done) {
		var msg_payload = {username:username,password:password};
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			console.log(err+ " " +results);
			if (err) {
				return done(err);
			}
			if (!results) {
				return done(null, false);
			}
			if (results) {
				return done(null, results);
			}
	      });
/*	});
		
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');

			process.nextTick(function() {
				coll.findOne({
					email_id : username
				}, function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false);
					}

					if (user) {
						if (bcrypt.compareSync(password, user.password)) {
							done(null, user);
						} else {
							done(null, false);
						}
					}
				});
			});
		});*/
	}));
};
