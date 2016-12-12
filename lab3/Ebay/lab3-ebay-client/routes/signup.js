/**
 * http://usejsdoc.org/
 */

var bcrypt = require('bcryptjs');
var handle = require('shortid');
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services";
var url = baseURL + "/Auth?wsdl";
var option = {
	ignoredNamespaces: true
};


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
		var msg_payload = {
			fname: first_name,
			lname: last_name,
			email: email_id,
			password: pwd,
			handle:handle
		};
		soap.createClient(url, option, function (err, client) {
			client.register(msg_payload, function (err, result) {
				var results = JSON.parse(result.registerReturn);
				if (err) {
					throw err;
				} else {
					res.send(results);
				}
			});
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
