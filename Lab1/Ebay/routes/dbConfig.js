/**
 * http://usejsdoc.org/
 */

var mysql = require('mysql');

exports.getConnection = function(){
	var connection = mysql.createConnection({        
		 	host     : 'localhost',
		    user     : 'root',
		    password : 'vnv_8300',
		    database : 'marketplace',
		    debug    :  false,
		    multipleStatements: true,
		    port : 3306
	});
	return connection;
};