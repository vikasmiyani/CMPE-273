/**
 * http://usejsdoc.org/
 */
var db = require('./dbConfig.js');
var List = require("collections/list");

function Pool(num_conns) {
	this.pool = new List();

	for (var i = 0; i < num_conns; ++i) {
		this.pool.push(db.getConnection());
	}

	this.remove = function() {
		return this.pool.pop();
	};

}

var size = 200;
var p = new Pool(size);
var occupied_pool = new Pool(0);

function get() {

	if (p.pool.length === 0 || occupied_pool.pool.length === size) {
		console.log("No connections are available");
		return null;
	} else {
		var conn = p.remove();
		occupied_pool.pool.push(conn);
		return conn;
	}

}

function release(conn) {

	occupied_pool.remove();
	p.pool.push(conn);
}

exports.getConFromPool = get;
exports.releaseCon = release;
