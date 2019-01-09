var Product = require('../models/product');


module.exports.getMain = function(req, res){
    var messages = req.flash('success')[0]
    var classDisabled = 'list-group-item disabled';
    var prod = Product.find()   
    prod.exec(function(err, p){
        if(err){console.log(err)}
    var product = [];
    var maxPage =  Math.ceil(p.length/15);
    if(maxPage > 5){max = 5} else {max = maxPage}
    p.forEach(function(item, i){
        if(i >= 0 && i < 15 ){
        product.push(item); 
        }
    })
        res.render('partials/home',{
        title: 'Express', 
        products      : product,
        page          : max,
        next          : '',
        classDisabled : classDisabled,
        currentPage    : 1,
        message: messages,
        noMessage:!messages
        });
    }) 
}

module.exports.postMain = function(req, res){
 console.log(req.body)
    var classDisabled = 'list-group-item disabled';
    var firstPage  = req.body.firstPage;
    var clickValue = req.body.clickValue;
    var lastPage   = req.body.lastPage;
    var activeEl   = req.body.activeEl;
    var search     = req.body.search
    var product    = [];
    var next = '';
    var back = '';
    var sort;
    activeEl = JSON.parse(activeEl)
    
    if(clickValue > 1){back = 'glyphicon glyphicon-arrow-left'}
    if(clickValue > 4){next = 'glyphicon glyphicon-arrow-right'}

    if(isNaN(clickValue) === true){ clickValue = 1 }
    if(search.length >= 1){ sort ={name:{$regex:req.body.search}} }

    if(activeEl.length == 1 && search.length >= 0 ){
        var strActiveEl = activeEl.join(', ')
        sort = {sort: strActiveEl, name:{$regex:req.body.search}} 
    }
    if(activeEl.length > 1 && search.length >= 0){sort = {sort: activeEl, name:{$regex:req.body.search}}; clickValue = clickValue || 1}
    
    Product.find(sort)   
    .exec(function(err, p){
    var quantityPage = Math.ceil(p.length/15) 
    if(quantityPage == 0){quantityPage = 1} 
    if(quantityPage < 5){lastPage = quantityPage}
    if(quantityPage > 5 && lastPage == 1){lastPage = 5}
    if(clickValue < firstPage){ lastPage = lastPage - 5 ;
        if(lastPage < 5){lastPage = 5}
    } 
    if(+clickValue > +lastPage){ lastPage = +clickValue+4  
        if(lastPage > quantityPage){ lastPage = quantityPage }
    }  
    if(clickValue > quantityPage){clickValue = quantityPage}
    var data = clickValue * 15;
    p.forEach(function(item, i){
    if(i >= data - 15 && i < data ){
        product.push(item);
    } 
    })
    res.render('partials/products', {
    title: 'Express', 
    layout:null,
    products: product,
    currentPage: +clickValue,
    back: back,
    next: next,
    classDisabled: classDisabled,
    page : +lastPage,
    }); 
    })
}
