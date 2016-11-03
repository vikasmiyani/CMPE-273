/**
 * http://usejsdoc.org/
 */
var ejs = require("ejs");
var log = require("./log");
var fecha = require('fecha');
var mq_client = require('../rpc/client');

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
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("confirming order and redirecting to payment page || user_id :"+req.session.user_id);
		var isBuyItNow = req.body.isBuyItNow;
		var msg_payload = { "method":"confirmOrder",user_id: user_id,isBuyItNow:isBuyItNow};
		
		mq_client.make_request('payment_queue',msg_payload, function(err,user){
			if(err){
				res.json({
					success : false,
					message : 'error in confirming order'
				});
				res.end();
			}
			 if(user){
				    req.session.address = user.address;
					req.session.city = user.city;
					req.session.zip = user.zip;
					req.session.contact_info = user.contact_info;
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
			 }else{
				 res.end();
			 }
		});
	}else{
		 res.send({redirect: '/'});
		res.end();
	}
	

};

exports.order = function(req, res) {
	
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("placing order and redirecting to home page || user_id :"+user_id);
		var items = req.body.items;
		var isBuyItNow = req.body.isBuyItNow;
		var msg_payload = { "method":"order",user_id: user_id,isBuyItNow:isBuyItNow,items:items};
		
		mq_client.make_request('payment_queue',msg_payload, function(err,order){
			if(err){
				res.json({
					success : false,
					message : 'Error in payment Done'
				});
				res.end();
			}
			if(order){
				res.json({
					success : true,
					message : 'Payment Done'
				});
				res.end();
			}else{
				res.json({
					success : false,
					message : 'Error in payment Done'
				});
				res.end();
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
