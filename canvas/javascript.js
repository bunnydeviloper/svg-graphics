window.onload = function() { startGame(); }

let myGamePiece;

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
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      console.log(e.keyCode);
      myGameArea.keys[e.keyCode] = (e.type == "keydown"); // true
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown") // false
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

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
  if (myGameArea.keys && myGameArea.keys[37]) myGamePiece.speedX = -1;
  if (myGameArea.keys && myGameArea.keys[39]) myGamePiece.speedX = +1;
  if (myGameArea.keys && myGameArea.keys[38]) myGamePiece.speedY = -1;
  if (myGameArea.keys && myGameArea.keys[40]) myGamePiece.speedY = +1;
  myGamePiece.newPos();
  myGamePiece.updateRect();
}

function moveup() { myGamePiece.speedY -= 1; }
function movedown() { myGamePiece.speedY += 1; }
function moveleft() { myGamePiece.speedX -= 1; }
function moveright() { myGamePiece.speedX += 1; }

function stopMove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}
