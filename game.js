// Paddles
// [X, Y, Angle, Colour]
var windowSize = 750;
var center = windowSize/3;
var radius = windowSize/3;
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray'];

var paddleThickness = 10;
var paddleLength = 250;

var playerNum = 6;
var angleRad = 2*Math.PI/playerNum;
var angleDeg = 360/playerNum;
var paddles = [];

var number_live_balls = 0;
var max_balls = 4;

Crafty.init(windowSize, windowSize+100);
Crafty.background('white');

for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    var paddle = Crafty.e('Paddle, 2D, DOM, Color');
    paddle.color(colours[paddlePos]);
    paddle.attr({
        x: center + radius * Math.sin(paddlePos * angleRad),
        y: center + radius * Math.cos(paddlePos * angleRad),
        w: paddleLength, h: paddleThickness,
        rotation: -paddlePos * angleDeg
    });
    paddle.origin("center");

    console.log("Paddle X:" + paddle.attr("x") + " Y:" + paddle.attr("y") + " R:" + paddle.attr("rotation") + " C:" + colours[paddlePos]);
}

function createBall() {
    if (number_live_balls < max_balls) {
        number_live_balls++;

        var ball = Crafty.e();
    }

}

// Server ping
function paddleMovements() {

}

// setInterval(createBall, 5000);
