var leftEarFrequencies = [200];
var rightEarFrequencies = [204,207];
var gainFactor = 0.15;
var freqTwiddle = 1.0;


var oscSourcesLeft = [];
var oscSourcesRight = [];

var audioContext;

var shepardRissetMinFreq = 150;
var shepardRissetOctaves = 3;
var shepardRissetRate = 1; // octaves per second

var shepardRissetLogFreqs = []; // logarithms of the frequencies

function beginBinaural(){
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();

	var panNodeLeft = audioContext.createStereoPanner();
	panNodeLeft.pan.setValueAtTime(-1, audioContext.currentTime);
	var panNodeRight = audioContext.createStereoPanner();
	panNodeRight.pan.setValueAtTime(1, audioContext.currentTime);
	panNodeLeft.connect(audioContext.destination);
	panNodeRight.connect(audioContext.destination);


	var gainNodeLeft = audioContext.createGain();
	gainNodeLeft.gain.setValueAtTime(gainFactor, audioContext.currentTime);
	gainNodeLeft.connect(panNodeLeft);
	var gainNodeRight = audioContext.createGain();
	gainNodeRight.gain.setValueAtTime(gainFactor, audioContext.currentTime);
	gainNodeRight.connect(panNodeRight);

	for(let i=0;i<leftEarFrequencies.length;i++){
		let oscillator = audioContext.createOscillator();
		oscillator.type='sine';
		oscillator.frequency.setValueAtTime(leftEarFrequencies[i], audioContext.currentTime);
		oscillator.connect(gainNodeLeft);
		oscSourcesLeft.push(oscillator);
	}

	for(let i=0;i<rightEarFrequencies.length;i++){
		let oscillator = audioContext.createOscillator();
		oscillator.type='sine';
		oscillator.frequency.setValueAtTime(rightEarFrequencies[i], audioContext.currentTime);
		oscillator.connect(gainNodeRight);
		oscSourcesRight.push(oscillator);
	}

	
	for(let i=0;i<oscSourcesLeft.length;i++){
		oscSourcesLeft[i].start();
	}
	for(let i=0;i<oscSourcesRight.length;i++){
		oscSourcesRight[i].start();
	}
}

function twiddleBinaural(){
	for(let i=0;i<oscSourcesLeft.length;i++){
		let offset = Math.random()*freqTwiddle*2-freqTwiddle;
		oscSourcesLeft[i].frequency.setValueAtTime(leftEarFrequencies[i] + offset, audioContext.currentTime);
	}
	for(let i=0;i<oscSourcesRight.length;i++){
		let offset = Math.random()*freqTwiddle*2-freqTwiddle;
		oscSourcesRight[i].frequency.setValueAtTime(rightEarFrequencies[i] + offset, audioContext.currentTime);
	}
}
