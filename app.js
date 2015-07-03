var config = require('config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var session = require('express-session');
var oauthserver = require('oauth2-server');
var localStrategy = require('passport-local').Strategy;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', config.port);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));
//Config mongodb
if(config.has('mongodb')){
  mongoose.connect(config.get('mongodb.url'));
  mongoose.connection.on('error', function(){
    console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  });
}
// Use the passport package in our application
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./app/models/account');
passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.oauth = oauthserver({
  model: require('./app/models/oauth2Models'),
  grants: ['password'],
  debug: true,
  accessTokenLifetime : null
});

// Handle token grant requests
app.all('/oauth/token', app.oauth.grant());

// Error handling
app.use(app.oauth.errorHandler());

fs.readdirSync(__dirname +'/app/routers').forEach(function(file){
  if(path.extname(file)==='.js'){
      require(__dirname +'/app/routers/' +  file)(app);
    }
});

app.post('/login', 
passport.authenticate('local', { failureRedirect: '/login' }),
function(req, res) {
  res.redirect('/');
});

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

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
