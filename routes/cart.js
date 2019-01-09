var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Cart = require('../models/cart')

router.get('/add/:id', function(req,res) {
  var productId = req.params.id

  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(productId, function(err, product) {
    if(err) {
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    req.flash('success', "Successfully it is added to Cart!")
    res.redirect('/product/' + productId )
  })
  
})

router.get('/reduce/:id', function(req, res){
   var productId = req.params.id
   var cart = new Cart(req.session.cart ? req.session.cart : {})

   cart.reduceByOne(productId)
   req.session.cart = cart
   res.redirect('/shopping/cart')
})


router.get('/remove/:id', function(req, res){
   var productId = req.params.id
   var cart = new Cart(req.session.cart ? req.session.cart : {})

   cart.removeItem(productId)
   req.session.cart = cart
   res.redirect('/shopping/cart')  
})  


module.exports = router; 