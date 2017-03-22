

class Paddle {

  constructor(width, height, color, type, stage) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.stage = stage;

    this.shape = new createjs.Shape();
  }

  draw() {
    if (this.type === 'near') {
      this.drawNearPaddle();
    } else {
      this.drawFarPaddle();
    }
  }

  drawNearPaddle() {
    this.shape.graphics
      .beginStroke(this.color)
      .setStrokeStyle(4)
      .beginFill(this.color)
      .drawRoundRect(0, 0, this.width, this.height, 10);
    this.shape.alpha = 0.5;
    this.shape.prevX = 0;
    this.shape.prevY = 0;

    this.stage.addChild(this.shape);
  }

  drawFarPaddle() {
    this.shape.graphics
      .beginStroke(this.color)
      .setStrokeStyle(2)
      .beginFill(this.color)
      .drawRoundRect(385, 290, this.width, this.height, 3);
    this.shape.alpha = 0.5;
    this.shape.rawX = 0;
    this.shape.rawY = 0;

    this.stage.addChild(this.shape);
  }

}

module.exports = Paddle;
