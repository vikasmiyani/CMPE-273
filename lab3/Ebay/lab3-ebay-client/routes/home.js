/**
 * http://usejsdoc.org/
 */
var ejs = require("ejs");
var log = require("./log");
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3ebay-server/services";
var url = baseURL + "/Index?wsdl";

var option = {
	ignoredNamespaces: true
};

exports.loadHomePg = function(req,res){

	var sess = req.session;
	var user_data ={
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access
	};

	ejs.renderFile('../views/home.ejs',user_data, function (err,result) {
        if(err){
        	if(sess.user_id){
        		log.logger.info("Error occured in home page || user_id :"+sess.user_id);
        	}else{
        		log.logger.info("Error occured in home page || anonymous user");
        	}
        	res.statusCode = 404;
            res.send("An error occurred to get home page");
        } else {
        	if(sess.user_id){
        		log.logger.info("Redirecting to home page || user_id :"+sess.user_id);
        	}else{
        		log.logger.info("Redirecting to home page || anonymous user");
        	}
        	res.statusCode = 200;
        }	
        res.end(result);
    });

};

exports.loadProfilePage = function(req,res){
	
	
	
	var sess = req.session;
	var user_data ={
		"first_name" : sess.first_name,
		"last_name" : sess.last_name,
		"user_id" : sess.user_id,
		"last_access" : sess.last_access
	};

	ejs.renderFile('../views/account.ejs',user_data, function (err,result) {
		 if(err){
	        	if(sess.user_id){
	        		log.logger.info("Error occured in my account page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Error occured in my account page || anonymous user");
	        	}
	        	res.statusCode = 404;
	            res.send("An error occurred to get home page");
	        } else {
	        	if(sess.user_id){
	        		log.logger.info("Redirecting to my account page || user_id :"+sess.user_id);
	        	}else{
	        		log.logger.info("Redirecting to my account page || anonymous user");
	        	}
	        	res.statusCode = 200;
	        }
        res.end(result);
    });

};

exports.fetchItems = function(req,res){
	
	var user_id = req.session.user_id;
	var msg_payload = {
		user_id: (user_id) ? user_id : 0
	};
	soap.createClient(url, option, function (err, client) {
		client.getItems(msg_payload, function (err, result) {
			var results = JSON.parse(result.getItemsReturn);
			if (err) {
				throw err;
			} else {
				res.send(results);
			}
		});
	});

};

