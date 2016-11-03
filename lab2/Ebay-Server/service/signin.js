/**
 * http://usejsdoc.org/
 */
var bcrypt = require('bcryptjs');
var fecha = require('fecha');
var mongo = require("./mongo");  
var config = require('./config.js');


exports.doLogin=function(msg, callback) {

    var username = msg.username;
    var password = msg.password;
    console.log("USERNAME: "+username+" PASSWORD: "+password);
	mongo.connect(config.mongo.dbURL, function() {
  	  var coll = mongo.collection('users');
  	  coll.findOne({email_id: username}, function (err, user) {
  		
        if (err) {
             callback(err,null);
        }
        if (!user) {
             callback(null, null);
        }
        if (user) {
        	console.log(user);
            if (bcrypt.compareSync(password, user.password)) {
             	var last_access = fecha.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            	 coll.update({_id:user._id}, {$set:{last_access:last_access}},function(err, results) {
		    			if(err){
		    				callback(err,null);
		    			}
		    			if(results){
		    				callback(null, user);
		    			}
		    		});
               
            } else {
                 callback(null, null);
            }
        }
     });
    });
};
/*
exports.authenticateUser = function(req, res, next) {

//	var email_id = req.body.email_id;
//	var pwd = req.body.password;
	console.log("in authenticate method"+req.body.email_id);
	var sess = req.session;
	  passport.authenticate('login', function(err, user) {
	    if(err) {
	      return next(err);
	    }

	    if(!user) {
	      return res.redirect('/signup');
	    }
	   
	    req.logIn(user, {session:false}, function(err) {
	      if(err) {
	        return next(err);
	      }

	       	var last_access = fecha.format(new Date(),'YYYY-MM-DD HH:mm:ss');
  			sess.first_name =user.first_name;
			sess.last_name = user.last_name;
			sess.user_id = user._id;
			sess.last_access = last_access;
			mongo.connect(config.mongo.dbURL, function() {
		    	  var coll = mongo.collection('users');
		    	  coll.update({_id:user._id}, {$set:{last_access:last_access}},function(err, user) {
		    			if(err){
//		    				res.statusCode = 404;
		  					res.json({ success: false, message: 'Issue in upadting user' });
		  					res.end();
		    			}
		    			if(user){
		    				log.logger.info("User logged in ||user_id :"+sess.user_id);
//		  			        res.statusCode = 200;
		  					res.json({
		  			          success: true,
		  			          message: 'Logged in'
		  			        });
		  					res.end();
		    			}
		    		});
		      });
	    });
	  })(req, res, next);
};
*/


	