INITIAL_RADIUS = 35;

class Ball {

  constructor(stage, maxDistance) {
    this.stage = stage;
    this.maxDistance = maxDistance;

    this.shape = new createjs.Shape();

    this.reset();
  }

  adjustForRadius() {
    if (this.rawX > 400) {
      this.shape.x -= this.radius * (this.rawX - 400)/312;
    } else if (this.rawX < 400) {
      this.shape.x += this.radius * (400 - this.rawX)/312;
    }

    if (this.rawY > 300) {
      this.shape.y -= this.radius * (this.rawY - 300)/209;
    } else if (this.rawY < 300) {
      this.shape.y += this.radius * (300 - this.rawY)/209;
    }
  }

  applyPerspective() {
    const distanceFactor = this.distance / this.maxDistance;

    this.shape.x = this.rawX - (this.rawX - this.farX) * distanceFactor;
    this.shape.y = this.rawY - (this.rawY - this.farY) * distanceFactor;
  }

  applySpin() {
    if (this.direction === "out"){
      this.xVelocity -= this.xSpin / this.maxDistance;
      this.yVelocity -= this.ySpin / this.maxDistance;
    } else {
      this.xVelocity += this.xSpin / this.maxDistance;
      this.yVelocity += this.ySpin / this.maxDistance;
    }
  }

  applyVelocity() {
    this.rawX += this.xVelocity;
    this.farX = (this.rawX - 400) * 79/312 + 400;

    this.rawY += this.yVelocity;
    this.farY = (this.rawY - 300) * 53/209 + 300;
  }

  draw() {
    this.fillCommand = this.shape
      .graphics
      .beginRadialGradientFill(["#EEE","#444"], [0, 1], 15, -15, 0, 0, 0, 35).command;
    this.silverGradient = this.fillCommand.style;
    this.shape.graphics.drawCircle(0, 0, INITIAL_RADIUS);

    this.stage.addChild(this.shape);
  }

  move() {
    this.updateDistance();
    this.scaleBall();
    this.applySpin();
    this.applyVelocity();
    this.applyPerspective();
    this.adjustForRadius();

    this.stage.update();
  }

  reset() {
    this.shape.x = 400;
    this.shape.y = 300;

    this.distance = 0;
    this.direction = "out";
    this.radius = INITIAL_RADIUS;

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.xSpin = 0;
    this.ySpin = 0;

    this.rawX = 400;
    this.rawY = 300;

    this.shape.scaleX = 1;
    this.shape.scaleY = 1;

    if (this.fillCommand) {
      this.fillCommand.style = this.silverGradient;
    }
  }

  scaleBall() {
    this.shape.scaleX = 1 - this.distance * 3 / (4 * this.maxDistance);
    this.shape.scaleY = 1 - this.distance * 3 / (4 * this.maxDistance);

    this.radius = 35 * this.shape.scaleX;
  }

  updateDistance() {
    if (this.direction === "out"){
      this.distance += 1;
    } else {
      this.distance -= 1;
    }
  }
}

module.exports = Ball;
