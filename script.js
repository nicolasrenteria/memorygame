//this file is created for logic behind the game
//Global const
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

//Global Vars
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

function startGame() {
  //init game vars
  progress = 0;
  gamePlaying = true;
  pattern = [];
  document.getElementById("startbutton").classList.add("hidden");
  document.getElementById("stopbutton").classList.remove("hidden");
  genPattern(pattern);
  playClueSequence();
};

function stopGame() {
  //ends game
  gamePlaying = false;
  document.getElementById("startbutton").classList.remove("hidden");
  document.getElementById("stopbutton").classList.add("hidden");
};

//generates a random pattern
let genPattern = list => {
  for(let i = 0; i < 8; i++){
    list.push(Math.floor(Math.random() * Math.floor(4)) + 1)
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 446.2
};

//Page Initialization
// Init Sound Synthesizer
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

let playTone = (btn, len) => {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
};

let startTone = btn => {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
};

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
};



let lightButton = btn => {
  document.getElementById("button" + btn).classList.add("lit");
};
let clearButton = btn => {
  document.getElementById("button" + btn).classList.remove("lit");
};

let playSingleClue = btn => {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
};

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
};

function loseGame() {
  stopGame();
  alert("Game Over. You lost. Try again friend");
};

function winGame() {
  stopGame();
  alert("Game Over. You won! Here's a cookie");
  
};

function showImage(src, width, height, alt) {
  var img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;
  
 
}

let guess = btn => {
  console.log("user guessed:" + btn);

  if (!gamePlaying) {
    return;
  }
 
  if (btn === pattern[guessCounter]) {
    //Correct Guess
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        //pattern complete player wins
        winGame();
      } else {
        //correct guess next clue
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    //lose game
    loseGame();
  }
};
