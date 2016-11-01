
var ejs = require("ejs");

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
	res.send({
		"Result" : result
	});
	res.end();
};

exports.subtraction = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);

	var result = field_1 - field_2;

	res.send({
		"Result" : result
	});
	res.end();
};
exports.multiplication = function(req,res){
	var field_1 = Number(req.body.field_1);
	var field_2 = Number(req.body.field_2);

	var result = field_1 * field_2;

	res.send({
		"Result" : result
	});
	res.end();
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
	res.send({
		"Result" : result
	});
	res.end();
};
