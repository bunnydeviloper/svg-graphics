window.onload = function() { startGame(); }

let myGamePiece;        // initialize game piece component
let myObstacles = [];   // initialize obstacle component, save multiples obs in an array
let myScore;            // initialize score component

/* TODO: for user to select diff. avatar -> doesn't work yet, not sure why...
const pickAvatar(id) => {
  let avatar = document.getElementbyId(id);
  avatar.addEventListener("click", startGame(id));
};

window.onload = function() {
document.getElementById('spaceship').onclick = function() { startGame('spaceship.png'); };
document.getElementById('mangocat').onclick = function() { startGame('catreading.jpg'); };
document.getElementById('pusheen').onclick = function() { startGame('pusheenlazy.gif'); };
}
*/

function startGame() {
  myGamePiece = new component(40, 40, 'pusheenlazy.gif', 10, 70, "image");
  myScore = new component("20px", "Consolas", "black", 480, 40, "text");
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
function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }

  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.color = color;
  this.x = x;
  this.y = y;    
  this.update = function() {
    ctx = myGameArea.context;

    /* draw using outside image, the image is ugly due to re-scale/size */
    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "#2bb11b";  // for border
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    if (type == "piece" || type == "obstacles") {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // NOTE: must use fillRect, cannot use ctx.rect(...) and ctx.fill();
    }
    if (type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }

    /* circle: currently cannot use b/c idk how to fix trailing path w/ clearRect() */
    if (type == "circle") {
     // ctx.fillStyle = this.color;
     // ctx.fill();
     ctx.linewidth = this.width * 0.1;
     ctx.arc(this.x, this.y, this.width / 5, 0, 2*Math.PI);
     ctx.lineWidth = 1; // border line
     ctx.strokeStyle = this.color;
     ctx.stroke();
    }
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

    myObstacles.push(new component(10, height, color, x, 0, "obstacles")); // obstacle on the top
    myObstacles.push(new component(10, x-height-gap, color, x, height+gap, "obstacles")); // obs bottom
  }

  // after clearing canvas and push new obstacle to array, move obstacles leftward at interval
  myObstacles.forEach(obstacle => {
      obstacle.x--; // same as 'obstacle.speedX = -1;' and 'obstacle.newPos();'
      obstacle.update(); // display obstacles
  });

  myScore.text = "SCORE: " + myGameArea.score;
  if (myGameArea.score >= 0) myScore.update(); // display score starting from 0
  myGamePiece.newPos();
  myGamePiece.update();

  // extra feature to update game control with keys
  if (myGameArea.keys && myGameArea.keys.length > 0) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    // press arrow keys or <h, j, k, l> to move left, down, up, right
    if (myGameArea.keys[38] || myGameArea.keys[75]) move('up');
    if (myGameArea.keys[40] || myGameArea.keys[74]) move('down');
    if (myGameArea.keys[37] || myGameArea.keys[72]) move('left');
    if (myGameArea.keys[39] || myGameArea.keys[76]) move('right');

    // press <s> to activate bird shrinking functionality
    // TODO: limit the time you can shrink, or how often you can shrink
    // TODO: also, add this as a button
    if (myGameArea.keys[83]) move('shrink');
    

    // TODO: press <spacebar> to restart the game
    // if (myGameArea.keys[32]) startGame(); // space bar doesnt work yet

    myGameArea.keys = []; // soft reset
  }
  window.onkeyup = function() { stopMove(); }

  /* update game control for touch screen devices
   * if (myGameArea.x && myGameArea.y) {
   *  myGamePiece.x = myGameArea.x;
   *  myGamePiece.y = myGameArea.y;
   * }
   */
}

// game control with buttons
function move(direction) {
  myGamePiece.image.src = "pusheendriving.gif";
  if (direction == "up") myGamePiece.speedY -= 2;
  if (direction == "down") myGamePiece.speedY += 2;
  if (direction == "left") myGamePiece.speedX -= 2;
  if (direction == "right") myGamePiece.speedX += 2;
  if (direction == "shrink") {
    myGamePiece.height = myGamePiece.height / 2;
    myGamePiece.width = myGamePiece.width / 2;
    setTimeout(function() {
      myGamePiece.height = myGamePiece.height * 2;
      myGamePiece.width = myGamePiece.width * 2;
    }, 2000)
  }
}

function stopMove() {
  myGamePiece.image.src = "pusheenlazy.gif";
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

// restart game
function restart() { startGame(); }
