const Corridor = require('./corridor.js')

class Swervo {

  constructor() {
    this.stage = new createjs.Stage("myCanvas");
    this.corridor = new Corridor(this.stage);

    this.buildCpuText();
    this.buildHumanText();

    this.cpuStrikes = 3;
    this.humanStrikes = 5;
    this.level = 1;
  }

  buildCpuText() {
    const text = new createjs.Text("CPU", "20px Arial", "#FFF8F0");
    text.x = 100;
    text.y = 70;
    text.textBaseline = "alphabetic";

    this.stage.addChild(text);
    this.stage.update();
  }

  buildHumanText() {
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
