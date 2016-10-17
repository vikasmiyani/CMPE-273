/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var ejs = require("ejs");
var log = require("./log");

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

	
	var user_id = req.session.user_id;
	if(user_id !== null && user_id !== undefined){
		log.logger.info("Item add to shopping cart page || user_id :"+user_id);
		var qty = req.body.quantity;
		var sd_id = req.body.sd_id;
		
		var sqlQuery = "select quantity from shopping_cart WHERE seller_id='"+sd_id+"' and user_id='"+user_id+"'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				log.logger.info("Error in finding item for the same user to add to shopping cart page || user_id :"+user_id);
				res.statusCode = 404;
				res.end();
			} else {
				if (results.length <= 0) {
					log.logger.info("No item for the same user hence inserting to shopping cart page || user_id :"+user_id);
					var cart_data = {quantity:qty,seller_id:sd_id,user_id:user_id};
					var insertCartItemQuery = "INSERT INTO shopping_cart SET ?";
					mysql.storeData(insertCartItemQuery,cart_data,function(err, results) {
						if (err) {
							res.statusCode = 404;
							 res.json({ success: false, message: 'Error in adding to shopping cart.' });
							 res.end();
						} else {
							if (results.affectedRows > 0) {
								res.statusCode = 200;
								res.json({
								          success: true,
								          message: 'added to shopping cart'
								        });
								res.end();
							} else {
								res.statusCode = 404;
								 res.json({ success: false, message: 'Error in adding item to shopping cart.' });
								 res.end();
							}
						}
						
					});
				}else{
					log.logger.info("Item found for the same user to add to shopping cart page || user_id :"+user_id);
					qty = qty + results[0].quantity;
					var sqlQuery = "UPDATE shopping_cart SET quantity='"+qty+"' WHERE seller_id='"+sd_id+"' and user_id='"+user_id+"'";
					mysql.fetchData(sqlQuery, function(err, results) {
						if (err) {
							if (err.code === "ER_DUP_ENTRY") {
								res.statusCode = 404;
								 res.json({ success: false, message: 'Issue in upadting user' });
							}
							res.end();
						}
					});
					res.statusCode = 200;
					res.json({
				          success: true,
				          message: 'added to shopping cart'
				        });
					res.end();
				
				} 
			}
	});
		
	}else{
		res.redirect("/");
	}
	
	
};

exports.fetchShoppingDetail = function(req, res){
	
	var user_id = req.session.user_id;
	if(user_id !== null){
		log.logger.info("Fetching shopping cart items || user_id :"+user_id);
		var sqlQuery = "select u.first_name, u.user_id, i.*, sc.id as sc_id, sc.quantity as ord_quantity, sd.quantity as sd_qty, sd.id as sd_id,sd.user_id from users u, sellers_data sd, items i, shopping_cart sc where sd.id = sc.seller_id and sd.user_id = u.user_id and sd.item_id = i.id and sc.user_id = '"+user_id+"'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				log.logger.info("Error in fetching shopping cart items || user_id :"+user_id);
				res.statusCode = 404;
				 res.end();
			} else {
				if (results.length > 0) {
					res.statusCode = 200;
					res.send(results);
					res.end();
				} else {
					res.end();
				}
			}
	});
		
	}	
};

exports.updateShoppingcart = function(req,res){

	console.log("update cart");
	if(req.session.user_id !== null || req.session.user_id !== undefined){
		console.log("inside if");
		log.logger.info("updating item in shopping cart || user_id :"+req.session.user_id);
		var id = req.body.sc_id;
		var quantity = req.body.quantity;
		var sqlQuery = "UPDATE shopping_cart SET quantity='"+quantity+"' WHERE id='"+id+"'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				log.logger.info("Error updating item in shopping cart || user_id :"+req.session.user_id);
					res.statusCode = 404;
					 res.json({ success: false, message: 'Issue in upadting cart' });
		
				res.end();
			}else{
				if(results.affectedRows > 0){
					res.statusCode = 200;
					 res.json({ success: true, message: 'cart updated' });
					 res.end();
				}else{
					res.statusCode = 404;
					 res.json({ success: false, message: 'Issue in upadting cart' });
					 res.end();
				}
				
				
			}
		});
	}else{
		console.log("inside else");
		res.redirect("/");
	}
};
	

exports.deleteShoppingCartItem = function(req,res){
	
	if(req.session.user_id){
		log.logger.info("Deleting item from shopping cart || user_id :"+req.session.user_id);
		var id = req.query.id;
		var sqlQuery = "DELETE FROM shopping_cart WHERE id='"+id+"'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				log.logger.info("Error in deleting item from shopping cart || user_id :"+req.session.user_id);
					res.statusCode = 404;
					 res.json({ success: false, message: 'Issue in deleting item in cart' });
				res.end();
			}else{
				if(results.affectedRows > 0){
					res.statusCode = 200;
					 res.json({ success: true, message: 'Item deleted from cart' });
					 res.end();
				}else{
					res.statusCode = 404;
					 res.json({ success: false, message: 'Issue in deleting item in cart' });
					 res.end();
				}
			}
		});
	}else{
		res.redirect("/");
	}

	
};