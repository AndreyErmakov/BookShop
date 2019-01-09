var express = require('express');
var moment = require('moment')
var fs  = require('fs');
var router = express.Router();
var csrf    = require('csurf')
var Order  =require('../models/order')
var Cart = require('../models/cart')

// var passport = require('passport')


var Product = require('../models/product');

var csrfProtection = csrf()
router.use(csrfProtection)


router.get('/product/:id',isAdmin,function(req, res, next){
   var id = req.params.id
   if(id == 'new'){
     var product = new Product({name: "new", price: 0});
      product.save(function(err){
          if(err) return console.log(err);
          res.redirect('/admin/product/'+ product._id)
      });
   }else{
     Product.find({_id: id},function(err, result){
       console.log(result)
    res.render('admin/adminProduct', {csrfToken: req.csrfToken(),product: result})
  })
   }
})

router.get('/',isAdmin,function(req, res){
  Product.find(function(err, result){
     res.render('admin/admin',{product: result}) 
  })
})


router.post('/product/:id',isAdmin ,function(req, res){
  var id = req.params.id
  var remove = req.body.remove
  if(remove == 'remove'){
  var image = req.body.image
    console.log(image) 
    if(image == undefined){
      return false
    }
      fs.unlink("."+image,function(err){
      if (err) console.log(err);
    })
    
    Product.remove({_id:id},function(err, result){
      if(err) return console.log(err)
      console.log(result)
    })
     res.redirect('/admin')
  }else{
  var name = req.body.name
  var price = req.body.price
  var description = req.body.description
  var otherDetalis = req.body.otherDetalis
  var sort = req.body.sort
  console.log(sort)
  Product.updateOne(
    {_id: id},
    {sort:sort,
     $set:{ 
          name:name, 
          price:price,  
          description:description,
          otherDetalis:otherDetalis,
     }},
  
  function(err, result){
    if(err) return console.log(err)
    console.log(result)
  })

  res.redirect('/admin')
  }

  
}) 
 
router.post('/upload', function(req, res){
  var image = req.body.image
  console.log(image) 

  if(image == undefined){
    return false
  }{
    fs.unlink("."+image,function(err){
    if (err) console.log(err);
  })
  }

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log('req.files >>>', req.files);

  var sampleFile = req.files.sampleFile;
  var date = moment().format('DDMMYYYY-HHmmss_SSS')
  sampleFile.name = date + "-"+sampleFile.name


  var uploadPath ='./uploads/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err); 
    }
    
    uploadPath = uploadPath.substring(1)
    console.log(uploadPath.substring(0))
    Product.updateOne({_id:req.body.product},{$set:{image: uploadPath}},function(err, result){
       if(err) return console.log(err)
       console.log(result)
    })

        res.redirect(req.body.href)
    // res.send(uploadPath);
    
  });
})

router.get('/orders',isAdmin,function(req, res){
  Order.find( function(err,orders){
    console.log(orders) 
      if(err){return res.write('Error!')}
       var cart
      orders.forEach(function(order){
        console.log(order) 
        cart = new Cart(order.cart)
        order.items = cart.generateArray()
      })
 
      res.render('admin/orders', {orders: orders})
    })
  })


module.exports = router; 


function isAdmin(req,res, next) {
  if (req.isAuthenticated() && req.user._id == '5c305723f766f5579bed8030') {
    return next()
  }
  req.flash( "error", "Not are not admin" );
  res.redirect('/auth/singin')
}
