/* -------------------------------- variables ------------------------------- */

let firstPlay = true;

/* ----------------------------- Sound FX player ---------------------------- */

function playSound() { // plays specific soundeffect on trigger
    if(firstPlay){
        if(intro){
            if(!carstop.isPlaying()){
                carstop.play();
            }
        }
        firstPlay = false;
    }
}

/* -------------------------- Sound Track resetter -------------------------- */

function soundReset() { // resets all currently playing soundtracks
    firstPlay = true;
    carstop.stop();
    carInt.stop();
    woodsST.stop();
    carST.stop();
}

/* ----------------------- Background Music Selection ----------------------- */

function backgroundMusic() { // play background music for specific areas of game

 // Point n' Click background music and sounds

    if(gameState === 1){
        woodsST.stop();
        if(!carST.isPlaying() && !carInt.isPlaying()){
            carST.setVolume(0.2)
            carST.loop();
            carInt.loop();
        }

// Choose your own adventure background music

    } else if(gameState === 2){
        carST.stop();
        carInt.stop();
        if(!woodsST.isPlaying()){
            woodsST.loop();
        }
    }
    
}