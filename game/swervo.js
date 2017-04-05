const Corridor = require('./corridor.js')
const Ball = require('./ball.js')

FONT = "Audiowide"

class Swervo {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    this.corridor = new Corridor(this.stage, this);

    this.buildCpuScore();
    this.buildHumanScore();
    this.printInstructions();
    this.printLevel();
    this.setStage();
  }

  buildCpuScore() {
    const text = new createjs.Text("CPU", `20px ${FONT}`, "#2B4162");
    text.x = 100;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.buildCpuStrikes();

    this.stage.update();
  }

  buildCpuStrikes() {
    this.cpuStrikeShapes = [];
    for (let i = 0; i < this.cpuStrikes; i++) {
      this.cpuStrikeShapes[i] = new createjs.Shape();
      this.cpuStrikeShapes[i].graphics.beginFill("#721817").drawCircle((160 + i * 25), 62, 10);

      this.stage.addChild(this.cpuStrikeShapes[i]);
    }
  }

  buildHumanScore() {
    const text = new createjs.Text("Player", `20px ${FONT}`, "#2B4162");
    text.x = 650;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.buildHumanStrikes();

    this.stage.update();
  }

  buildHumanStrikes() {
    this.humanStrikeShapes = [];
    for (let i = 0; i < this.humanStrikes; i++) {
      this.humanStrikeShapes[i] = new createjs.Shape();
      this.humanStrikeShapes[i].graphics.beginFill("#2B4162").drawCircle((630 - i * 25), 62, 10);

      this.stage.addChild(this.humanStrikeShapes[i]);
    }
  }

  printGameOver() {
    const frame = new createjs.Shape();
    frame.graphics
      .beginFill("#555")
      .drawRoundRect(275, 250, 250, 100, 5);

    const gameOver = new createjs.Text(`Game Over`, `42px ${FONT}`, "#FFF");
    gameOver.x = 290;
    gameOver.y = 315;
    gameOver.textBaseline = "alphabetic";

    const spaceText = new createjs.Text(`Click to restart`, `42px ${FONT}`, "#2B4162");
    spaceText.x = 320;
    spaceText.y = 570;
    spaceText.textBaseline = "alphabetic";

    this.stage.addChild(frame);
    this.stage.addChild(gameOver);
    this.stage.addChild(spaceText);

    this.stage.update();

    this.stage.on('mousedown', this.restart.bind(this));
  }

  printInstructions() {
    const text = new createjs.Text("To curve: sweep the paddle over the ball as it hits", `16px ${FONT}`, "#2B4162");
    text.x = 230;
    text.y = 25;
    text.textBaseline = "alphabetic";
    text.name = 'instructions';

    this.stage.addChild(text);
  }

  printLevel() {
    const text = new createjs.Text(`Level ${this.level}`, `24px ${FONT}`, "#2B4162");
    text.x = 363;
    text.y = 540;
    text.textBaseline = "alphabetic";
    text.name = "level";

    this.stage.addChild(text);

    this.stage.update();
  }

  resetPieces(loser) {
    if(loser === 'cpu') {
      this.updateCpuStrikes();
    } else {
      this.updateHumanStrikes();
    }
  }

  restart() {
    this.stage.removeAllEventListeners();
    this.corridor.ticker.removeAllEventListeners();
    this.stage.removeAllChildren();

    this.cpuStrikes = 2;
    this.humanStrikes = 5;
    this.level = 1;

    this.corridor = new Corridor(this.stage, this);

    this.buildCpuScore();
    this.buildHumanScore();
    this.printLevel();
    this.setStage();
  }

  setStage() {
    const ballMarker = this.stage.getChildByName('ballMarker');

    this.corridor.ball.reset();
    ballMarker.graphics.clear().beginStroke("#444").drawRect(88, 91, 624, 418);
    this.stage.on('stagemousedown', this.corridor.hitBall.bind(this.corridor));
  }

  updateCpuStrikes() {
    if(this.cpuStrikes > 0){
      this.cpuStrikeShapes[this.cpuStrikes - 1].graphics.clear();
      this.cpuStrikes -= 1;
    } else {
      const level = this.stage.getChildByName('level');
      this.level += 1;
      level.text = `Level ${this.level}`
      if (this.level === 2) {
        const instructions = this.stage.getChildByName('instructions');
        if (instructions) instructions.text = "";
      }
      this.corridor.cpuTrackingRatio = this.corridor.cpuTrackingRatio / 1.4 ;
      this.cpuStrikes = 2;
      setTimeout( () => {
        this.corridor.ball.maxDistance = Math.floor(this.corridor.ball.maxDistance * 0.95);
        this.corridor.maxDistance = this.corridor.ball.maxDistance;
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
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
