/**
 * http://usejsdoc.org/
 */
var ejs = require("ejs");
var log = require("./log");
var fecha = require('fecha');
var moment = require('moment');
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services/";
var url = baseURL + "/Payment?wsdl";

var option = {
	ignoredNamespaces: true
};


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


exports.order = function(req, res) {
	
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("placing order and redirecting to home page || user_id :"+user_id);
		var items = req.body.items;
		var isBuyItNow = req.body.isBuyItNow;
		var msg_payload = {
			user_id: user_id,
			is_cart: !isBuyItNow,
			item_id: (req.body.item_id) ? req.body.item_id : 0,
			quantity: (req.body.quantity) ? req.body.quantity : 0
		};
		soap.createClient(url, option, function (err, client) {
			client.pay(msg_payload, function (err, result) {
				console.log(result);
				var results = JSON.parse(result.payReturn);
				if (err) {
					throw err;
				} else {
					res.json({status: 200});
					res.end();
				}
			});
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
