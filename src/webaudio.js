var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioBuffer;
var sourceNode;

// load sound
const setupAudioNodes = () => {
  console.log('setup');
  // create a buffer source node
  sourceNode = audioCtx.createBufferSource();
  // and connect to destination
  sourceNode.connect(audioCtx.destination);
}

const loadSound = (url) => {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // when loaded decode the data
  request.onload =  () => {
    console.log('request onload');
    // decode the data
    audioCtx.decodeAudioData(request.response, (buffer) => {
      // when the audio is decoded play the sound
      // playSound(buffer);
      audioBuffer = buffer;
      console.log(audioBuffer);
      playSound(buffer);
    }, onError);
  }

  request.send();
}

// log if an error occurs
const onError = (e) => {
    console.log(e);
}

const playSound = (buffer) => {
  sourceNode.buffer = buffer;
  sourceNode.start(0);
}

setupAudioNodes();
loadSound('./media/DawnOnSunset.mp3');