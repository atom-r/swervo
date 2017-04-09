const CorridorClasses = require('./corridor.js');
const Corridor = CorridorClasses.Corridor;
const CorridorView = CorridorClasses.CorridorView;

const PaddleClasses = require('./paddle.js');
const Paddle = PaddleClasses.Paddle;
const PaddleView = PaddleClasses.PaddleView;

const BallClasses = require('./ball.js');
const Ball = BallClasses.Ball;
const BallView = BallClasses.BallView;

const Players = require('./player.js');
const Human = Players.Human;
const CPU = Players.CPU;

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

  constructor(stage, bluePlayer, redPlayer) {
    this.corridor = new Corridor(WIDTH, HEIGHT, DEPTH);
    this.bluePaddle = new Paddle(this.corridor, bluePlayer, 0);
    this.redPaddle = new Paddle(this.corridor, redPlayer, DEPTH);
    this.ball = new Ball(this.corridor, RADIUS);

    this.blueStrikes = 6;
    this.redStrikes = 2;
    this.level = 1;

    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);

    this.view = new SwervoView(this, stage);

    this.ticker.addEventListener('tick', this.step.bind(this));
  }

  step() {
    this.movePaddles();
    this.ball.move();
    this.view.render();
  }

  movePaddles() {
    this.bluePaddle.move();
  }

}

class SwervoView {
  constructor(swervo, stage) {
    this.stage = stage;
    this.stage.canvas.style.cursor = "none";

    this.swervo = swervo;

    this.corridor = new CorridorView(this.swervo.corridor,
                                         this.stage,
                                         BLUE);

    this.rPad = new PaddleView(this.swervo.redPaddle,
                                        this.stage,
                                        ORANGE);

    this.ball = new BallView(this.swervo.ball, this.stage);

    this.bPad = new PaddleView(this.swervo.bluePaddle,
                                         this.stage,
                                         BLUE);
  }

  render() {
    this.bPad.render();
    this.ball.render();
  }
}

const init = () => {
  const stage = new createjs.Stage('myCanvas');
  const swervo = new Swervo(stage, new Human(stage), new CPU(stage));
};

document.addEventListener("DOMContentLoaded", init)
