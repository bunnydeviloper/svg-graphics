/* global $*/
// Namespace structure
var svgm = (function () {
    'use strict';
    return {
        startMagic: function () {
        }
    };
})();

// Todo: Move to the namespace when ready!
function startMagic() {
    $('.simple-circle').each(function (elem) {
        var translation = {
            translateX: Math.abs(Math.random()) * 100 + "vw",
            translateY: Math.abs(Math.random()) * 100 + "vh",
            opacity: Math.random() - 0.2,
            fill: randomColor()
        };
        $(this).velocity(translation, {
            /* Velocity's default options */
            duration: 4000,
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

function randomColor(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

// Todo: Move to the namespace when ready!
function initializeMagic() {
    'use strict';
    var pattern = $('.simple-circle').first();
    for (var i = 0; i < 50; i++) {
        $('#svg-playground').append(pattern.clone());
    }
}

$(document).ready(function () {
    'use strict';
    initializeMagic();
    setInterval(startMagic, 4000);
});