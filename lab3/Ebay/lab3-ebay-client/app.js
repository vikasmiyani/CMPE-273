var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var signin = require('./routes/signin');
var signup = require('./routes/signup');
var sellItem = require('./routes/sellItem');
var account = require('./routes/account');
var detail = require('./routes/detail');
var payment = require('./routes/payment');
var shoppingCart = require('./routes/shoppingcart');
var auction = require('./routes/auction');
var search = require('./routes/search');
var config = require('./routes/config');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var dir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(dir)) {
	console.log("creating dir");
  fs.mkdirSync(dir);
}
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use('/stylesheets', express.static('public'));
app.use('/controller', express.static('public'));
app.use('/js', express.static('public'));
app.use('/image', express.static('public'));
app.use('/angular', express.static('bower_components'));
app.use('/angular-route', express.static('bower_components'));
app.use('/bootstrap', express.static('bower_components'));
app.use('/jquery', express.static('bower_components'));
app.use('/users', users);


app.use(function(req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	var authorizeUrlArr = ["/sellItemPg","/account","/accountDetails","/paymentPg","/shoppingCartPg","/fetchShoppingDetail",
	                       "/displayCollectionPg","/orderHis","/sellingHis","/sellItem/","/accountUpdate/","/payment/",
	                       "/order/","/placeBid/","/addToCart/","/updateShoppingcart/","/validateCard/","/deleteShoppingCartItem/"];
 if (authorizeUrlArr.indexOf(req.url) > -1 && (req.session.user_id === "" || req.session.user_id === null || req.session.user_id === undefined )) {
	 res.redirect("/");
 }else{
	 next();
 }
  
});

app.get('/', home.loadHomePg);
app.get('/signinPg',signin.loadSigninPg);
app.get('/sellItemPg', sellItem.loadSellItemPg);
app.get('/account', home.loadProfilePage);
app.get('/itemList',home.fetchItems);
app.get('/accountDetails',account.accountDetails);
app.get('/detailPg/:item_id',detail.loadDetailPg);
app.get('/paymentPg',payment.loadPaymentPg);
app.get('/fetchDetail/:item_id',detail.fetchDetail);
app.get('/shoppingCartPg',shoppingCart.loadShoppingCartPg);
app.get('/fetchShoppingDetail',shoppingCart.fetchShoppingDetail);
app.get('/signout',signin.signout);
app.get('/displayCollectionPg',account.displayCollection);
app.get('/orderHis',account.orderHis);
app.get('/sellingHis',account.sellingHis);
app.get('/searchItem/:item',search.loadSearchPg);
app.get('/searchItemList/:item',search.getsearchItem);


app.post('/signin', signin.authenticateUser);
app.post('/signup', signup.registerUser);
app.post('/sellItem', sellItem.storingToSell);
app.post('/accountUpdate',account.accountUpdate);
app.post('/payment',payment.confirmOrder);
app.post('/order',payment.order);
app.post('/addToCart',shoppingCart.addToCart);
app.post('/placeBid',detail.placeBid);
app.post('/updateShoppingcart',shoppingCart.updateShoppingcart);
app.post('/validateCard', payment.validateCard);


app.delete('/deleteShoppingCartItem/:id',shoppingCart.deleteShoppingCartItem);


// auction job which run at every 10 min
setInterval(auction.checkAuction,60*10*1000);


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
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
