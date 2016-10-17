/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var log = require("./log");

exports.checkAuction = function(){


	var sqlQuery = "select s.id as sd_id, u1.user_id as buyer_id, i.*, u2.user_id as seller_id " +
			"from bidding b, sellers_data s, " +
			"users u1, users u2, items i " +
			"where b.seller_id=s.id and s.item_id=i.id and i.isSold=0 " +
			"and b.user_id=u1.user_id and s.user_id=u2.user_id " +
			"and i.bidding_due_time_stamp < current_timestamp " +
			"and b.bid_amount = i.bidding_price" ;
	mysql.fetchData(sqlQuery, function(err, results) {
	if (err) {
			log.logger.info("Error in auction process");
	} else {
		if (results.length > 0) {
			
			log.logger.info("Auction process is running");
			var items = results;
			var item_data = [];
			var sd_data = [];
			var buyer_data = [];
			for (var int = 0; int < items.length; int++) {				
				var item_id = items[int].id;
				var item_name = items[int].item_name;
				var item_desc = items[int].item_desc;
				var price = items[int].price;
				var bidding_price = items[int].bidding_price;
				var isBidding = items[int].isBidding;
				var bidding_due_time_stamp = items[int].bidding_due_time_stamp;
			    var buyer_id = items[int].buyer_id;
			    var seller_user_id = items[int].seller_id;
			    var sd_id = items[int].sd_id;
			    var bid_amount = items[int].bid_amount;
			    
				var buyer_qty = 1;
				var seller_qty = 0;
				var isSold = 1;
				
				var sdObj = [sd_id,seller_user_id,item_id,seller_qty];
				var buyerObj = [buyer_id,item_id,buyer_qty];
				var itemObj = [item_id,item_name,item_desc,price,bidding_price,isBidding,bidding_due_time_stamp,isSold];
				sd_data[int] = sdObj;
				buyer_data[int] = buyerObj;
				item_data[int] = itemObj; 
			}
			
			var sqlSellerUpdateQuery = "insert into sellers_data (id,user_id,item_id,quantity) values ? on duplicate key update quantity = IF(quantity < VALUES(quantity), quantity,values(quantity))";
			mysql.storeData(
					sqlSellerUpdateQuery,
							[ sd_data ],
							function(err, results) {
								if (err) {
									log.logger.info("Error in updating seller data in auction process");
								} else {
									if (results.affectedRows > 0) {
										var sqlItemUpdateQuery = "insert into items(id,item_name,item_desc,price,bidding_price,isBidding,bidding_due_time_stamp,isSold) values ? on duplicate key update isSold = values(isSold)";
										mysql.storeData(
												sqlItemUpdateQuery,
												[ item_data ], function(err, results) {
											if (err) {
												log.logger.info("Error in updating item in auction process");
											}
											if (results.affectedRows > 0) {
												var insertOrderItemQuery = "INSERT INTO buyers_data  (user_id, item_id, quantity) values ?";
												mysql.storeData(
														insertOrderItemQuery,
														[ buyer_data ], function(err, results) {
													if (err) {
														log.logger.info("Error in inserting buyer data in auction process");
													}
													log.logger.info("Auctioned proccess done");
												});
											}
										});
									} else {
										log.logger.info("Error in updating seller data in auction process");
									}
								}

							});
		}
	}
});
	
	
};