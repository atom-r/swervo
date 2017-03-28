const Ball = require('./ball.js')
const Paddle = require('./paddle.js')

CENTER_X = 400;
CENTER_Y = 300;

HUMAN_COLOR = "#2176FF";
CPU_COLOR = "#F26430";

HUMAN_PADDLE_WIDTH = 120;
HUMAN_PADDLE_HEIGHT = 80;
CPU_PADDLE_WIDTH = 30;
CPU_PADDLE_HEIGHT = 20;

class Corridor {

  constructor(w, h, d) {
    this.width = w;
    this.height = h;
    this.depth = d;
  }

  detectWallBounce() {
    if(this.ball.rawX >= 712 || this.ball.rawX <= 88){
      this.ball.xVelocity = this.ball.xVelocity * -1;
      this.ball.xSpin = 0;
      this.vWallHit.load();
      this.vWallHit.play();
    }

    if(this.ball.rawY >= 509 || this.ball.rawY <= 91){
      this.ball.yVelocity = this.ball.yVelocity * -1;
      this.ball.ySpin = 0;
      this.hWallHit.load();
      this.hWallHit.play();
    }
  }

  detectGoalOrHit() {
    if (this.ball.distance === this.maxDistance){
      this.detectCpuHit();
      this.ball.direction = "in";
    } else if (this.ball.distance === 0){
      this.detectHumanHit();
      this.ball.direction = "out";
    }
  }

  

  drawCorner(shape, { mtx, mty, ltx, lty }) {
    shape.graphics.beginStroke("#FFF8F0");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.moveTo(mtx, mty);
    shape.graphics.lineTo(ltx, lty);

    this.stage.addChild(shape);
  }

  drawBallMarker() {
    const ballMarker = new createjs.Shape();

    ballMarker.graphics.beginStroke("#009B72");
    ballMarker.graphics.setStrokeStyle(1);
    ballMarker.snapToPixel = true;
    ballMarker.graphics.drawRect(88, 91, 624, 418);
    ballMarker.name = 'ballMarker';

    this.stage.addChild(ballMarker);
  };

  movePaddles() {
    this.humanPaddle.move();
    this.cpuPaddle.move(this.ball, this.cpuTrackingRatio);
    this.stage.update();
  }

  renderPieces() {
    this.cpuPaddle.draw();
    this.ball.draw();
    this.humanPaddle.draw();
    this.drawBallMarker();
    this.ticker.addEventListener('tick', this.movePaddles.bind(this));
  }



  detectHumanHit() {
    if (this.humanPaddle.hit(this.ball)) {
      this.nearHit.load();
      this.nearHit.play();
      this.getSpin();
    } else {
      this.ball.fillCommand.style = "#F26430";
      this.goal.load();
      this.goal.play();
      this.ticker.removeAllEventListeners('tick');
      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
      this.swervo.resetPieces('human');
    }
  }

  getSpin() {
    let [xSpin, ySpin] = this.humanPaddle.spinVector();
    this.ball.xSpin += xSpin;
    this.ball.ySpin += ySpin;
  }

  detectCpuHit() {
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
    if (this.cpuPaddle.hit(this.ball)) {
      this.farHit.load();
      this.farHit.play();
    } else {
      this.ball.fillCommand.style = "#2176FF";
      this.goal.load();
      this.goal.play();
      this.ticker.removeAllEventListeners('tick');
      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
      this.swervo.resetPieces('cpu');
    }
  }

  updateBallMarker() {
    const ballMarker = this.stage.getChildByName('ballMarker');

    const markerX = 88 + this.ball.distance * (321 - 88) / this.maxDistance;
    const markerY = 91 + this.ball.distance * (247 - 91) / this.maxDistance;
    const markerW = 624 - this.ball.distance * (624 - 158) / this.maxDistance;
    const markerH = 418 - this.ball.distance * (418 - 106) / this.maxDistance;

    ballMarker.graphics.clear().beginStroke("#009B72").drawRect(markerX, markerY, markerW, markerH);
  }


  hitBall(e) {
    if (this.humanPaddle.hit(this.ball)) {
      e.remove();
      this.nearHit.load();
      this.nearHit.play();
      this.getSpin();
      if (this.ball.xSpin > 15) {
        this.ball.xSpin = 15;
      }
      if (this.ball.xSpin < -15) {
        this.ball.xSpin = -15;
      }
      if (this.ball.ySpin > 15) {
        this.ball.ySpin = 15;
      }
      if (this.ball.ySpin < -15) {
        this.ball.ySpin = -15;
      }
      this.ticker.addEventListener('tick', this.doTheStuff.bind(this));
    }
  }

  doTheStuff() {
    this.ball.move();
    this.detectWallBounce();
    this.detectGoalOrHit();
    this.updateBallMarker();
  }


}

module.exports = Corridor;
