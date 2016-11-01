/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var log = require("./log");
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;
var mq_client = require('../rpc/client');

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

	var item_id = req.params.item_id;
	var msg_payload = { "item_id": item_id};
	
	mq_client.make_request('detail_item_queue',msg_payload, function(err,results){
		if(err){
			if(req.session.user_id){
        		log.logger.info("Error occured in displaying items for detail page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Error occured in displaying items for detail page || anonymous user");
        	}
//			res.statusCode = 404;
			res.json({ success: false, message: 'Error occured in displaying items for detail page' });
			res.end();
		}
		if(results){
			if(req.session.user_id){
        		log.logger.info("Displaying items for detail page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Displaying items for detail page || anonymous user");
        	}
//				res.statusCode = 200;
				res.send(results);
				res.end();
		}
});
		
};


exports.placeBid = function(req,res){
	
	var user_id = req.session.user_id;
	if(user_id){
		
		log.logger.info("bidding on item for detail page || user_id :"+req.session.user_id);
		var id = req.body.item_id;
		var bidding_price = req.body.bidding_price;
		var bidder_data = {_id:new ObjectID(user_id),bidding_price:bidding_price};
		var msg_payload = { "user_id": user_id,bidder_data:bidder_data,item_id:id};
		
		mq_client.make_request('item_bid_queue',msg_payload, function(err,results){
			if(err){
				log.logger.info("Error in bidding on item for detail page || user_id :"+user_id);
//				res.statusCode = 404;
				res.json({ success: false, message: 'Issue in updating biddin price' });
				res.end();
			}
			if(results){
				log.logger.info("Inserting on bidding item for detail page || user_id :"+user_id);
//				res.statusCode = 200;
				res.json({
				          success: true,
				          message: 'Bidding placed'
				        });
				res.end();
			}
		
		
		
		/*mongo.connect(config.mongo.dbURL,function(){

			var coll = mongo.collection('items');
				coll.findOne({_id:new ObjectID(id)},function(err, item) {
					if(err){
						log.logger.info("Error in bidding on item for detail page || user_id :"+req.session.user_id);
//						res.statusCode = 404;
						res.json({ success: false, message: 'Issue in updating biddin price' });
						res.end();
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
									log.logger.info("Inserting on bidding item for detail page || user_id :"+user_id);
//									res.statusCode = 200;
									res.json({
									          success: true,
									          message: 'Bidding placed'
									        });
									res.end();
								}
							});
					}
				});	
			});*/
		});		
	}else{
		res.redirect("/");
	}
};


