window.onload = function() { startGame(); }

let myGamePiece;

function startGame() {
  myGameArea.start();
  myGamePiece = new component(30, 30, 'red', 10, 120, 15);
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

function component(width, height, color, x, y, r) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;    
  this.r = r;
  this.updateRect = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.updateCircle = function() {
    ctx = myGameArea.context;
    ctx.arc(this.x+15, this.y-20, this.r, 0, 2*Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();

  };
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.updateRect();
  myGamePiece.updateCircle();
}
