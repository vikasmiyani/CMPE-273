/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var fecha = require('fecha');
var ejs = require("ejs");
var log = require("./log");

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

	if(req.session.user_id){
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
		var item_id;
		var	user_id = req.session.user_id;

		var itemData = {
			item_name : name,
			item_desc : description,
			price : price,
			isBidding : isBidding,
			bidding_price : bid_price,
			bidding_due_time_stamp : bidding_due_time_stamp
		};
		var insertItemQuery = "INSERT INTO items SET ?";
		var insertSellDataQuery = "INSERT INTO sellers_data SET ?";
		mysql.storeData(insertItemQuery, itemData, function(err, results) {
			if (err) {
				log.logger.info("Error in inserting sell item for sell page || user_id :"+req.session.user_id);
				res.statusCode = 404;	
				res.json({
						success : false,
						message : 'Issue in adding items'
					});
		
				res.end();
			} else {
				log.logger.info("Inserting sell item for sell page || user_id :"+req.session.user_id);
				if (results.affectedRows > 0) {
					item_id = results.insertId;
					var seller_data = {
						user_id : user_id,
						item_id : item_id,
						quantity : qty
					};
					if (qty <= 0) {
						res.statusCode = 404;
						res.json({
							success : false,
							message : 'Issue in adding items'
						});
						res.end();
					}
					mysql.storeData(insertSellDataQuery, seller_data, function(err,
							results) {
						if (err) {
							
							log.logger.info("Error in inserting sell item for seller data for sell page || user_id :"+req.session.user_id);
							res.statusCode = 404;
								res.json({
									success : false,
									message : 'Issue in adding items'
								});
					
							res.end();
						}
					});
					log.logger.info("Inserting sell item for seller data for sell page || user_id :"+req.session.user_id);
					res.statusCode = 200;
					res.json({
						success : true,
						message : 'Item added successfully'
					});
					res.end();
				} else {
					res.statusCode = 404;
					res.json({
						success : false,
						message : 'Issue in adding items'
					});
					res.end();
				}
			}
		});
	}else{
		res.redirect("/");
	}
	

};