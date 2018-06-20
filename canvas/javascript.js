window.onload = function() { startGame(); }

let myGamePiece; // initialize game piece component
let myObstacles = [];  // initialize obstacle component, save multiples obs in an array

/* set emoji for drawImage as myGamePiece
*/
let emoji = new Image();
emoji.src = "emoji.png";

function startGame() {
  myGamePiece = new component(20, 20, 'blue', 10, 70);
  myGameArea.start();
}

const myGameArea = {
  canvas: document.createElement('canvas'),

  start: function() {
    this.frameNo = 0; // initialize frame count
    this.canvas.width = 500; // override the style tag
    this.canvas.height = 300; // override the style tag
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20); // update screen constantly

    // game control for up-down-right-left arrow keys
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown"); // true
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown") // false
    })

    // game control for touch screen devices
    // window.addEventListener('touchmove', function (e) {
    //   myGameArea.x = e.touches[0].screenX;
    //  myGameArea.y = e.touches[0].screenY;
    // })
  },

  // clear the canvas at every update (constantly), hence myGamePiece won't leave a trail
  // if not, all movements of all components will leave a trail where it was positioned last frame
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() { clearInterval(this.interval); }, // stop the game if user hit the obstacles
};

// constructor function for canvas element
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.color = color;
  this.x = x;
  this.y = y;    
  this.updateRect = function() {
    ctx = myGameArea.context;
    /* draw square
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // NOTE: must use fillRect, cannot use ctx.rect(...) and ctx.fill();
    */

    /* circle, cannot use b/c idk how to fix fn myGameArea.clear() w/ clearRect()
     * // ctx.fillStyle = color;
     * // ctx.fill();
     * ctx.linewidth = this.width * 0.1;
     * ctx.arc(this.x, this.y, this.width / 5, 0, 2*Math.PI);
     * ctx.lineWidth = 1; // border line
     * ctx.strokeStyle = color
     * ctx.stroke();
     */

    /* draw using outside image, the image is ugly due to re-scale/size
    */
    ctx.drawImage(emoji, 0, 0, emoji.width, emoji.height,           // source image
                      this.x, this.y, this.width, this.height);     // new coordinate and new size
  };
  this.updateObs = function() {
    ctx = myGameArea.context;
    // draw square
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // NOTE: must use fillRect, cannot use ctx.rect(...) and ctx.fill();
  };
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.crashWith = function(otherobj) {
    const myleft = this.x;
    const myright = this.x + (this.width);
    const mytop = this.y;
    const mybottom = this.y + (this.height);
    const otherleft = otherobj.x;
    const otherright = otherobj.x + (otherobj.width);
    const othertop = otherobj.y;
    const otherbottom = otherobj.y + (otherobj.height);

    let crash = true;
    if ((mybottom < othertop) || // myGamePiece is above
        (mytop > otherbottom) || // myGamePiece is below
        (myright < otherleft) || // myGamePiece is on the left side
        (myleft > otherright)) { // myGamePiece is on the right side
       crash = false;
    }
    return crash;
  }
}

// make sure to initialize frameNo in myGameArea.start()
function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) return true;
  return false;
}

function updateGameArea() {
  let x, y;
  // Object.keys(myObstacles).forEach( i => { if (myGamePiece.crashWith(myObstacles[i])) myGameArea.stop(); } );

    for (i = 0; i < myObstacles.length; i += 1) {
  console.log(myObstacles.length);
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyInterval(150)) {
      x = myGameArea.canvas.width;
      y = myGameArea.canvas.height - 200
      myObstacles.push(new component(10, 200, "green", x, y));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x -= 1; // change pos to move to the left at every update
      myObstacles[i].updateObs();
  }
  /*

  myGameArea.clear();
  myObstacles.x--;
  myObstacles.updateObs();
  */

  // update game control with keys
  if (myGameArea.keys && myGameArea.keys.length > 0) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys[37] || myGameArea.keys[72]) myGamePiece.speedX = -1;
    if (myGameArea.keys[39] || myGameArea.keys[76]) myGamePiece.speedX = 1;
    if (myGameArea.keys[38] || myGameArea.keys[75]) myGamePiece.speedY = -1;
    if (myGameArea.keys[40] || myGameArea.keys[74]) myGamePiece.speedY = 1;
    myGameArea.keys = []; // soft reset
  }

  /* update game control for touch screen devices
   * if (myGameArea.x && myGameArea.y) {
   *  myGamePiece.x = myGameArea.x;
   *  myGamePiece.y = myGameArea.y;
   * }
   */

  myGamePiece.newPos();
  myGamePiece.updateRect();
}

// game control with buttons
function moveup() { myGamePiece.speedY -= 1; }
function movedown() { myGamePiece.speedY += 1; }
function moveleft() { myGamePiece.speedX -= 1; }
function moveright() { myGamePiece.speedX += 1; }
function stopMove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}
