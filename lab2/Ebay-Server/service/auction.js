/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;
var fecha = require('fecha');

exports.checkAuction = function(msg,callback){

	var current_timestamp  = fecha.format(new Date(),
	'YYYY-MM-DD HH:mm:ss');
	mongo.connect(config.mongo.dbURL,function(){
		var coll = mongo.collection('items');
			coll.find().toArray(function(err, item) {
				if(item){
					var user_ids = [];
					var item_ids = [];
					var item_list = [];
					var dataAvailable = false;
					for (var int = 0; int < item.length; int++) {
						if(item[int].isBidding === true && item[int].isSold === 0 && item[int].bidding_due_time_stamp < current_timestamp){
							item_ids.push(new ObjectID(item[int]._id));
							if(item[int].bidder){
								user_ids.push(new ObjectID(item[int].bidder[item[int].bidder.length-1]._id));
								
								item[int].ord_quantity = item[int].quantity;
								item[int].subtotal = item[int].price;
								delete item[int].isSold;
								delete item[int].quantity;
								delete item[int].bidder;
								item_list.push(item[int]); 
								dataAvailable = true;
							}
							
						}
					}
					if(dataAvailable){
						dataAvailable = false;
						coll.update({_id:{ $in: item_ids}},{$set:{isSold:1,sold_quantity:1}},{multi:true},function(err,items){});
						coll = mongo.collection('order');
						for (var j = 0; j < user_ids.length; j++) {
							var order_data = {};
							order_data.buyer = new ObjectID(user_ids[j]);
							var ordered_items = [];
							ordered_items.push(item_list[j]);
							order_data.ordered_items = ordered_items ; 
							coll.insert(order_data);
						}
					}
				
				}
			});	
		});	
		
	callback(true,true);
	
};