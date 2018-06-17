window.onload = function() {
  canvasBasic();
  canvasClock();
}

function canvasBasic() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext('2d');

  // Create gradient
  const grd = ctx.createLinearGradient(0,0,200,0);
  grd.addColorStop(0,"red");
  grd.addColorStop(1,"white");
  ctx.fillStyle = grd;
  ctx.fillRect(10,10,150,75);

  // draw a line
  ctx.moveTo(0,0);
  ctx.lineTo(200,100);
  ctx.stroke();

  // draw a circle
  ctx.beginPath()
  ctx.arc(95,50,40,0,2*Math.PI); // x,y,r, startAngle, endAngle
  ctx.stroke();

  // add text and text styling
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "blue";
  ctx.textAlign = "center";
  ctx.fillText("Helloooo", canvas.width/2, canvas.height/2);
};

function canvasClock() {
 
}
