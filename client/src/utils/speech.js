import { toast } from "react-toastify";

function textToSpeech(text, setIsAISpeaking) {
  if (!text) {
    return;
  }
  const speechSynthesis = window.speechSynthesis;
  speechSynthesis.cancel();

  if (!speechSynthesis) {
    toast("Brower not supporting speech");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onstart = () => {
    setIsAISpeaking(true);
  };
  utterance.onend = () => {
    setIsAISpeaking(false);
  };
  speechSynthesis.speak(utterance);
}

let recognition = null;
function startListening(onTranscript) {
  const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    toast("Browser does not support speech recognition");
    return;
  }

  recognition = new SpeechRecognitionAPI();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = (data) => {
    let transcript = "";
    for (let i = 0; i < data.results.length; i++) {
      transcript += data.results[i][0].transcript;
    }
    onTranscript(transcript);
    console.log(transcript, " text that spoke");
  };
  console.log("started listening");
  recognition.start();
}

function stopListening() {
  if (!recognition) {
    return;
  }
  recognition.stop();
  console.log("stoped lisetning");
}

export { textToSpeech, startListening, stopListening };
