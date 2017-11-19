
// window Variables
var windowSize = 1000; // Window Size
var center = windowSize/2; // Window Center
var radius = windowSize/3; // Window Radius]
var url = "http://localhost:8080"; // Url to the server

// Paddle variables
var paddleThickness = 10; // Paddle Thickness
var paddleLength = 125; // Paddle Length
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray']; // Paddle Colours

// Setup variables
var playerNum = 6; // Number of players
var angleRad = 2*Math.PI/playerNum; // Gets the angle between players
var angleDeg = 360/playerNum; // Gets the angle between players
var topRadius = 2 * radius * Math.tan(angleRad/2);

// Balls variables
var number_live_balls = 0; // Number of balls currently
var max_balls = 5; // The maximum number of balls
var ballRadius = 10;
var ballAcceleration = 5;
var maxBallSpeed = 3;
var minBallSpeed = 0.5;
var paddleHitMultiplier = 1.5;
var createBallInterval = 3000;

// Powerup variables
var number_live_powerup = 0;
var maxPowerups = 3;
var powerupRadius = 40;
var createPowerupInterval = 3000;

Crafty.init(windowSize, windowSize); // Init the window
Crafty.background('white'); // Sets the window background

var outerRadius = radius + 10;
var outerLength = outerRadius * 2 * Math.tan(angleRad/2);
for(var outerPos = 0; outerPos < playerNum; outerPos++){
	var wall = Crafty.e("Wall, 2D, DOM, Color, Collision");
	wall.attr({
		x: center + (outerLength * Math.sin(outerPos * angleRad - (angleRad/2))),
		y: center + (outerLength * Math.cos(outerPos * angleRad - (angleRad/2))),
		w: outerLength + 4,
		h: 5,
		rotation: -outerPos * angleDeg
	});
	wall.color("black");
}

// Creates the paddles
for (var paddlePos = 0; paddlePos < playerNum; paddlePos++) {
    // Create a paddle
    var paddle = Crafty.e('Paddle, 2D, DOM, Color, Collision');

    paddle.color(colours[paddlePos]);
    paddle.attr({
        id: paddlePos,
        originalX: center + (topRadius * Math.sin(paddlePos * angleRad - (angleRad / 2))),
        originalY: center + (topRadius * Math.cos(paddlePos * angleRad - (angleRad / 2))),
        w: paddleLength, h: paddleThickness,
        rotation: -paddlePos * angleDeg,
        //position: [-1,1,-1,1,-1,1][paddlePos],
        position: 0,
        movement: 0.2 // Clockwise 1 Anticlock -1 No thing 0
    });
    paddle.calcPos = function() {
        this.attr({
            x: this.originalX + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.cos(this.rotation * 2*Math.PI/360)),
            y: this.originalY + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.sin(this.rotation * 2*Math.PI/360))
        });
    };
    paddle.calcPos();
    paddle.bind('EnterFrame', function () {
	this.position += this.movement * 0.05;
	if(this.position > 1) this.position = 1;
	if(this.position < -1) this.position = -1;
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
            dx: (Math.random()-0.5)*ballAcceleration,
            dy: (Math.random()-0.5)*ballAcceleration
        });

        ball.bind('EnterFrame', function() {
            if (this.dx < minBallSpeed && this.dy < minBallSpeed) {
                this.dx = (Math.random()-0.5)*6;
                this.dy = (Math.random()-0.5)*6;
            }
            if (this.dx > maxBallSpeed) {
                this.dx = maxBallSpeed;
            } else if (this.dy > maxBallSpeed) {
                this.dy = maxBallSpeed;
            }

            this.x += this.dx;
            this.y += this.dy;
        });

        ball.onHit('Paddle', function() {
            console.log('Hit paddle');
            this.x += -this.dx;
            this.y += -this.dy;

            this.dx = -(this.dx + (Math.random() * paddleHitMultiplier));
            this.dy = -(this.dy + (Math.random() * paddleHitMultiplier));
        });
        ball.onHit('Wall', function() {
            console.log('Hit wall');
            this.destroy();
            number_live_balls--;
            createBall();
        });
    }
}

function createPowerup() {
    if (number_live_powerup < maxPowerups) {
        var powerUpId = Crafty.math.randomInt(0, 4);
        var powerUps = ["", "", "", ""];
        Crafty.sprite("img/"+powerUps[powerUpId]);
        var powerup = Crafty.e("PowerUp, 2D, DOM, Color, Collision");
        powerup.attr({
            id: powerUpId,
            x: center+(Math.random()-0.5*200),
            y: center+(Math.random()-0.5*200),
            color: 'red'
        });
        powerup.onHit('Ball', function() {
            console.log("Powerup Hit");
            number_live_powerup--;
            // TODO run powerup function
            this.destroy();
        });
        number_live_powerup++;
        console.log('Create powerup');
    }
}

function paddleRequest() {
    $.get(url+"/paddles", function (data) {
        if (data.status == "fail") {
            console.log("Well something went wrong");
        } else {
            paddles = Crafty('Paddle');
		paddles.each(function(i){
			this.movement = data["data"][i];
		//	console.log(this.movement);
		});
        }
    });
}

createBall();
setInterval(createBall, createBallInterval);

createPowerup();
setInterval(createPowerup, createPowerupInterval);

setInterval(paddleRequest, 100);
