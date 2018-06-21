window.onload = function() { startGame(); }

let myGamePiece;        // initialize game piece component
let myObstacles = [];   // initialize obstacle component, save multiples obs in an array
let myScore;            // initialize score component

/* set spaceship for drawImage as myGamePiece
*/
let spaceship = new Image();
spaceship.src = "spaceship.png";

function startGame() {
  myGamePiece = new component(40, 40, 'blue', 10, 70);
  myScore = new component("30px", "Consolas", "black", 280, 40, "text");
  myGameArea.start();
}

const myGameArea = {
  canvas: document.createElement('canvas'),

  start: function() {
    this.frameNo = 0; // initialize frame count
    this.score = -2;   // initialize score to -2 to account for waiting interval at first
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
    ctx.drawImage(spaceship, 0, 0, spaceship.width, spaceship.height,           // source image
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
  this.updateScore = function() {
    ctx = myGameArea.context;
    ctx.font = this.width + " " + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);
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
  myObstacles.forEach(obstacle => { if (myGamePiece.crashWith(obstacle)) myGameArea.stop(); } );
  
  // otherwise continue the game, continue to count the frame
  myGameArea.clear();
  myGameArea.frameNo++;
  // add new obs at the beginning of game or every 150th frame, randomize height and gap
  if (myGameArea.frameNo == 1 || everyInterval(150)) {
    // TODO: this is temporary solution to update score, more to come...
    myGameArea.score++;

    const minHeight = 20;
    const maxHeight = 200;
    const height = Math.floor(Math.random()*(maxHeight-minHeight+1) + minHeight);
    const minGap = 30;
    const maxGap = 200;
    const gap = Math.floor(Math.random()*(maxGap-minGap+1) + minGap);
    const color = "#"+Math.random().toString(16).slice(-6);   //randomize obstacle colors
    const x = myGameArea.canvas.width;

    myObstacles.push(new component(10, height, color, x, 0)); // obstacle on the top
    myObstacles.push(new component(10, x-height-gap, color, x, height+gap)); // obstacle bottom
  }
  myObstacles.forEach(obstacle => {
      obstacle.x--; // change horizontal pos to move to the left at every update
      obstacle.updateObs();
  });

  // update game control with keys
  if (myGameArea.keys && myGameArea.keys.length > 0) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // press arrow keys or <h, j, k, l> to move left, down, up, right
    if (myGameArea.keys[37] || myGameArea.keys[72]) myGamePiece.speedX = -2;
    if (myGameArea.keys[39] || myGameArea.keys[76]) myGamePiece.speedX = 2;
    if (myGameArea.keys[38] || myGameArea.keys[75]) myGamePiece.speedY = -2;
    if (myGameArea.keys[40] || myGameArea.keys[74]) myGamePiece.speedY = 2;

    // press <s> to activate bird shrinking functionality
    // TODO: limit the time you can shrink, or how often you can shrink
    if (myGameArea.keys[83]) {
      myGamePiece.height = myGamePiece.height / 2;
      myGamePiece.width = myGamePiece.width / 2;
      setTimeout(function() {
        myGamePiece.height = myGamePiece.height * 2;
        myGamePiece.width = myGamePiece.width * 2;
      }, 2000)
    }

    // TODO: press <spacebar> to restart the game
    // if (myGameArea.keys[32]) startGame(); // space bar doesnt work yet

    myGameArea.keys = []; // soft reset
  }

  /* update game control for touch screen devices
   * if (myGameArea.x && myGameArea.y) {
   *  myGamePiece.x = myGameArea.x;
   *  myGamePiece.y = myGameArea.y;
   * }
   */

  myScore.text = "SCORE: " + myGameArea.score;
  if (myGameArea.score >= 0) myScore.updateScore();
  myGamePiece.newPos();
  myGamePiece.updateRect();
}

// game control with buttons
function moveup() { myGamePiece.speedY -= 2; }
function movedown() { myGamePiece.speedY += 2; }
function moveleft() { myGamePiece.speedX -= 2; }
function moveright() { myGamePiece.speedX += 2; }
function stopMove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

// restart game
function restart() { startGame(); }
