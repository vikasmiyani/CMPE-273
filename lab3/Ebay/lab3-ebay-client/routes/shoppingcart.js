/**
 * http://usejsdoc.org/
 */
var ejs = require("ejs");
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services/";
var url = baseURL + "/ShoppigCart?wsdl";

var option = {
	ignoredNamespaces: true
};
exports.loadShoppingCartPg = function(req,res){
	
	var sess = req.session;
	var user_data ={
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access
	};

	ejs.renderFile('../views/shoppingcart.ejs',user_data, function (err,result) {
		 if(err){
	        	if(sess.user_id){
	        		log.logger.info("Error occured in shopping cart page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Error occured in shopping cart page || anonymous user");
	        	}
	        	res.statusCode = 404;
	            res.send("An error occurred to get shopping cart page");
	            
	        } else {
	          /*  console.log('getting shopping cart in page');*/
	        	if(sess.user_id){
	        		log.logger.info("Redirecting to shopping cart page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Redirecting to shopping cart page || anonymous user");
	        	}
	        	res.statusCode = 200;
	        }
		
        res.end(result);
    });
	
	
};


exports.addToCart = function(req,res){

	var user_id =  req.session.user_id;

	if(user_id){
		log.logger.info("Item add to shopping cart page || user_id :"+user_id);
		var qty = req.body.quantity;
		var item_id = req.body.sd_id;
		var msg_payload = {
			user_id: user_id,
			item_id: item_id,
			quantity: qty
		};
		soap.createClient(url, option, function (err, client) {
			client.addToCart(msg_payload, function (err, result) {
				var results = JSON.parse(result.addToCartReturn);
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

exports.fetchShoppingDetail = function(req, res){
	
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("Fetching shopping cart items || user_id :"+user_id);
		var msg_payload = {
			user_id: user_id
		};
		soap.createClient(url, option, function (err, client) {
			client.getCartItems(msg_payload, function (err, result) {
				var results = JSON.parse(result.getCartItemsReturn);
				if (err) {
					throw err;
				} else {
					res.send(results.myArrayList);
				}
			});
		});
	}	
};

exports.updateShoppingcart = function(req,res){
	var user_id = req.session.user_id;	
	if(user_id){
		log.logger.info("updating item in shopping cart || user_id :"+req.session.user_id);
		var id = req.body.sc_id;
		var quantity = req.body.quantity;
		var msg_payload = {
			user_id: user_id,
			item_id: id,
			quantity:quantity
		};
		soap.createClient(url, option, function (err, client) {
			client.updateCartItem(msg_payload, function (err, result) {
				var results = JSON.parse(result.removeCartItemReturn);
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
	

exports.deleteShoppingCartItem = function(req,res){
	
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("Deleting item from shopping cart || user_id :"+req.session.user_id);
		var id = req.params.id;

		var msg_payload = {
			user_id: user_id,
			item_id: id
		};
		soap.createClient(url, option, function (err, client) {
			client.removeCartItem(msg_payload, function (err, result) {
				var results = JSON.parse(result.removeCartItemReturn);
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