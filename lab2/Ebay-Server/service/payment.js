/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;
var fecha = require('fecha');

exports.confirmOrder = function(msg, callback) {
	var user_id = msg.user_id;
	var isBuyItNow = msg.isBuyItNow;
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			coll.findOne({_id:new ObjectID(user_id)}, function(err, user) {
				 if(err){
						callback(err,null);
					}
					if(user){
						callback(null,user);
					}
			});
		});	
};

exports.order = function(msg,callback) {

	var user_id = msg.user_id;
		var items = msg.items;
		var ids = [];
		var isBuyItNow = msg.isBuyItNow;
		mongo.connect(config.mongo.dbURL,function(){
			var coll = mongo.collection('items');
			for (var int = 0; int < items.length; int++) {
				ids.push(new ObjectID(items[int]._id));
			}
			coll.find({_id:{$in: ids}}).toArray(function(err,item_list){
						if(item_list){
						var item_quantities = [];
						var available_quantities = [];
						var dataAvailable = true;
						for (var int = 0; int < item_list.length; int++) {
							
							for(var i = 0; i < items.length; i++){
								
								if(item_list[int]._id.equals(items[i]._id)){
									if(item_list[int].quantity - items[int].ord_quantity < 0){
										dataAvailable = false;
										break;
									}
									if(item_list[int].sold_quantity){
										item_quantities.push(Number(item_list[int].sold_quantity) + Number(items[int].ord_quantity));
									}else{
										item_quantities.push(Number(items[int].ord_quantity));
									}
									
									available_quantities.push(Number(item_list[int].quantity) - (Number(item_list[int].sold_quantity)+Number(items[int].ord_quantity)));
									delete items[int].isSold;
									delete items[int].quantity;
								}
								
							}
								
						}
						if(dataAvailable){
							var order_data = {};
							order_data.buyer = new ObjectID(user_id);
							order_data.ordered_items = items; 
							var bulk = coll.initializeUnorderedBulkOp();
							for (var j = 0; j < ids.length; j++) {
								if(available_quantities[j] === 0){
									bulk.find({ _id: new ObjectID(ids[j])}).update({$set:{sold_quantity:item_quantities[j],isSold:1}});
								}else{
									bulk.find({ _id: new ObjectID(ids[j])}).update({$set:{sold_quantity:item_quantities[j]}});
								}
								
							}
							bulk.execute();
							coll = mongo.collection('order');
							coll.insert(order_data,function(err,order){
								if(order){
									if(isBuyItNow === 'false'){
										coll = mongo.collection('users');
										var empty = [];
										coll.update({_id:new ObjectID(user_id)},{$set:{shoppingcart:empty}},function(err,user){
											if(user){
												callback(null,user);
											}
										});
									}else{
										callback(null,order);
									}
								}
							});
						}
				  }
			});
	});
};
