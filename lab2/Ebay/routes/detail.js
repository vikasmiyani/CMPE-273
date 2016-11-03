/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var log = require("./log");
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
		}else{
			if(req.session.user_id){
        		log.logger.info("Error occured in displaying items for detail page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Error occured in displaying items for detail page || anonymous user");
        	}
//			res.statusCode = 404;
			res.json({ success: false, message: 'Error occured in displaying items for detail page' });
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
			}else{
				log.logger.info("Error in bidding on item for detail page || user_id :"+user_id);
//				res.statusCode = 404;
				res.json({ success: false, message: 'Issue in updating biddin price' });
				res.end();
			}

		});		
	}else{
		res.redirect("/");
	}
};


