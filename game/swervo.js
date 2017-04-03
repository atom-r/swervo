const Corridor = require('./corridor.js');
const Ball = require('./ball.js');
const Paddle = require('./paddle.js');

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
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.corridor = new Corridor(
      WIDTH,
      HEIGHT,
      DEPTH,
      NUM_SEGMENTS,
      this.stage
    );

    this.bluePaddle = new Paddle(
      this.stage,
      this.corridor,
      BLUE,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    this.orangePaddle = new Paddle(
      this.stage,
      this.corridor,
      ORANGE,
      PADDLE_WIDTH / this.corridor.narrowFactor,
      PADDLE_HEIGHT / this.corridor.narrowFactor
    );

    this.ball = new Ball(this.stage, this.corridor, RADIUS);

    this.corridor.render();
    this.orangePaddle.draw();
    this.ball.draw();
    this.bluePaddle.draw();
    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);
    this.ticker.addEventListener('tick', this.handleTick.bind(this))
  }

  handleTick() {
    this.bluePaddle.move();
    this.stage.update();
  }


}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
