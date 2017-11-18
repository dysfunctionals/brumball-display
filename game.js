
var windowSize = 1000; // Window Size
var center = windowSize/2; // Window Center
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
var ballRadius = 9;

Crafty.init(windowSize, windowSize); // Init the window
Crafty.background('white'); // Sets the window background

var outerRadius = radius + 10;
var outerLength = outerRadius * 2 * Math.tan(angleRad/2);
for(var outerPos = 0; outerPos < playerNum; outerPos++){
	var wall = Crafty.e("Wall, 2D, DOM, Color, Collision");
	wall.attr({
		x: center + (outerLength * Math.sin(outerPos * angleRad - (angleRad/2))),
		y: center + (outerLength * Math.cos(outerPos * angleRad - (angleRad/2))),
		w: outerLength,
		h: 5,
		rotation: -outerPos * angleDeg
	});
	wall.color("black");
}

// Creates the paddles
for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    // Create a paddle
    var paddle = Crafty.e('Paddle, 2D, DOM, Color, Collision, WiredHitBox');

	paddle.debugStroke("green");

    paddle.color(colours[paddlePos]);
    paddle.attr({
        originalX: center + (topRadius * Math.sin(paddlePos * angleRad - (angleRad / 2))),
        originalY: center + (topRadius * Math.cos(paddlePos * angleRad - (angleRad / 2))),
        w: paddleLength, h: paddleThickness,
        rotation: -paddlePos * angleDeg,
        position: [-1,1,-1,1,-1,1][paddlePos],
        //position: 0,
        movement: 1 // Clockwise 1 Anticlock -1 No thing 0
    });
    paddle.calcPos = function() {
        this.attr({
            x: this.originalX + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.cos(this.rotation * 2*Math.PI/360)),
            y: this.originalY + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.sin(this.rotation * 2*Math.PI/360))
        });
    };
    paddle.calcPos();
    paddle.bind('EnterFrame', function () {
        if (this.movement === 1) {
            if (this.position < 1) {
                this.position += 0.05;
            } else {
                this.movement = -1;
            }
        } else if (this.movement === -1) {
            if (this.position > -1) {
                this.position -= 0.05;
            } else {
                this.movement = 1;
            }
        } else {
            // No movement
        }
        this.calcPos();
    });
}

function createBall() {
    if (number_live_balls < max_balls) {
        number_live_balls++;

        var ball = Crafty.e('Ball, 2D, DOM, Color, Collision');
        // ball.color(colours[(Math.random()*playerNum)]);
        ball.color('black');
        ball.attr({
            x: center,
            y: center,
            h: ballRadius,
            w: ballRadius,
            dx: Math.random()*2,
            dy: Math.random()*2
        });
        ball.bind('EnterFrame', function() {
            this.x += this.dx;
            this.y += this.dy;
        });

        ball.onHit('Paddle', function() {
            console.log('Hit paddle');
            this.dx *= -1;
            this.dy *= -1;
        });
        ball.onHit('Wall', function() {
            console.log('Hit wall');
            this.destroy();
        });
        console.log("Ball Created");
    } else {
        console.log('Max balls');
    }
}

// Server ping
function paddleMovements() {

}

createBall();
setInterval(createBall, 3000);
// setInterval(paddleMovements, 50);
