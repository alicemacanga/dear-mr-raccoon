// MESSAGE TO READER OF CODE:
// doesn't the plushie's nose look extra boop-able?


// positional var
let w; // width of screen
let h; // height of screen
let mX; //mouse X position
let mY; //mouse Y position

// game Logic
let gameState = 0;    // sets game state
let endState = false; // defines if game has ended

// Point n' Click

  // interactive variables
  let day = 1;        // counts days
  let badEnd = false; // determines if ending is bad
  let badEndRoll; // rolls for bad end after day 20
  let netEnd = false; // determines if ending is neutral
  let netEndAnimation = 0; // used to animate diary glow
  let pageHint = 0;   // will be used to make a hint to turn page, currently not implemented
  let hintOpCheck = false;  // same as above

  let coolDown = 0; // used to prevent spam-clicking

  // VFX
  let boardAnimation; // used to animate board sliding out in the begginning

  // raccoon display variable
  let raccoonIndex;   // used to display raccoon images

  // images
  let imageAsset = [];  // general image variable
  let letter = [];      // contains letter images
  let letterHeader = [];// contains letter header images
  let headerIndex = 0;  // used to select headers

function preload() {
  for (let i = 0; i < 18; i++) {
    imageAsset[i] = loadImage("assets/imageAsset_" + i + ".png");
  }
  for (let i = 0; i < 31; i++) {
    letter[i] = loadImage("assets/letter_" + i + ".png");
  }
  for (let i = 0; i < 6; i++) {
    letterHeader[i] = loadImage("assets/letterHeader_" + i + ".png");
  }
}

function setup() {
// canvas
  canvas = createCanvas(windowWidth*0.625, (windowWidth*0.8)*0.625); // dynamically sets canvas size based on window size
  canvas.parent("holder-canvas");

  frameRate(60);

// var define
  w = width;
  h = height;

  raccoonIndex = 4;

// settings
  imageMode(CENTER);
  angleMode(DEGREES);

// buttons
    //quit to main menu
  let button01 = createButton('Quit');
  button01.parent('holder-button01');
  button01.mousePressed(quit);
    //save progress and quit to main menu
  let button02 = createButton('Save & Quit');
  button02.parent('holder-button02');
  button02.mousePressed(saveQuit);

  console.log('day', day); // displays current day in console
}

function draw() {
// Meta Functions
  adjustCanvas()      // adjusts canvas size live based on window
  background(213,188,176); 
  gameMechanics();    // contains general game mechanics


  // positional var define
    w = width;
    h = height;
    mX = mouseX;
    mY = mouseY;

// Game State Changes

  if(gameState === 0){              // "Menu" Mode
    menu();
  } else if(gameState === 1){       // "Point n' Click Adventure" Mode
    pointAndClick();
    endScreens();                   // displays end screens
  } else if(gameState === 3){       // "Credits" Mode
    credits();
  }
}

function mousePressed() {

// "Menu" Mode
if(gameState === 0){
  if(mX > w*0.4 && mX < w*0.6 && mY > h*0.565 && mY < h*0.635){ // start button function
    gameState = 1;
  }
  if(mX > w*0.4 && mX < w*0.6 && mY > h*0.705 && mY < h*0.775){ // credits button function
    gameState = 3;
  }
}

// "Point n' Click Adventure" Mode

if(gameState === 1){

// Bad Ending 
  if(day > 20 && day < 30 && netEnd === false){   // every click post day 20, 1 in 3 chance of bad ending
    badEndRoll = int(random(1,3))
  }


  if(badEnd === true){
    if(raccoonIndex === 9){   // if bad ending scene already displayed, end game
      endState = true;
    }
    raccoonIndex = 9;         // calls on bad ending scene
  }else {
// if raccoon nose is booped, guarantee neutral ending    
    if(mX > w*0.31 && mY > h*0.32 && mX < w*0.36 && mY < ((h*0.32)+(w*0.05))){
      netEnd = true;
    }

// flipping diary progresses days
    if(mX > w*0.87 && mX < w*0.99 && mY > h*0.5 && mY < h*0.64 && (frameCount - coolDown) > 10){
      day = day +1;
      console.log('pageUp', day);
      coolDown = frameCount;  // anti-spam mechanic
    }

// display appropriate raccoon image on appropriate day
    if(day <= 3){
        console.log('01');
        raccoonIndex = 4
      } else if(day > 3 && day < 8){
        console.log('02.1');
        raccoonIndex = 5
      } else if(day > 7 && day < 11){
        console.log('02.2')
        raccoonIndex = 11;
      } else if(day > 10 && day < 21){
        console.log('03');
        raccoonIndex = 6
      } else if(day > 20 && day < 30){
        console.log('04');
        raccoonIndex = 7
      } else if(day === 30){
        console.log('05');
        raccoonIndex = 8
      } else if(day > 30){
        netEnd = true;
        endState = true;
        day = 30;
      }
  }
}
  
}

function gameMechanics() {
  if(badEndRoll === 1){ // if bad end is rolled, guarantee bad ending
    badEnd = true;
  }
}

function endScreens() { // display appropreate end screen
  if(endState === true){
    if(badEnd === true){
      image(imageAsset[16],w*0.5,h*0.5,w*1,h*1);
    } else if(netEnd === true){
      image(imageAsset[14],w*0.5,h*0.5,w*1,h*1);
    }
  }

}

function menu(){ // contains menu items
  boardAnimation = w*1;

  push();
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    translate(w*0.5,h*0.5)
    push();
      textSize(w*0.07)
      text('Dear Mr.Raccoon', w*0,-h*0.2,w*0.6) // title
    pop();
    push();
      translate(w*0,h*0.1);
      rect(w*0,h*0,w*0.2,w*0.07,w*0.03) // Play button
      textSize(w*0.04)
      text('Play', w*0,h*0,w*0.5)
    pop();
    push();
      translate(w*0,h*0.24);
      rect(w*0,h*0,w*0.2,w*0.07,w*0.03) // credits button
      textSize(w*0.04)
      text('Credits', w*0,h*0,w*0.5)
    pop();
  pop();
}

function credits(){ // displays credits
  push();
    image(imageAsset[17],w*0.5,h*0.5,w*1,h*1);
  pop();
}

function pointAndClick() { // contains main game-mode items

  boardAnimation = lerp(boardAnimation,0,w*0.00009) // animate board entry

  push();
    image(imageAsset[10],w*0.5,h*0.5,w*1,h*1); // backdrop
    push();
      translate(boardAnimation,0);
      drawingBoard(); 
    pop();
    if(raccoonIndex === 9){
      image(imageAsset[15],w*0.5,h*0.5,w*1,h*1);  // if bad end, show bad end scene
    }  
  pop();
}

function drawingBoard() { // contains items attached to board
  board();    // main board
  raccoon();  // raccoon images
  diary();    // diary/note pad
}

function board() { // contains board
  push();
    translate(w*0.84,h*0.5);
    scale(0.5)
    image(imageAsset[1],w*0,h*0,w*1.67,w*1.67);
  pop();
}


function raccoon() {  // contains raccoon images
  push();
    translate(w*0.66,h*0.76);
    scale(0.77)
    rotate(-10);
    image(imageAsset[3],w*0,h*0,w*0.5,w*0.5)  // paper backdrop
    image(imageAsset[raccoonIndex],w*0,h*0,w*0.5,w*0.5) // display raccooon sketches
  pop();
}

// Display Diary Asset
function diary() {

// display appropriate header on appropriate day
  if(day < 20) {
    headerIndex = 0;
  } else if(day === 20){
    console.log(20)
    headerIndex = 1;
  } else if(day === 21){
    headerIndex = 5;
  } else if(day > 21 && day < 28){
    headerIndex = 2;
  } else if(day === 28){
    headerIndex = 0;
  } else if(day === 29){
    headerIndex = 3;
  } else if(day === 30){
    headerIndex = 4;
  }
  
  push();
    translate(w*0.8,h*0.31);
    scale(1.1)
    image(imageAsset[2],w*0,h*0,w*0.5,w*0.5);         // Diary Block
    if(netEnd === true){
      push()
        netEndAnimation = lerp(netEndAnimation,255,0.2) // fade in
        tint(255,netEndAnimation)
        image(imageAsset[12],w*0,h*0,w*0.5,w*0.5); // neutral ending guarantee - golden note pad
      pop()
    }
    image(letterHeader[headerIndex],w*0,h*0,w*0.5,w*0.5)        // Letter headers
    image(letter[day],w*0,h*0,w*0.5,w*0.5)            // Letter contents
  pop();
}


// Meta Functions

function quit() { // quits game without saving
  gameState = 0;
  day = 1;
  badEndRoll = 2;
  badEnd = false;
  netEnd = false;
  netEndAnimation = 0;
  endState = false;
}

function saveQuit() { // saves progress, returns to menu
  gameState = 0;
}

function adjustCanvas() { // dynamically adjusts canvas size based on window size
  resizeCanvas(windowWidth*0.625, (windowWidth*0.8)*0.625);
}