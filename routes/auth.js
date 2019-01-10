var express = require('express');
var router = express.Router();
var csrf    = require('csurf')
var passport = require('passport')

var Order = require('../models/order')
var Cart = require('../models/cart')
var WishList = require('../models/WishList')
var Product = require('../models/product');

var csrfProtection = csrf()
router.use(csrfProtection)


router.get('/order',isLoggerIn,isAdminOrders,function(req,res) {
    Order.find({user: req.user}, function(err,orders){
      if(err){return res.write('Error!')}
       var cart
      orders.forEach(function(order){
        cart = new Cart(order.cart)
        order.items = cart.generateArray()
      })
 
      res.render('user/order', {orders: orders})
    })
})

router.get('/wishlist', isLoggerIn, function(req, res){
  WishList.find({userID: req.user._id}, function(err, list){
    if(err){return res.write('Error!')}
    var arr = []
    list.forEach(function(l){ 
      arr = l.product
    })
    Product.find({_id:arr},function(err, p){
      res.render('user/wishList',{list:p}) 
    })
  })
})

router.get('/myAccount',isLoggerIn,isAdmin, function(req, res, next){
  res.render('user/myAccount')
})

router.post('/myAccount', passport.authenticate('local.myAccount',{
  successRedirect: '/auth/myAccount',
  failureRedirect: '/auth/singup',
  failureFlash: true
  }
))

router.get('/logout',function(req,res) {
   req.logout()
   res.redirect('/')
})
router.get('/singup', notLoggerIn ,function(req, res, next){ 
  var messages = req.flash('error')
  res.render('user/singup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
})

router.get('/singin', function(req, res, next) {
  var messages = req.flash('error')
  res.render('user/singin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/singin', passport.authenticate('local' ,{
  successRedirect: '/auth/myAccount',
  failureRedirect: '/auth/singin',
  failureFlash: true
  }),
)






module.exports = router; 

function isLoggerIn(req,res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash( "error", "Not user in system" );
  res.redirect('/auth/singup')
}

 function notLoggerIn(req, res, next) {
  
  if (!req.isAuthenticated()) {
    return next() 
  }   res.redirect('/')
 }

 function isAdmin (req, res,next){
   if (req.user._id == '5c3770204278330004205037') {
    return res.redirect('/admin')

 }
 return next()
 }

 function isAdminOrders (req, res,next){
   if (req.user._id == '5c3770204278330004205037') {
    return res.redirect('/admin/orders')
  }
  next()
}

