var register = function(Handlebars) {
    var helpers = {
    foo: function(value,cssClass, numberPage ,options) {
        var out = ""
        var i = value - 4 
        if(i < 1){ i = 1}
        for( i ;i <= value; i++){
            if(i == numberPage){ out = out + '<li class="pages '+ cssClass +'" data ="' + i + '">'+i+"</li>"}
            else{out = out + "<li class='pages'  data ='"+ i +"'>"+i+"</li>"}     
        }
        return out
    }
};
return helpers
};

module.exports.helpers = register(null); 
