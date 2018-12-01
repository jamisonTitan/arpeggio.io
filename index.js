const chromaticTemplate = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const chromatic = [];
const whiteKeys = [];
const blackKeys = [];
const width = 400, height = 500;
let currentNotes = [];
let wave = 'triangle';
const scale = 16;
const noteFreq = [];
const ctx = new AudioContext();
const gainNode = ctx.createGain();
const convolver = ctx.createConvolver();
let playing = false;
let overlap = false;
let reverb = true;

  noteFreq["C0"] = 261.625565300598634;
  noteFreq["C#0"] = 277.182630976872096;
  noteFreq["D0"] = 293.664767917407560;
  noteFreq["D#0"] = 311.126983722080910;
  noteFreq["E0"] = 329.627556912869929;
  noteFreq["F0"] = 349.228231433003884;
  noteFreq["F#0"] = 369.994422711634398;
  noteFreq["G0"] = 391.995435981749294;
  noteFreq["G#0"] = 415.304697579945138;
  noteFreq["A0"] = 440.000000000000000;
  noteFreq["A#0"] = 466.163761518089916;
  noteFreq["B0"] = 493.883301256124111;
  noteFreq["C1"] = 523.251130601197269;
  noteFreq["C#1"] = 554.365261953744192;
  noteFreq["D1"] = 587.329535834815120;
  noteFreq["D#1"] = 622.253967444161821;
  noteFreq["E1"] = 659.255113825739859;
  noteFreq["F1"] = 698.456462866007768;
  noteFreq["F#1"] = 739.988845423268797;
  noteFreq["G1"] = 783.990871963498588;
  noteFreq["G#1"] = 830.609395159890277;
  noteFreq["A1"] = 880.000000000000000;
  noteFreq["A#1"] = 932.327523036179832;
  noteFreq["B1"] = 987.766602512248223;
  noteFreq["C2"] = 1046.502261202394538;
  noteFreq["C#2"] = 1108.730523907488384;
  noteFreq["D2"] = 1174.659071669630241;
  noteFreq["D#2"] = 1244.507934888323642;
  noteFreq["E2"] = 1318.510227651479718;
  noteFreq["F2"] = 1396.912925732015537;
  noteFreq["F#2"] = 1479.977690846537595;
  noteFreq["G2"] = 1567.981743926997176;
  noteFreq["G#2"] = 1661.218790319780554;
  noteFreq["A2"] = 1760.000000000000000;
  noteFreq["A#2"] = 1864.655046072359665;
  noteFreq["B2"] = 1975.533205024496447;
  noteFreq["C3"] = 2093.004522404789077;

function impulseResponse( duration, decay, reverse ) {
    var sampleRate = ctx.sampleRate;
    var length = sampleRate * duration;
    var impulse = ctx.createBuffer(2, length, sampleRate);
    var impulseL = impulse.getChannelData(0);
    var impulseR = impulse.getChannelData(1);

    if (!decay)
        decay = 2.0;
    for (var i = 0; i < length; i++){
      var n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    return impulse;
}

convolver.buffer = impulseResponse(4,4,false);

const fillKeys = () => {
	let tempx = 50 - scale;
	let freq;
	for(let i = 0; i < chromatic.length; i++){
			freq = noteFreq[chromatic[i]]
			if( !chromatic[i].includes('#') ) {
				whiteKeys.push(whiteKey( chromatic[i], freq, tempx));
				tempx += scale;
			}else {
				tempx -= scale / 4;
				blackKeys.push(blackKey( chromatic[i], freq, tempx));
				tempx += scale / 4;
			}
	}
}

function setup() {
	let note = 0;
	let octave = -1;
	for( let i = 0; i < 37; i++ ){
		if(i % 12 === 0) {octave++; note = 0;} else {note++;}
		chromatic.push(chromaticTemplate[note].concat(octave.toString()));
	}
	let canvas = createCanvas(width, height);
	canvas.parent('canvas-holder');
	fillKeys();
}

function draw() {
	background(100,100,200);
	for(key of whiteKeys){key.show()}
	for(key of blackKeys){key.show()}
	if(!playing){arpeggiate(currentNotes, false)}
	wave = $('#soundType').val();
	console.log(wave);
}

const createMajorScale = tonic => {
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let tempIndex = chromatic.indexOf(tonic);
	const push = () => {result.push(chromatic[tempIndex]);}
	const wholeStep = () => {tempIndex += 2;}
	const halfStep = () => {tempIndex += 1;}
	push() //tonic
	wholeStep();
	push() //second
	wholeStep();
	push() //major third
	halfStep();
	push(); //perfect fourth
	wholeStep();
	push(); //perfect fifth
	wholeStep(); 
	push(); //major sixth
	wholeStep();
	push(); //major seventh
	halfStep();
	push() //tonic
	wholeStep();
	push() //second
	wholeStep();
	push() //major third
	halfStep();
	push(); //perfect fourth
	wholeStep();
	push(); //perfect fifth
	wholeStep(); 
	push(); //major sixth
	wholeStep();
	push(); //major seventh
	return result;
}

const createMinorScale = tonic => {
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let tempIndex = chromatic.indexOf(tonic);
	const push = () => {result.push(chromatic[tempIndex]);}
	const wholeStep = () => {tempIndex += 2;}
	const halfStep = () => {tempIndex += 1;}
	push() //tonic
	wholeStep();
	push() //second
	halfStep();
	push() //minor third
	wholeStep();
	push(); //perfect fourth
	wholeStep();
	push(); //perfect fifth
	halfStep(); 
	push(); //minor sixth
	wholeStep();
	push(); //minor seventh
	wholeStep();
	push() //tonic
	wholeStep();
	push() //second
	halfStep();
	push() //minor third
	wholeStep();
	push(); //perfect fourth
	wholeStep();
	push(); //perfect fifth
	halfStep(); 
	push(); //minor sixth
	wholeStep();
	push(); //minor seventh
	return result;
}

const arpeggiate = (chord, loop) => {
	playing = true;
	whiteKeys.forEach(key => key.stop());
	blackKeys.forEach(key => key.stop());
	for(let i = 0; i < chord.length; i++) {
		setTimeout(() => {

			if(i === chord.length+1 || !chord[i].includes('#')){
				if(i!== 0) {
						whiteKeys.forEach(k => {
						if(k.note === chord[i - 1]) {k.stop()} 
					});
				}
				if(i !== chord.length + 1) {
						whiteKeys.forEach(k => {
						//console.log(k.note);
						if(k.note === chord[i]) {k.start()} 
					});
				}
			}else{
					if(i!== 0) {
						blackKeys.forEach(k => {
						if(k.note === chord[i - 1]) {k.stop()} 
					});
				}
				if(i !== chord.length + 1) {
						blackKeys.forEach(k => {
						//console.log(k.note);
						if(k.note === chord[i]) {k.start()} 
					});
				}
			}
		}, i * 200)
	}
		setTimeout(() => {
			if(loop){
				arpeggiate(chord, true);
			}else {
				playing = false;
			}
		}, chord.length * 200)
	
}


const createChord = (tonic, type, extensions) => {
	console.log(extensions);
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let scale;
	if(type === 'major'){
		scale = createMajorScale(tonic.toUpperCase().concat('0'));
	}else if (type === 'minor') {
		scale = createMinorScale(tonic.toUpperCase().concat('0'));
	}else {
		scale = createMajorScale(tonic.toUpperCase().concat('0'));
	}
	console.log(scale);
	result.push(scale[0]);
	result.push(scale[2]);
	result.push(scale[4]);
	if(extensions){
	extensions.forEach(extension => {
			result.push(scale[extension - 1]);
		});
	}
	if(overlap){
		arpeggiate(result, true);
	}
	return result;
}

const blackKey = (note_, freq, startx) => {
	let note = note_;
	let f = ctx.createOscillator();
	f.type = wave;
    f.frequency.value = freq;
	f.start();
	return {
		get note() {
			return note;
		},
		show() {
			if(!currentNotes.includes(note)) {
				fill(0);
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 2 - 2, scale * (2/3), 32);
			}else {
				fill(200,100,100);
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 2 - 2, scale * (2/3), 32);
			}
		},
		start() {
			f.type = wave;
			if(reverb){
				f.connect(gainNode).connect(convolver).connect(ctx.destination);
			}else {
				f.connect(gainNode).connect(ctx.destination);
			}
		},	
		stop() {
			f.disconnect();
		}	
	}
}

const whiteKey = (note_, freq, startx) => {
	let note = note_;
	let f = ctx.createOscillator();
	f.type = wave;
    f.frequency.value = freq;
	f.start();
	return {
		get note() {
			return note;
		},
		show() {
			if(!currentNotes.includes(note)) {
				fill(255);
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 2, scale, 48);
			}else {
				fill(200,100,100);
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 2, scale, 48);
			}
		},
		start() {
			f.type = wave;
			if(reverb){
				f.connect(gainNode).connect(convolver).connect(ctx.destination);
			} else {
				f.connect(gainNode).connect(ctx.destination);
			}
		},	
		stop() {
			f.disconnect();
		}		
	}
}

$(document).ready(function(){
		$("#volume").on("input change", function() { 
			gainNode.gain.value = this.value; 
		});

	$('#btn').on('click', function() {
		let  str = $('#in').val();
		console.log(str);
		str = str.split(' ');
		console.log(str);
		switch(str.length) {
			case 1:
				currentNotes = createChord(str[0].toUpperCase(), 'major');
			break;
			case 2:
				currentNotes = createChord(str[0].toUpperCase(), str[1].toLowerCase());
			break;
			default:
				let ext = str.splice(2, str.length - 2).map(ext => parseInt(ext, 10));
				console.log(ext);
				currentNotes = 
					createChord(str[0].toUpperCase(), str[1].toLowerCase(), ext);
			break;
		}
		console.log(currentNotes);
	});
});

