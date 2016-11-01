/**
 * http://usejsdoc.org/
 */

var mysql = require("./mysql");
var ejs = require("ejs");
var log = require("./log");

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
	var sqlQuery = "select s.id as s_id, s.quantity, u.first_name, u.city, i.* from users u, items i, sellers_data s where s.item_id = i.id and s.user_id = u.user_id and s.user_id <> '"+req.session.user_id+"' and i.isSold = 0 and i.item_name like '%"+item+"%'" ;
		mysql.fetchData(sqlQuery, function(err, results) {
		if (err) {
			if(req.session.user_id){
        		log.logger.info("Error occured in displaying items for search page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Error occured in displaying items for search page || anonymous user");
        	}
			res.statusCode = 404;
			res.end();
		} else {
			if(req.session.user_id){
        		log.logger.info("Displaying items for search page || user_id :"+req.session.user_id);
        	}else{
        		log.logger.info("Displaying items for search page || anonymous user");
        	}
			if (results.length > 0) {
				
				res.send(results);
				res.statusCode = 200;
				res.end();
			} else {
				res.statusCode = 404;
				res.end();
			}
		}
	});
	
	
};