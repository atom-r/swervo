const Corridor = require('./corridor.js')

class Swervo {

  constructor() {
    this.stage = new createjs.Stage("myCanvas");

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    this.corridor = new Corridor(this.stage, this);

    this.buildCpuScore();
    this.buildHumanScore();
    this.setStage();

  }

  resetPieces(losingPlayer) {
    if(losingPlayer === 'cpu') {
      this.updateCpuStrikes();
    } else {
      this.humanStrikes -= 1;
    }
    setTimeout(this.setStage.bind(this), 1000);
  }

  setStage() {
    const ball = this.stage.getChildByName('ball');
    const ballMarker = this.stage.getChildByName('ballMarker');
    ball.x = 400;
    ball.y = 300;
    ball.rawX = 400;
    ball.rawY = 300;
    ball.xVelocity = 0;
    ball.yVelocity = 0;
    ball.direction = "out";
    ball.distance = 0;
    ball.scaleX = 1;
    ball.scaleY = 1;
    ball.xSpin = 0;
    ball.ySpin = 0;
    ballMarker.graphics.clear().beginStroke("#009B72").drawRect(88, 91, 624, 418);
    this.stage.on('stagemousedown', this.corridor.hitBall.bind(this.corridor));
  }

  updateCpuStrikes() {
    if(this.cpuStrikes > 0){
      this.strikes[this.cpuStrikes - 1].graphics.clear();
      this.cpuStrikes -= 1;
    } else {
      this.level += 1;
      this.cpuStrikes = 2;
      setTimeout(this.buildCpuStrikes.bind(this), 1000);
    }
  }

  printYouWon() {
    const text = new createjs.Text("You Win", "36px Arial", "#FFF8F0");
    text.x = 400;
    text.y = 300;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);

    this.stage.update();
  }

  buildCpuStrikes() {
    this.strikes = [];
    for (let i = 0; i < this.cpuStrikes; i++) {
      this.strikes[i] = new createjs.Shape();
      this.strikes[i].graphics.beginFill("#F26430").drawCircle((160 + i * 25), 62, 10);

      this.stage.addChild(this.strikes[i]);
    }
  }

  buildHumanStrikes() {
    const ball = new createjs.Shape();
    ball
      .graphics
      .beginRadialGradientFill(["#009B72","#006B42"], [0, 1], 15, -15, 0, 0, 0, 5)
      .drawCircle(0, 0, 5);
    ball.name = "ball";

    this.stage.addChild(ball);
  }

  buildCpuScore() {
    const text = new createjs.Text("CPU", "20px Arial", "#FFF8F0");
    text.x = 100;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.buildCpuStrikes();

    this.stage.update();
  }

  buildHumanScore() {
    const text = new createjs.Text("Player", "20px Arial", "#FFF8F0");
    text.x = 650;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.stage.update();
  }
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
