/**
 * http://usejsdoc.org/
 */
var config = {};

config.mongo = {};
config.mongo.coll = {};
config.mongo.sessionURL = "mongodb://localhost:27017/sessions";
config.mongo.dbURL = "mongodb://localhost:27017/marketplace";
config.mongo.coll.users = "users";
config.mongo.coll.items = "items";

module.exports = config;