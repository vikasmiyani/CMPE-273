/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");
var bcrypt = require('bcryptjs');
var handle = require('shortid');
var log = require("./log");
var config = require('./config');
var mq_client = require('../rpc/client');

exports.registerUser = function(req, res) {

	log.logger.info("New user registration");
	var f_name = req.body.first_name;
	var l_name = req.body.last_name;
	var email_id = req.body.email_id;
	var pwd = req.body.password;
	var cnfrmPwd = req.body.cnfrmPwd;

	if (pwd === cnfrmPwd) {
		var salt = bcrypt.genSaltSync(10);
		var passwordToSave = bcrypt.hashSync(pwd, salt);
		var ebay_handle = f_name + "_" + handle.generate();
		var user_data = {
			first_name : f_name,
			last_name : l_name,
			email_id : email_id,
			password : passwordToSave,
			ebay_handle : ebay_handle
		};
		
		var msg_payload = user_data;
		
		mq_client.make_request('register_queue',msg_payload, function(err,results){
			if(err){
				log.logger.info("Error in user registration");
//				res.statusCode = 404;
				res.json({
					success : false,
					message : 'Error in registration.'
				});
				res.end();
			}
			if(results){
				log.logger.info("User registered || user id :"+email_id);
//				res.statusCode = 200;
				res.json({
					success : true,
					message : 'Registered'
				});
				res.end();
			}else{
				log.logger.info("Error in user registration");
//				res.statusCode = 404;
				res.json({
					success : false,
					message : 'Error in registration.'
				});
				res.end();
			}	
	 });
	} else {
		log.logger.info("Confirm password does not match with password. || email id :"+email_id);
//		res.statusCode = 404;
		res.json({
			success : false,
			message : 'Confirm password does not match with password.'
		});
		res.end();
	}

};
