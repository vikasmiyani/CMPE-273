/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var fecha = require('fecha');
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services";
var url = baseURL + "/User?wsdl";
var option = {
	ignoredNamespaces: true
};

exports.accountDetails = function(req, res) {

		var user_id = req.session.user_id;
	if (user_id) {
		var msg_payload = {
			user_id: user_id
		};
		soap.createClient(url, option, function (err, client) {
			client.getUserDetails(msg_payload, function (err, result) {
				var results = JSON.parse(result.getUserDetailsReturn);
				if (err) {
					throw err;
				} else {
					res.send(results.map);
				}
			});
		});
		
	}
};
exports.accountUpdate = function(req, res) {
	var user_id = req.session.user_id;
	if(user_id){
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var dob = req.body.dob;
		var bdate;
		if(dob){
			bdate = fecha.format(new Date(dob), 'YYYY-MM-DD HH:mm:ss');	
		}
		
		var email_id = req.body.email_id;
		var contact_info = req.body.contact_info;
		var address = req.body.address;
		var city = req.body.city;
		var zip = req.body.zip;
		var msg_payload = {
			user_id: user_id,
			fname: first_name,
			lname: last_name,
			phone: contact_info,
			bdate: bdate,
			line_1: address,
			city: city,
			state: state,
			zip: zip
		};
		soap.createClient(url, option, function (err, client) {
			client.saveUserDetails(msg_payload, function (err, result) {
				var results = JSON.parse(result.saveUserDetailsReturn);
				if (err) {
					throw err;
				} else {
					res.send(results.map);
				}
			});
		});
	}else{
		res.redirect("/");
	}
	

};

exports.displayCollection = function(req, res) {

	var sess = req.session;
	var user_data = {
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access,
		"isOrderHis" : true
	};

	ejs.renderFile('../views/mycollection.ejs', user_data,
			function(err, result) {
				if (err) {
					if (req.session.user_id) {
						log.logger
								.info("Error in displaying my collection details || user_id :"
										+ req.session.user_id);
					}
					res.statusCode = 404;
					res.send("An error occurred to get collection page");
				} else {
					if (req.session.user_id) {
						log.logger
								.info("Displaying my collection details || user_id :"
										+ req.session.user_id);
					}
					res.statusCode = 200;
				}
				res.end(result);
			});
};

exports.sellingHis = function(req, res) {
	var user_id = req.session.user_id;
	var msg_payload = {
		user_id: user_id
	};
	soap.createClient(url, option, function (err, client) {
		client.getSoldItems(msg_payload, function (err, result) {
			var results = JSON.parse(result.getSoldItemsReturn);
			if (err) {
				throw err;
			} else {
				res.send(results.myArrayList);
			}
		});
	});
		
};

exports.orderHis = function(req, res) {

	var user_id = req.session.user_id;
	var msg_payload = {
		user_id: user_id
	};
	soap.createClient(url, option, function (err, client) {
		client.getBaughtItems(msg_payload, function (err, result) {
			var results = JSON.parse(result.getBaughtItemsReturn);
			console.log(results);
			if (err) {
				throw err;
			} else {
				res.send(results.myArrayList);
			}
		});
	});
	
};