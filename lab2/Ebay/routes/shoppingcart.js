/**
 * http://usejsdoc.org/
 */
var ejs = require("ejs");
var log = require("./log");
var mq_client = require('../rpc/client');

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
			method : "addToCart",
			quantity : qty,
			sd_id : item_id,
			user_id : user_id
		};
		mq_client.make_request('shopping_item_queue',msg_payload, function(err,results){
			if(err){
//				res.statusCode = 404;
				res.json({ success: false, message: 'Error in adding to shopping cart.' });
				res.end();
			}
			if(results){
//				res.statusCode = 200;
				res.json({
				          success: true,
				          message: 'added to shopping cart'
				        });
				res.end();
			}	
	});
	}else{
		res.redirect("/");
	}
};

exports.fetchShoppingDetail = function(req, res){
	
	var user_id = req.session.user_id;
	if(user_id){
		log.logger.info("Fetching shopping cart items || user_id :"+user_id);
		
		var msg_payload = {method:"fetchShoppingDetail",user_id: user_id};
		
		mq_client.make_request('shopping_item_queue',msg_payload, function(err,results){
			if (err) {
				log.logger.info("Error in fetching shopping cart items || user_id :"+user_id);
//				res.statusCode = 404;
				 res.end();
			} 
			if(results) {
//				res.statusCode = 200;
				res.send(results.shoppingcart);
				res.end();
			}
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
			method : "updateShoppingcart",
			id : id,
			user_id : user_id,
			quantity : quantity
		};
		
		mq_client.make_request('shopping_item_queue',msg_payload, function(err,results){
			if (err) {
//				res.statusCode = 404;
				log.logger.info("Error updating item in shopping cart || user_id :"+req.session.user_id);
				 res.json({ success: false, message: 'Issue in upadting cart' });
				res.end();
			} 
			if(results) {
//				res.statusCode = 200;
				 res.json({ success: true, message: 'cart updated' });
				 res.end();
			}
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
				method : "deleteShoppingCartItem",
				id : id,
				user_id : user_id
				};
			
			mq_client.make_request('shopping_item_queue',msg_payload, function(err,results){
				if (err) {
					log.logger.info("Error in deleting item from shopping cart || user_id :"+req.session.user_id);
//					res.statusCode = 404;
					 res.json({ success: false, message: 'Issue in deleting item in cart' });
					 res.end();
				} 
				if(results) {
//					res.statusCode = 200;
					 res.json({ success: true, message: 'Item deleted from cart' });
					 res.end();
				}
			});
		
	}else{
		res.redirect("/");
	}

	
};