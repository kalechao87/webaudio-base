
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
