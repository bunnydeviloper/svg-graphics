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
  const clock = document.getElementById("myClock");
  const c = clock.getContext('2d');

  let radius = clock.height/2;
  c.translate(radius, radius); // remap the (0,0) position to the center of canvas
  radius = radius * 0.90; // reduce clock radius to fit canvas size
  setInterval(drawClock); // to start the clock call drawClock fn at intervals

  function drawClock() {
    drawFace(c, radius);
    drawNumbers(c, radius);
    drawTime(c, radius);
  }

  function drawFace(c, radius) {
    // draw the big cirle for clock's border
    c.beginPath();
    c.arc(0, 0, radius, 0, 2*Math.PI);
    c.fillStyle = "white";
    c.fill();

    // add circular gradient effect on border
    const grad = c.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.02);
    grad.addColorStop(0, "#333"); // inner edge
    grad.addColorStop(0.5, "white"); // middle edge
    grad.addColorStop(1, "#333"); // outer edge
    c.strokeStyle = grad;
    c.lineWidth = radius*0.1;
    c.stroke();

    // draw the tiny cirle for clock's heart
    c.beginPath();
    c.arc(0, 0, radius*0.1, 0, 2*Math.PI);
    c.fillStyle = "#333";
    c.fill();
  }

  function drawNumbers(c, radius) {
    c.font = radius*0.15 + "px arial";
    c.textBaseline = "middle";
    c.textAlign = "center";
    for (let num = 1; num < 13; num++) {
      /* each angle is 180 deg divide 6 */
      let ang = num * Math.PI/6; 

        c.rotate(ang);
        c.translate(0, -radius*0.85); // the number position is 85% from the middle of circle
        c.rotate(-ang);
        c.fillText(num.toString(), 0, 0);
        c.rotate(ang);
        c.translate(0, radius*0.85);
        c.rotate(-ang);
    }
  }

  function drawTime(c, radius) {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    
    //hour
    hour = hour % 12;
    hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
    drawHand(c, hour, radius*0.5, radius*0.07);
    //minute
    minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(c, minute, radius*0.8, radius*0.07);
    // second
    second = (second*Math.PI/30);
    drawHand(c, second, radius*0.9, radius*0.02);
  }

  function drawHand(c, pos, length, width) {
      c.beginPath();
      c.lineWidth = width;
      c.lineCap = "round";
      c.moveTo(0,0);
      c.rotate(pos);
      c.lineTo(0, -length);
      c.stroke();
      c.rotate(-pos);
  }
}
