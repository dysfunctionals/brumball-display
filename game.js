Crafty.init(1000, 1100);
Crafty.background('white');

// Paddles
// [X, Y, Angle, Colour]
var center = 750;
var radius = 100;
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray'];

var paddleWidth = 10;
var paddleLength = 100;
var angle = 360/6;
var playerNum = 6;

var number_live_balls = 0;
var max_balls = 4;

for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    var newThing = Crafty.e('Paddle, 2D, DOM, Color');
    newThing.color(colours[paddlePos]);
    newThing.origin("center");
    newThing.attr({
            x: center + radius*Math.sin(paddlePos*angle),
            y: center + radius*Math.cos(paddlePos*angle),
            w: paddleWidth, h: paddleLength,
            rotation: paddlePos*angle
        });


    console.log(newThing);
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
