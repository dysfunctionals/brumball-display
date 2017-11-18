Crafty.init(500, 500);
Crafty.background('white');

// Paddles
// [X, Y, Angle, Colour]
var center = 250;
var radius = 100;
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray'];

var paddleThickness = 10;
var paddleLength = 100;

var playerNum = 6;
var angleRad = 2*Math.PI/playerNum;
var angleDeg = 360/playerNum;


var number_live_balls = 0;
var max_balls = 4;

for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    var newThing = Crafty.e('Paddle, 2D, DOM, Color');
    newThing.color(colours[paddlePos]);
    newThing.attr({
            x: center + radius*Math.sin(paddlePos*angleRad),
            y: center + radius*Math.cos(paddlePos*angleRad),
            w: paddleLength, h: paddleThickness,
            rotation: -paddlePos*angleDeg
        });
    newThing.origin("center")

    console.log("Paddle X:"+newThing.attr("x")+" Y:"+newThing.attr("y")+" R:"+newThing.attr("rotation")+" C:"+colours[paddlePos]);

}

function createBall() {
    if (number_live_balls < max_balls) {
        number_live_balls++;

        Crafty.e();
    }

}

// Server ping
function paddleMovements() {

}

// setInterval(createBall, 5000);
