/* -------------------------------------------------------------------------- */
/*                                  Variables                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- animation ------------------------------- */

  let npFrStill = 0;
  let npFrFlip = 0;

/* -------------------------------- gameplay -------------------------------- */



function choices() {
  background(12,10,18);

  notePad();
}

function notePad() {
  
  if(frameCount % 8 === 0) {
    npFrStill += 1;
  }
  if(npFrStill > ((npStill.length)-1)){
    npFrStill = 0;
  }
  image(npStill[npFrStill],w*0.5,h*0.5,w,h)

}