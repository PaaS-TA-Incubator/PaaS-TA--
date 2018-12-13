// request_btn instance
new Vue({
    el: '#request_btn',
    methods: {
        request_answer: function () {
            // show Modal
            $('#answer').text('검색중 ...');
            $('#answer_modal').modal('toggle');

            // json request
            const question = $('#question_text')[0].value;
            axios.get('http://127.0.0.1:8000/site/qna/', {
                // origin link http://13.209.97.110/site/qna
                params: { question: question }
            }).
            then(response => {
                // update answer text
                $('#answer').text(response.data.content);
                $('#answer_link').on('click', function () {
                    location.href = response.data.link;
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }
});

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

timer();