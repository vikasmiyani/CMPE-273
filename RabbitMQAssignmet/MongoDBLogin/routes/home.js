/**
 * http://usejsdoc.org/
 */
var express = require('express');
var ejs = require("ejs");

/* GET home page. */
exports.homepage = function(req, res) {

	if (req.session.username) {
		
		res.header('Cache-Control',	'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("home", {
			username : req.session.username
		});
	} else {
		res.redirect('/');
	}
};

exports.logout = function(req,res){
	req.session.destroy(); 
	res.redirect('/');
};


