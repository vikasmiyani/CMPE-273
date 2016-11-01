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
	console.log("in authenticate method"+req.body.email_id);
	var sess = req.session;
	  passport.authenticate('login', function(err, user) {
		  console.log("in  method");
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	      return res.redirect('/signup');
	    }
	   
	    req.logIn(user, {session:false}, function(err) {
	      if(err) {
	        return next(err);
	      }

	       	var last_access = fecha.format(new Date(),'YYYY-MM-DD HH:mm:ss');
  			sess.first_name =user.first_name;
			sess.last_name = user.last_name;
			sess.user_id = user._id;
			sess.last_access = last_access;
			mongo.connect(config.mongo.dbURL, function() {
		    	  var coll = mongo.collection('users');
		    	  coll.update({_id:user._id}, {$set:{last_access:last_access}},function(err, user) {
		    			if(err){
//		    				res.statusCode = 404;
		  					res.json({ success: false, message: 'Issue in upadting user' });
		  					res.end();
		    			}
		    			if(user){
		    				console.log(user);
		    				log.logger.info("User logged in ||user_id :"+sess.user_id);
//		  			        res.statusCode = 200;
		  					res.json({
		  			          success: true,
		  			          message: 'Logged in'
		  			        });
		  					res.end();
		    			}
		    		});
		      });
	    });
	  })(req, res, next);
	
	
	
	/*mongo.connect(config.mongo.dbURL, function() {
	
		

		var coll = mongo.collection('users');
		coll.findOne({email_id:email_id}, function(err, user) {
		 if(err){
				log.logger.info("Error in signin");
//				res.statusCode = 404;
				res.json({
					success : false,
					message : 'Error in signin.'
				});
				res.end();
			}
			if (user) {
				if(bcrypt.compareSync(pwd, user.password)){
		    		var last_access = fecha.format(new Date(),'YYYY-MM-DD HH:mm:ss');
		    		sess.first_name =user.first_name;
    				sess.last_name = user.last_name;
    				sess.user_id = user._id;
    				sess.last_access = last_access;
		    		coll.update({_id:user._id}, {$set:{last_access:last_access}},function(err, user) {
		    			if(err){
//		    				res.statusCode = 404;
							res.json({ success: false, message: 'Issue in upadting user' });
							res.end();
		    			}
		    			if(user){
		    				console.log(user);
		    				log.logger.info("User logged in ||user_id :"+sess.user_id);
//					        res.statusCode = 200;
							res.json({
					          success: true,
					          message: 'Logged in'
					        });
							res.end();
		    			}
		    		});
				}else{
//					res.statusCode = 404;
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					res.end();
				}
			} else {
				  log.logger.info("Authentication failed. User not found.");
//				  res.statusCode = 404;
			      res.json({ success: false, message: 'Authentication failed. User not found.' });
			      res.end();
			}
		});
	});*/
};

exports.signout = function(req,res){
	
	log.logger.info("User sigining out ||user_id :"+req.session.user_id);
	req.session.destroy();
	res.redirect("/");
};



	