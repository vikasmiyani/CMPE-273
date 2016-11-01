/**
 * http://usejsdoc.org/
 */

var pool = require('./conPool.js');

 
exports.fetchData = function(sql, callback) {
	var conn = pool.getConFromPool();
	var query = conn.query(sql, callback);
	query.on('error', function(err) {
		console.log('Mysql query error: ' + err);
		callback(err, true);
	});
	query.on('result', function(rows) {
		console.log("inside mysql " + rows);
		callback(false, rows);
	});
	query.on('end', function() {
	
		 pool.releaseCon(conn);
	});

};

exports.storeData = function(sqlQuery, data, callback) {

	var conn = pool.getConFromPool();
	var query = conn.query(sqlQuery, data, callback);
	query.on('error', function(err) {
		console.log('Mysql query error: ' + err);
		callback(err, true);
	});
	query.on('result', function(rows) {
		console.log("inside mysql " + rows);
		callback(false, rows);
	});
	query.on('end', function() {
		 pool.releaseCon(conn);
	});

};

exports.updateData = function(sqlQuery, data, callback) {

	var conn = pool.getConFromPool();
	var query = conn.query(sqlQuery, data, callback);
	query.on('error', function(err) {
		console.log('Mysql query error: ' + err);
		callback(err, true);
	});
	query.on('result', function(rows) {
		console.log("inside mysql " + rows);
		callback(false, rows);
	});
	query.on('end', function() {
		 pool.releaseCon(conn);
	});

};
