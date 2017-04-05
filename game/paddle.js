class Paddle {

  constructor(width, height, color, type, stage) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    this.stage = stage;
    this.demo = true;

    this.shape = new createjs.Shape();
  }

  center() {
    this.shape.x -= this.width / 2;
    this.shape.y -= this.height / 2;
  }

  draw() {
    let borderRadius;
    let strokeStyle;
    if (this.type === 'near') {
      borderRadius = 10;
      strokeStyle = 4;
    } else {
      borderRadius = 3;
      strokeStyle = 2;
    }

    this.shape.graphics
      .beginStroke(this.color)
      .setStrokeStyle(strokeStyle)
      .beginFill(this.color)
      .drawRoundRect(0, 0, this.width, this.height, borderRadius);
    this.shape.alpha = 0.5;
    this.prevX = 400;
    this.prevY = 300;
    this.shape.x = 400;
    this.shape.y = 300;

    this.stage.addChild(this.shape);
  }

  enforceBounds(bounds) {
    if (this.shape.x + this.width > bounds.right){
      this.shape.x = bounds.right - this.width;
    } else if (this.shape.x < bounds.left){
      this.shape.x = bounds.left;
    }

    if (this.shape.y + this.height > bounds.bottom){
      this.shape.y = bounds.bottom - this.height;
    } else if (this.shape.y < bounds.top){
      this.shape.y = bounds.top;
    }
  }

  hit(ball) {
    if (ball.shape.x - ball.radius <= this.shape.x + this.width
        && ball.shape.x + ball.radius >= this.shape.x
        && ball.shape.y - ball.radius <= this.shape.y + this.height
        && ball.shape.y + ball.radius >= this.shape.y) {
      return true;
    } else {
      return false;
    }
  }

  move(ball, trackingRatio = null) {
    if (this.type === 'near') {
      this.demo ? this.moveDemoPaddle(ball) : this.moveNearPaddle();
    } else {
      this.demo ? this.moveFarPaddle(ball, -4) : this.moveFarPaddle(ball, trackingRatio);
    }
  }

  moveDemoPaddle(ball) {
    this.prevX = this.shape.x;
    this.prevY = this.shape.y;

    this.shape.x = ball.shape.x;
    this.shape.y = ball.shape.y;

    this.center();
    this.enforceBounds({top: 91, right: 712, bottom: 509, left: 88});
  }

  moveNearPaddle() {
    this.prevX = this.shape.x;
    this.prevY = this.shape.y;

    this.shape.x = this.stage.mouseX;
    this.shape.y = this.stage.mouseY;

    this.center();
    this.enforceBounds({top: 91, right: 712, bottom: 509, left: 88});
  }

  moveFarPaddle(ball, trackingRatio) {
    const difX = ball.farX - this.shape.x - this.width / 2;
    const difY = ball.farY - this.shape.y - this.height / 2;

    this.shape.x += difX / (5 + trackingRatio);
    this.shape.y += difY / (5 + trackingRatio);

    this.enforceBounds({top: 247, right: 480, bottom: 353, left: 322});
  }

  spinVector() {
    const xSpin = this.shape.x - this.prevX;
    const ySpin = this.shape.y - this.prevY;

    return [xSpin, ySpin];
  }

}

module.exports = Paddle;
