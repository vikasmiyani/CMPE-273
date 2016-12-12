
var ejs = require("ejs");
var numeral = require('numeral');
var soap = require('soap');
var baseURL = "http://localhost:8080/lab3calculator-server/services";
var option = {
	ignoredNamespaces: true
};
var url = baseURL + "/Calculator?wsdl";

exports.calc = function(req,res){
	ejs.renderFile('../views/calc.ejs', function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};

exports.addition = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);
	var result = field_1 + field_2;
	var args = {a: field_1, b: field_2};
	soap.createClient(url, option, function (err, client) {
		client.add(args, function (err, result) {
			var response = {result: numeral(result.addReturn).format('0[.]0[00]')};
			res.send({Result:response});
		});
	});
};

exports.subtraction = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);

	var result = field_1 - field_2;
	var args = {a: field_1, b: field_2};
	soap.createClient(url, option, function (err, client) {
		client.subtract(args, function (err, result) {
			var response = {result: numeral(result.addReturn).format('0[.]0[00]')};
			res.send({Result:response});
		});
	});
};
exports.multiplication = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);

	var result = field_1 * field_2;

	var args = {a: field_1, b: field_2};
	soap.createClient(url, option, function (err, client) {
		client.multiply(args, function (err, result) {
			var response = {result: numeral(result.addReturn).format('0[.]0[00]')};
			res.send({Result:response});
		});
	});
};
exports.division = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);

	var result;
	if (field_2 !== 0) {
		result = field_1 / field_2;
	} else {
		result = "Cannot be divide by zero";
	}
	var args = {a: field_1, b: field_2};
	soap.createClient(url, option, function (err, client) {
		client.divide(args, function (err, result) {
			var response = {result: numeral(result.addReturn).format('0[.]0[00]')};
			res.send({Result:response});
		});
	});
};
