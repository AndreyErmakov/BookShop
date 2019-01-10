var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var session = require('express-session') 
var passport = require('passport')
var Hbs = require('express-handlebars')
var flash = require('connect-flash')
var validator = require('express-validator')
var WishList = require('./models/WishList')
var fileUpload = require('express-fileupload')
var helmet = require('helmet');
;

var MongoStore = require('connect-mongo')(session)


var admin = require('./routes/admin')
var indexRouter = require('./routes/index');
var auth = require('./routes/auth')
var cart = require('./routes/cart')
var shopping = require('./routes/shopping')

var app = express();

var hbsHelpers = Hbs.create({ 
  helpers: require("./helpers/headlebars").helpers, 
  defaultLayout: 'layout',
  extname: '.hbs'
  
});

mongoose.connect('mongodb://andrey:123QWE@ds119734.mlab.com:19734/bookshop',{ useNewUrlParser: true } )
require('./config/passport')
app.use(helmet())
app.engine('.hbs',  hbsHelpers.engine)
app.set('view engine', '.hbs');
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator())
app.use(cookieParser());

app.use(session({
  secure: true,
  httpOnly: true,
  secret:'sECREtSuPer258741', 
  resave:false,
  saveUninitialized:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session
  if(req.isAuthenticated() == true){
    WishList.find({userID:req.user._id} ,function(err, result){
      result.forEach(function(el){
      var wish = el.product.length
      req.session.wish = wish 
      })
    })}else{ req.session.wish = 0}
  next()
})
app.use(fileUpload({
  limits: { fileSize: 1024 * 1024 },
  abortOnLimit: true
}))


app.use('/uploads', express.static('uploads'));

app.use('/', indexRouter); 
app.use('/cart', cart);
app.use('/shopping', shopping);
app.use('/auth', auth)
app.use('/admin', admin)




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404)); 
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  res.render('error');
});

module.exports = app;
