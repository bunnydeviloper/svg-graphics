window.onload = function() { startGame(); }
console.log('something');

let myGamePiece; // initialize game piece

function startGame() {
  myGameArea.start();
  myGamePiece = new component(20, 20, 'blue', 10, 70);
}

const myGameArea = {
  canvas: document.createElement('canvas'),

  start: function() {
    // this.canvas.width = 500; // override the style tag
    // this.canvas.height = 300; // override the style tag
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);

    // game control for up-down-right-left arrow keys
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown"); // true
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown") // false
    })

    // game control for touch screen devices
    window.addEventListener('touchmove', function (e) {
      myGameArea.x = e.touches[0].screenX;
      myGameArea.y = e.touches[0].screenY;
    })
  },

  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

// constructor function for canvas element
function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;    
  this.updateRect = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };
}

function updateGameArea() {
  myGameArea.clear();

  // update game control with keys
  if (myGameArea.keys && myGameArea.keys.length > 0) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys[37]) myGamePiece.speedX = -1;
    if (myGameArea.keys[39]) myGamePiece.speedX = 1;
    if (myGameArea.keys[38]) myGamePiece.speedY = -1;
    if (myGameArea.keys[40]) myGamePiece.speedY = 1;
    myGameArea.keys = []; // soft reset
  }

  // update game control for touch screen devices
  if (myGameArea.x && myGameArea.y) {
    myGamePiece.x = myGameArea.x;
    myGamePiece.y = myGameArea.y;
  }

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
