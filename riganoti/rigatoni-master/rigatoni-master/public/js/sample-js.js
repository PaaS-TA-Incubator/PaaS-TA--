google.load("visualization", "1", {packages:["orgchart"]});

//db 타입 URL
var dbType = getDbType();

var orgNum = getOrgNum();

//화면에 데이터를 요청 하기 위한 URL
var dataUrl = "../org-chart/"+ orgNum +"/"+ dbType;

//화면 갱신 필요 확인 URL
var statusUrl = "../org-chart/"+ orgNum +"/status/"+dbType;


function getOrgNum(){
    var url = location.href;
    url.split('/');
    var splitted = url.split('/');
    console.log(splitted[splitted.length-1])
    return splitted[splitted.length-1];
}

$( document ).ready(function() {

    $("#dbType").val(dbType);

    $('a[href!=""]').removeAttr("href");

    $('#modal-refresh').on('click',function(evt){
        requestAjax();
        $('#myModal').modal('hide');
    });


    var sampleData,groups;

    $(".tab-container").hide();
    $("#tab_1").show();

    //Tab 클릭 했을 때 해당 화면 보여주는 이벤트
    $('.tab').click(function() {
        var hoverString = $(this).text();

        $(".tab").removeClass("active");
        $(this).addClass("active");
        $(".tab-container").hide();

        switch (hoverString) {
            case '카드'  : $("#tab_1").show(); break;
            case '탭+카드' : $("#tab_2").show(); break;
            case '트리'  : $("#tab_3").show(); break;
            case '탭+트리'  : $("#tab_4").show(); break;
            default   : $("#tab_1").show(); break;
        }
    });

    //Tab2,4 에서 navigation 클릭시 이벤트 처리
    $(".nav a").on("click", function(){
    	
        var hoverString = $(this).text();
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");

        $(".nav-content").append(hoverString);

    });

    $(".nav").click(function(){
        window.location.href = "../manage";
    });


    $( "#dbType" ).change(function() {
        dbType = $(this).val();
        setDbType(dbType);
        // alert(dbType);
        //TODO 다른 db 가 설정 되면 추가
        requestAjax();
    });



    //TODO RabbitMQ url 이 설정 완료 되면 추가!
    // 타이머 5초마다 한번!
    setInterval(function(){
        statusUrl = "../org-chart/"+ orgNum +"/status/"+dbType;

        $.ajax({
            url: statusUrl,
            method: "GET"

        })
        .done(function( msg ) {
            var msgTypeString = checkRabbitMessage(msg);

            if(msgTypeString != null){
                $('#modal-body-content').html(msgTypeString + "되었습니다.\n조직도 상태를 갱신하시겠습니까?");
                $('#myModal').modal()
            }

        })
        .fail(function( jqXHR, textStatus ) {
            //alert( "Request failed: " + textStatus );
        });
    },30000);


    function randomSetMsg(){
        var msg = {};

        var randomValue = Math.floor(Math.random()*6);

        if(randomValue == 0)
        {
            msg.status = "NO_CHANGES"
        }
        else if(randomValue == 1)
        {
            msg.status = "ORG_DELETED"
        }
        else if(randomValue == 2)
        {
            msg.status = "ORG_UPATED"
        }
        else if(randomValue == 3)
        {
            msg.status = "GROUP_ADDED"
        }
        else if(randomValue == 4)
        {
            msg.status = "GROUP_DELETED"
        }
        else if(randomValue == 5)
        {
            msg.status = "GROUP_UPDATED"
        }
        return msg;
    }


    /*

 변화가 없으면 null을 반환하고
 나머지 상태 변화는 한글로 반환한다.

     */
    function checkRabbitMessage(msg){
        if(msg.status == "NO_CHANGES"){
            return null;
        }
        else if(msg.status == "ORG_DELETED"){
            return "조직도 정보가 삭제"
        }
        else if(msg.status == "ORG_UPATED"){
            return "조직도 정보가 변경"
        }
        else if(msg.status == "GROUP_ADDED"){
            return "그룹 정보가 추가"
        }
        else if(msg.status == "GROUP_DELETED"){
            return "그룹 정보가 삭제"
        }
        else if(msg.status == "GROUP_UPDATED"){
            return "그룹 정보가 변경"
        }
    }


    function requestAjax(){

        dataUrl = "../org-chart/"+ orgNum +"/"+ dbType;

        // dataUrl = "../resources/sample/org-chart.json";

        $.get( dataUrl )
        .done(function( data ) {

            sampleData = data;

            createTree(sampleData.groups);
            console.log( sampleData );
            var finalLevel = calculateDepth();

            var beforeNode = [];
            var beforeLevelMargin = [];
            var isNode = false;



            //init

            $( ".inner-btn-group *" ).remove();
            $( "#tab_2_card_group *" ).remove();
            $( "#tab_1 *" ).remove();
            // $( "#tab_3 *" ).remove();
            $( "#chart_div *" ).remove();
            $( "#chart_div_group *" ).remove();
            // $( "#tab_4 *" ).remove();



            /*
        SetData
             */



            //타이틀 바 추가
            $( ".title_org" ).text(sampleData.org.label);
            $(".title_org ~ small").show();

            /*
        Tab 1 추가
             */


            //그룹 박스 추가

            var tempTitle;
            var beforeLevelInfo = {};
            console.log(sampleData.groups)

            for(var i = 0 ; i <= finalLevel ; i++ ){
                var tempClass = "tab_1_"+i


                if( i == 0){
                    tempTitle = "<li>" + sampleData.org.label + "</li>";
                    $( "#tab_1" ).append("<div class = \""+ tempClass +"\"><ol class=\"color col-xs-12 breadcrumb font-color-white\">"
                            + tempTitle +"<button class=\"toggle faq-links pull-right\" value = \"card-group_1-"+ i + "\">"
                            +"<i class=\"fa fa-minus-square-o\" ></i></button></ol></div>"
                            +"<div id = \"card-group_1-"+ i + "\" class=\"card-group\"></div>");
                }
                else{

                    var beforeInnerTitle;
                    for(var j = 0 ; j < sampleData.groups.length ; j++){
                        var level = i;
                        if(sampleData.groups[j].level == level ){

                            tempClass = tempClass+"-"+j;
                            tempTitle = "<li>" + sampleData.org.label + "</li>" + getParentName(sampleData.groups[j].parent_id);
                            if(beforeInnerTitle != tempTitle && sampleData.groups[j].duplication != 1){
                                // if(sampleData.groups[j].level_count != tempTitle){
                                beforeInnerTitle = tempTitle;

                                $( "#tab_1" ).append("<div class = \""+ tempClass +"\"><ol class= \"color col-xs-12 breadcrumb font-color-white\">"
                                        + tempTitle +"<button class=\"toggle faq-links pull-right\" value = \"card-group_1-"+ i +"-"+sampleData.groups[j].level_count+"\">"
                                        +"<i class=\"fa fa-minus-square-o\" ></i></button></ol></div>"
                                        +"<div id = \"card-group_1-"+ i +"-"+sampleData.groups[j].level_count+"\" class=\"card-group\"></div>");

                            }
                            // break;
                        }

                    }
                }


            }

            //카드 추가

            sampleData.groups.forEach(function(element) {

                var tempId;

                if(element.level == 0){
                    tempId = "#card-group_1-"+element.level;
                }
                else{
                    tempId = "#card-group_1-"+element.level+"-"+element.level_count;
                }

                if(element.thumb_img_path == null){
                    $(tempId).append("<div class=\"col-xs-3 box row delete-padding-both\">"
                            +"<a href =\""+ element.url +"\" target=\"_blank\">"
                            +"<div class=\"col-xs-4 delete-padding-both\"><i class=\"card-sumnail fa fa-user fa-4x\"></i></div>"
                            +"<div class=\"border-line col-xs-8 delete-padding-both\">"
                            +"<div class=\"card-title\">"+ element.label +"</div>"
                            +"<div class=\"card-detail-description\">"+ element.desc +"</div></div></a></div>");
                }
                else{
                    $(tempId).append("<div class=\"col-xs-3 box row delete-padding-both\">"
                            +"<a href =\""+ element.url +"\" target=\"_blank\">"
                            +"<div class=\"col-xs-4 delete-padding-both\">"
                            +"<img src=\""+ element.thumb_img_path +"\" alt=\""+element.thumb_img_name+"\" height=\"70\" width=\"70\"/></div>"
                            +"<div class=\"border-line col-xs-8 delete-padding-both\">"
                            +"<div class=\"card-title\">"+ element.label +"</div>"
                            +"<div class=\"card-detail-description\">"+ element.desc +"</div></div></a></div>");
                }

            });

            /*
        Tab 2 추가
             */

            //sub tab 추가


            for(var j = 0 ; j < sampleData.groups.length ; j++){
                var level = i-1;
                if(sampleData.groups[j].level == 0 ){
                    $(".inner-btn-group").append("<button type=\"button\" class=\"col-xs-3 active small-tab tab-btn tab btn btn-default\">"
                            +"<i class=\"tab-sumnail fa fa-user fa-2x fa-vertical-align\" ></i><span>"+ sampleData.groups[j].label +"</span></button>");

                    $( "#tab_2_card_group" ).append("<div class = \"small_tab_container\" id = \"tab2_group_"+ sampleData.groups[j].ancestor +"\"></div>");


                }
            }


            //그룹 박스 추가

            var tempTitle;
            var beforeLevelInfo = {};
            console.log(sampleData.groups)

            for(var i = 1 ; i <= finalLevel ; i++ ){

                var tempClass = "tab_2_"+i

                var beforeInnerTitle;


                for(var j = 0 ; j < sampleData.groups.length ; j++){
                    var level = i;

                    if(sampleData.groups[j].level == level ){

                        tempClass = tempClass+"-"+j;

                        tempTitle = "<li>" + sampleData.org.label + "</li>" + getParentName(sampleData.groups[j].parent_id);
                        if(beforeInnerTitle != tempTitle && sampleData.groups[j].duplication != 1){
                            beforeInnerTitle = tempTitle;

                            $( "#tab2_group_"+sampleData.groups[j].ancestor ).append("<div class = \""+ tempClass +"\"><ol class=\"color col-xs-12 breadcrumb font-color-white\">"
                                    + tempTitle +"<button class=\"toggle faq-links pull-right\" value = \"card-group_2-"+ i +"-"+sampleData.groups[j].level_count+"\">"
                                    +"<i class=\"fa fa-minus-square-o\" ></i></button></ol></div>"
                                    +"<div id = \"card-group_2-"+ i +"-"+sampleData.groups[j].level_count+"\" class=\"card-group\"></div>");

                        }
                        // break;
                    }

                }

            }





            //카드 추가

            sampleData.groups.forEach(function(element) {

                var tempId;

                if(element.level == 0){
                    tempId = "#card-group_2-"+element.level;
                }
                else{
                    tempId = "#card-group_2-"+element.level+"-"+element.level_count;
                }
                if(element.thumb_img_path == null){
                    $(tempId).append("<div class=\"col-xs-3 box row delete-padding-both\">"
                            +"<a href =\""+ element.url +"\" target=\"_blank\">"
                            +"<div class=\"col-xs-4 delete-padding-both\"><i class=\"card-sumnail fa fa-user fa-4x\"></i></div>"
                            +"<div class=\"border-line col-xs-8 delete-padding-both\">"
                            +"<div class=\"card-title\">"+ element.label +"</div>"
                            +"<div class=\"card-detail-description\">"+ element.desc +"</div></div></a></div>");
                }
                else{
                    $(tempId).append("<div class=\"col-xs-3 box row delete-padding-both\">"
                            +"<a href =\""+ element.url +"\" target=\"_blank\">"
                            +"<div class=\"col-xs-4 delete-padding-both\">"
                            +"<img src=\""+ element.thumb_img_path +"\" alt=\""+element.thumb_img_name+"\" height=\"70\" width=\"70\"/></div>"
                            +"<div class=\"border-line col-xs-8 delete-padding-both\">"
                            +"<div class=\"card-title\">"+ element.label +"</div>"
                            +"<div class=\"card-detail-description\">"+ element.desc +"</div></div></a></div>");
                }
            });






            //setGroupBoxColor
            for(var i = 0 ; i < $(".color").length ; i++){
                if(i%6 == 0){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "5E87B0");
                }
                else if(i%6 == 1){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "70AFC4");
                }
                else if(i%6 == 2){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "A8BC7B");
                }
                else if(i%6 == 3){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "F0AD4E");
                }
                else if(i%6 == 4){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "D9534F");
                }
                else if(i%6 == 5){
                    $("#tab_1 .color:eq("+ i +")").css("background-color", "555555");
                }
            }

            for(var i = 0 ; i < $(".color").length ; i++){
                if(i%6 == 0){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "5E87B0");
                }
                else if(i%6 == 1){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "70AFC4");
                }
                else if(i%6 == 2){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "A8BC7B");
                }
                else if(i%6 == 3){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "F0AD4E");
                }
                else if(i%6 == 4){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "D9534F");
                }
                else if(i%6 == 5){
                    $("#tab_2 .color:eq("+ i +")").css("background-color", "555555");
                }
            }


            /*
        클릭 이벤트

             */
            //small Tab 클릭 했을 때 해당 화면 보여주는 이벤트
            $(".small_tab_container").hide();
            $("#tab2_group_"+sampleData.root[0].id).show();


            $('.small-tab').click(function() {

                var hoverString = $(this).text();

                $(".small-tab").removeClass("active");
                $(this).addClass("active");
                $(".small_tab_container").hide();

                sampleData.root.forEach(function(element){
                    if(hoverString == element.label){
                        $("#tab2_group_"+element.id).show();
                    }
                });

            });


            $( ".toggle" ).click(function() {
                var tempCardGroup = "#"+$(this).val();
                $( tempCardGroup ).toggle( "fast" );
            });

            $('.faq-links').click(function(){
                var collapsed=$(this).find('i').hasClass('fa-minus-square-o');

                $('.faq-links').find('i').removeClass('fa-plus-square-o');

                $('.faq-links').find('i').addClass('fa-minus-square-o');
                if(collapsed)
                    $(this).find('i').toggleClass('fa-minus-square-o fa-2x fa-plus-square-o fa-2x')
            });




            /*
        3 Tab 추가

             */

                //트리구조 생성
            google.setOnLoadCallback(drawChart(sampleData));
            drawChart(sampleData);




            /*
        4 Tab 추가

             */

            // tree 그룹 추가


            //tree 추가





            function getParentName(parentId){


                if(parentId != 0 && parentId !== null){
                    var tempParent = "<li>" + sampleData.map[parentId].label + "</li>";
                    return getParentName(sampleData.map[parentId].parent_id) + tempParent;
                }
                else{
                    return "";
                }
            }


        })
        .fail(function(){

            $(".title_org").text("요청하신 조직이 존재하지 않습니다.");
            $(".title_org ~ small").hide();
            $("#tab_1").html("");
            $(".inner-btn-group").html("");
            $("#tab_2_card_group").html("");
            $("#chart_div").html("");
            $("#chart_div_group").html("");
            $()
        });
    }

    requestAjax();




    //Tree를 위한 계산

    function calculateDepth(){
        var finalLevel = 0;
        sampleData.root.forEach(function(element) {
            traversal(element, 1, function(node){
                if(finalLevel == node.level || finalLevel < node.level){
                    finalLevel = node.level;
                }

            });
        });

        return finalLevel;
    }


    function createTree(groups) {
        // groups를 탐색하여 트리 형태를 만듬
        sampleData.map = {};
        sampleData.root = new Array();

        // 첫 번째 데이터가 루트라고 가정했을 때는 첫 번째 그룹이 루트.
        // sampleData.root = groups[0];

        // 첫 번째 그룹이 루트인지 알 수 없는 경우.
        // 루트노드를 찾으려면 parent_id 가 null인 값을 찾음
        var i = 0;
        var level_count = {};

        groups.forEach(function(element) {

            if(!element.parent_id) {
                console.log("root "+ i +" : " + element.id);
                sampleData.root.push(element);
                i++;
            }

            // map에 id로 넣음
            sampleData.map[element.id] = element;

            element.children = [];
            element.weight = 0;

        });



        // 노드들 연결
        groups.forEach(function(element) {
            if(element.parent_id) {
                var parent = sampleData.map[element.parent_id];

                parent.children.push(element);
            }
        });

        // 하위 노드의 갯수 및 레벨 계산
        sampleData.root.forEach(function(element) {

            calculateTreeValues(element, 0);
        });
        // calculateTreeValues(sampleData.root[], 0);

        //각 level당 갯수 입력

        var beforeParent = [];
        groups.forEach(function(element) {

            var key = element.level;
            var parentKey = element.parent_id;
            var sameParent = 0;

            for(var i = 0 ; i < beforeParent.length ; i++){
                if(element.parent_id == beforeParent[i]){
                    sameParent = 1;

                }
            }

            var result = Math.floor(Math.random() * 10000000) + 1;


            if(level_count[parentKey] == null){
                level_count[parentKey] = result;
                beforeParent.push(element.parent_id);
                sampleData.map[element.id].duplication = 0;
            }
            else if(sameParent == 1){
                level_count[parentKey] = level_count[parentKey];
                sampleData.map[element.id].duplication = 1;
            }
            else{
                beforeParent.push(element.parent_id);
                level_count[parentKey] = result;
                sampleData.map[element.id].duplication = 0;
            }

            sampleData.map[element.id].level_count = level_count[parentKey];

            sampleData.map[element.id].ancestor = getParentId(sampleData,element.id);

        });
    }

    // 하위 노드의 갯수 및 레벨
    function calculateTreeValues(rootNode, level) {
        var children = rootNode.children;
        rootNode.level = level;

        // 자식 노드가 있는 경우
        if (children.length > 0) {
            var sumOfWeight = 0;
            for(var i = 0 ; i < children.length ; i++) {
                sumOfWeight += calculateTreeValues(children[i], level + 1);
            }

            rootNode.weight = sumOfWeight;

            return sumOfWeight;
        } else { // 자식 노드가 없는 경우 1칸을 차지하므로 1반환
            rootNode.weight = 1;
            return 1;
        }
    }

    function getParentId(sampleData, id) {
        var tempParentId
        if(sampleData.map[id].parent_id == null){
            tempParentId = 0;
        }
        else{
            tempParentId = sampleData.map[id].parent_id;
        }

        if(tempParentId != 0){
            return getParentId(sampleData, tempParentId);
        }
        else{
            return id;
        }
    }

    // 순회, type 값: 1-전위, 2-후위
    // * 이진트리가 아니므로 중위 순회는 없음
    function traversal(rootNode, type, action) {
        // 전위 순회인 경우 현재 노드에 대해 할 함수를 호출
        if(type == 1) action(rootNode);

        rootNode.children.forEach(function(child){
            traversal(child, type, action);
        });

        // 후위 순회인 경우 현재 노드에 대해 할 함수를 호출
        if(type == 2) action(rootNode);
    }

});

/*
  트리와 탭 트리를 구성한다.
 */
function drawChart(sampleData) {
    {
        // 트리 추가
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('string', 'Manager');
        data.addColumn('string', 'ToolTip');
        var tempValue;

        var parentId;

        // sampleData.groups.forEach(function(element){
        $.each(sampleData.groups,function(key, element){


            tempValue = $("#smallTreeTemplate").render(element);

            if(element.parent_id == 0 || element.parent_id === null){
                parentId = '';
            }
            else{
                parentId = element.parent_id.toString();
            }

            var myVal = element.id.toString();

            data.addRow([{v:myVal, f:tempValue}, parentId, element.desc]);
            // data.setRowProperty(key, 'style', 'border: 1px solid blue; height : 72px; width : 600px');
            // data.setProperty(0, 0, "style", "vertical-align:top;");
        });

        for (var i = 0; i < data.getNumberOfRows(); i++) {
        }

        var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
        chart.draw(data, {allowHtml:true , allowCollapse:false});

        $(".google-visualization-orgchart-table *").css("padding","0px");

        $(".google-visualization-orgchart-node").css("font-family","inherit");
        $(".google-visualization-orgchart-table").css("text-align","inherit");
        $(".google-visualization-orgchart-node").css("text-align","inherit");

        $(".card-tree-margin-top").css("margin-top","5px");
        $("img").css("margin-top","1px");


        $(".box-small").css("width","75px");
        $(".box-small").css("height","102px");
        $("img").css("margin-top","1px");
    }


    {
        // tab tree 추가
        sampleData.root.forEach(function(element){
            var tempId = "char_div_"+element.id;
            $( "#chart_div_group" ).append("<div class = \"tree_small_tab_container\" id = "+ tempId +"></div>");
        });




        sampleData.root.forEach(function(node){


            var tempId = "char_div_"+node.id;

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Name');
            data.addColumn('string', 'Manager');
            data.addColumn('string', 'ToolTip');
            var tempValue;

            var parentId;

            sampleData.groups.forEach(function(element){
                if(element.ancestor == node.id ){

                    tempValue = $("#smallTreeTemplate").render(element);
                    if(element.parent_id == 0 || element.parent_id === null){
                        parentId = '';
                    }
                    else{
                        parentId = element.parent_id.toString();
                    }

                    var myVal = element.id.toString();

                    data.addRow([{v:myVal, f:tempValue}, parentId, element.desc]);

                }
            });

            var chart = new google.visualization.OrgChart(document.getElementById(tempId));
            chart.draw(data, {allowHtml:true, allowCollapse:false});

            $(".google-visualization-orgchart-table *").css("padding","0px");

            $(".google-visualization-orgchart-node").css("font-family","inherit");
            $(".google-visualization-orgchart-table").css("text-align","inherit");
            $(".google-visualization-orgchart-node").css("text-align","inherit");

            $(".card-tree-margin-top").css("margin-top","5px");
            $("img").css("margin-top","1px");
            // $("td").css("border","solid 1px black");

            $(".box-small").css("width","75px");
            $(".box-small").css("height","102px");
            $("img").css("margin-top","1px");

        });


        /*
        클릭 이벤트

         */
        //small Tab 클릭 했을 때 해당 화면 보여주는 이벤트
        $(".tree_small_tab_container").hide();
        $("#char_div_"+sampleData.root[0].id).show();


        $('.small-tab').click(function() {

            var hoverString = $(this).text();

            $(".small-tab").removeClass("active");
            $(this).addClass("active");
            $(".tree_small_tab_container").hide();

            sampleData.root.forEach(function(element){
                if(hoverString == element.label){
                    $("#char_div_"+element.id).show();
                }
            });

        });
    }
}

