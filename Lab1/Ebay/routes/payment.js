/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var ejs = require("ejs");
var log = require("./log");
var fecha = require('fecha');

exports.loadPaymentPg = function(req, res) {

	var sess = req.session;
	var user_data;
	if (sess.isBuyItNow) {
		user_data = {
			"first_name" : sess.first_name,
			"last_name" : sess.last_name,
			"user_id" : sess.user_id,
			"last_access" : sess.last_access,
			"sd_id" : sess.sd_id,
			"order_qty" : sess.order_qty,
			"address" : sess.address,
			"city" : sess.city,
			"zip" : sess.zip,
			"contact_info" : sess.contact_info,
			"isBuyItNow" : sess.isBuyItNow
		};
	} else {
		user_data = {
			"first_name" : sess.first_name,
			"last_name" : sess.last_name,
			"user_id" : sess.user_id,
			"last_access" : sess.last_access,
			"address" : sess.address,
			"city" : sess.city,
			"zip" : sess.zip,
			"sd_id" : "",
			"order_qty" : "",
			"contact_info" : sess.contact_info,
			"isBuyItNow" : sess.isBuyItNow
		};
	}

	ejs.renderFile('../views/payment.ejs', user_data, function(err, result) {
		 if(err){
	        	log.logger.info("Error occured in payment page || user_id :"+sess.user_id);
	        	res.statusCode = 404;
	            res.send("An error occurred to get home page");
	        } else {
	          /*  console.log('getting home in page');*/
	        	log.logger.info("Redirecting to payment page || user_id :"+sess.user_id);
	        	res.statusCode = 200;
	        }
		res.end(result);
	});

};

exports.confirmOrder = function(req, res) {
	if(req.session.user_id){
		log.logger.info("confirming order and redirecting to payment page || user_id :"+req.session.user_id);
		var isBuyItNow = req.body.isBuyItNow;
		var sqlQuery = "select address, city, zip, contact_info from users u where u.user_id = '"
				+ req.session.user_id + "'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				res.statusCode = 404;
				res.end();
			} else {
				if (results.length > 0) {
					console.log("Success inside query" + results[0]);
					req.session.address = results[0].address;
					req.session.city = results[0].city;
					req.session.zip = results[0].zip;
					req.session.contact_info = results[0].contact_info;
					if (isBuyItNow) {
						var qty = req.body.quantity;
						var sd_id = req.body.sd_id;
						req.session.sd_id = sd_id;
						req.session.order_qty = qty;
					}
					req.session.isBuyItNow = isBuyItNow;
					res.statusCode = 200;
					res.json({
						success : true,
						message : 'confirming order before payment'
					});
					res.end();
				} else {
					res.statusCode = 404;
					res.json({
						success : false,
						message : 'Error in purchase'
					});
					res.end();
				}
			}
		});
	}else{
		 res.send({redirect: '/'});
		res.end();
	}
	

};

exports.order = function(req, res) {

	if(req.session.user_id){
		log.logger.info("placing order and redirecting to home page || user_id :"+req.session.user_id);
		var items = req.body.items;
		var isBuyItNow = req.body.isBuyItNow;
		var sd_data = [];
		var buyer_data = [];
		var user_id = req.session.user_id;
		for (var int = 0; int < items.length; int++) {
			var item_id = items[int].item_id;
			var id = items[int].sd_id;
			var quantity = items[int].quantity;
			var u_id = items[int].user_id;
			var order_time = fecha.format(new Date(),
			'YYYY-MM-DD HH:mm:ss');
			var sdObj = [id,u_id,item_id,quantity];
			var buyerObj = [ item_id, quantity, user_id,order_time];
			sd_data[int] = sdObj;
			buyer_data[int] = buyerObj;
		}
		var sqlSellerUpdateQuery = "insert into sellers_data (id,user_id,item_id,quantity) values ? on duplicate key update quantity = IF(quantity < VALUES(quantity), quantity, quantity -  values(quantity))";
		mysql.storeData(
				sqlSellerUpdateQuery,
						[ sd_data ],
						function(err, results) {
							if (err) {
								res.statusCode = 404;
								res.json({
									success : false,
									message : 'Error in adding to buyer data.'
								});
								log.logger.info("Error in updating seller data for payment page || user_id :"+req.session.user_id);
								res.end();
							} else {
					
								if (results.affectedRows > 0) {
									var insertOrderItemQuery = "INSERT INTO buyers_data  (item_id, quantity, user_id,order_time) values ?";
									mysql.storeData(
											insertOrderItemQuery,
											[ buyer_data ], function(err, results) {
										if (err) {
											log.logger.info("Error in inserting buyer data for payment page || user_id :"+req.session.user_id);
											res.statusCode = 404;
												res.json({
													success : false,
													message : 'Error in inseting to buyer data.'
												});
												res.end();
										}
										if (results.affectedRows > 0) {
											
											var sqlQuery = "UPDATE items i, sellers_data sd SET  i.isSold = 1 WHERE  i.id = sd.item_id AND sd.quantity = 0";
											mysql.fetchData(sqlQuery, function(err, results){});

											if(isBuyItNow === 'false'){
												var sqlDelQuery = "DELETE FROM shopping_cart WHERE user_id='"+user_id+"'";
												mysql.fetchData(sqlDelQuery, function(err, results) {
													if (err) {
														log.logger.info("Error in deleting item from shopping cart for payment page || user_id :"+req.session.user_id);
														if (err.code === "ER_DUP_ENTRY") {
															
															 res.json({ success: false, message: 'Issue in deleting item in cart' });
														}
														res.statusCode = 404;
														res.end();
													}else{
														log.logger.info("All operation done successfully for payment page || user_id :"+req.session.user_id);
														if(results.affectedRows > 0){
															res.statusCode = 200;
															 res.json({ success: true, message: 'Item deleted from cart' });
														}else{
															res.statusCode = 404;
															 res.json({ success: false, message: 'Issue in deleting item in cart' });
														}
														 res.end();
													}
											});
											}else{
											res.statusCode = 200;
											res.json({
												success : true,
												message : 'Payment Done'
											});
											}
										}else{
											res.statusCode = 404;
										res.json({
											success : false,
											message : 'Error in adding item to buyer'
										});
										res.end();
										}
									});
								} else {
									res.statusCode = 404;
									res.json({
										success : false,
										message : 'Order quantity is more than availabel quantity'
									});
									res.end();
								}
							}
						});
	}else{
		res.redirect("/");
	}
	
};

exports.validateCard = function(req,res){
	
	log.logger.info("Validating card for payment page || user_id :"+req.session.user_id);
	var cardNumber = req.body.cardNumber;
	var expMonth = req.body.expMonth;
	var expYear = req.body.expYear;
	var cvvNumber = req.body.cvvNumber;
	
	var cardPattrn = /^([0-9]{16})$/;
	var expMonthPattern = /^(0[1-9]|1[0-2])$/;
	var expyearPattern = /^(\d{4})$/;
	var cvvPattern = /^(\d{3})$/;

		if(cardPattrn.test(cardNumber) && expMonthPattern.test(expMonth) && expyearPattern.test(expYear) && cvvPattern.test(cvvNumber) && ((parseInt(expYear) > new Date().getFullYear()) || (parseInt(expYear)=== new Date().getFullYear() && parseInt(expMonth) >= new Date().getMonth()))){
			log.logger.info("Valid card || user_id :"+req.session.user_id);
			res.statusCode = 200;
			res.json({
				success : true,
				message : 'Card valid'
			});
		}else{
			log.logger.info("Invalid card || user_id :"+req.session.user_id);
			res.statusCode = 404;
			res.json({
				success : false,
				message : 'Card invalid'
			});
		}
		res.end();
	
};
