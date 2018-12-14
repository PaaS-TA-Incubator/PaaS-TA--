
document.write("<script type='text/javascript' src='resources/js/map_google.js'></script>");
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = ["강서구","양천구","구로구","영등포구","금천구","동작구","관악구",
          "서초구","강남구","송파구","강동구","마포구","서대문구","은평구",
          "종로구","중구","용산구","성북구","강북구","도봉구","노원구",
          "동대문구","중랑구","성동구","광진구"];

var phrasePara = document.querySelector('.phrase');
var resultPara = document.querySelector('.result');
var diagnosticPara = document.querySelector('.output');

var testBtn = document.querySelector('#rec');
// var tel = '112';


// function randomPhrase() {
//   var number = Math.floor(Math.random() * phrases.length);
//   return number;
// }

function searchSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';
  var phrase = phrases;
  console.log(phrase);
  // To ensure case consistency while checking with the returned output text
  // phrase = phrase.toLowerCase();
  phrasePara.textContent = "지역을 말씀하세요! ex)중랑구, 은평구";
  resultPara.textContent = 'Right or wrong?';
  // resultPara.style.background = 'rgba(0,0,0,0.2)';
  // diagnosticPara.textContent = '...diagnostic messages';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'ko-KO';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var speechResult = event.results[0][0].transcript;
    console.log(speechResult);
    // diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
    resultPara.textContent = speechResult;

    var val = $("#address").val(' ');
    var address = "";
    address = $("#address").val(speechResult);
    console.log(val);
    // $("#result").val(result);
    if (val != address) {
      search_addr(address);
    }
    // $('#address').on("change", function() {
    //   alert("address 입력 완료");
    //     // console.log('result');
    //     // searchAddressToCoordinate($('#address').val());
    // });


    // if(speechResult === phrase[0] || speechResult === phrase[1]) {
    //
    //   resultPara.textContent = speechResult;
    //   resultPara.style.color = '#ffffff';
    //   // resultPara.style.background = '#FBBC05';
    //   callNumber('${01040539306}');
    //
    // } else {
    //   resultPara.textContent = '인식실패';
    //   // resultPara.style.background = 'red';
    // }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }

  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }

  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }

  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }

  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }

  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }

  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
}


testBtn.addEventListener('click', searchSpeech);
