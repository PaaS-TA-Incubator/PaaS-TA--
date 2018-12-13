// present current date and time
function timer() {
    let today = new Date();

    let year = today.getFullYear()+"년 ";
    let month = today.getMonth()+1+"월 ";
    let date = today.getDate()+"일 ";
    const weeks = ['일','월','화','수','목','금','토'];
    let week = "("+weeks[today.getDay()]+") ";

    let hour = today.getHours();
    let min = today.getMinutes();
    let second = today.getSeconds();
    hour = (hour < 10) ? '0'+hour : hour;
    min = (min < 10) ? '0'+min : min;
    second = (second < 10) ? '0'+second : second;

    document.getElementById("currentTime").innerHTML =
        year + month + date + week + hour+":" + min+":" + second;

    setTimeout('timer()',1000);
}

// request answer to user question
function request_answer () {
    // show Modal
    $('#answer').text('검색중 ...');
    $('#answer_modal').modal('toggle');

    // json request
    const question = $('#question_text')[0].value;
    $.ajax({
        type : 'GET',
        url : 'http://api.datamixi.com/datamixiApi/deepqa',
        data : {
            key: '3082028134077943630',
            question: question
        },
        success : function (data) {
            // update answer text
            $('#answer').text(data.return_object.answer);
            console.log(data);
        }
    });
}
timer();