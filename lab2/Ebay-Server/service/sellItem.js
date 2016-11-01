/**
 * http://usejsdoc.org/
 */
var fecha = require('fecha');
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;

exports.storingToSell = function(msg,callback) {
	var	user_id = msg.user_id;
		var name = msg.name;
		var description = msg.description;
		var isBidding = msg.isBidding;
		var bid_price = msg.bid_price;
		var price =msg.price;
		var qty = msg.qty;
		var bidding_due_time_stamp = msg.bidding_due_time_stamp;

		var item_info;
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({_id:new ObjectID(user_id)},function(err,user){
				if(user){
					item_info = {
							item_name : name,
							item_desc : description,
							price : price,
							isBidding : isBidding,
							bidding_price : bid_price,
							bidding_due_time_stamp : bidding_due_time_stamp,
							quantity : qty,
							isSold : 0,
							
						};
					 	
					 	var itemData = JSON.parse(JSON.stringify(item_info));
					 	itemData.seller = {};
					 	itemData.seller._id = new Object(user._id);
					 	itemData.seller.first_name = user.first_name;
					 	itemData.seller.last_name = user.last_name;
					 	itemData.seller.email_id = user.email_id;
					 	itemData.seller.ebay_handle = user.ebay_handle;
					 	coll = mongo.collection('items');
						coll.insertOne(itemData,function(err,item){
							if(err){
								callback(err,null);
							}
							if(item){ 	
								callback(null,item);
							}
						});
				}
			});
		});	
};