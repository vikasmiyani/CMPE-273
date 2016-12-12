/**
 * http://usejsdoc.org/
 */
var fecha = require('fecha');
var ejs = require("ejs");
var log = require("./log");

var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services/";
var url = baseURL + "/SellItem?wsdl";

var option = {
	ignoredNamespaces: true
};


exports.loadSellItemPg = function(req, res) {

	var sess = req.session;
	var user_data = {
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access
	};

	ejs.renderFile('../views/selling_item.ejs', user_data,
			function(err, result) {
		 	if(err){
	        	if(sess.user_id){
	        		log.logger.info("Error occured in sell page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Error occured in sell page || anonymous user");
	        	}
	            res.send("An error occurred to get sell page");
	        } else {
	          /*  console.log('getting sell in page');*/
	        	if(sess.user_id){
	        		log.logger.info("Redirecting to sell page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Redirecting to sell page || anonymous user");
	        	}
	        }	
		 res.end(result);
	});

};

exports.storingToSell = function(req, res) {
	var	user_id = req.session.user_id;
	if(user_id){
		log.logger.info("storing item for sell page || user_id :"+req.session.user_id);
		var name = req.body.item_name;
		var description = req.body.item_desc;
		var isBidding = req.body.isBidding;
		var bid_price = 0;
		var price = 0;
		var qty = 1;
		var bidding_due_time_stamp = null;

		if (isBidding === true) {
			bid_price = req.body.bid_price;
			price = bid_price;
			bidding_due_time_stamp = fecha.format(req.body.bid_days,
					'YYYY-MM-DD HH:mm:ss');
		} else {
			price = req.body.price;
			qty = req.body.qty;
		}
		if (qty <= 0) {
			res.statusCode = 404;
			res.json({
				success : false,
				message : 'Issue in adding items'
			});
			res.end();
		}

		var msg_payload = {
			user_id: user_id,
			name: name,
			description: description,
			price: price,
			quantity: qty,
			bidding_price: bid_price,
			is_bidding: isBidding,
			bidding_due_time: bidding_due_time_stamp
		};
		soap.createClient(url, option, function (err, client) {
			client.sellItem(msg_payload, function (err, result) {
				var results = JSON.parse(result.sellItemReturn);
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