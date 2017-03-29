const Corridor = require('./corridor.js')
const Ball = require('./ball.js')
const Paddle = require('./paddle.js')

// CORRIDOR ATTRIBUTES
WIDTH = 700;
HEIGHT = 500;
DEPTH = 1600;
NUM_SEGMENTS = 9;

// PADDLE ATTRIBUTES
PADDLE_WIDTH = WIDTH / 5;
PADDLE_HEIGHT = HEIGHT / 5;
BLUE = "#2176FF";
ORANGE = "#F26430";

class Swervo {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.corridor = new Corridor(WIDTH, HEIGHT, DEPTH, NUM_SEGMENTS, this.stage);
    this.bluePaddle = new Paddle(this.stage, this.corridor, BLUE, PADDLE_WIDTH, PADDLE_HEIGHT);
    this.orangePaddle = new Paddle(this.stage, this.corridor, ORANGE, PADDLE_WIDTH / this.corridor.narrowFactor, PADDLE_HEIGHT / this.corridor.narrowFactor);

    this.corridor.render();

    this.orangePaddle.draw();
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
