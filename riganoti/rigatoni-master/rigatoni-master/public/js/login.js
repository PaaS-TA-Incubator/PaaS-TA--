$(document).ready(function(){


    $("#login-btn").click(function(){

        $.ajax({
            url : "manage/login"
            , method: "POST"
            , data : JSON.stringify($("#loginForm").serializeObject())
            , contentType : "application/json"
            , dataType : "json"
            , success : function(data, status){
                $(location).attr('href',"manage");
            }
            , error : function(jqxhr, status, error){

                $("#login-info").css("visibility", "visible");

            }
        });

        return false;
    });

});
