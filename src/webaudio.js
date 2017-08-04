var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var audioBuffer;
var sourceNode;
var sourceFilter;


// load sound
const setupAudioNodes = () => {
  console.log('setup');
  document.body.append('setup');
  // create a buffer source node
  sourceNode = audioCtx.createBufferSource();
  // sourceNode = audioCtx.createOscillator();
  // sourceNode.type = 0;
  // sourceFilter = audioCtx.createBiquadFilter();
  // sourceNode.connect(sourceFilter);
  // sourceFilter.type = 'lowpass';
  // sourceFilter.frequency.value = 440;
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
    document.body.append("request onload");
    // decode the data
    audioCtx.decodeAudioData(request.response, (buffer) => {
      // when the audio is decoded play the sound
      // playSound(buffer);
      audioBuffer = buffer;
      console.log(audioBuffer);
      playSound(buffer);
      document.body.append("decode");
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
  // sourceNode.noteOn(0);
  sourceNode.start(0);
  document.body.append("play");
}

setupAudioNodes();
loadSound('./media/play.mp3');

window.addEventListener('touchstart', () => {
  alert('touchstart');
  // create new buffer source for playback with an already
  // loaded and decoded empty sound file
  let buffer = audioCtx.createBuffer(1, 1, 22050);
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;

  // connect to output (your speakers)
  source.connect(audioCtx.destination);

  // play the file
  source.start(0);
}, false);

let isUnlocked = false;
const unlock = () => {
  if (isIOS || this.unlocked) return;

  // create empty buffer and play it
  let buffer = audioCtx.createBuffer(1, 1, 22050);
  let source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);

  // by checking the play state after some time, we know if we're really unlocked
  setTimeout(() => {
    if((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
      isUnlocked = true;
    }
  }, 0);
}