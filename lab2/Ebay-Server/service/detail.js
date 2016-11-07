/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;


exports.fetchDetail = function(msg, callback) {

	var item_id = msg.item_id;
	mongo.connect(config.mongo.dbURL,function(){

		var coll ;
		try{
			 coll = mongo.collection('items');
		}catch(e){
			console.log(e);
			callback(e,null);
		}
			coll.find({_id:new ObjectID(item_id)}).toArray(function(err, item) {
				if(err){
					callback(err,null);
				}
				if(item){
					callback(null,item);
				}
		});
	  
	});
};


exports.placeBid = function(msg,callback){
	
		var id = msg.item_id;
		var bidder_data = msg.bidder_data;
		var bidding_price = bidder_data.bidding_price;
		var user_id = msg.user_id;
		
		mongo.connect(config.mongo.dbURL,function(){

			var coll = mongo.collection('items');
				coll.findOne({_id:new ObjectID(id)},function(err, item) {
					if(err){
						callback(err,null);
					}
					if(item.isBidding && item.bidding_price < bidding_price){
							if(item.bidder){
									item.bidder.push(bidder_data);
							}else{
								var bidder = [];
								bidder.push(bidder_data);
								item.bidder = bidder;
							}
							coll.update({_id:new ObjectID(id)}, {$set:{bidding_price:bidding_price,bidder:item.bidder}},function(err, item) {
								if(item){
									callback(null,item);
								}
							});
					}
			});	
	});
};


