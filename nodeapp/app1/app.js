var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db');
var mongo = require('mongodb');
var stylus = require('stylus');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash   = require('connect-flash');
var morgan  = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(morgan('dev'));

app.use(session({
  store: new MongoStore({
    url: 'mongodb://seanlholt:rexam12oz@ds141454.mlab.com:41454/seanlholt'
  }),
  secret: 'keyboard car', 
  name: 'test',
  resave: true, 
  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session({
  secret: 'keyboard car',
  name: 'test',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false}
}));
app.use(function(req, res, next) {
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.notice;
  delete req.session.success;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next()

})



app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(stylus.middleware(path.join(__dirname, 'public')))

db.connect('mongodb://seanlholt:rexam12oz@ds141454.mlab.com:41454/seanlholt', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
    }

  });

app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//Connect to Mongo on start



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
