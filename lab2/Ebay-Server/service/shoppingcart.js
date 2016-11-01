/**
 * http://usejsdoc.org/
 */
var mongo = require("./mongo");  
var config = require('./config.js');
var ObjectID = require('mongodb').ObjectID;

exports.addToCart = function(msg,callback){

	    var user_id =  msg.user_id;
		var qty = msg.quantity;
		var item_id = msg.sd_id;
		var cart_data = {quantity:qty,item_id:item_id,user_id:user_id};
		console.log(cart_data);
		mongo.connect(config.mongo.dbURL,function(){
			var coll = mongo.collection('items');
				coll.findOne({_id:new ObjectID(item_id)},function(err, item) {
					if(err){
						callback(err,null);
					}
					if(item){
						coll = mongo.collection('users');
						coll.findOne({_id:new ObjectID(user_id)},function(err,user){
							item.ord_quantity = qty;
							if(user.shoppingcart){
								var isExist = false;
								for (var int = 0; int < user.shoppingcart.length; int++) {
									

									if(user.shoppingcart[int]._id.equals(item._id)){
										
										 user.shoppingcart[int].ord_quantity += item.ord_quantity ;
										 isExist  = true;
										 break;
									}
								}
								
								if(isExist === false){
									user.shoppingcart.push(item);
								}
							}else{
								var shoppingcart = [];
								shoppingcart.push(item);
								user.shoppingcart = shoppingcart;
							}
							coll.update({_id:user._id}, {$set:{shoppingcart:user.shoppingcart}},function(err,doc){
								if(err){
									callback(err,null);
								}
								if(doc){
									callback(null,doc);
								}
							});
						});
					}
				});
		});	

};

exports.fetchShoppingDetail = function(msg,callback){
	
	var user_id =msg.user_id;
		mongo.connect(config.mongo.dbURL, function() {
			var coll = mongo.collection('users');
			if(user_id){
				coll.findOne({_id:new ObjectID(user_id)}, function(err, user) {
					if (err) {
						callback(err,null);
					} 
					if(user) {
						callback(null,user);
					}
			});
		  }
		});	
};

exports.updateShoppingcart = function(msg,callback){

	
		var user_id = msg.user_id;
		var id = msg.id;
		var quantity = msg.quantity;
		
		var coll = mongo.collection('users');
		coll.findOne({_id:new ObjectID(user_id)},function(err,user){
			if(user.shoppingcart){
				for (var int = 0; int < user.shoppingcart.length; int++) {
					if(user.shoppingcart[int]._id.equals(new ObjectID(id))){
						 user.shoppingcart[int].ord_quantity = quantity;
						 break;
					}
				}
				coll.update({_id:user._id}, {$set:{shoppingcart:user.shoppingcart}},function(err,doc){
					if(err){
						callback(err,null);
					}
					if(doc){
						callback(null,doc);
					}
				});
			}
			
		});
};
	

exports.deleteShoppingCartItem = function(msg,callback){
	
		var user_id = msg.user_id;
		var id = msg.id;
		var coll = mongo.collection('users');
		coll.findOne({_id:new ObjectID(user_id)},function(err,user){
			if(user.shoppingcart){
				var index;
				for (var int = 0; int < user.shoppingcart.length; int++) {
					if(user.shoppingcart[int]._id.equals(new ObjectID(id))){
						 index = int;
						 break;
					}
				}
				user.shoppingcart.splice(index, 1);
				coll.update({_id:user._id}, {$set:{shoppingcart:user.shoppingcart}},function(err,doc){
					if(err){
						callback(err,null);
					}
					if(doc){
						callback(null,doc);
					}
				});
			}
		});
};