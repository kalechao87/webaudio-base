import './scss/audio.scss';
/**
 * https://segmentfault.com/a/1190000005715615
 * audio node有入口和出口，多个节点构成类似链表一样的结构。从一个货多个音源出发，经过一个或者
 * 多个处理节点，最终处处到输出节点，也可以不指定输出节点，如把音频数据用图表形式展示
 * 1. 创建AudioContext对象
 * 2. 在AudioContext对象内设置音源，例如<audio>标签，震动发生器，音频流
 * 3. 创建effect node(效果节点).例如reverb, biquad filter, panner, compressor(音频特效)
 * 4. 选择音频的最终输出节点，如扬声器
 * 5. 音频经过效果节点处理后，然后输出到下一个节点，这些节点连接起来
 *
 */
console.log('webaudio2');
// 创建AudioContext对象
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
console.log(audioCtx);

/**
 *
 * 创建AudioSource
 * 1. 使用震动发生器与javascript创建音源：使用AudioContext.createOscillator这个方法创建OscillatorNode，之后就可以利用震动发生器做音源了
 * 2. 使用原始的PCM数据：如果是可以识别的特定格式如mp3，使用AudioContext特定decode方法，
 * 获取PCM数据，参照AudioContext.createBuffer()、AudioContext.createBufferSource()、
 * AudioContext.decodeAudioData()
 * 3. 使用<video><audio>等HTML元素：参照AudioContext.createMediaElementSource()
 * 4. 从WebRTC MediaStream输入音频源：使用麦克风或Web摄像头。参照AudioContext.createMediaStreamSource()
 */


/**
 * connect oscillator to gain node to speakers
 * 简单把震动发生器作为音源，使用gain节点控制音量
 * 将oscillator连接到gainNode,gainNode的输出连接到标准输出上
 *
 */
/* oscillator comment start
let oscillator = audioCtx.createOscillator();
let gainNode = audioCtx.createGain();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

// create initial frequency and volumn values
let WIDTH = innerWidth;
let HEIGHT = window.innerHeight;

const maxFreq = 6000;
const maxVol = 0.02;
const initialFreq = 3000;
const initialVol = 0.001;

// set options for the oscillator
oscillator.type = 'sine'; // sine wave
oscillator.frequency.value = initialFreq; // value in hertz
oscillator.detune.value = 100; // value in cents
oscillator.start(0);
oscillator.onended = () => {
  console.log('Your tone has now stopped playing!');
}

gainNode.gain.value = initialVol;

// Mouse pointer coordinates
let CurX;
let CurY;

// Get new mouse pointer coordinates when mouse is moved
// then set new gain and pitch values
document.onmousemove = updatePage;

function updatePage(event) {
  // event = event || window.event;
  keyFlag = false;
  CurX = (window.event) ? event.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  CurY = (window.Event) ? event.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  console.log(CurX + ', ' + CurY);

  oscillator.frequency.value = CurX / WIDTH * maxFreq;
  gainNode.gain.value = CurY / HEIGHT * maxVol;
}
oscillator comment end*/

// preload MP3 over XHR
/**Hoist the buffer source to the top */
let sound;
/**Create a script processor node with a `bufferSize` of 1024 */
let processor = audioCtx.createScriptProcessor(1024);
/**Create an analyser node */
let analyser = audioCtx.createAnalyser();
/**Wire the processor into our audio context */
processor.connect(audioCtx.destination);
/**Wire the analyser into the processor */
analyser.connect(processor);

/**Define a Uint8Array to receive the analysers data */
let data = new Uint8Array(analyser.frequencyBinCount);
/**Create new XHR object */
let xhr = new XMLHttpRequest();
/**Open a GET request connection to the .mp3 */
xhr.open("GET", "./media/play.mp3", true);
/**Set the XHR responseType to arraybuffer */
xhr.responseType = 'arraybuffer';
xhr.onload = () => {
  /**The files arrayBuffer is available at xhr.response */
  sound = audioCtx.createBufferSource();

  audioCtx.decodeAudioData(xhr.response, buffer => {
    /**Set the buffer to our decoded AudioBuffer */
    sound.buffer = buffer;

    sound.connect(analyser);
    /**Wire the AudioBufferSourceNode into AudioContext */
    sound.connect(audioCtx.destination);
    
    processor.onaudioprocess = () => {
      /**Populate the data array with the frequency data */
      // data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(data);
      // analyser.getByteTimeDomainData(data);
      /**Populate the dataarray with the waveform data */
      // analyser.getByteFrequencyData(data);
      // console.log(data);
    }
    sound.start(0);
    render();
    
  }, onError);
}
xhr.send();
// log if an error occurs
const onError = (e) => {
    console.log(e);
}


/**
 *
 * Visual component
 *
 */
/**Start of visual component, let's define define some constants */
const NUM_OF_SLICES = 300;
/**The ``STEP const allows us to step through all the data we receive,
 * instead of just the first `NUM_OF_SLICES` elements in the array
*/
const STEP = Math.floor(data.length / NUM_OF_SLICES);
console.log(STEP);
/**When the anlyser receives no data, all values in the array will be 128 */
const NO_SIGNAL = 128;

/**Get the element we want to slice */
// let logo = document.querySelector('.logo-container');
let logo = document.querySelector(".logo-container");
console.log(logo);

/**we need to store our slices to interact with them later. */
let slices = [];
let rect = logo.getBoundingClientRect();
console.log(rect);
let width = 300;
let height = 300;
let widthPerSlice = width / NUM_OF_SLICES;
console.log(width);
console.log(widthPerSlice);

/**Create a container `<div>` to hold our 'slices' */
let container = document.createElement('div');
container.className = 'container';
container.style.width = width + 'px';
container.style.height = height + 'px';

/**Create 'slices' */
for (var i = 0; i < NUM_OF_SLICES; i++) {
  /**Calulate the `offset` for each individual 'slice' */
  let offset = i * widthPerSlice;
  // console.log(offset);

  /**Create a mask `div` for this 'slice' */
  let mask = document.createElement("div");
  mask.className = "mask";
  mask.style.width = widthPerSlice + "px";
  /* For the best performance, and to prevent artefacting when we
  * use `scale` we instead use a 2d `matrix` that is in the form:
  * matrix(scaleX, 0, 0, scaleY, translateX, translateY). We initially
  * translate by the `offset` on the x-axis. */
  mask.style.transform = 'matrix(1, 0, 0, 1, '+ offset +'0)';

  /**Clone the original element. */
  let clone = logo.cloneNode(true);
  clone.className = 'clone';
  clone.style.width = width + 'px';
  /**We won't be changing this tansform so we don't need to use a matrix */
  clone.style.transform = 'translate3d(' + -offset + 'px, 0, 0)';
  clone.style.height = mask.style.height = height + 'px';

  mask.appendChild(clone);
  container.appendChild(mask);
  /** We need to maintain the `offset` for when we
   * alter the transform in `requestAnimationFrame`
   */
  slices.push({offset: offset, elem: mask});
  // console.log(slices);
}

/**Replace the original element with our new container of 'slices'. */
document.body.replaceChild(container, logo);

/* Create our `render` function to be called every available frame. */
function render() {
/* Request a `render` on the next available frame.
  * No need to polyfill because we are in Chrome. */
  requestAnimationFrame(render);

  /* Loop through our 'slices' and use the STEP(n) data from the
    * analysers data. */
  for (var i = 0, n = 0; i < NUM_OF_SLICES; i++, n+=STEP) {
    var slice = slices[i],
      elem = slice.elem,
      offset = slice.offset;

    /* Make sure the val is positive and divide it by `NO_SIGNAL`
      * to get a value suitable for use on the Y scale. */
    var val = Math.abs(data[n]) / NO_SIGNAL;
    /* Change the scaleY value of our 'slice', while keeping it's
      * original offset on the x-axis. */
    elem.style.transform = 'matrix(1,0,0,' + val + ',' + offset + ',0)';
    elem.style.opacity = val;
  }
}

