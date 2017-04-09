const CorridorClasses = require('./corridor.js');
const Corridor = CorridorClasses.Corridor;
const CorridorView = CorridorClasses.CorridorView;

const PaddleClasses = require('./paddle.js');
const Paddle = PaddleClasses.Paddle;
const PaddleView = PaddleClasses.PaddleView;

const Ball = require('./ball.js');

// CORRIDOR ATTRIBUTES
const WIDTH = 700;
const HEIGHT = 500;
const DEPTH = 1600;
const NUM_SEGMENTS = 9;

// PADDLE ATTRIBUTES
const PADDLE_WIDTH = WIDTH / 5;
const PADDLE_HEIGHT = HEIGHT / 5;
const BLUE = "#2176FF";
const ORANGE = "#F26430";

// BALL ATTRIBUTES
const RADIUS = 35;

class Swervo {

  constructor() {
    this.corridor = new Corridor(WIDTH, HEIGHT, DEPTH);
    this.bluePaddle = new Paddle(this.corridor, 0);
    this.redPaddle = new Paddle(this.corridor, DEPTH);
    this.ball = new Ball(this.corridor, RADIUS);

    this.blueStrikes = 6;
    this.redStrikes = 2;
    this.level = 1;

    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);

    this.swervoView = new SwervoView(this);
  }

  // handleTick() {
  //   this.bluePaddle.move();
  //   this.stage.update();
  // }


}

class SwervoView {
  constructor(swervo) {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.swervo = swervo;

    this.corridorView = new CorridorView(this.swervo.corridor, this.stage, BLUE);
    this.redPaddleView = new PaddleView(this.swervo.redPaddle, this.stage, ORANGE);
    this.bluePaddleView = new PaddleView(this.swervo.bluePaddle, this.stage, BLUE);
  }
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
