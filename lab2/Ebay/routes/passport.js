var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var log = require("./log");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var config = require('./config.js');
var db = config.mongo.dbURL;

module.exports = function(passport) {
	
	passport.use('login', new LocalStrategy({
		usernameField : 'email_id',
	    passwordField:'password'
	}, function(username, password, done) {
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
		});
	}));
};
