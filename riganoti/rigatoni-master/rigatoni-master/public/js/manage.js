var datas = {
    orgs : []
    , groups : []
    , dbType : getDbType()
    , pageCount : 10
    , pageGroupCount : 5
    , currentPage : 1
    , currentOrg : {}
};

function setBodyVisible (jqueryObject){
    $("#add").hide();
    $("#modify").hide();
    $("#manage").hide();
    jqueryObject.show();
}



function setOrgs(){

    setBodyVisible($("#manage"));

    //템플릿 렌더링
    var orgsHtml = $("#orgsTemplate").render(datas.orgs);
    $("#orgsResult").html(orgsHtml);

    $("#orgsNotFound").hide();

    //조직도 항목 이벤트 바인딩
    $(".body-left .list-item").each(function(index){
        $(this).click(function(event){
            requestGroups(datas.orgs[index], 1);
        });
    });

    //홈 버튼 이벤트 바인딩
    $("[id='btn_home']").each(function(index){
        $(this).click(function(event){
            // window.location.replace("main/" + datas.orgs[index].id);
            window.location = "main/" + datas.orgs[index].id;
        });
    });

    //삭제 이벤트 바인딩
    $("[id='btn_removeOrg']").each(function(index){
        var id = datas.orgs[index].id;
        var label = datas.orgs[index].label;

        $(this).click(function(event){
            deleteOrgModal({
                label : label,
                click : function(event){
                    $.ajax({
                        url : "orgs/" + id + "/" + datas.dbType,
                        method: "DELETE",
                        contentType: "application/json",
                        dataType:"json",
                        success:function(data, status){
                            $("#delOrg").modal("hide");
                            requestOrgs();
                        }
                    });
                }
            });

            return false;
        });
    });

    //조직도 없을 때
    if(datas.orgs.length < 1)
        $("#orgsNotFound").show();
    else
        $("#orgsNotFound").hide();
}

function setGroups(org, page){

    //body view change
    setBodyVisible($("#modify"));

    datas.currentOrg = org;

    //기본 조직도 데이터 셋팅
    $("#modify #orgLabel").val(datas.currentOrg.label);
    $("#modify #orgUrl").val(datas.currentOrg.url);

    //기본 페이지 데이터 설정
    datas.currentPage = Number(page);
    var totalPage = Math.ceil(datas.groups.length / datas.pageCount);
    totalPage = totalPage < 1 ? 1: totalPage;

    //페이지 조정
    datas.currentPage = datas.currentPage < 1 ? 1 : datas.currentPage;
    datas.currentPage = datas.currentPage > totalPage ? totalPage : datas.currentPage;

    //페이징 데이터 추출
    var pagedGroups = $.grep(datas.groups, function(obj, index){
        return (index < datas.currentPage * datas.pageCount && index >= (datas.currentPage - 1) * datas.pageCount);
    });

    //그룹 템플릿 렌더링
    var groupsHtml = $("#groupsTemplate").render(pagedGroups);
    $("#groupsResult").html(groupsHtml);

    //페이징 넘버링 추출
    var centerNumber = datas.currentPage;
    var half = Math.floor(datas.pageGroupCount / 2) ;
    centerNumber = centerNumber < half+1 ? half+1 : centerNumber;
    centerNumber = centerNumber > totalPage - half ? totalPage - half : centerNumber;

    var minPage = centerNumber - half;
    minPage = minPage < 1 ? 1 : minPage;

    var maxPage = centerNumber + half;

    //페이지 데이터 생성
    var pages = [
        {
            page : 1,
            label : "First"
        },
        {
            page : datas.currentPage - 1,
            label : "Previous"
        }
    ];
    for(var i = minPage; i <= maxPage; i++){
        pages.push({page : i, label : i});
    }

    pages.push({
        page : datas.currentPage + 1,
        label : "Next"
    });
    pages.push({
        page : totalPage,
        label : "Last"
    });


    //페이징 템플릿 렌더링.
    var pageHtml = $("#pageTemplate").render(pages);
    $("#pageResult").html(pageHtml);


    //페이징 이벤트 바인딩.
    $("#pageResult a").click(function(event){
        var targetPage = $(this).attr("data-page");
        setGroups(datas.currentOrg, targetPage);
        return false;
    });

    //페이징 클래스 추가
    $("#pageResult a").each(function(){
        if($(this).html() == datas.currentPage){
            $(this).parent().addClass("active");
        }
    });


    //삭제 버튼 이벤트 바인딩
    $("#groupsResult [id='btn_del']").click(function(event){
        var id = $(this).parent().attr("data-id");

        //모달 띄움.
        deleteGroupModal(function(){
            $.ajax({
                url : "orgs/" + datas.currentOrg.id +"/groups/" + id + "/"  +datas.dbType,
                method : "DELETE",
                contentType : "application/json",
                dataType : "json",
                success : function(data, status){
                    $("#delGroup").modal("hide");
                    requestGroups(datas.currentOrg, datas.currentPage);
                }
            });
        })

        return false;
    });

    //수정 버튼 이벤트 바인딩.
    $("#groupsResult [id='btn_modify']").click(function(event){
        var id = $(this).parent().attr("data-id");
        var index = objectArrayIndexOf(datas.groups, "id", id);

        showModifyGroupModal(function(){
           var formData = getFileFormData();
            if(formData !== undefined)
                uploadFile(formData, requestModifyGroup, id);
            else
                requestModifyGroup(datas.groups[index].thumb_img_path || "", id);
        }, datas.groups[index]);
        return false;
    });

}

function addGroupsNecessaryData(){
    //필요한 데이터 추가.
    $.each(datas.groups, function(index, value){
        arrs = $.grep(datas.groups, function(obj, index){
            return value.id == obj.parent_id;
        });
        $.each(arrs, function(index, element){
            element.parentLabel = value.label;
        });
    });
}


function deleteOrgModal(options){
    //레이블 셋팅
    $("#delOrg #label").html(options.label);
    //OK에 이벤트 셋팅
    $("#delOrg #btn_del").unbind("click")
            .click(options.click);
    //모달 show
    $("#delOrg").modal("show");
}

function deleteGroupModal(click){
    //OK에 이벤트 셋팅O
    $("#delGroup #btn_del").unbind("click")
            .click(click);
    //모달 show
    $("#delGroup").modal("show");
}

function requestOrgs(){
    $.ajax({
        url:"orgs/" + datas.dbType,
        // url: "resources/sample/bd_orgs.json",
        dataType:"json",
        method:"GET",
        contentType: "application/json",
        success:function(data, status){
            if(status != "success"){
                alert("request failed");
                return;
            }

            //데이터 셋팅
            datas.orgs = data.orgs;

            //조직도 화면 표시
            setOrgs();
        }
    });
}

function requestGroups(org, page){
    $.ajax({
        url : "orgs/" + org.id + "/groups/" + datas.dbType,
        // url : "resources/sample/bd_groups.json",
        dataType : "json",
        method : "GET",
        contentType: "application/json",
        success : function(data, status){
            if(status != "success"){
                alert("request failed");
                return;
            }
             //데이터 셋팅
            datas.groups = data.groups;

            //필요한 데이터 추가.
            addGroupsNecessaryData();

            //그룹 화면 표시 셋팅
            setGroups(org, page);
        }
    });
}

function bindEvent(){

    //조직도 수정
    $("#body-left #btn_addOrg").click(function(event){
        setBodyVisible($("#add"));
        $("#add #orgLabelAlert").hide();
    });

    //조직도 추가 요청
    $("#add #btn_addOrg").click(function(event){
        //Validation Check
        if($("#add #orgLabel").val().length < 1){
            $("#add #orgLabelAlert").show();
            return false;
        }

        var requestData = {
            label : $("#add #orgLabel").val(),
            url : $("#add #orgUrl").val(),
            desc : ""
        };

        $.ajax({
            url : "orgs/" + datas.dbType,
            method : "POST",
            contentType : "application/json",
            data : JSON.stringify(requestData),
            dataType : "json",
            success : function(data, status){
                 $("#add #orgLabelAlert").hide();
                 $("#add #orgLabel").val("");
                 $("#add #orgUrl").val("");
                 requestOrgs();
            }
        });

        return false;
    });

    //조직도 수정 요청
    $("#modify #btn_modifyOrg").click(function(event){
        //Validation Check
        if($("#modify #orgLabel").val().length < 1){
            $("#modify #orgLabelAlert").show();
            return false;
        }

        var requestData = {
            label : $("#modify #orgLabel").val(),
            url : $("#modify #orgUrl").val()
        };

        $.ajax({
            url : "orgs/" + datas.currentOrg.id + "/" + datas.dbType,
            method : "PUT",
            contentType : "application/json",
            data : JSON.stringify(requestData),
            dataType : "json",
            success : function(data, status){
                 $("#modify #orgLabelAlert").hide();
                 requestOrgs();
            }
        });

        return false;
    });

    //조직 추가 버튼
    $("#modify #btn_addGroup").click(function(event){
        //모달 show
        showAddGroupModal(function(){
            var formData = getFileFormData();
            if(formData !== undefined)
                uploadFile(formData, requestAddGroup);
            else
                requestAddGroup("");
        });

        return false;
    });

    //dbType 변경
    $("#dbType").change(function(event){
        datas.dbType = $(this).val();
        setDbType(datas.dbType);
        setBodyVisible($("#manage"));
        requestOrgs();
    });

    //로그아웃 버튼
    $("#logout").click(function() {
        $.ajax({
            url : "manage/logout"
            , method : "POST"
            , dataType : "json"
            , success : function(data, status){
                // var url = "main";
                // $(location).attr("href", url);
                location.reload(true);
            }
        });
    });

}

/*
    파일을 FormData 형태로 감싸서 반환.
*/
function getFileFormData(){
    // var formData = new FormData($("#groupForm")[0]);
    if($("#file")[0].files[0] === undefined)
        return undefined;

    var formData = new FormData();
    formData.append("file", $("#file")[0].files[0]);
    return formData;
}

function uploadFile(formData, successCallback, id){
    $.ajax({
        url : "upload"
        , method : "POST"
        , processData : false
        , contentType : false
        , data : formData
        , dataType : "json"
        , success : function(data, status){
            successCallback(data.thumb_img_path, id);
        }
    });
}

function requestAddGroup(thumb_img_path){

    var requestData = $("#groupForm").serializeObject();
    delete requestData.file;
    requestData.thumb_img_path = thumb_img_path;

    $.ajax({
        url : "orgs/" + datas.currentOrg.id + "/groups/" + datas.dbType
        , method : "POST"
        , contentType : "application/json"
        , data : JSON.stringify(requestData)
        , dataType : "json"
        , success : function(data, status){
            //계속 추가인 경우다시 열고 아니면 닫음.
            if($("#groupModal #addContinue").is(":checked")){
                $("#modify #btn_addGroup").click();
            } else {
                $("#groupModal").modal("hide");
            }
            //다시 request
            requestGroups(datas.currentOrg, datas.currentPage);


        }
    });
}

function requestModifyGroup(thumb_img_path, id){

    var requestData = $("#groupForm").serializeObject();
    delete requestData.file;
    requestData.thumb_img_path = thumb_img_path;

    $.ajax({
        url : "orgs/" + datas.currentOrg.id + "/groups/"+ id + "/" + datas.dbType
        , method : "PUT"
        , contentType : "application/json"
        , data : JSON.stringify(requestData)
        , dataType : "json"
        , success : function(data, status){
            //닫고
            $("#groupModal").modal("hide");
            //다시 request
            requestGroups(datas.currentOrg, datas.currentPage);
        }
    });
}

function showAddGroupModal(func, init){
    $("#groupModal .modal-title strong").html("하위 조직 추가");
    $("#groupModal #btn_addGroup").html("조직 추가");
    $("#groupModal .checkbox").show();
    showGroupModal(func, init);
}

function showModifyGroupModal(func, init){
    $("#groupModal .modal-title strong").html("하위 조직 수정");
    $("#groupModal #btn_addGroup").html("조직 수정");
    $("#groupModal .checkbox").hide();
    showGroupModal(func, init);
}

//모달에 이벤트를 바인딩, 초기화 데이터 셋팅 후 show
function showGroupModal(func, init){
    //폼 클리어
    $("#groupModal #groupForm")[0].reset();

    //추가 버튼에 이벤트 셋팅
    $("#groupModal #btn_addGroup").unbind("click")
            .click(function(event){
                func();
                return false;
            });

    //드롭다운 렌더링
    var parents = [{id:null, label:"없음"}];
    parents = parents.concat(datas.groups);
    var parentsHtml = $("#parentsTemplate").render(parents);
    $("#groupModal #groupParent").html(parentsHtml);

    //초기화
    $("#groupModal #groupOrg").val(datas.currentOrg.id);

    if(init === undefined)
        init = {};

    $("#groupModal #groupParent").val(init.parent_id);
    $("#groupModal #groupLabel").val(init.label);
    $("#groupModal #groupUrl").val(init.url);
    $("#groupModal #groupDesc").val(init.desc);
    $("#groupModal #inputFile").val(init.thumb_img_name).attr("data-original", init.thumb_img_name);

    $("#groupModal").modal({
        backdrop : "static"
    }).modal("show");
}

$(document).ready(function(){
    $("#dbType").val(datas.dbType);
    setBodyVisible($("#manage"));
    bindEvent();
    requestOrgs();
});

