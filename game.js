// window Variables
var windowSize = 1000; // Window Size
var scoreboardSize = 600;
var center = windowSize / 2; // Window Center
var radius = windowSize / 3; // Window Radius
var url = "/api"; // Url to the server

// Paddle variables
var paddleThickness = 10; // Paddle Thickness
var colours = ['blue', 'red', 'purple', 'green', 'pink', 'orange']; // Paddle Colours
var powerupDelay = 3000;
var defaultPaddleLength = 125;
var minPaddleLength = 75;
var maxPaddleLength = 200;

// Setup variables
var playerNum = 6; // Number of players
var angleRad = 2 * Math.PI / playerNum; // Gets the angle between players
var angleDeg = 360 / playerNum; // Gets the angle between players
var topRadius = 2 * radius * Math.tan(angleRad / 2);

// Balls variables
var number_live_balls = 0; // Number of balls currently
var defaultMaxBalls = 0;
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
var powerupRadius = 100;
var createPowerupInterval = 3000;
var maxMassBallz = 25;

var teamScores = [0, 0, 0, 0, 0, 0];
var paddleHitScore = 3;
var wallHitScore = -1;

Crafty.init(windowSize + scoreboardSize + 500, windowSize); // Init the window
Crafty.background('white'); // Sets the window background

Crafty.sprite(64, "paddleLonger.png", {PaddleLonger:[0,0]});
Crafty.sprite(64, "paddleShorter.png", {PaddleShorter:[0,0]});
Crafty.sprite(64, "paddleDynamic.png", {PaddleDynamic:[0,0]});
Crafty.sprite(64, "massBallz.png", {MassBallz:[0,0]});
Crafty.sprite(64, "ballSpeed.png", {BallSpeed:[0,0]});
var powerupName = ["PaddleLonger", "PaddleShorter", "PaddleDynamic", "MassBallz", "BallSpeed"];

var outerRadius = radius + 10;
var outerLength = outerRadius * 2 * Math.tan(angleRad / 2);
for (var outerPos = 0; outerPos < playerNum; outerPos++) {
    var wall = Crafty.e("Wall, 2D, DOM, Color, Collision");
    wall.attr({
        id: outerPos,
        x: center + (outerLength * Math.sin(outerPos * angleRad - (angleRad / 2))),
        y: center + (outerLength * Math.cos(outerPos * angleRad - (angleRad / 2))),
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
        w: defaultPaddleLength, h: paddleThickness,
        paddleLength: defaultPaddleLength,
        rotation: -paddlePos * angleDeg,
        //position: [-1,1,-1,1,-1,1][paddlePos],
        position: 0,
        movement: 0 // Clockwise 1 Anticlock -1 No thing 0
    });

    paddle.calcPos = function () {
        this.attr({
            x: this.originalX + ((topRadius / 2 - this.paddleLength / 2) * (this.position + 1) * Math.cos(this.rotation * 2 * Math.PI / 360)),
            y: this.originalY + ((topRadius / 2 - this.paddleLength / 2) * (this.position + 1) * Math.sin(this.rotation * 2 * Math.PI / 360))
        });
    };

    paddle.bind('EnterFrame', function () {
        this.position += this.movement * 0.05;
        if (this.position > 1) this.position = 1;
        if (this.position < -1) this.position = -1;
        this.calcPos();
    });

    paddle.onHit('Ball', function () {
        teamScores[this.id] += paddleHitScore;
    });
}

var title = Crafty.e('2D, DOM, Text');
title.attr({y: 0, x: windowSize, w: scoreboardSize, h: windowSize});
title.textFont({size: "7em"});
title.text("BrumBall.com");

var scoreboard = Crafty.e('2D, DOM, Text');
scoreboard.attr({y: 200, x: windowSize, w: scoreboardSize, h: windowSize});
scoreboard.textFont({size: "4em"});
scoreboard.updateText = function () {
    text = "";
    for (var team = 0; team < playerNum; team++) {
        text += "<span style=\"color:" + colours[team] + "\">&#9679;</span> " + toTitleCase(colours[team]) + ": " + teamScores[team] + "<br>";
    }
    scoreboard.text(text);
};
setInterval(scoreboard.updateText, 200);

function createBall() {
    if (number_live_balls < maxBalls) {
        number_live_balls++;

        var ball = Crafty.e('Ball, 2D, DOM, Color, Collision');
        // ball.color(colours[(Math.random()*playerNum)]);
        ball.color('black');
        ball.attr({
            x: center,
            y: center,
            h: ballRadius,
            w: ballRadius,
            dx: (Math.random() - 0.5) * ballAcceleration,
            dy: (Math.random() - 0.5) * ballAcceleration
        });

        ball.bind('EnterFrame', function () {
            if (Math.pow(this.dx, 2) + Math.pow(this.dy, 2) < Math.pow(minBallSpeed, 2)) {
                this.dx = (Math.random() - 0.5)  * ballAcceleration;
                this.dy = (Math.random() - 0.5) * ballAcceleration;
            }

            if (Math.abs(this.dx) > maxBallSpeed) {
                this.dx = maxBallSpeed;
            } else if (Math.abs(this.dy) > maxBallSpeed) {
                this.dy = maxBallSpeed;
            }

            this.x += this.dx;
            this.y += this.dy;
        });

        ball.onHit('Paddle', function (hit) {
            teamScores[hit[0].obj.id] += paddleHitScore;
            this.x += -this.dx*2;
            this.y += -this.dy*2;

            this.dx = -(this.dx + (Math.random() * paddleHitMultiplier));
            this.dy = -(this.dy + (Math.random() * paddleHitMultiplier));
        });
        ball.onHit('Wall', function (hit) {
            teamScores[hit[0].obj.id] += wallHitScore;
            this.destroy();
            number_live_balls--;
            createBall();
        });
    }
}

function setPaddleSize(size) {
    Crafty('Paddle').each(function () {
        this.paddleLength = size;
        this.w = size;
    });
}

function createPowerup(index) {
    if (index == undefined) {
        console.log('Error undefined index');
    } else if (number_live_powerup < maxPowerups) {
        var powerUpId = index;
        //var powerup = Crafty.e('PowerUp, 2D, canvas, Collision, ' + powerupName[powerUpId]);
        var powerup = Crafty.e('Powerup, 2D, '+powerupName[powerUpId]+', Canvas, Collision, WiredHitBox');
        powerup.attr({
            x: center+(Math.random()-0.5)*300,
            y: center+(Math.random()-0.5)*300,
            w: powerupRadius, h: powerupRadius
        });
        powerup.collision(new Crafty.polygon(
            17, 105, 84, 105, 115, 50, 84, -15, 17, -15, -15, 50
        ));
        powerup.debugStroke('Black');

        powerup.onHit('Ball', function () {
            number_live_powerup--;
            this.runPowerup();
            this.destroy();
        });
        number_live_powerup++;

        switch (powerUpId) {
            // Increase Paddle Size
            case 0:
                powerup.runPowerup = function () {
                    setPaddleSize(maxPaddleLength);
                    setTimeout(setPaddleSize, powerupDelay, defaultPaddleLength);
                };
                break;

            // Decrease Paddle size
            case 1:
                powerup.runPowerup = function() {
                    setPaddleSize(minPaddleLength);
                    setTimeout(setPaddleSize, powerupDelay, defaultPaddleLength);
                };
                break;

            // PaddleDynamic
            case 2:
                powerup.runPowerup = function () {
                    var time = 0;
                    dynamicMovement = setInterval(function() {
                        setPaddleSize(Math.sin(time)*75+defaultPaddleLength);
                        time += 0.1;
                        if (time > 10) {
                            clearInterval(dynamicMovement);
                        }
                    }, 50);

                    setPaddleSize(defaultPaddleLength);
                };
                break;

            // massBallz
            case 3:
                powerup.runPowerup = function() {
                    maxBalls = maxMassBallz;
                    for (var ball = 0; ball < maxMassBallz; ball++) {
                        createBall();
                    }
                    maxBalls = defaultMaxBalls;
                };
                break;

            // ballSpeed
            case 4:
                powerup.runPowerup = function () {
                    Crafty('Ball').each(function () {
                        this.dx *= 3;
                        this.dy *= 3;
                    });
                };
                break;

            default:
                console.log('Unknown Powerup id ' + powerUpId);
        }
    }
}

function paddleRequest() {
    $.get(url + "/paddles", function (data) {
        if (data.status == "fail") {
            console.log("Well something went wrong");
        } else {
            paddles = Crafty('Paddle');
            paddles.each(function (i) {
                this.movement = data["data"][i];
            });
        }
    });
}

Crafty.bind('KeyDown', function(e) {
    if (e.key == Crafty.keys.ENTER) {
        advanceDemo();
    }
});

Crafty.bind('KeyDown', function(e) {
    if (e.key == Crafty.keys.M) {
        console.log('Mark is the best');
        maxBalls = 200;
        for (var i = 0; i < 200; i++){
            createBall();
        }
        number_live_balls = 4;
    }
});

Crafty.bind('KeyDown', function(e) {
   if (e.key == Crafty.keys.C) {
        console.log("CATZZZZ");
        document.getElementsByClassName("main").src = "https://media.giphy.com/media/PUBxelwT57jsQ/giphy.gif";
        document.getElementsByClassName("main").height = "100%";
       document.getElementsByClassName("main").width = "100%";
   }
});
function createRandomPowerup(){
    createPowerup(Crafty.math.randomInt(0, 4));
}

var demoState = 0;

function advanceDemo(){
    switch(demoState){
        case 0:
            defaultMaxBalls = 1;
            maxBalls = 1;
            break;
        case 1:
            defaultMaxBalls = 4;
            maxBalls = 4;
            break;
        case 2:
            createPowerup(1);
            break;
        case 3:
            createPowerup(0);
            break;
        case 4:
            createPowerup(2);
            break;
        case 5:
            createPowerup(4);
            break;
        case 6:
            createPowerup(3);
            break;
        case 7:
            createPowerup(3);
            break;
        case 8:
            setInterval(createRandomPowerup, createPowerupInterval);
            break;

    }
    demoState++;
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

createBall();
setInterval(createBall, createBallInterval);

setInterval(paddleRequest, 100);
