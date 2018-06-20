window.onload = function() { startGame(); }

let myGamePiece; // initialize game piece component
let myObstacles = [];  // initialize obstacle component, save multiples obs in an array

/* set angrybird for drawImage as myGamePiece
*/
let angrybird = new Image();
angrybird.src = "angrybird.png";

function startGame() {
  myGamePiece = new component(80, 80, 'blue', 10, 70);
  myGameArea.start();
}

const myGameArea = {
  canvas: document.createElement('canvas'),

  start: function() {
    this.frameNo = 0; // initialize frame count
    this.canvas.width = 600; // override the style tag
    this.canvas.height = 400; // override the style tag
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
    ctx.drawImage(angrybird, 0, 0, angrybird.width, angrybird.height,           // source image
                      this.x, this.y, this.width, this.height);     // new coordinate and new size
    ctx.strokeStyle = "#2bb11b";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
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

// check the current frame number and return true if corresponds with given interval
// make sure to initialize frameNo in myGameArea.start()
function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) return true;
  return false;
}

function updateGameArea() {
  // first, loop through every obstacles to see if there's a crash, then stop
  myObstacles.forEach( e => { if (myGamePiece.crashWith(e)) myGameArea.stop(); } );
  
  // otherwise continue the game, continue to count the frame
  myGameArea.clear();
  myGameArea.frameNo += 1;
  // add new obs at the beginning of game or every 150th frame
  if (myGameArea.frameNo == 1 || everyInterval(150)) {
      const x = myGameArea.canvas.width;
      const y = myGameArea.canvas.height - 200
      myObstacles.push(new component(10, 200, "blue", x, y));
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
    // if (myGameArea.keys[32]) startGame(); // space bar doesnt work yet
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

// restart game
function restart() { startGame(); }
