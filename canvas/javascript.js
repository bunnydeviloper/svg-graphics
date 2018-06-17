window.onload = function() { startGame(); }

function startGame() {
  myGameArea.start();
  const myGamePiece = new component(30, 30, 'red', 10, 120);
}

const myGameArea = {
  canvas: document.createElement('canvas'),
  start: function() {
    this.canvas.width = 500; // overridden by style tag
    this.canvas.height = 300; // overridden by style tag
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
};

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;    
  ctx = myGameArea.context;
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
}
