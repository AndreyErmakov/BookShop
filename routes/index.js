var express = require('express');
var router = express.Router();
var controllers = require('../controllers/home')

var Product = require('../models/product');
var WishList = require('../models/WishList')

router.route('/')
.get(controllers.getMain )
.post( controllers.postMain )



router.get('/categoria/:categoria',function(req,res){

    var categoria = req.params.categoria
    console.log(categoria)

    var classDisabled = 'list-group-item disabled';
    Product.find({sort:categoria},function(err, p){
        if(err){console.log(err)}
    var product = [];
    var maxPage =  Math.ceil(p.length/15);
    if(maxPage > 5){max = 5} else {max = maxPage}
    p.forEach(function(item, i){
        if(i >= 0 && i < 15 ){
        product.push(item); 
        } 
    })
        res.render('partials/categoria',{
        title: 'Express', 
        products      : product,
        page          : max,
        next          : '',
        classDisabled : classDisabled,
        currentPage    : 1,
        categoria : categoria
        });
    }) 
})


router.get('/product/:id', function(req,res){
   var productId = req.params.id
   var messages = req.flash('success')[0]

    Product.find({_id:productId}, function(err, prod){
      res.render('partials/product', {
        product:prod,
        message: messages,
        noMessage:!messages
      }) 
    })
 
  
})

router.post("/product", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);

    Product.update({_id:req.body.button},{$addToSet:{comment:{user:req.body.name, email:req.body.email, message: req.body.message}}},function (e, params) {
      if (e) {console.log('error',e)}
        res.redirect('/product/'+ req.body.button )
    })

    
    
   
});

 
//wish-list
router.get('/add-to-wish-list/:id',isLoggerIn,function(req, res){
  var productId = req.params.id;

        WishList.find({ userID: req.user._id},function(err, user){
        if(err)  { return res.redirect('/shopping/cart') }

        if(user[0] == undefined ){
        var wishlist = new WishList({  
        userID: req.user._id, 
        product: [productId]
        })
        wishlist.save(function() {
              req.flash('success', "Successfully it is added to Wish List!")
              res.redirect('/shopping/cart')
          })
        }else{
            WishList.update( {userID: req.user._id }, {$addToSet:{product: productId}},function(e, s){
                if (e) {
                    console.log('error',e);
                }
                if(s.nModified === 0){
                  req.flash('success', "There is such a product to Wish List!")
                   res.redirect('/shopping/cart')
                }else{
                   req.flash('success', "Successfully it is added to Wish List!")
                   res.redirect('/shopping/cart')
                }
              }) 

          }  
  })
})
router.get('/remove-wishlist/:id', function(req,res) {
   var productId = req.params.id

    WishList.update( {userID: req.user._id }, {$pull:{product: productId}},function(e, s){
                if (e) {
                    console.log('error',e);
                }else{
                  console.log('sucssecfyl',s)
                } 
                // req.flash('success', "Successfully remove product!")
                res.redirect('/auth/wishlist')
              }) 
  
})


 router.post('/search',function(req,res) {
   console.log(req.body)
  //  var id = req.params.id
  //  console.log(id)
   Product.find({name:{$regex:req.body.referal}}, function(err, result) {
     var hidden = ''
     console.log(result.length)
     if(err){console.log(err)} 
      if(req.body.referal == ''){hidden = 'hidden'}
      res.render('partials/search',{
         title: 'Express', 
         layout:null,
         products:result,
         hidden:hidden
      })
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
