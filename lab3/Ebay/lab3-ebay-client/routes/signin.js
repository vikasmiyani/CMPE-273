/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
var express = require('express');
var fecha = require('fecha');
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services";
var url = baseURL + "/Auth?wsdl";
var option = {
	ignoredNamespaces: true
};
exports.loadSigninPg = function(req,res){
	log.logger.info("Redirecting to login page");
	res.render("../views/signin.ejs");
};

exports.authenticateUser = function(req, res, next) {

	var email_id = req.body.email_id;
	var pwd = req.body.password;
	var msg_payload = {
		username: email_id,
		password: pwd
	};
	soap.createClient(url, option, function (err, client) {
		client.signin(msg_payload, function (err, result) {
			var results = JSON.parse(result.signinReturn);
			if (err) {
				throw err;
			} else {
				if (results.status == 200) {
					req.session.fname = results.fname;
					req.session.last_logged_in = results.last_logged_in;
					req.session.username = username;
					req.session.user_id = results.id;
					delete results.fname;
					delete results.last_logged_in;
					delete results.id;
				}
				res.send(results);
			}
		});
	});

};

exports.signout = function(req,res){
	
	log.logger.info("User sigining out ||user_id :"+req.session.user_id);
	req.session.destroy();
	res.redirect("/");
};



	