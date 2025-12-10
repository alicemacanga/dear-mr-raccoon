/* -------------------------------------------------------------------------- */
/*                                  Variables                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- animation ------------------------------- */

  let npFrStill = 0;  // Frame Counter for Still Notepad 
  let npFrFlip = 0; // Frame Counter for Flipping Notepad
  let doFlip;

  let textFlip = 0; // lets code know when to hide animated prompt during animation;

/* --------------------------------- Choice Cursor --------------------------------- */
  
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
  let typeSpd = 0.05;

  let typeStart;
  let typeFrame;

  let writePrompt = true;

/* ------------------------------- Name Prompt ------------------------------ */

  let carving = false; // tells the code whether to engage the "carving" screne

  let nameInput = ""; // holds user's name guess
  let nameState = "clue"; // used to check if user guess is correct

  let namePrompt = "What's his name?";
  let nameOp = 255;
  let fadePrompt = false;

  let wrongCount = 0;
  let wrongCooldown = false;
  let wrongTimer = 0;
  

/* ----------------------------- gameplay logic ----------------------------- */
  
  let choosing;
  let choiceMade;
  let choiceText = [];
  let choiceType2 = false;

  let scenario = "road";

  let chestnuts;
  let rascal;

  let endingOp = 0; // used to fade-in the end screen
  let ending; // checks if the ending was achieved

/* -------------------------------------------------------------------------- */
/*                                    Code                                    */
/* -------------------------------------------------------------------------- */

/* ------------------------ The "Composite" Function ------------------------ */

function chooseyourown() {

  background(12,10,18);

  cursBehavior();
  choiceTree();

  notePad();

  choicePrompt(
      w*0.35, // prompt X position
      h*0.18, // prompt Y position
      w*0.3,  // text width
      h*0.5,  // text height
      w*0.016,  // font size
      w*0.028,  // line height
    );

  if(carving){
    nameCarving();
  } else {
    choices();
    if(!paused){
      chCursor.display();
    }
    
    chCursor.shake();
  }

  if(ending){
      theend();
    }
}

/* --------------------------- Name Carving Scene --------------------------- */

function nameCarving() {

// erases previous scene
  background(12,10,18); 

// prompt
  push()
    textAlign(CENTER);
    fill(157,139,255,nameOp);
    textFont();
    textSize(w*0.03)
    text(namePrompt,w*0.5,h*0.3);
  pop()

// display user input
  push()
  textAlign(CENTER);
  fill(255,139,157);
  textFont(pFont);
  textSize(w*0.05);
  text(nameInput,w*0.5,h*0.5);
  pop()

// name prompt fade transition
  if(fadePrompt){

    nameOp -= 5.6;

    if(nameOp <= 0){
      
      fadePrompt = false;

      // only update name prompt if the opacity of text is at 0
      switch(nameState){
        case "clue":
            namePrompt = "What was his name?"
          break;
        case "true":
            namePrompt = " "
            ending = true;
          break;
        case "false":
            if(wrongCount > 2){
              namePrompt = "I asked him for a sign... maybe I should check my diary?"
            } else {
              namePrompt = "That's not right..."
            }
          break;
      }
    } 

  } else {

    if(nameOp < 255){
      nameOp += 5.6;
    }

  }

  // switch name prompt to "clue" state
  if(wrongCooldown){
    wrongTimer += 1;
    if(wrongTimer > 300){
      wrongTimer = 0;
      fadePrompt = true;
      nameState = "clue";
      wrongCooldown = false;
    }
  } 

}

function nameGuess() { // checks if the input name is correct
  if(nameInput == "charlie"){
    nameState = "true";
  } else {
    nameState = "false";
    wrongCount += 1;
    wrongTimer = 0;
    wrongCooldown = true;
  }

  fadePrompt = true;
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

  if(choiceType2){

    // making a choice
    if(choiceField(w*0.5,h*0.85,w*0.26,w*0.08)){
      choosing += 4;
    } else {
      choosing = 0;
      choiceMade = 0;
    }

    // choice field 03
    push()
      fill(0,0);
      stroke(157,139,255)
      if(choiceField(w*0.5,h*0.85,w*0.26,w*0.08)){
        fill(147,59,255,140);
        if(choosing >= 360){
          choiceMade = 1;
          resetScene();
        }
      }
      rectMode(CENTER);
      rect(w*0.5,h*0.85,w*0.26,w*0.08,200);

      textAlign(CENTER, CENTER);
      noStroke();
      fill(157,139,255);
      textSize(w*0.015);

      text(choiceText[1],w*0.5,h*0.85,w*0.26,w*0.08)
    pop()
  } else {

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
}

/* -------------------------- Cursor Behavior Logic ------------------------- */

function cursBehavior() {

  anchX = w*0.5;
  anchY = h*0.95;

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
  cShakeX = map(cursDist,0,cursRadius,0,w*0.01);
  cShakeY = map(cursDist,0,cursRadius,0,w*0.01);
}

/* -------------------------------- Page Flip ------------------------------- */

function resetScene() {
  cX = anchX;
  cY = anchY;
  doFlip = true;
}

/* ------------------------------- End Screen ------------------------------- */

function theend() {
  endingOp += 5.6;

  tint(255,endingOp)
  image(farewellImg,w*0.5,h*0.5,w,h)
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

/* -------------------------------------------------------------------------- */
/*                                 CHOICE TREE                                */
/* -------------------------------------------------------------------------- */

function choiceTree() {
  switch (scenario){

    /* ---------------------------------- ROAD ---------------------------------- */
    case "road":

      pScene = 'I finally stopped. Without a second thought, I slammed on my brakes and pulled over next to the road. My heart was still pounding as my tires screeched to a stop. I have no idea what took over me in that moment, yet I did make a choice.\n \nI took a deep breath before getting out of my car, and there you were, right in front of me. \n \nAm I really doing this?';
      choiceText[1] = "Let's do this"
      choiceText[2] = "This is CRAZY"

      choiceType2 = false;
      chestnuts = false;
      rascal = false;

      if(choiceMade === 1){
        scenario = "commited"
      } else if (choiceMade === 2){
        scenario = "crazy"
      }
      break;

    /* ---------------------------------- CRAZY --------------------------------- */
    case "crazy":

      pScene = 'What was I thinking?? This is gross- I am gross!! Maybe even a little crazy... I say, staring at the dead raccoon I had intended to carry. Definitely crazy. \n \nYou know what? I\'m just gonna leave.';
      choiceText[1] = "Start over"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "road" //wip
      }
      break;

    /* -------------------------------- COMMITTED ------------------------------- */
    case "commited":

      pScene = '\"Alright, let\'s do this.\" Another deep sigh later, I found myself waist-deep in my trunk, digging for an old, thick wool blanket and a small shovel. \n \nI wrapped it around you before finally picking you up and heading into the forest next to me. \n \nThere was a small clearing, with a wall of thick bushes ahead, and what seemed to be the sound of running water to my right.';
      choiceText[1] = "Push through the bushes"
      choiceText[2] = "Follow the sound"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "clearing-1"
      } else if (choiceMade === 2){
        scenario = "river-1"
      }
      break;

    /* ------------------------------- CLEARING 1 ------------------------------- */
    case "clearing-1":

      pScene = 'I pushed myself through the wall of bushes, collecting scratches left and right, only to find myself in another forest clearing. This one, however, was breathtaking.\n \nThere was bright sunlight peeking through the leaves; dare I say it was even warm. Every inch of the ground below was covered in flowers of all shapes and colors. Perhaps this is the spot?';
      choiceText[1] = "Say Goodbye"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "grave-1"
      }
      break;
    
    /* --------------------------------- GRAVE 1 -------------------------------- */
    case "grave-1":

      pScene = 'I used my shovel to dig a large hole before gently laying you into it, still wrapped in my blanket. After one last look at my old friend, I began layering large stones and dirt on top of the grave. Leaving a small mound. \n \nI did what I set out to do, yet I can\'t help but feel that something isn\'t right...';
      choiceText[1] = "Start Over"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "road" //wip
      }
      break;

    /* --------------------------------- RIVER 1 -------------------------------- */
    case "river-1":

      pScene = 'There was a small river running through the forest. Luckily, the rocky riverbank was clear of bushes, so I had a clean way through.\n \nI began walking along the riverbank when I suddenly heard a strange chitter coming from the trees across the river.';
      choiceText[1] = "nope nope nope"
      choiceText[2] = "Investigate"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "chestnut-1"
      } else if (choiceMade === 2){
        scenario = "rascal-1"
      }
      break;

    /* -------------------------------- RASCAL 1 -------------------------------- */
    case "rascal-1":

      pScene = 'I decided to follow the noise, jumping across small stones to cross the river. After one final jump, I found myself standing in front of a large willow tree, with a small hole below its trunk.\n \nOut of this hole peeked out an even smaller, fluffy gray tail, with a bit of red in its tip. "Rascal?" I gasped, frightening the cub and prompting him to run off.';
      choiceText[1] = "Go back"
      choiceText[2] = "Give chase"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "chestnut-1"
      } else if (choiceMade === 2){
        scenario = "rascal-chase"
      }
      break;

    /* ------------------------------ RASCAL CHASE ------------------------------ */
    case "rascal-chase":

      pScene = 'Without a second to spare, I chased after Rascal, tearing through bushes and dodging trees, eventually looping around and crossing the river once more.\n \nIn the end, my efforts were in vain as I ended up losing sight of him. After a fair bit of cussing, I realized that I was in the same clearing where I had started.';
      choiceText[1] = "Push through the bushes"
      choiceText[2] = "Go back to the river"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "clearing-1"
      } else if (choiceMade === 2){
        scenario = "chestnut-1"
      }
      break;
    
    /* ------------------------------- CHESTNUT 1 ------------------------------- */
    case "chestnut-1":

      pScene = 'Lost in thought, I continued down the riverbank, eventually running into a tree branch. After looking around to make sure no one witnessed my clumsiness, I realized that I had found a chestnut tree.\n \nRemembering your love for chestnuts, I couldn\'t help but smile and wonder if there were still some left.';
      choiceText[1] = "Look for chestnuts"
      choiceText[2] = "They\'re probably rotten . . ."

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "chestnut-search"
      } else if (choiceMade === 2){
        scenario = "dead-end"
      }
      break;

    /* ----------------------------- CHESTNUT SEARCH ---------------------------- */
    case "chestnut-search":

      pScene = 'I gently laid you down before hoisting myself up into the tree. Though I looked for a while, I had no luck. I was ready to leave empty-handed, but as I descended, I ended up slipping on the lowest branch and falling into a pile of leaves below.\n \nI felt something hard below the leaves; it was chestnuts!';
      choiceText[1] = "Take chestnuts"

      choiceType2 = true;
      chestnuts = true;

      if(choiceMade === 1){
        scenario = "dead-end"
      }
      break;

    /* -------------------------------- DEAD END -------------------------------- */
    case "dead-end":

      pScene = 'I continued walking downstream; even when the terrain became harder to navigate, I pushed on. Nonetheless, the stream eventually thinned out, and all I found was a dead end, a massive wall of dense bushes.\n \nAt this point, I wonder if the forest just doesn\'t like me.';
      choiceText[1] = "Don't give up"
      choiceText[2] = "Go back"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "clearing-1"
      } else if (choiceMade === 2){
        scenario = "river-2"
      }
      break;
    
    /* --------------------------------- RIVER 2 -------------------------------- */
    case "river-2":

      pScene = 'I began to walk back up the riverbank, listening to the peaceful stream next to me. Suddenly, my journey got interrupted by a series of growls coming from a bush across the river.\n \nIt was similar to the last time, except for the fact that said \"river\" was now but a foot wide. Whatever it was, it would have no trouble crossing.';
      choiceText[1] = "Investigate"
      choiceText[2] = "Dive into the bushes!"

      choiceType2 = false;

      if(choiceMade === 1){
        scenario = "rascal-2"
      } else if (choiceMade === 2){
        scenario = "clearing-1"
      }
      break;
    
    /* -------------------------------- RASCAL 2 -------------------------------- */
    case "rascal-2":

      pScene = 'I hopped over the stream, carefully approaching the bush, before gently parting the leaves. I couldn\'t believe my eyes; it was Rascal! What was he growling at, though?\n \nI slowly walked around the bush, doing my best not to startle the cub. He was trapped, his hips caught in a tangle of dry lianas. As soon as he saw me, he began to panic, tossing himself around and biting at the lianas.';
      choiceText[1] = "Try to help"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "rascal-3"
      }
      break;
    
    /* -------------------------------- RASCAL 3 -------------------------------- */
    case "rascal-3":

      if(chestnuts){
        pScene = 'Thankfully, I still had my chestnuts. I slowly lowered myself to the ground and placed one of the nuts next to him. This distraction worked wonders, as Rascal did his best to reach for his treat while I carefully loosened the vines.\nAs soon as he came loose, Rascal began backing away but stopped once he smelled the remaining chestnuts in my pocket.\n \nI pulled one out and clicked my tongue. "Come with me, buddy."';
        choiceText[1] = "Backtrack"

        choiceType2 = true;
        rascal = true;

        if(choiceMade === 1){
          scenario = "backtrack-rascal"
        }
      } else {
        pScene = 'I didn\'t know how to calm him, but I couldn\'t just leave him like this. I didn\'t want to startle him any further, so I slowly lowered myself to the ground and attempted to loosen the vines, a task made more difficult by his frantic thrashing.\n \nHe scratched me several times before I finally managed to get him loose. Once I did, he slipped out of my grasp and dove into the forest. I couldn\'t find him.';
        choiceText[1] = "Backtrack"

        choiceType2 = true;

        if(choiceMade === 1){
          scenario = "backtrack-alone"
        }
      }
      break;

    /* ----------------------------- BACKTRACK ALONE ---------------------------- */
    case "backtrack-alone":

      pScene = 'Tired and upset, I slowly made my way up the riverbank. I kept thinking about Rascal, wondering if there was something I could\'ve done differently.\n \nIn the end, I found myself back in the forest clearing where I had first begun my journey.\n \nThere\'s only one last way to go.';
      choiceText[1] = "Walk through the bushes"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "clearing-1"
      }
      break;

    /* -------------------------- BACKTRACK WITH RASCAL ------------------------- */
    case "backtrack-rascal":

      pScene = 'Slowly but surely, we made our way up the riverbank. As we went, Rascal would occasionally try and grab the chestnuts out of my hand, only to get randomly distracted by something else.\n \nIn the end, we found ourselves back in the forest clearing where I had first begun my journey.\n \nThere\'s only one last way to go.';
      choiceText[1] = "Walk through the bushes"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "bushes"
      }
      break;
    
    /* --------------------------------- BUSHES --------------------------------- */
    case "bushes":

      pScene = 'I walked backwards into the bushes, bending the branches so that Rascal could easily follow. I did get scratched a little this way, but I didn\'t mind.\n \nI got lost in my own world, thinking about how I might get Rascal home and how happy Mrs. Raccoon will be when she sees him.';
      choiceText[1] = "Keep pushing"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "fall"
      }
      break;

    /* ---------------------------------- FALL ---------------------------------- */
    case "fall":

      pScene = 'Suddenly, I couldn\'t feel the branches behind me anymore, a feeling soon followed by my back hitting the ground. \"Ouch!\" I had no time to be dazed though, as I instinctually grabbed the remaining chestnuts and lifted them high into the air, away from Rascal, who was already jumping on my stomach, trying to reach them.';
      choiceText[1] = "Turn around"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "clearing-2"
      }
      break;

    /* ------------------------------- CLEARING 2 ------------------------------- */
    case "clearing-2":

      pScene = 'I found myself in yet another clearing; this one, however, was beautiful beyond words. There was bright sunlight dancing through the tree canopies above, made visible by a gentle fog, which itself was somewhat warm.\n \nThe ground was vibrant, somehow covered by flowers of all heights, shapes, and colors. In the middle of the clearing was a small grassy circle. This was the perfect place.';
      choiceText[1] = "It's time"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "digging"
      }
      break;
    
    /* --------------------------------- DIGGING -------------------------------- */
    case "digging":

      pScene = 'I gave Rascal one of the chestnuts to play with while I used my shovel to dig your grave. Once I was done, I slowly lowered you in.\n \n\"Goodbye, old friend,\" I whispered as I glanced at you one last time, before gently placing one of the chestnuts on your chest and filling the grave. I was ready to walk away, when I suddenly felt something poking my ankle.';
      choiceText[1] = "Look down"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "name"
      }
      break;

    /* ---------------------------------- NAME ---------------------------------- */
    case "name":

      pScene = 'It was Rascal, holding a stick he found. Once he noticed that he had my attention, he let go and sat down, staring up at me.\n \nHe didn\'t make a sound, yet I understood what he was trying to say: I can\'t just leave your grave unmarked. And he was right, but what should I carve into the stick?';
      choiceText[1] = "Carve"

      choiceType2 = true;

      if(choiceMade === 1){
        scenario = "carving"
      }
      break;
    
    /* --------------------------------- CARVING -------------------------------- */
    case "carving":

      choiceType2 = false;
      carving = true;

      break;
  }
}