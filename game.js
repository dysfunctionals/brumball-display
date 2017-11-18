Crafty.init(1000, 1100);
Crafty.background('black');

// Paddles
// [X, Y, Angle, Colour]
var paddleInfos = [
    [],
    [],
    [],
    [],
    [],
    []];
var paddleWidth = 0;
var paddleLength = 0;

var number_live_balls = 0;
var max_balls = 4;

for (var paddleInfo in paddleInfo) {
    Crafty.e('Paddle, 2D, Color')
        .color(paddleInfo[3])
        .attr({x: paddleInfo[0], y: paddleInfo[1],
            w: paddleWidth, h: paddleLength,
            rotation: paddleInfo[2]
        });
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

setInterval(createBall, 5000)
