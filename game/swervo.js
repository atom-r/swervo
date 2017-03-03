const Corridor = require('./corridor.js')

class Swervo {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    this.corridor = new Corridor(this.stage, this);

    this.buildCpuScore();
    this.buildHumanScore();
    this.setStage();
  }

  resetPieces(loser) {
    if(loser === 'cpu') {
      this.updateCpuStrikes();
    } else {
      this.updateHumanStrikes();
    }
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
      this.cpuStrikeShapes[this.cpuStrikes - 1].graphics.clear();
      this.cpuStrikes -= 1;
    } else {
      this.level += 1;
      this.corridor.cpuTrackingRatio = this.corridor.cpuTrackingRatio / 1.5;
      this.cpuStrikes = 2;
      console.log(this.level);
      setTimeout( () => {
        this.corridor.max_distance -= 5
      }, 1000);
      setTimeout(this.buildCpuStrikes.bind(this), 1000);
    }
    setTimeout(this.setStage.bind(this), 1000);
  }

  updateHumanStrikes() {
    if(this.humanStrikes > 0){
      this.humanStrikeShapes[this.humanStrikes - 1].graphics.clear();
      this.humanStrikes -= 1;
      setTimeout(this.setStage.bind(this), 1000);
    } else {
      this.printGameOver();
    }
  }

  printGameOver() {
    const text = new createjs.Text("Game Over", "42px Arial", "#FFF8F0");
    text.x = 300;
    text.y = 300;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);

    this.stage.update();
  }

  buildCpuStrikes() {
    this.cpuStrikeShapes = [];
    for (let i = 0; i < this.cpuStrikes; i++) {
      this.cpuStrikeShapes[i] = new createjs.Shape();
      this.cpuStrikeShapes[i].graphics.beginFill("#F26430").drawCircle((160 + i * 25), 62, 10);

      this.stage.addChild(this.cpuStrikeShapes[i]);
    }
  }

  buildHumanStrikes() {
    this.humanStrikeShapes = [];
    for (let i = 0; i < this.humanStrikes; i++) {
      this.humanStrikeShapes[i] = new createjs.Shape();
      this.humanStrikeShapes[i].graphics.beginFill("#2176FF").drawCircle((630 - i * 25), 62, 10);

      this.stage.addChild(this.humanStrikeShapes[i]);
    }
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
    this.buildHumanStrikes();

    this.stage.update();
  }
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
