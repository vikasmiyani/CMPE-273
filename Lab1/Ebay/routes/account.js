/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var ejs = require("ejs");
var fecha = require('fecha');
var log = require("./log");

exports.accountDetails = function(req, res) {

	if (req.session.user_id !== null && req.session.user_id !== undefined
			&& req.session.user_id !== "") {
		var sqlQuery = "select * from users where user_id='"
				+ req.session.user_id + "'";
		mysql
				.fetchData(
						sqlQuery,
						function(err, results) {
							if (err) {
								if (req.session.user_id) {
									log.logger
											.info("Error in displaying account details || user_id :"
													+ req.session.user_id);
								
								} else {
									log.logger
											.info("Error in displayingaccount details || anonymous user");
								}
								res.statusCode = 404;
								res.end();
							} else {

								if (req.session.user_id) {
									log.logger
											.info("Displaying account details || user_id :"
													+ req.session.user_id);
								}
								if (results.length > 0) {
									res.statusCode = 200;
									res.send(results);
									res.end();
								} else {
									res.statusCode = 404;
									res.end();

								}
							}
						});
	}
};

exports.accountUpdate = function(req, res) {

	if(req.session.user_id){
		var first_name = req.body.first_name;
		var last_name = req.body.last_name;
		var dob = req.body.dob;
		var bdate = fecha.format(new Date(dob), 'YYYY-MM-DD HH:mm:ss');
		var email_id = req.body.email_id;
		var contact_info = req.body.contact_info;
		var address = req.body.address;
		var city = req.body.city;
		var zip = req.body.zip;
		var user_id = req.session.user_id;
		var d = [ {
			first_name : first_name,
			last_name : last_name,
			dob : bdate,
			email_id : email_id,
			contact_info : contact_info,
			address : address,
			city : city,
			zip : zip
		}, {
			user_id : user_id
		} ];
		var sqlQuery = "UPDATE users SET ? WHERE ? ";

		mysql.storeData(sqlQuery, d, function(err, results) {
			if (err) {
				if (req.session.user_id) {
					log.logger
							.info("Error in updating account details || user_id :"
									+ req.session.user_id);
				}
				if (err.code === "ER_DUP_ENTRY") {
					res.json({
						success : false,
						message : 'Issue in updating account'
					});
				}
				res.statusCode = 404;
				res.end();

			} else {

				if (req.session.user_id) {
					log.logger.info("Updating account details || user_id :"
							+ req.session.user_id);
				}
				if (results.affectedRows > 0) {
					res.statusCode = 200;
					res.json({
						success : true,
						message : 'Account updated successfully'
					});
					res.end();
				} else {
					res.statusCode = 404;
					res.json({
						success : false,
						message : 'Issue in updating account'
					});
					res.end();
				}
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

	var sqlQuery = "select i.*, sd.quantity as quantity, SUM(bd.quantity) as sold_quantity from sellers_data as sd Join items as i on i.id = sd.item_id Left Join buyers_data as bd on bd.item_id = i.id where sd.user_id = '"
			+ user_id + "'group by i.id ";
	console.log("Selling collections");
	mysql.fetchData(sqlQuery, function(err, results) {
		if (err) {
			if (req.session.user_id) {
				log.logger
						.info("Error in displaying  my collection details for selling history || user_id :"
								+ req.session.user_id);
			}
			res.statusCode = 404;
			res.end();
		} else {
			if (req.session.user_id) {
				log.logger
						.info("Displaying  my collection details for selling history || user_id :"
								+ req.session.user_id);
			}
			if (results.length > 0) {
				res.statusCode = 200;
				res.send(results);
				res.end();
			} else {
				res.statusCode = 404;
				res.end();

			}
		}
	});
};

exports.orderHis = function(req, res) {

	var user_id = req.session.user_id;
	var sqlQuery = "select i.*, sum(bd.quantity) as quantity from buyers_data as bd, items as i where i.id = bd.item_id and bd.user_id = '"
			+ user_id + "' GROUP BY i.id";
	console.log("Order collections");
	mysql.fetchData(sqlQuery, function(err, results) {
		if (err) {
			if (req.session.user_id) {
				log.logger
						.info("Error in displaying  my collection details for order history || user_id :"
								+ req.session.user_id);
			}
			res.statusCode = 404;
			res.end();
		} else {
			if (req.session.user_id) {
				log.logger
						.info("Displaying  my collection details for order history || user_id :"
								+ req.session.user_id);
			}
			if (results.length > 0) {
				res.statusCode = 200;
				res.send(results);
				res.end();
			} else {
				res.statusCode = 404;
				res.end();

			}
		}
	});
};