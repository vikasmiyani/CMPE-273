/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services/";
var url = baseURL + "/DetailItem?wsdl";

var option = {
	ignoredNamespaces: true
};

exports.loadDetailPg = function(req, res) {

	var sess = req.session;
	var user_data = {
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access,
		"item_id":req.params.item_id
	};

	ejs.renderFile('../views/detailItem.ejs', user_data, function(err, result) {
		  if(err){
	        	if(sess.user_id){
	        		log.logger.info("Error occured in detail page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Error occured in detail page || anonymous user");
	        	}
	        	res.statusCode = 404;
	            res.send("An error occurred to get detail page");
	        } else {
	          /*  console.log('getting home in page');*/
	        	if(sess.user_id){
	        		log.logger.info("Redirecting to detail page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Redirecting to detail page || anonymous user");
	        	}
	        	res.statusCode = 200;
	        }	
		res.end(result);
	});

};

exports.fetchDetail = function(req, res) {

	var item_id = req.params.item_id;
	var msg_payload = {
		item_id: item_id
	};

	soap.createClient(url, option, function (err, client) {
		client.getItemDetails(msg_payload, function (err, result) {
			var results = JSON.parse(result.getItemDetailsReturn);
			if (err) {
				throw err;
			} else {
				res.send(results.map);
			}
		});
	});
		
};


exports.placeBid = function(req,res){
	
	var user_id = req.session.user_id;
	if(user_id){
		
		log.logger.info("bidding on item for detail page || user_id :"+req.session.user_id);
		var id = req.body.item_id;
		var bidding_price = req.body.bidding_price;
		var baseURL = "http://localhost:8080/lab3ebay-server/services/";
		var url = baseURL + "/Cart?wsdl";
		var msg_payload = {
			user_id: user_id,
			item_id: id,
			bid: bidding_price
		};
		soap.createClient(url, option, function (err, client) {
			client.placeBid(msg_payload, function (err, result) {
				console.log(result);
				var results = JSON.parse(result.placeBidReturn);
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


