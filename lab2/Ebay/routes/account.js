/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var fecha = require('fecha');
var log = require("./log");
var mq_client = require('../rpc/client');

exports.accountDetails = function(req, res) {

		var user_id = req.session.user_id;
	if (user_id) {
		var msg_payload = {"method":"accountDetails" ,"user_id": user_id};
		mq_client.make_request('account_queue',msg_payload, function(err,results){
			if(err){
//				res.statusCode = 404;
				log.logger
				.info("Error in displaying account details || user_id :"
						+ user_id);
				res.end();
			}
			if(results){
//				res.statusCode = 200;
				res.send(results);
				res.end();
			}else{
				log.logger
				.info("Error in displaying account details || user_id :"
						+ user_id);
				res.end();
			}	
	});
		
	}
};
exports.accountUpdate = function(req, res) {
	var user_id = req.session.user_id;
	if(user_id){
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var dob = req.body.dob;
		var bdate = fecha.format(new Date(dob), 'YYYY-MM-DD HH:mm:ss');
		var email_id = req.body.email_id;
		var contact_info = req.body.contact_info;
		var address = req.body.address;
		var city = req.body.city;
		var zip = req.body.zip;
		

		var msg_payload = {
			"method" : "accountUpdate",
			"user_id" : user_id,
			first_name : first_name,
			last_name : last_name,
			dob : dob,
			bdate : bdate,
			email_id : email_id,
			contact_info : contact_info,
			address : address,
			city : city,
			zip : zip
		};
		
		mq_client.make_request('account_queue',msg_payload, function(err,results){
			if(err){
				log.logger
				.info("Error in updating account details || user_id :"+ user_id);
				res.json({
					success : false,
					message : 'Issue in updating account'
				});
//				res.statusCode = 404;
				res.end();
			}
			if(results){
//				res.statusCode = 200;
				res.json({
					success : true,
					message : 'Account updated successfully'
				});
				res.end();
			}else{
				log.logger
				.info("Error in updating account details || user_id :"+ user_id);
				res.json({
					success : false,
					message : 'Issue in updating account'
				});
//				res.statusCode = 404;
				res.end();
			}	
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
	var msg_payload = {"method":"sellingHis" ,"user_id": user_id};
	
	mq_client.make_request('collection_his_queue',msg_payload, function(err,results){
		if(err){
			log.logger
			.info("Error in displaying  my collection details for selling history || user_id :"+ user_id);
//			res.statusCode = 404;
			res.end();
		}
		if(results){
//			res.statusCode = 200;
			res.send(results);
			res.end();
		}else{
			log.logger
			.info("Error in displaying  my collection details for selling history || user_id :"+ user_id);
//			res.statusCode = 404;
			res.end();
		}	
   });
		
};

exports.orderHis = function(req, res) {

	var user_id = req.session.user_id;
	var msg_payload = {"method":"orderHis" ,"user_id": user_id};
	
	mq_client.make_request('collection_his_queue',msg_payload, function(err,results){
		if(err){
			log.logger
			.info("Error in displaying  my collection details for order history || user_id :"+ user_id);
//			res.statusCode = 404;
			res.end();
		}
		if(results){
			log.logger
			.info("Displaying  my collection details for order history || user_id :"+ user_id);
//			res.statusCode = 200;
			res.send(results);
			res.end();
		}else{
			log.logger
			.info("Error in displaying  my collection details for order history || user_id :"+ user_id);
//			res.statusCode = 404;
			res.end();
		}	
   });
		
	
};