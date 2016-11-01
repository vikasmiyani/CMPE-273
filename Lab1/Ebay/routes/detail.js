/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var ejs = require("ejs");
var log = require("./log");

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

	var item_id = req.query.item_id;
	
	var sqlQuery = "select s.id as sd_id, u.user_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id and s.id = '"
			+ item_id + "'";
	mysql.fetchData(sqlQuery, function(err, results) {
		if (err) {
			if(req.session.user_id){
        		log.logger.info("Error occured in displaying items for detail page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Error occured in displaying items for detail page || anonymous user");
        	}
			res.statusCode = 404;
			res.json({ success: false, message: 'Error occured in displaying items for detail page' });
			res.end();
		} else {
			if(req.session.user_id){
        		log.logger.info("Displaying items for detail page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Displaying items for detail page || anonymous user");
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


exports.placeBid = function(req,res){
	
	if(req.session.user_id){
		log.logger.info("bidding on item for detail page || user_id :"+req.session.user_id);
		var id = req.body.item_id;
		var bidding_price = req.body.bidding_price;
		var sd_id = req.body.sd_id;
		var sqlQuery = "UPDATE items SET bidding_price='"+bidding_price+"' WHERE id='"+id+"'" +
				" and bidding_due_time_stamp > current_timestamp and bidding_price <'"+bidding_price+"'";
		mysql.fetchData(sqlQuery, function(err, results) {
			if (err) {
				log.logger.info("Error in bidding on item for detail page || user_id :"+req.session.user_id);
				res.statusCode = 404;
				res.json({ success: false, message: 'Issue in updating biddin price' });
				res.end();
			}else{
				if(results.affectedRows > 0){
					var user_id = req.session.user_id;
					var cart_data = {bid_amount:bidding_price,seller_id:sd_id,user_id:user_id};
					var insertCartItemQuery = "INSERT INTO bidding SET ? ";
					console.log(cart_data);
					mysql.storeData(insertCartItemQuery,cart_data,function(err, results) {
						if (err) {
							log.logger.info("Error in inserting on bidding item for detail page || user_id :"+req.session.user_id);
							res.statusCode = 404;
							 res.json({ success: false, message: 'Error in adding bidding.' });
							 res.end();
						} else {
							log.logger.info("Inserting on bidding item for detail page || user_id :"+req.session.user_id);
							if (results.affectedRows > 0) {
								res.statusCode = 200;
								res.json({
								          success: true,
								          message: 'Bidding placed'
								        });
								res.end();
							} else {
								res.statusCode = 404;
								 res.json({ success: false, message: 'Error in adding bidding ' });
								 res.end();
							}
						}
						
					});
				}else{
					res.statusCode = 404;
					res.json({ success: false, message: 'Issue in updating biddin price ' });
					res.end();
				}
			}
		});
	}else{
		res.redirect("/");
	}
};


