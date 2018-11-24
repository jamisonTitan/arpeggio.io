const chromatic = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
for(note in chromatic){chromatic.push(chromatic[note])}//make chromatic loop
const whiteKeys = [];
const blackKeys = [];
const width = 800, height = 500;
let currentNotes = [];
const scale = 12;

function setup() {
	let canvas = createCanvas(width, height);
	canvas.parent('canvas-holder');
	fillKeys();
	currentNotes = createMajorScale('A');
}

function draw() {
	background(100,100,200);
	for(key of whiteKeys){key.show()}
	for(key of blackKeys){key.show()}
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
		scale = createMajorScale(tonic.toUpperCase());
	}else if (type === 'minor') {
		scale = createMinorScale(tonic.toUpperCase());
	}else {
		scale = createMajorScale(tonic.toUpperCase());
	}
	for(note in scale){scale.push(scale[note])}//make scale loop
	console.log(scale);
	result.push(scale[0] + '4');
	result.push(scale[2] + '4');
	result.push(scale[4] + '4');
	if(extensions){
	extensions.forEach(extension => {
			console.log(extension);
			if(extension < 8){
				result.push(scale[extension - 1] + '4');
			}else {
				result.push(scale[extension - 1] + '5');
			}
		});
	}
	return result;
}

const blackKey = (note_, startx, highlightable) => {
	let note = note_;
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
		}	
	}
}

const whiteKey = (note, startx) => {
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
		}	
	}
}

const fillKeys = () => {
	let tempx = 50 - scale;
	for(let i = 0; i < 7; i++){
		for(let j = 0; j < 12; j++) {
			if( !chromatic[j].includes('#') ) {
				whiteKeys.push(whiteKey( chromatic[j] + (i).toString(), tempx));
				tempx += scale;
			}else {
				tempx -= scale / 4;
				blackKeys.push(blackKey( chromatic[j] + (i).toString(), tempx));
				tempx += scale / 4;
			}
		}
	}
}

$(document).ready(function(){
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

