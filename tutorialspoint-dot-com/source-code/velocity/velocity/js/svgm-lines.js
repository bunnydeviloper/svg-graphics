/*global $*/
var SVG = {
    createCanvas : function( width, height, containerId ){
        'use strict';
        var container = document.getElementById( containerId),
            canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        container.appendChild( canvas );
        return canvas;
    },
    createLine : function (x1, y1, x2, y2, color, w) {
        'use strict';
        var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        aLine.setAttribute('x1', x1);
        aLine.setAttribute('y1', y1);
        aLine.setAttribute('x2', x2);
        aLine.setAttribute('y2', y2);
        aLine.setAttribute('stroke', color);
        aLine.setAttribute('stroke-width', w);
        return aLine;
    }
},
    wWidth = window.innerWidth,
    wHeight = window.innerHeight,
    canvas = SVG.createCanvas( wWidth , wHeight , 'container' ),
    lines = [];

lines.addLine = function( line ){
    this.push( line );
    return line;
}

/* It returns an array of points that belong to an spiral*/
function spiralPoints(a, b, c){
    'use strict';
    var points = [],
        centerx = wWidth / 2,
        centery = wHeight / 2, angle, x, y, i;

    for (i = 0; i < 300; i++) {
        angle = c * i;
        x = centerx + (a + b * angle) * Math.cos(angle);
        y = centery + (a + b * angle) * Math.sin(angle);
        points.push({"x": x, "y": y});
    }
    return points;
}

/* It paints the archimedean spiral. */
function paintSpiral(a, b, c) {
    'use strict';
    var lineElement, i, x1,
        points = spiralPoints(a, b, c);

    for (i = 2; i < points.length; i += 1) {
        x1 = Math.floor(Math.random() * wHeight / 2),
            lineElement = lines.addLine( SVG.createLine(points[i-1].x, points[i-1].y, points[i].x, points[i].y, 'rgb(0,0,' + x1 + ')', 2) );
        canvas.appendChild( lineElement );
    }
}

/* It animates the spiral. */
function animate(){
    'use strict';
    var randrot = Math.random(),
        randskx = Math.random(),
        randsky = Math.random();
    $('line').each(function (elem) {
        var translation = {
            /*translateX: Math.abs(Math.random()) * 100 + "vw",
            translateY: Math.abs(Math.random()) * 100 + "vh",
            opacity: Math.random() - 0.2,*/
            skewX: randskx,
            skewY: randsky,
            rotateZ: randrot
        };
        $(this).velocity(translation, {
            /* Velocity's default options */
            duration: 300,
            easing: "swing",
            queue: "",
            begin: undefined,
            progress: undefined,
            complete: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true
        });
    });
}

paintSpiral(5, 5, 0.5);
setInterval(animate, 300);