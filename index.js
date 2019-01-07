const chromaticTemplate = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const chromatic = [];
const whiteKeys = [];
const blackKeys = [];
const width = 400, height = 100;
let currentNotes = [];
let wave = 'triangle';
let currentChord = 0;
const scale = 16;
const noteFreq = [];
let currentChords = [];
const ctx = new AudioContext();
const gainNode = ctx.createGain();
const convolver = ctx.createConvolver();
let playing = false;
let overlap = false;
let reverb = false;
let reverse = false;
let reverbLevel = 2;
const ABCD = ['A', 'B', 'C', 'D'];

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
  noteFreq["C#3"] = 2217.461047814976769;
  noteFreq["D3"] = 2349.318143339260482;
  noteFreq["D#3"] = 2489.015869776647285;
  noteFreq["E3"] = 2637.020455302959437;
  noteFreq["F3"] = 2793.825851464031075;
  noteFreq["F#3"] = 2959.955381693075191;
  noteFreq["G3"] = 3135.963487853994352;
  noteFreq["G#3"] = 3322.437580639561108;
  noteFreq["A3"] = 3520.000000000000000;
  noteFreq["A#3"] = 3729.310092144719331;
  noteFreq["B3"] = 3951.066410048992894;
  noteFreq["C3"] = 4186.009044809578154;

const fillKeys = () => {
	let tempx = 50 - scale;
	for(i in chromatic){
			if( !chromatic[i].includes('#') ) {
				whiteKeys.push(whiteKey( chromatic[i],tempx));
				tempx += scale;
			}else {
				tempx -= scale / 4;
				blackKeys.push(blackKey( chromatic[i], tempx));
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
	convolver.buffer = impulseResponse(4,4,false);
	convolver.connect(ctx.destination);
	currentChords  = [
		createChord('A0', 'minor', [7, 9, 17]),
		createChord('F1', 'major', [8, 7, '-']),
		createChord('C0', '-5', [7, '-', 13]),
		createChord('B0', '--', ['-', 7 , 13]),
	];
	presets = [
		[
			createChord('C0', 'minor', [10, 12, 16]),
			createChord('A1', 'minor', [10, 12, 16]),
			createChord('D1', 'minor', [10, 12, 16]),
			createChord('G1', 'minor', [10, 12 , 16]),
		],
	]
}

	function draw() {
		background('#fbc1db');
		for(key of whiteKeys){key.show()}
		for(key of blackKeys){key.show()}
		if(!playing || overlap){
			if(!(currentChord === 0) && currentChord % 3 === 0) {
				currentChord = 0;
				currentNotes = currentChords[currentChord];
			}else{ currentChord++; }
				console.log(currentChords[currentChord], 'currentChord:', currentChord);
				currentNotes = currentChords[currentChord];
		 play(currentChords[currentChord], false);
		}
	}


const createMajorScale = tonic => {
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let tempIndex = chromatic.indexOf(tonic);
	const push = () => {
		if(chromatic[tempIndex] !== undefined){result.push(chromatic[tempIndex]);}
	}
	const wholeStep = () => {tempIndex += 2;}
	const halfStep = () => {tempIndex += 1;}
	const pushOctave = () => {
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
	}
	for(let i = 0; i < (chromatic.length - chromatic.indexOf(tonic)); i+=12){
		pushOctave();
	}
	console.log(result);
	return result;
}

const createMinorScale = tonic => {
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let tempIndex = chromatic.indexOf(tonic);
	const push = () => {
		if(chromatic[tempIndex] !== undefined){result.push(chromatic[tempIndex]);}
	}
	const wholeStep = () => {tempIndex += 2;}
	const halfStep = () => {tempIndex += 1;}
	const pushOctave = () => {
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
	}
	for(let i = 0; i < (chromatic.length - chromatic.indexOf(tonic)); i+=12){
		pushOctave();
	}
	console.log(result);
	console.log(chromatic.length - chromatic.indexOf(tonic));
	return result;
}

const createChord = (tonic, type, extensions) => {
	console.log(extensions);
	if(!chromatic.includes(tonic)){
		//TODO error handling
	}
	let result = [];
	let scale;
	if(type === 'major'){
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push(scale[2]);
		result.push(scale[4]);
	}else if (type === 'minor') {
		scale = createMinorScale(tonic);
		result.push(scale[0]);
		result.push(scale[2]);
		result.push(scale[4]);
	}else if (type === 'sus2'){
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push(scale[1]);
		result.push(scale[4]);
	}else if (type === 'sus4') {
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push(scale[3]);
		result.push(scale[4]);
	}else if (type === '-5') {
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push('-');
		result.push(scale[4]);
	}else if (type === '--') {
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push('-');
		result.push('-');
	}else {
		scale = createMajorScale(tonic);
		result.push(scale[0]);
		result.push(scale[2]);
		result.push(scale[4]);
	}
	console.log(result);
	for(extension of extensions) {
		if (extension === '-') { 
				result.push(extension);
				}else if(scale[extension - 1] !== undefined){
				console.log(extension);
				result.push(scale[extension - 1]);
			}
		}
	if(overlap){
	 play(result, true);
	}
	return result;
}

const blackKey = (note, startx) => {
	let f  = ctx.createOscillator();
	f.type = wave;
    f.frequency.value = noteFreq[note];
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
				rect(startx, height / 16 - 2, scale * (2/3), 32);
			}else {
				fill('#9966ff');
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 16 - 2, scale * (2/3), 32);
			}
		},
		start() {
			f = ctx.createOscillator();
			f.type = wave;
		    f.frequency.value = noteFreq[note];
		    f.start();
			if(reverb){
				convolver.connect(ctx.destination);
				f.connect(convolver);
			} else {
				convolver.disconnect();
				f.connect(ctx.destination);
			}
		},	
		stop() {
			f.stop();
			f.disconnect();
		} 
	}
}

const whiteKey = (note, startx) => {
	let f = ctx.createOscillator();
	f.type = wave;
    f.frequency.value = noteFreq[note];
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
				rect(startx, height / 16, scale, 48);
			}else {
				fill('#9966ff');
				stroke(0);
				strokeWeight(2);
				rect(startx, height / 16, scale, 48);
			}
		},
		start() {
			f = ctx.createOscillator();
			f.type = wave;
		    f.frequency.value = noteFreq[note];
		    f.start();
			if(reverb){
				convolver.connect(ctx.destination);
				f.connect(convolver);
			} else {
				convolver.disconnect();
				f.connect(ctx.destination);
			}
		},	
		stop() {
			f.stop();
			f.disconnect();
		} 
	}
}

const play = (chord, loop) => {
	playing = true;
	for(let i = 0; i < chord.length; i++) {
		setTimeout(() => {
			whiteKeys.forEach(key => key.stop());
			blackKeys.forEach(key => key.stop());
			//check if note corresponds to a white or black key
			if(chord[i].includes('-')){
				//do nothing
			}else if(!chord[i].includes('#')){
					whiteKeys.forEach(key => {
						if(key.note === chord[i]) {key.start();} 
					});
			}else {
					blackKeys.forEach(key => {
					 	if(key.note === chord[i]) {key.start();} 
				});
	
			}
		}, i * 200);
	}
	setTimeout(() => {
		if(loop){
		 play(chord, true);
		}else {
			playing = false;
		}
	}, chord.length * 200);
}


//for reverb
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

$(document).ready(function(){
	for(let k = 0; k < 4;k++){
		for(let j = 0; j < 3; j++){
			for(let i = 0;i < 24; i++){
				//$("#ext-"+j.toString()+ABCD[k]).append(new Option((i +1).toString(), i + 1));
			}
		}
	}

	$('.select').on("input change", function() { 
		let indexOfRoot = chromatic.indexOf($('#chord-1').val().concat('0'));
		let indexOfCurrent;
		for(let i = 0; i < 4;i++){
			indexOfCurrent = chromatic.indexOf($('#chord-'+(i+1).toString()).val().concat('0'));
			let extensions = [];
			for(let j = 0; j < 3;j++){
				let temp = $('#ext-'+(j).toString().concat(ABCD[i])).val();
				console.log(temp);
				if(temp !== undefined && temp !== 0) {
					if(temp === '-'){extensions.push('-')}else{
						extensions.push(parseInt(temp,10));
					}
				}
			}
			if(i === 0) {
			currentChords[i] =
				createChord($('#chord-'+(i+1).toString()).val()+'0',
				 $("#type-"+(i+1).toString()).val(), extensions);

			}else if(indexOfRoot >= indexOfCurrent) {
			currentChords[i] =
				createChord($('#chord-'+(i+1).toString()).val()+'1',
				$("#type-"+(i+1).toString()).val(), extensions);	
			}else{
				currentChords[i] =
				createChord($('#chord-'+(i+1).toString()).val()+'0',
				$("#type-"+(i+1).toString()).val(), extensions);
			}
		}
	});


	$('#reverb').on("input change", function() {
		//reverb = $('#reverb').val();
		switch($('#reverb').val()){
			case 'true':
				reverb = true;
			break;
			case 'false':
				reverb = false;
			break;
			default:
				//throw error or something

		}
		console.log($('#reverb').val());
	});

	$('#reverb-level').on("input change", function() { 
		var sampleRate = ctx.sampleRate;
    	var length = sampleRate * 2;
		reverbLevel = $('#reverb-level').val();
		convolver.buffer = 
			impulseResponse(reverbLevel,reverbLevel,reverse);
	});

	$('#reverb-reverse').on("input change", function() { 
		reverse = $('#reverb-reverse').val();
		convolver.buffer = 
			impulseResponse(reverbLevel,reverbLevel,reverse);
	});


	$('#soundType').on("input change", function() { 
		wave = $('#soundType').val();
	});

	$("#volume").on("input change", function() { 
		gainNode.gain.value = this.value; 
	});

	$("#octaveUp").on("click", function() { 
		for(n in chromatic){
			noteFreq[chromatic[n]] *= 2;
		}
	});
	$("#octaveDown").on("click", function() { 
		for(n in chromatic){
			noteFreq[chromatic[n]] /= 2;
		}
	});
});

