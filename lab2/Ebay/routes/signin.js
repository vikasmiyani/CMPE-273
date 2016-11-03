/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var log = require("./log");
var mongo = require("./mongo");  
var config = require('./config.js');
var passport = require("passport");
require('./passport')(passport);

var app = express();

exports.loadSigninPg = function(req,res){
	log.logger.info("Redirecting to login page");
	res.render("../views/signin.ejs");
};

exports.authenticateUser = function(req, res, next) {

//	var email_id = req.body.email_id;
//	var pwd = req.body.password;
	var sess = req.session;
	  passport.authenticate('login', function(err, user) {
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	      return res.redirect('/signup');
	    }
	   
	    if(user){
	    	console.log(user);
	    	sess.first_name =user.first_name;
			sess.last_name = user.last_name;
			sess.user_id = user._id;
			sess.last_access = user.last_access;
			log.logger.info("User logged in ||user_id :"+sess.user_id);
//		        res.statusCode = 200;
				res.json({
		          success: true,
		          message: 'Logged in'
		        });
				res.end();
	    }
	  })(req, res, next);
};

exports.signout = function(req,res){
	
	log.logger.info("User sigining out ||user_id :"+req.session.user_id);
	req.session.destroy();
	res.redirect("/");
};



	