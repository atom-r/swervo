class Paddle {

  constructor(stage, corridor, color, w, h) {
    this.width = w;
    this.height = h;
    this.color = color;
    this.corridor = corridor;
    this.stage = stage;
    this.shape = new createjs.Shape();

    this.x = 0;
    this.y = 0;
  }

  getPos() {
    this.x = this.stage.mouseX;
    this.y = this.stage.mouseY;

    console.log(this.x);
  }

  center() {
    this.shape.x -= this.width / 2;
    this.shape.y -= this.height / 2;
  }

  draw() {
    let borderRadius;
    let strokeStyle;
    if (this.color === '#2176FF') {
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

  move(ball = null, trackingRatio = null) {
    // if (this.type === 'near') {
      this.moveNearPaddle(ball);
    // } else {
    //   this.moveFarPaddle(ball, trackingRatio);
    // }
  }

  moveNearPaddle(ball = null) {
    this.prevX = this.shape.x;
    this.prevY = this.shape.y;

    if (ball) {
      this.shape.x = ball.x
      this.shape.y = ball.y;
    } else {
      this.shape.x = this.stage.mouseX;
      this.shape.y = this.stage.mouseY;
    }

    this.center();
    this.enforceBounds({
      top: this.corridor.nearY,
      right: this.corridor.nearX + this.corridor.width,
      bottom: this.corridor.nearY + this.corridor.height,
      left: this.corridor.nearX
    });
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
