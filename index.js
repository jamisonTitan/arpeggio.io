const chromatic = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
for(note in chromatic){chromatic.push(chromatic[note])} //mkae chromatic loop
const whiteKeys = [];
const blackKeys = [];
const width = 800, height = 500;
let curentNotes = [];
const scale = 12;


const blackKey = (note, startx) => {
	return {
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
	let tempx = 50;
	for(let i = 0; i < 7; i++){
		for(let i = 0; i < 12; i++) {
			if( !chromatic[i].includes('#') ) {
				whiteKeys.push(whiteKey( chromatic[i], tempx ));
				tempx += scale;
			}else {
				//TODO sharps
				tempx -= scale / 4;
				blackKeys.push(blackKey( chromatic[i], tempx ));
				tempx += scale / 4;
			}
		}
	}
}

function setup() {
	let canvas = createCanvas(width, height);
	canvas.parent('canvas-holder');
	fillKeys();
	currentNotes = createMajorScale('A');
}

function draw() {
	background(100,100,200, 0.5);
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
	push(); //major seventh
	return result;
}
//uncomment later
//console.log(chromatic.map(note => createMajorScale(note)));