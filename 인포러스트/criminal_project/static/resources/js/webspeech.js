var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition || null;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList || null;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent || null;

var phrases_help = [
  '도와주세요',
  '전화',
  '전화 걸어',
  '경찰',
  '도와줘',
];

var phraseParaH = document.querySelector('.phrase_help');
var resultParaH = document.querySelector('.result_help');
var diagnosticParaH = document.querySelector('.output_help');

var testBtn = document.querySelector('#call');
// var testBtn = document.querySelector('#');
// var tel = '112';


// function randomPhrase() {
//   var number = Math.floor(Math.random() * phrases.length);
//   return number;
// }

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';
  var phrase = phrases_help;
  console.log(phrase[0]);
  // To ensure case consistency while checking with the returned output text
  // phrase = phrase.toLowerCase();
  phraseParaH.textContent = "도움을 요청하세요! ex)도와주세요, 전화, 전화걸어, 경찰";
  resultParaH.textContent = 'Right or wrong?';
  // resultParaH.style.background = 'rgba(0,0,0,0.2)';
  // diagnosticParaH.textContent = '...diagnostic messages';

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
    // diagnosticParaH.textContent = 'Speech received: ' + speechResult + '.';
    if((speechResult === phrase[0]) || (speechResult === phrase[1]) || (speechResult === phrase[2] || speechResult === phrase[3]) || (speechResult === phrase[4])) {
      console.log('성공');
      resultParaH.textContent = '전화연결성공';
      resultParaH.style.color = '#ffffff';
      // resultParaH.style.background = '#FBBC05';
      callNumber('${112}');

    } else {
      resultParaH.textContent = '인식실패';
      // resultParaH.style.background = 'red';
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = 'Start new test';
  }

  // recognition.onerror = function(event) {
  //   testBtn.disabled = false;
  //   testBtn.textContent = 'Start new test';
  //   diagnosticParaH.textContent = 'Error occurred in recognition: ' + event.error;
  // }

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
function callNumber(num){
  location.href = "tel:" + num;
}


testBtn.addEventListener('click', testSpeech);
