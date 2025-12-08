/* -------------------------------------------------------------------------- */
/*                                  Variables                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- animation ------------------------------- */

  let npFrStill = 0;  // Frame Counter for Still Notepad 
  let npFrFlip = 0; // Frame Counter for Flipping Notepad
  let doFlip;

  let textFlip = 0; // lets code know when to hide animated prompt during animation;

/* --------------------------------- Choice Cursor --------------------------------- */
  
  let cmovX;  // Technical Cursor X position (pre lerp)
  let cmovY;  // Technical Cursor Y position (pre lerp)
  let cX; // Practical Cursor X position (post lerp)
  let cY; // Practical Cursor Y position  (post lerp)

  let anchX;  // X position of Cursor Anchor
  let anchY;  // Y position of Cursor Anchor

  let cursDist; // Distance of Cursor from Anchor
  let cursRadius; // Maximum reach of Cursor

  let cursDrag; // holds a value for "Drag" or "Friction" applied to Cursor movement
  let cShakeX;  // determines how much the Cursor should shake the on X axis
  let cShakeY;  // determines how much the Cursor should shake the on Y axis

  let chCursor; // holds Choice Cursor class

/* ----------------------------- Animated Prompt ---------------------------- */

  let pScene = ''; // scene prompt, queued to be next
  let pStored = '';  // displayable prompt
  let pCurrent = '';  // text currently on screen

  let typePos = 0;
  let typeSpd = 1;

  let typeStart;
  let typeFrame;

  let writePrompt = true;

/* ----------------------------- gameplay logic ----------------------------- */
  
  let choosing;
  let choiceMade;
  let choiceText = [];

  let scenario = "road";

/* -------------------------------------------------------------------------- */
/*                                    Code                                    */
/* -------------------------------------------------------------------------- */

/* ------------------------ The "Composite" Function ------------------------ */

function chooseyourown() {

  cursBehavior();
  choiceTree();

  background(12,10,18);

  notePad();

  choicePrompt(
      w*0.35,
      h*0.18,
      w*0.3,
      h*0.5,
      w*0.018,
      w*0.028,
    );

  choices();

  chCursor.display();
  chCursor.shake();
  
}

/* ----------------------------- Narrative Tree ----------------------------- */

function choiceTree() {
  switch (scenario){
    case "road":

      pScene = 'I finally stopped. Without a second thought, I slammed my breaks and pulled over next to the road. My heart was still pounding as my tires screeched to a stop. I have no idea what took over me in that moment, yet, I did make a choice. \n I took a deep breath before getting out of my car, and there you were, right in front of me. \n \nAm I really doing this?';
      choiceText[1] = "Pick Him Up"
      choiceText[2] = "This is CRAZY"


      if(choiceMade === 1){
        scenario = "forest"
      } else if (choiceMade === 2){
        scenario = "river"
      }
      break;
  }
}

/* -------------------------- Animated Prompt Logic ------------------------- */

function choicePrompt(x,y,w,h,ts,tl,) {

  // hide text while notepad is flipped
  if(doFlip && textFlip >= 17){
    typePos = 0;
  } else if (!doFlip){
    pStored = pScene;
  }

// display letter based on Type Cursor's position  
  pCurrent = pStored.substring(0,typePos);

// text being displayed 
  push();
    fill(157,139,255); //129,106,255
    textSize(ts)
    textLeading(tl)
    textFont(pFont);

    text(pCurrent,x,y,w,h);
  pop();

// prompt type animation logic
  if(frameCount > typeFrame){ // if frameCount > frameCount + typeSpd

    typePos++; // advance position of Type Cursor

    typeStart = frameCount; // make TypeStart equal to framecount again
    typeFrame = typeStart + typeSpd;  // set new goal for type frame to advance Type Cursor position

    if(typePos > pStored.length){ // stop advancing Type Cursor if all words are displayed

      typePos = pStored.length; 

    }
  }

}

function startTimer() {
  typeStart = frameCount;
  typeFrame = typeStart + typeSpd;
}

/* ------------------------ Note Pad Animation Logic ------------------------ */

function notePad() {
  
  if(doFlip){
    
    image(npFlip[npFrFlip],w*0.5,h*0.5,w,h)

    if(frameCount % 2 === 0) {
      npFrFlip += 1;
    }

    textFlip++

    if(npFrFlip > ((npFlip.length)-1)){
      doFlip = false;
      npFrFlip = 0;
      textFlip = 0;
    }
  } else {

    if(frameCount % 8 === 0) {
      npFrStill += 1;
    }

    if(npFrStill > ((npStill.length)-1)){
      npFrStill = 0;
    }

    image(npStill[npFrStill],w*0.5,h*0.5,w,h)
  }
}

/* --------------------------- Choice System Logic -------------------------- */

function choiceField(x,y,w,h) {
  return cX > x-((w)/2) && cX < x+((w)/2) && cY < y+((h)/2) && cY > y-((h)/2)
}

function choices() {

  /* push()
  noFill()
  stroke(255)
  rectMode(CENTER)
  rect(w*0.5,h*0.85,w*0.7,h*0.25)
  pop() */

  // making a choice
  if(choiceField(w*0.8,h*0.85,w*0.26,w*0.08) || choiceField(w*0.2,h*0.85,w*0.26,w*0.08)){
    choosing += 4;
  } else {
    choosing = 0;
    choiceMade = 0;
  }

  // choice field 01
  push()
    fill(0,0);
    stroke(157,139,255)
    if(choiceField(w*0.2,h*0.85,w*0.26,w*0.08)){
      fill(147,59,255,140);
      if(choosing >= 360){
        choiceMade = 1;
        resetScene();
      }
    }
    rectMode(CENTER)
    
    rect(w*0.2,h*0.85,w*0.26,w*0.08,200);

    textAlign(CENTER, CENTER);
    noStroke();
    fill(157,139,255);
    textSize(w*0.015);

    text(choiceText[1],w*0.2,h*0.85,w*0.21,w*0.08)
  pop()

  // choice field 02
  push()
    fill(0,0);
    stroke(157,139,255)
    if(choiceField(w*0.8,h*0.85,w*0.26,w*0.08)){
      fill(147,59,255,140);
      if(choosing >= 360){
        choiceMade = 2;
        resetScene();
      }
    }
    rectMode(CENTER);
    rect(w*0.8,h*0.85,w*0.26,w*0.08,200);

    textAlign(CENTER, CENTER);
    noStroke();
    fill(157,139,255);
    textSize(w*0.015);

    text(choiceText[2],w*0.8,h*0.85,w*0.21,w*0.08)
  pop()
}

/* -------------------------- Cursor Behavior Logic ------------------------- */

function cursBehavior() {

  cX += movedX;
  cY += movedY;

  // Cursor's distance from anchor
  cursDist = int(dist(anchX,anchY,cX,cY));

  // Cursor Drag Calculation
  if(cursDist > cursRadius*0.7){
    cursDrag = 0.04;
  } else {
    cursDrag = map(cursDist,0,cursRadius*0.7,1,0.05);
  }


  // Cursor Shake Ammount Calculation
  cShakeX = map(cursDist,0,cursRadius*1.2,0,w*0.01);
  cShakeY = map(cursDist,0,cursRadius*1.2,0,w*0.01);
}

function resetScene() {
  cX = anchX;
  cY = anchY;
  doFlip = true;
}

/* ------------------------------ Cursor Class ------------------------------ */

class choiceCursor {
  constructor(posX,posY) {
    this.posX = posX;
    this.posY = posY;
  }
  display() {

    /* -------------------------- Sprite Movement Logic ------------------------- */

    if(cursDist <= cursRadius){                 // if within cursRadius, use cursDrag
      this.posX = lerp(this.posX,cX,cursDrag);
      this.posY = lerp(this.posY,cY,cursDrag);
    } else {                                    // if outside curRadius, move cursor to anchor 
      this.posX = lerp(this.posX,anchX,0.1);
      this.posY = lerp(this.posY,anchY,0.1);
      cX = anchX;
      cY = anchY;
    }



    ellipse(this.posX,this.posY,w*0.02);
    push()
      noFill();
      stroke(255);
      strokeWeight(w*0.005);
      arc(this.posX,this.posY,w*0.03,w*0.03,0,choosing);
    pop()
  }
  shake() {
    if(cursDist <= cursRadius){
      this.posX = this.posX+(random(-cShakeX,cShakeX));
      this.posY = this.posY+(random(-cShakeY,cShakeY));
    }
  }
}