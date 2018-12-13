function objectArrayIndexOf(array, property, value) {
    for(var i = 0; i < array.length; i++) {
        if (array[i][property] == value)
            return i;
    }
    return -1;
}

function getDbType(){
    var dbType = Cookies.get("dbType");
    if(dbType === undefined)
        dbType = "mysql";
    return dbType;
    // return "hsql";
}

function setDbType(dbType){
    Cookies.set("dbType", dbType);
}



//formdata to object
$.fn.serializeObject = function(){
    var object = {};
    var formArray = this.serializeArray();

    $.each(formArray, function(){

        if(object[this.name] !== undefined){
            if(!object[this.name].push){
                object[this.name] = [object[this.name]];
            }
            object[this.name].push(this.value || "");
        } else {
            object[this.name] = this.value || "";
        }
    });

    return object;
}
