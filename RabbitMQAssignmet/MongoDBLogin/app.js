var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var expressSession = require("express-session");
var login = require('./routes/login');
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/stylesheets', express.static('public'));
app.use('/controller', express.static('public'));
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var login = require("./routes/login");

app.use(expressSession({
	secret : 'cmpe273_teststring',
	resave : false,
	saveUninitialized : false,
	duration : 30 * 60 * 1000,
	activeDuration : 5 * 60 * 1000,
	store : new mongoStore({
		url : 	mongoSessionConnectURL
	})
}));
// connect

app.use('/users', users);

app.get('/', routes.loginPage);
app.get('/homepage', home.homepage);
app.get('/logout',home.logout);
app.post('/doLogin', login.doLogin);
app.post('/doSignup', login.doSignup);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

module.exports = app;
