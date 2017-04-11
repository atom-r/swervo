INITIAL_RADIUS = 35;

class Ball {

  constructor(corridor, radius) {
    this.corridor = corridor;
    this.r = radius;
    this.x = 750;
    this.y = 300;
    this.z = 75;
    this.xVel = 5;
    this.yVel = 0;
    this.zVel = 10;
    this.xSpin = 0;
    this.ySpin = 0;
  }

  bounce() {
    if (this.x >= this.corridor.bounds.r || this.x <= this.corridor.bounds.l) {
      this.xVel *= -1;
    }
    if (this.y >= this.corridor.bounds.b || this.y <= this.corridor.bounds.t) {
      this.yVel *= -1;
    }
    if (this.z <= 75 || this.z >= this.corridor.d) {
      this.zVel *= -1;
    }
  }

  move() {
    this.x += this.xVel;
    this.y += this.yVel;
    this.z += this.zVel;

    this.bounce();
  }

}

class BallView {
  constructor(ball, stage) {
    this.ball = ball;
    this.stage = stage;
    this.shape = new createjs.Shape();

    this.draw();
  }

  applyPerspective() {
    const distanceFactor = Math.sqrt(this.ball.z / this.ball.corridor.d);
    this.farX = (this.ball.x - 400) / 4 + 400;
    this.farY = (this.ball.y - 300) / 4 + 300;

    this.shape.x = this.ball.x - (this.ball.x - this.farX) * distanceFactor;
    this.shape.y = this.ball.y - (this.ball.y - this.farY) * distanceFactor;
  }

  draw() {
    this.fillCommand = this.shape
      .graphics
      .beginRadialGradientFill(["#EEE","#444"], [0, 1], 15, -15, 0, 0, 0, 35).command;
    this.silverGradient = this.fillCommand.style;
    this.shape.graphics.drawCircle(0, 0, INITIAL_RADIUS);

    this.shape.x = this.stage.canvas.width / 2;
    this.shape.y = this.stage.canvas.height / 2;

    this.stage.addChild(this.shape);
  }

  scaleBall() {
    this.shape.scaleX = 1 - (3 / 4) * this.ball.z / this.ball.corridor.d;
    this.shape.scaleY = 1 - (3 / 4) * this.ball.z / this.ball.corridor.d;
  }

  render() {
    this.shape.x = this.ball.x;
    this.shape.y = this.ball.y;

    this.scaleBall();
    this.applyPerspective();
    this.stage.update();
  }
}

  // adjustForRadius() {
  //   if (this.rawX > 400) {
  //     this.shape.x -= this.radius * (this.rawX - 400)/312;
  //   } else if (this.rawX < 400) {
  //     this.shape.x += this.radius * (400 - this.rawX)/312;
  //   }
  //
  //   if (this.rawY > 300) {
  //     this.shape.y -= this.radius * (this.rawY - 300)/209;
  //   } else if (this.rawY < 300) {
  //     this.shape.y += this.radius * (300 - this.rawY)/209;
  //   }
  // }
  //
  //
  //
  // applySpin() {
  //   if (this.direction === "out"){
  //     this.xVelocity -= this.xSpin / this.maxDistance;
  //     this.yVelocity -= this.ySpin / this.maxDistance;
  //   } else {
  //     this.xVelocity += this.xSpin / this.maxDistance;
  //     this.yVelocity += this.ySpin / this.maxDistance;
  //   }
  // }
  //
  // applyVelocity() {
  //   this.rawX += this.xVelocity;
  //   this.farX = (this.rawX - 400) * 79/312 + 400;
  //
  //   this.rawY += this.yVelocity;
  //   this.farY = (this.rawY - 300) * 53/209 + 300;
  // }
  //
  // draw() {
  //   this.fillCommand = this.shape
  //     .graphics
  //     .beginRadialGradientFill(["#EEE","#444"], [0, 1], 15, -15, 0, 0, 0, 35).command;
  //   this.silverGradient = this.fillCommand.style;
  //   this.shape.graphics.drawCircle(0, 0, INITIAL_RADIUS);
  //
  //   this.stage.addChild(this.shape);
  // }
  //
  // move() {
  //   this.updateDistance();
  //   this.scaleBall();
  //   this.applySpin();
  //   this.applyVelocity();
  //   this.applyPerspective();
  //   this.adjustForRadius();
  //
  //   this.stage.update();
  // }
  //
  // reset() {
  //   this.shape.x = 400;
  //   this.shape.y = 300;
  //
  //   this.distance = 0;
  //   this.direction = "out";
  //   this.radius = INITIAL_RADIUS;
  //
  //   this.xVelocity = 0;
  //   this.yVelocity = 0;
  //
  //   this.xSpin = 10 * Math.random();
  //   this.ySpin = 10 * Math.random();
  //
  //   this.rawX = 400;
  //   this.rawY = 300;
  //
  //   this.farX = 400;
  //   this.farY = 300;
  //
  //   this.shape.scaleX = 1;
  //   this.shape.scaleY = 1;
  //
  //   if (this.fillCommand) {
  //     this.fillCommand.style = this.silverGradient;
  //   }
  // }
  //
  //
  //
  // updateDistance() {
  //   if (this.direction === "out"){
  //     this.distance += 1;
  //   } else {
  //     this.distance -= 1;
  //   }
  // }

module.exports = {
  Ball: Ball,
  BallView: BallView
};
