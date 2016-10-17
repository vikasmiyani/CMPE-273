/**
 * http://usejsdoc.org/
 */
var mysql = require("./mysql");
var ejs = require("ejs");
var log = require("./log");

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
	
	var sqlQuery = "select s.id as s_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id and s.user_id <> '"+req.session.user_id+"' ";
	mysql.fetchData(sqlQuery,function(err, results) {
		if (err) {
			if(req.session.user_id){
        		log.logger.info("Error occured in displaying items for home page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Error occured in displaying items for home page || anonymous user");
        	}
			res.statusCode = 404;
			res.end();
		} else {
			if(req.session.user_id){
        		log.logger.info("Displaying items for home page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Displaying items for home page || anonymous user");
        	}
			if (results.length > 0) {
					res.statusCode = 200;
					res.send(results);
					res.end();
			} else {
				res.statusCode = 404;
				res.end();
			}
		}
	});
};