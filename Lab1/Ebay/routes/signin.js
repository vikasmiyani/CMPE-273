/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var log = require("./log");

var app = express();

exports.loadSigninPg = function(req,res){
	log.logger.info("Redirecting to login page");
	res.render("../views/signin.ejs");
};

exports.authenticateUser = function(req, res) {

	var email_id = req.body.email_id;
	var pwd = req.body.password;
	var sess = req.session;

	var sqlQuery = "select password,user_id,first_name,last_name from users where email_id='"+email_id+"'";

		mysql.fetchData(sqlQuery,function(err, results) {
			
			if (results.length <= 0) {
				 log.logger.info("Authentication failed. User not found.");
				  res.statusCode = 404;
			      res.json({ success: false, message: 'Authentication failed. User not found.' });
			      res.end();
			    } else {
			    	if(bcrypt.compareSync(pwd, results[0].password)){
			    		var last_access = fecha.format(new Date(),'YYYY-MM-DD HH:mm:ss');
			    		var user_id = results[0].user_id;
			    		var sqlQuery = "UPDATE users SET last_access='"+last_access+"' WHERE user_id='"+user_id+"'";
			    		sess.first_name = results[0].first_name;
			    		sess.last_name = results[0].last_name;
			    		sess.user_id = user_id;
			    		sess.last_access = last_access;
						mysql.fetchData(sqlQuery, function(err, results) {
							if (err) {
								if (err.code === "ER_DUP_ENTRY") {
									res.statusCode = 404;
									 res.json({ success: false, message: 'Issue in upadting user' });
								}
								res.end();
							}
						});
						log.logger.info("User logged in ||user_id :"+sess.user_id);
					        res.statusCode = 200;
							res.json({
					          success: true,
					          message: 'Logged in'
					        });
					}else{
						res.statusCode = 404;
						res.json({ success: false, message: 'Authentication failed. Wrong password.' });
					}
			    	res.end();
			      }   
			
		});

};

exports.signout = function(req,res){
	
	log.logger.info("User sigining out ||user_id :"+req.session.user_id);
	req.session.destroy();
	res.redirect("/");
};