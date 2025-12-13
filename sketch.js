/* -------------------------------------------------------------------------- */
/*                                  VARIABLES                                 */
/* -------------------------------------------------------------------------- */



/* -------------------------- positional variables -------------------------- */

let w; // width of screen
let h; // height of screen
let mX; //mouse X position
let mY; //mouse Y position

/* ------------------------------- game logic variables ------------------------------- */

  let gameState = 0;    // sets game state
  let endState = false; // defines if game has ended

  let coolDown = 0; // used to prevent spam-clicking

  let paused = false;
  let showPointer = true;

/* ----------------------------- Point n' Click variables----------------------------- */

// general
  let day = 1;        // counts days

// endings

  // bad ending
    let badEndRoll; // rolls for bad end after day 20
    let badEnd = false; // determines if ending is bad

  // neutral ending
    let netEnd = false; // determines if ending is neutral

// animations

  let boardAnimation; // used to animate board sliding out in the begginning

  let netEndAnimation = 0; // used to animate diary glow

  let pageHint = 0;   // will be used to make a hint to turn page, currently not implemented
  let hintOpCheck = false;  // same as above

// raccoon visuals

  let raccoonIndex;   // used to display raccoon images

/* -------------------------- screen shot variables ------------------------- */

  let prepSS = true;

/* -------------------------------------------------------------------------- */
/*                                   PRELOAD                                  */
/* -------------------------------------------------------------------------- */

/* --------------------------------- v1 assets --------------------------------- */

  let imageAsset = [];  // general image variable
  let letter = [];      // contains letter images
  let letterHeader = [];// contains letter header images
  let headerIndex = 0;  // used to select headers

/* -------------------------------- v2 asets -------------------------------- */

// notepad sprites
  let npStill = []; // still notepad animation
  let npFlip = [];  // flipping notepad animation
// fonts
  let pFont;  // font used in animated prompt
// ending image
  let farewellImg; // holds image used for the good ending
// music and sounds
  let carstop; // car stop sound effect
  let carInt; // car interior ambience
  let woodsST; // music for the choice area
  let carST; // music for the point n' click area

function preload() {
  for (let i = 0; i < 18; i++) {
    imageAsset[i] = loadImage("assets/v1/imageAsset_" + i + ".png"); // loads image assets found in the main game area
  }
  for (let i = 0; i < 31; i++) {
    letter[i] = loadImage("assets/v1/letter_" + i + ".png"); // loads image assets used to display diary entries
  }
  for (let i = 0; i < 6; i++) {
    letterHeader[i] = loadImage("assets/v1/letterHeader_" + i + ".png"); // loads images of "letter headers" in diary entries
  }
  for (let i = 0; i< 24; i++) { // load notePad flip animation
    npFlip[i] = loadImage('assets/v2/nb-flip/nb-flip_' + i + '.png');
  }
  for (let i = 0; i< 6; i++) { // load notePad still animation
    npStill[i] = loadImage('assets/v2/nb-still/nb-still_' + i + '.png');
  }

  pFont = loadFont('assets/v2/fonts/PlaypenSans-Medium.ttf'); // notepad font in gamestate 3

  farewellImg = loadImage('assets/v2/end.png') // good ending image

  // music

  carstop = loadSound('assets/v2/SoundFx/carstop.mp3') // car stopping sound effect
  carInt = loadSound('assets/v2/SoundFx/carambience.mp3') // car interior ambience
  woodsST = loadSound('assets/v2/SoundFx/831758__akkaittou__sadatmosphericguitarsoundtrack2.wav') // music for the choice area
  carST = loadSound('assets/v2/SoundFx/pointmusic.mp3') // music for the point n' click area

}

/* -------------------------------------------------------------------------- */
/*                                    SETUP                                   */
/* -------------------------------------------------------------------------- */

function setup() {
// canvas

  let canvas = createCanvas(windowWidth*0.6875, windowWidth*0.55); // dynamically sets canvas size based on window size
  canvas.parent("holder-canvas");

  frameRate(60);

// var define

  w = width;
  h = height;
  mX = mouseX;
  mY = mouseY;

/* ----------------------------- Point n' Click ----------------------------- */

    raccoonIndex = 4;

/* --------------------------------- Choice --------------------------------- */

  // cursor variables

    anchX = w*0.5;
    anchY = h*0.95;

    cX = anchX;
    cY = anchY;

    cursRadius = int(dist(anchX,anchY,(anchX+w*0.35),(anchY+h*0.125)));
    chCursor = new choiceCursor(anchX,anchY);

  // animated prompt variables

    startTimer();
    pStored = pScene;

// global settings
  imageMode(CENTER);
  angleMode(DEGREES);

  // temp window.alert("Disclaimer: This experience discusses animal harm and contains images of gore."); // alerts user of potential gore
}

/* -------------------------------------------------------------------------- */
/*                                    DRAW                                    */
/* -------------------------------------------------------------------------- */

function draw() {
/* ------------------------------- META LOGIC ------------------------------- */

  background(54,39,54); 
  gameMechanics();    // contains general game mechanics

  // positional var define
    w = width;
    h = height;
    mX += movedX
    mY += movedY;

/* ------------------------------- GAME STATES ------------------------------ */

  if(gameState === 0){              // "Menu" Mode
    menu();
    soundReset();
    showPointer = true;

  } else if(gameState === 1){       // "Point n' Click Adventure" Mode

    pointAndClick();
    typePos = 0;
    showPointer = true;
    endScreens();

  } else if(gameState === 2){       // "Choose-Your-Own Adventure" Mode

    chooseyourown();
    showPointer = false;
    
  } else if(gameState === 3){       // "Credits" Mode
    credits();
    showPointer = false;
  }

/* ------------------------------- Pause Menu ------------------------------- */

  if(paused){
    showPointer = false;
    pauseMenu();
  }

/* --------------------------------- cursor --------------------------------- */

  if(showPointer){
    pointCursor();
  }

/* ---------------------------------- music --------------------------------- */

  backgroundMusic();

/* ------------------------------- save canvas ------------------------------ */

  screenGrab();
  
}

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function mousePressed() {

/* ---------------------------- Choice Clickables --------------------------- */

  // if the user interacts with the game at any point besides menu state, lock cursor.

  if(!paused){
    requestPointerLock();
  }
  
/* -------------------------- Title Clickables -------------------------- */

if(gameState === 0){
  if(mX > w*0.4 && mX < w*0.6 && mY > h*0.565 && mY < h*0.635){ // start button function
    gameState = 1;
  }
  if(mX > w*0.4 && mX < w*0.6 && mY > h*0.705 && mY < h*0.775){ // credits button function
    gameState = 3;
  }
}

/* ------------------ "Point n' Click" Clickables ----------------- */

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
      coolDown = frameCount;  // anti-spam mechanic
    }

// display appropriate raccoon image on appropriate day
    if(day <= 3){
        raccoonIndex = 4

      } else if(day > 3 && day < 8){
        raccoonIndex = 5

      } else if(day > 7 && day < 11){
        raccoonIndex = 11;

      } else if(day > 10 && day < 21){
        raccoonIndex = 6

      } else if(day > 20 && day < 30){
        raccoonIndex = 7

      } else if(day === 30){
        raccoonIndex = 8

      } else if(day > 30){
        netEnd = true;
        endState = true;
        day = 30;
      }
    }

// if handbrake clicked, begin choice mode
    if(mX > w*0.2 && mY > h*0.88 && mX < w*0.4 && mY < h){
      gameState = 2;
    }
  }

/* ------------------------------- Pause Menu ------------------------------- */

  if(paused){
    if(menuButton(w*0.5,h*0.45,w*0.21,h*0.1)){ // Resume
      paused = false;
      mX = mouseX;
      mY = mouseY;
      requestPointerLock();
    }
    if(menuButton(w*0.5,h*0.58,w*0.21,h*0.1)){ // Save & Quit
      saveQuit();
      mX = mouseX;
      mY = mouseY;
      requestPointerLock();
    }
    if(menuButton(w*0.5,h*0.71,w*0.21,h*0.1)){ // Quit
      quit();
      mX = mouseX;
      mY = mouseY;
      requestPointerLock();
    }
  }
}

function keyPressed() {

  /* ------------------------- name carving mechanics ------------------------- */

  if(keyCode === BACKSPACE){
      nameInput = nameInput.slice(0,-1);
    } else if(keyCode === ENTER){
      nameGuess();
    } else if(key.length <= 1){
      nameInput = nameInput + key;
    }

  /* ------------------------------- pause menu ------------------------------- */
  if(gameState > 0){
    if(!paused &&keyCode === 192){
      paused = true;
      exitPointerLock();
    } else if (paused &&keyCode === 192){
      paused = false;
      mX = mouseX;
      mY = mouseY;
      requestPointerLock();
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

function menu(){ // contains main menu items
  boardAnimation = w*1;
  paused = false;

  push();
    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    translate(w*0.5,h*0.5)

// title
    push();
      textSize(w*0.07)
      fill(235, 208, 214);
      text('Dear Mr.Raccoon', w*0,-h*0.25,w*0.6) 
    pop();

// Play button
    push();
      translate(w*0,h*0.05);
      fill(235, 208, 214);
      rect(w*0,h*0,w*0.2,w*0.07,w*0.03) 
      textSize(w*0.04)
      fill(0)
      text('Play', w*0,h*0,w*0.5)
    pop();

// credits button
    push();
      translate(w*0,h*0.19);
      fill(235, 208, 214);
      rect(w*0,h*0,w*0.2,w*0.07,w*0.03) 
      textSize(w*0.04)
      fill(0)
      text('Credits', w*0,h*0,w*0.5)
    pop();

// tip text
    push();
      translate(w*0,h*0.38);
      textSize(w*0.02)
      fill(235, 208, 214);
      text('Tip:', w*0,-h*0.05,w*1) 
      text('Use the Note Pad\'s corner to progress days', w*0,h*0,w*1)
      text('Use the [ ` ] key to open pause menu', w*0,h*0.03,w*1) 
      text('Use CONTROL + SHIFT + P  to create screengrab', w*0,h*0.06,w*1) 
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

function diary() { // Display Diary Asset

// display appropriate header on appropriate day
  if(day < 20) {
    headerIndex = 0;
  } else if(day === 20){
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


/* -------------------------------------------------------------------------- */
/*                               META FUNCTIONS                               */
/* -------------------------------------------------------------------------- */

/* -------------------------- quit and save & quit -------------------------- */

function quit() { // quits game without saving
  gameState = 0;
  day = 1;
  badEndRoll = 2;
  badEnd = false;
  netEnd = false;
  netEndAnimation = 0;
  endState = false;

  scenario= "intro"
  chestnuts = false;
  rascal = false;

  introTimer = 0;
  introOpacity = 255;
}

function saveQuit() { // saves progress, returns to menu
  gameState = 0;

  introOpacity = 255;
}

/* ------------------------------- pause menu ------------------------------- */

function pauseMenu() { // displays pause menu
  push()

    rectMode(CENTER);
    textAlign(CENTER,CENTER)

  //backdrop
    fill(94, 67, 87);
    rect(w*0.5,h*0.5,w*0.6,h*0.6,15)

  //title
    fill(235, 208, 214);
    textSize(w*0.07)
    text("PAUSED",w*0.5,h*0.27)

  // Resume Bytton
    push()
      translate(w*0.5,h*0.45);


      fill(173,128,132);
      rect(w*0,h*0,w*0.21,h*0.1,15);

      fill(235, 208, 214);
      textSize(w*0.03)
      stroke(94, 67, 87)
      strokeWeight(w*0.005)
      text("Resume",w*0,h*0)

    pop()
  
  // Save & Quit Bytton 
    push()
      translate(w*0.5,h*0.58);


      fill(173,128,132);
      rect(w*0,h*0,w*0.21,h*0.1,15);

      fill(235, 208, 214);
      textSize(w*0.03)
      stroke(94, 67, 87)
      strokeWeight(w*0.005)
      text("Save & Quit",w*0,h*0)

    pop()

  // Quit Bytton
    push()
      translate(w*0.5,h*0.71);


      fill(173,128,132);
      rect(w*0,h*0,w*0.21,h*0.1,15);

      fill(235, 208, 214);
      textSize(w*0.03)
      stroke(94, 67, 87)
      strokeWeight(w*0.005)
      text("Quit",w*0,h*0)

    pop()
  pop()
}

function menuButton(x,y,w,h) { // used to detect if the cursor is in the specified area
  return mouseX > x-((w)/2) && mouseX < x+((w)/2) && mouseY < y+((h)/2) && mouseY > y-((h)/2)
}

/* --------------------------------- cursor --------------------------------- */

function pointCursor() { // contains cursor used in point n' click area
  push()
  noStroke();
  ellipse(mX,mY,w*0.01,w*0.01);
  pop()
}

/* ------------------------ screenshot functionality ------------------------ */

function screenGrab() { // saves current state of canvas

  if(keyIsDown(SHIFT) === true && keyIsDown(CONTROL) === true && keyIsDown(80) === true){
    if(prepSS){
      saveCanvas('dear_mr-raccoon','png')
    }
    prepSS = false;
  }
}

function keyReleased() {
  if(keyCode === 80 || keyCode === SHIFT || keyCode === CONTROL){
    prepSS = true;
  }
}

