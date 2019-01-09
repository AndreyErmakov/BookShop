var express = require('express');
var router = express.Router();

var Order = require('../models/order')
var Cart = require('../models/cart')

router.get('/cart', function(req, res) {
      var messages = req.flash('success')[0]
        if(!req.session.cart) {
                return res.render('partials/shoppingCart', {product:null})
        }
        var cart = new Cart (req.session.cart)
        res.render('partials/shoppingCart',
         {
           products:cart.generateArray(),
            totalPrice:cart.totalPrice,
             message: messages,
             noMessage:!messages
            
            })
})

router.get('/checkout', function(req, res) {
        if(!req.session.cart) {
           return res.redirect('/shopping-cart')
        }
        if(!req.user){
           req.flash( "error", "Not user in system" );
           return res.redirect('/auth/singup') 
        }
        var cart = new Cart (req.session.cart)
        res.render('partials/checkout', {total: cart.totalPrice})
})

router.post('/checkout',isLoggerIn ,function(req,res) {
    if(!req.session.cart) {
        res.redirect('/shopping-cart')
    }
    var cart = new Cart(req.session.cart)
    
    var order = new Order({
        user: req.user,
        cart:cart,
        name: req.body.name,
        address: req.body.address,
        phone:req.body.phone
        
    })
    order.save(function() {
        
        req.flash('success', "Successfully bouht product!")
        req.session.cart = null
        res.redirect('/')
    })

})

module.exports = router; 

function isLoggerIn(req,res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash( "error", "Not user in system" );
  res.redirect('/auth/singup')
} 
