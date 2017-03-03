const Corridor = require('./corridor.js')

class Swervo {

  constructor() {
    this.stage = new createjs.Stage("myCanvas");
    this.corridor = new Corridor(this.stage);

    this.cpuStrikes = 3;
    this.humanStrikes = 5;
    this.level = 1;
  }
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
