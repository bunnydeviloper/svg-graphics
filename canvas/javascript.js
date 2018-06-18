window.onload = function() { startGame(); }

let myGamePiece;

function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, 'blue', 10, 120);
}

const myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = 500; // overridden by style tag
    this.canvas.height = 300; // overridden by style tag
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
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
