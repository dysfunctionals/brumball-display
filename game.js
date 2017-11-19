
// window Variables
var windowSize = 1000; // Window Size
var scoreboardHeight = 100;
var center = windowSize/2; // Window Center
var radius = windowSize/3; // Window Radius]
var url = "http://localhost:8080"; // Url to the server

// Paddle variables
var paddleThickness = 10; // Paddle Thickness
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'gray']; // Paddle Colours
var powerupDelay = 3000;
var defaultPaddleLength = 125;
var minPaddleLength = 75;
var maxPaddleLength = 200;

// Setup variables
var playerNum = 6; // Number of players
var angleRad = 2*Math.PI/playerNum; // Gets the angle between players
var angleDeg = 360/playerNum; // Gets the angle between players
var topRadius = 2 * radius * Math.tan(angleRad/2);

// Balls variables
var number_live_balls = 0; // Number of balls currently
var defaultMaxBalls = 4;
var maxBalls = defaultMaxBalls; // The maximum number of balls
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
var maxMassBallz = 25;

var teamScores = [0, 0, 0, 0, 0, 0];
var paddleHitScore = 1;
var wallHitScore = -3;

Crafty.sprite(64, "powerupSprites.png",
    {PaddleLonger:[0,0], PaddleShorter:[0,1], PaddleDynamic:[0,2], massBallz:[0,3], ballSpeed:[0,4], ballCurve:[0,5]});
var powerupName = ["PaddleLonger", "PaddleShorter", "PaddleDynamic", "massBallz", "ballSpeed", "ballCurve"];

Crafty.init(windowSize, windowSize + scoreboardHeight); // Init the window
Crafty.background('white'); // Sets the window background

var outerRadius = radius + 10;
var outerLength = outerRadius * 2 * Math.tan(angleRad/2);
for(var outerPos = 0; outerPos < playerNum; outerPos++){
	var wall = Crafty.e("Wall, 2D, DOM, Color, Collision");
	wall.attr({
        id: outerPos,
		x: center + (outerLength * Math.sin(outerPos * angleRad - (angleRad/2))),
		y: center + (outerLength * Math.cos(outerPos * angleRad - (angleRad/2))),
		w: outerLength + 4,
		h: 5,
		rotation: -outerPos * angleDeg
	});
	wall.onHit('Ball', function() {
	    teamScores[this.id] += wallHitScore;
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
        w: defaultPaddleLength, h: paddleThickness,
        paddleLength: defaultPaddleLength,
        rotation: -paddlePos * angleDeg,
        //position: [-1,1,-1,1,-1,1][paddlePos],
        position: 0,
        movement: 0 // Clockwise 1 Anticlock -1 No thing 0
    });

    paddle.calcPos = function() {
        this.attr({
            x: this.originalX + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.cos(this.rotation * 2*Math.PI/360)),
            y: this.originalY + ((topRadius/2 - paddleLength/2) * (this.position + 1) * Math.sin(this.rotation * 2*Math.PI/360))
        });
    };

    paddle.bind('EnterFrame', function() {
        this.position += this.movement * 0.05;
        if (this.position > 1) this.position = 1;
        if (this.position < -1) this.position = -1;
        this.calcPos();
    });

    paddle.onHit('Ball', function() {
        teamScores[this.id] += paddleHitScore;
    });
}

var scoreboard = Crafty.e('2D, DOM, Text');
scoreboard.attr({x:0, y:windowSize, w:windowSize, h:scoreboardHeight});
scoreboard.updateText = function() {
    this.text = "Scoreboard ";
    for (var team = 0; team < playerNum; team++) {
        this.text += colours[team] + ": " + teamScore[team] + " ";
    }
};

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

function setPaddleSize(size) {
    Crafty('Paddle').each(function(paddle) {
        paddle.paddleLength = size;
        paddle.w = size;
    });
}

function createPowerup() {
    if (number_live_powerup < maxPowerups) {
        var powerUpId = Crafty.math.randomInt(0, 4);
        var powerup = Crafty.e("PowerUp, 2D, DOM, Collision, "+powerupName[powerUpId]);
        powerup.attr({
            id: powerUpId,
            x: center+(Math.random()-0.5*200),
            y: center+(Math.random()-0.5*200),
            color: 'red'
        });
        powerup.onHit('Ball', function() {
            console.log("Powerup Hit");
            number_live_powerup--;
            this.runPowerup();
            this.destroy();
        });
        switch(powerUpId) {
            // Increase Paddle Size
            case 0:
                setPaddleSize(maxPaddleLength);
                setTimeout(setPaddleSize, powerupDelay, defaultPaddleLength);
                break;

            // Decrease Paddle size
            case 1:
                setPaddleSize(minPaddleLength);
                setTimeout(setPaddleSize, powerupDelay, defaultPaddleLength);
                break;

            // PaddleDynamic
            case 2:
                setPaddleSize(minPaddleLength);
                setTimeout(setPaddleSize, powerupDelay/2, maxPaddleLengthx);
                setTimeout(setPaddleSize, powerupDelay, defaultPaddleLength);
                break;

            // massBallz
            case 3:
                for (var ball = 0; ball < maxMassBallz; ball++) {
                    maxBalls = maxMassBallz;
                    createBall();
                }
                maxBalls = defaultMaxBalls;
                break;

            // ballSpeed
            case 4:
                Crafty('Ball').each(function(ball) {
                    ball.dx *= 5;
                    ball.dy *= 5;
                });
                break;

            // ballCurve
            case 5:
                console.log('Ball Curve');
                break;


        }

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
		    });
        }
    });
}

createBall();
setInterval(createBall, createBallInterval);

//createPowerup();
//setInterval(createPowerup, createPowerupInterval);

setInterval(paddleRequest, 100);
