// window.onload = function() { startGame(); }

let myGamePiece;        // initialize game piece component
let myObstacles = [];   // initialize obstacle component, save multiples obs in an array
let myScore;            // initialize score component
let myBackground;       // initialize background component
let mySound;            // initialize sound component
let myMusic;            // initialize sound component for background music

/* TODO: for user to select diff. avatar -> doesn't work yet, not sure why...
const pickAvatar(id) => {
  let avatar = document.getElementbyId(id);
  avatar.addEventListener("click", startGame(id));
};

window.onload = function() {
document.getElementById('spaceship').onclick = function() { startGame('spaceship.png'); };
document.getElementById('mangocat').onclick = function() { startGame('catreading.jpg'); };
document.getElementById('pusheen').onclick = function() { startGame('angrybird2.jpg'); };
}
*/

function startGame() {
 // myGameArea.reset();
  myGamePiece = new component(40, 40, 'angrybird2.jpg', 10, 70, "image");
  // myGamePiece = new component(40, 40, 'blue', 10, 70, "piece");

  myScore = new component("20px", "Consolas", "black", 480, 40, "text");
  myBackground = new component(699, 410, 'background.jpg', -5, 0, "background");

  mySound = new sound("gunhit.mp3");
  myMusic = new sound("candycrush.mp3", "background");
  myMusic.play();

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
  reset: function() {
    myGamePiece = undefined;
    myObstacles = [];
    myScore = "";
  },
};

// constructor function for canvas element
function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }

  this.width = width;
  this.height = height;
  this.speedX = 2;
  this.speedY = 2;
  this.angle = 0;
  this.gravity = 0.05;
  this.gravitySpeed = 0.1;
  this.bounce = 0.6; // 0 means no bounce, 1 means bounce back to where it start falling
  this.color = color;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;

    /* draw using outside image, the image is ugly due to re-scale/size */
    if (type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      // Add a second background after the first background
      ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
    if (type == "image") {
      // draw image as regular square, no rotate
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      /* currently rotation works but it create a gap when hitting objects
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(this.image, this.x/-2, this.y/-2, this.width, this.height);
      ctx.restore();
      */
    }
    if (type == "piece") {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      // NOTE: must use fillRect, cannot use ctx.rect(...) and ctx.fill();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
      ctx.restore();
    }
    if (type == "obstacles") {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
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
    if (this.type == "background") {
      this.x += this.speedX;
      if (this.x == -(this.width)) this.x = 0; // if reach the end of image, rewind
    } else {
    this.gravitySpeed += this.gravity;
    // this.x += this.speedX;
    // this.y += this.speedY + this.gravitySpeed;
    this.x += this.speedX + this.gravitySpeed*0.1;
    this.y += this.speedY + this.gravitySpeed*0.5;
    }

    this.hitEdge();
  };
  this.hitEdge = function() {
    // if hit top edge, fall down
    if (this.y < (this.width/2)) {
      this.y = this.width/2;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce)*1.5;
    }
    const rockbottom = myGameArea.canvas.height - this.height;
    // if hit bottom edge, bounce back up
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
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
    //console.log("my right", myright, "and other left", otherleft);
    if ((mybottom < othertop) || // myGamePiece is above
        (mytop > otherbottom) || // myGamePiece is below
        (myright < otherleft) || // myGamePiece is on the left side
        (myleft > otherright)) { // myGamePiece is on the right side
       crash = false;
    }
    return crash;
  }
}

function sound(src, type) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.type = type;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  if (this.sound.type == "background") this.sound.loop = true;
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }
}

// check the current frame number and return true if corresponds with given interval
// make sure to initialize frameNo in myGameArea.start()
function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) return true;
  return false;
}

function accelerate(n) { myGamePiece.gravity = n }

function updateGameArea() {
  // first, loop through every obstacles to see if there's a crash, then stop
  myObstacles.forEach(obstacle => {
    if (myGamePiece.crashWith(obstacle)) {
      mySound.play();
      myMusic.stop();
      myGameArea.stop();
      return;
    }
  } );
  
  // otherwise continue the game
  myGameArea.clear(); // clear trailing path of myGamePiece

  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update();

  myGameArea.frameNo++;
  // add new obs at the beginning of game or every 150th frame, randomize height and gap
  if (myGameArea.frameNo == 1 || everyInterval(250)) {
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

    myObstacles.push(new component(20, height, color, x, 0, "obstacles")); // top obstacle
    myObstacles.push(new component(20, x-height-gap, color, x, height+gap, "obstacles")); // bottom obs
  }

  // after clearing canvas and push new obstacle to array, move obstacles leftward at interval
  myObstacles.forEach(obstacle => {
      obstacle.x--; // same as 'obstacle.speedX = -1;' and 'obstacle.newPos();'
      obstacle.update(); // display obstacles
  });

  myScore.text = "SCORE: " + myGameArea.score;
  if (myGameArea.score >= 0) myScore.update(); // display score starting from 0

  myGamePiece.angle += 2 * Math.PI / 180;
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
  if (myGamePiece.type == "image") myGamePiece.image.src = "angrybird.png";
  if (direction == "up") {
    myGamePiece.speedY -= 2;
    accelerate(-0.1);
  }
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
  accelerate(0.02);
  if (myGamePiece.type == "image") myGamePiece.image.src = "angrybird2.jpg";
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

// restart game
function restart() {
//  myGameArea.reset();
  startGame();
}
