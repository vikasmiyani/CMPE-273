/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var bcrypt = require('bcryptjs');
var handle = require('shortid');
var log = require("./log");

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

		var sqlQuery = "Select * from users where email_id= '" + email_id + "'";

		mysql.fetchData(sqlQuery, function(err, results) {

			if (results.length <= 0) {
				var insertUserQuery = "INSERT INTO users SET ?";
				mysql.storeData(insertUserQuery, user_data, function(err,
						results) {
					if (err) {
						log.logger.info("Error in user registration");
						res.statusCode = 404;
						res.json({
							success : false,
							message : 'Error in registration.'
						});
						res.end();
					} else {
						log.logger.info("User registered || user id :"+email_id);

						if (results.affectedRows > 0) {
							res.statusCode = 200;
							res.json({
								success : true,
								message : 'Registered'
							});
							res.end();
						} else {
							console.log("Something goes wrong");
							res.statusCode = 404;
							res.json({
								success : false,
								message : 'Error in registration.'
							});
							res.end();
						}
					}

				});
			} else {
				log.logger.info("Email_id is already registed with us. || email id :"+email_id);
				res.statusCode = 404;
				res.json({
					success : false,
					message : 'Email_id is already registed with us.'
				});

				res.end();
			}
		});
	} else {
		log.logger.info("Confirm password does not match with password. || email id :"+email_id);
		res.statusCode = 404;
		res.json({
			success : false,
			message : 'Confirm password does not match with password.'
		});
		res.end();
	}

};
