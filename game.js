
var windowSize = 750; // Window Size
var center = windowSize/3; // Window Center
var radius = windowSize/3; // Window Radius
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray']; // Paddle Colours

var paddleThickness = 10; // Paddle Thickness
var paddleLength = 75; // Paddle Length

var playerNum = 6; // Number of players
var angleRad = 2*Math.PI/playerNum; // Gets the angle between players
var angleDeg = 360/playerNum; // Gets the angle between players
var topRadius = 2 * radius * Math.tan(angleRad/2);
var paddles = []; // Paddles

var number_live_balls = 0; // Number of balls currently
var max_balls = 4; // The maximum number of balls

Crafty.init(windowSize, windowSize+100); // Init the window
Crafty.background('white'); // Sets the window background

// Creates the paddles
for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    // Create a paddle
    var paddle = Crafty.e('Paddle, 2D, DOM, Color, Collision');

    paddle.color(colours[paddlePos]);
    paddle.attr({
        originalX: center + radius * Math.sin(paddlePos * angleRad),
        originalY: center + radius * Math.cos(paddlePos * angleRad),
        w: paddleLength, h: paddleThickness,
        rotation: -paddlePos * angleDeg,
        position: [-0.8,0,0,0,0,1][paddlePos],
        movement: 1 // Clockwise 1 Anticlock -1 No thing 0
    });
    paddle.calcPos = function() {
        console.log(paddle.attr("originalX"));
        this.attr({
            x: this.originalX + ((topRadius/2 - paddleLength/2) * this.position * Math.cos(this.rotation * 2*Math.PI/360)),
            y: this.originalY + ((topRadius/2 - paddleLength/2) * this.position * Math.sin(this.rotation * 2*Math.PI/360))
        });
    };
    paddle.calcPos();
    paddle.origin("center");
    paddle.bind('EnterFrame', function () {

    });

    console.log("Paddle X:" + paddle.attr("x") + " Y:" + paddle.attr("y") + " R:" + paddle.attr("rotation") + " C:" + colours[paddlePos]);
}

function createBall() {
    if (number_live_balls < max_balls) {
        number_live_balls++;

        var ball = Crafty.e('Ball, 2D, DOM, Color');
    }

}

// Server ping
function paddleMovements() {

}

// setInterval(createBall, 5000);
