function Menu (){
    var page            = document.querySelectorAll('.pages')
    var disabled        = document.querySelector('.disabled') 
    var next            = document.querySelector('#next')
    var back            = document.querySelector('#back')
    var best            = document.querySelectorAll('.best')
    var activeElement   = document.querySelectorAll('.active')
    var clickActive     = document.querySelectorAll('.main-categoria')
    var all             = document.querySelectorAll('.nav-stacked')
    var activeCategoria = document.querySelectorAll('#focus')
    var buttonSearch    = document.querySelector('#scren')
    var searchInput     = document.querySelector('#search_input')
    var arr = []     
    var categoria     = document.querySelector("#list_categoria") || 1
    var menuCategoria = document.querySelectorAll('.categoria')
    var cat
    
    menuCategoria.forEach(function(r){
        if(categoria.innerHTML != ''){
            if(r.attributes.data.value == categoria.innerHTML){ 
            arr.push(categoria.innerHTML) 
            r.id = 'focus_cat'
            }
        }
    })
   
    if(back != null){ back.onclick = tab }
    if(next != null){ next.onclick = tab }
    best.forEach(function(el){ el.onclick = tab })
    page.forEach(function(el){el.onclick = tab; })
    buttonSearch.onclick = tab
    clickActive.forEach(function(el){ el.onclick = assign });

    function tab(){
       menuCategoria.forEach(function(r){
           if(r.attributes.id == undefined){
               return false
           }else{
               if(r.attributes.id.value == 'focus_cat'){
               
                cat = r.attributes.data.value
           }
           }
           
       })
       
        searchInput    = document.querySelector('#search_input')
        var  clickValue = this.attributes.data.value
        var  dis        = disabled.attributes.data.value
        switch(clickValue){
            case 'bestSellers':
            case 'newArrivals':
            case 'usedBooks':
            case 'specialOffers': arr.push(clickValue); break;
            
            default:    activeElement.forEach(function(el) {
                if(el.attributes.class.value == 'best active'){
                    arr.push(el.attributes.data.value)
                } 
            }); 
        }
        switch(clickValue){
            case 'Computers':
            case 'Cooking':
            case 'Education':
            case 'Fictio':
            case 'Health':
            case 'Mathematics':
            case 'Medical':
            case 'Reference':
            case 'Science':arr.push(clickValue); break;
            default: activeCategoria.forEach(function(el){
                if(el.attributes.class == undefined){ return false } 
                else{ arr.push(el.attributes.data.value) 
                    
                }
            })
        }
        if(dis == null){dis = 1}
        else{var currentPage = +dis;}
        var currentPage = +dis;
        if(this.attributes.data.value == 'next'){ clickValue = +currentPage + 1 }
        else if(this.attributes.data.value == 'back'){ clickValue = +currentPage - 1}
        else{clickValue}
        if(+clickValue === +disabled.innerHTML){ return false }
       
       var activeEl = JSON.stringify(arr)  
        $.ajax ({ 
        url: '/',
        method:'POST',
        data: {
            currentPage: currentPage,
            clickValue: clickValue,
            lastPage: +page[page.length - 1].innerHTML,
            firstPage: +page[0].innerHTML,
            activeEl : activeEl,
            search: searchInput.value,
            cat: cat
        }}).then(function(data){
        $('#productsBorder').html(data)
        Menu()
        }).catch(function(){
            alert('error')
        })   
    }

    function assign(){
        var menuCategoria = document.querySelectorAll('.categoria')
        clickActive.forEach(function(el){el.id=''})
        this.id = "focus"
        menuCategoria.forEach(function(r){
            if(r.id == 'focus'){ 
                all[0].children[1].id= ''
            }
        })
        tab.apply(this)
    }
}

function Search(e){
    var searchInput = document.querySelector('#search_input')
    var activeCategoria = document.querySelectorAll('#focus')
    console.log(activeCategoria)

    searchInput.addEventListener("keyup", function(event) {
     event.preventDefault(); 
    });
    
    var searchText
    if(e == undefined){ searchText = '' }
    else{ searchText = e.value }
    
    $.ajax({
        type: 'post',
        url: "/search", 
        data: {referal:searchText},
        activeCategoria: activeCategoria
    }).then(function(data){ 
        $('#list-search').html(data)
            elsearch = document.querySelectorAll('.el-search')
            elsearch.forEach(function(el){
            el.onclick = searchTab
            })
    }).catch(function(){
        alert('error')
    })

    function  searchTab(){
        console.log(this)
        searchList  = document.querySelector('.search_result')
        searchInput.value = this.innerHTML
        searchList.hidden = true
    }


    searchInput.onblur = function(){
        searchList  = document.querySelector('.search_result')
        setTimeout(function(){
            searchList.hidden = true
        },200)
        
    }
    searchInput.onfocus = function(){
        searchList  = document.querySelector('.search_result')
        searchList.hidden = false
    }



}

function newCategoria(){
    var label = document.createElement('label')
    label.setAttribute('class', 'admin_label')
    label.innerHTML = 'Categoria'
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', 'sort')
    input.setAttribute('class', 'admin_input')
    input.setAttribute('value', '')
    new_categoria.appendChild(label);
    new_categoria.appendChild(input);
}

function removeCategoria(){
    var input = document.querySelectorAll('.admin_input')
    var label = document.querySelectorAll('.admin_label')
    var l = label.length
    var leng  = input.length
    input.forEach(function(e,i){
        if(i == leng -1){  e.remove() }  
    }) 
    label.forEach(function(e,i){
        if(i == l-1){ e.remove() }
    })
}






Menu() 

