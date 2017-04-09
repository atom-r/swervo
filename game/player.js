class HumanPlayer {
  constructor(stage) {
    this.stage = stage;
  }

  getPos() {
    return [this.stage.mouseX, this.stage.mouseY];
  }
}

class CPUPlayer {
  constructor(stage) {
    this.stage = stage;
    this.trackingRatio = 35;
  }

  getPos(target, paddle) {
    const difX = (target.x - paddle.x) / this.trackingRatio;
    const difY = (target.y - paddle.y) / this.trackingRatio;

    return [paddle.x + difX, paddle.y + difY];
  }
}

module.exports = {
  Human: HumanPlayer,
  CPU: CPUPlayer
};
