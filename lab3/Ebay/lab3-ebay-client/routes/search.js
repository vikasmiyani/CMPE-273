/**
 * http://usejsdoc.org/
 */

var ejs = require("ejs");
var log = require("./log");
var mq_client = require('../rpc/client');
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services/";
var url = baseURL + "/Search?wsdl";

var option = {
	ignoredNamespaces: true
};
exports.loadSearchPg = function(req,res){
	
	var sess = req.session;
	
	if(req.params.item === "" || req.params.item === undefined || req.params.item === null){
		req.params.item = " ";
	}
	var user_data = {
			"first_name" : sess.first_name,
			"last_name" : sess.last_name,
			"user_id" : sess.user_id,
			"last_access" : sess.last_access,
			"search_item":req.params.item
		};

	ejs.renderFile('../views/search.ejs', user_data, function(err, result) {
		 if(err){
	        	if(sess.user_id){
	        		log.logger.info("Error occured in search page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Error occured in search page || anonymous user");
	        	}
	        	res.statusCode = 404;
	            res.send("An error occurred to get search page");
	        } else {
	          /*  console.log('getting search in page');*/
	        	if(sess.user_id){
	        		log.logger.info("Redirecting to search page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Redirecting to search page || anonymous user");
	        	}
	        	res.statusCode = 200;
	        }
		
		res.end(result);
	});

	
};
exports.getsearchItem = function(req,res){
	var item = req.params.item;
	var user_id = user_id;
	var msg_payload = {
		item:item
	};
	soap.createClient(url, option, function (err, client) {
		client.search(msg_payload, function (err, result) {
			console.log(result);
			var results = JSON.parse(result.payReturn);
			if (err) {
				throw err;
			} else {
				res.json({status: 200});
				res.end();
			}
		});
	});
};