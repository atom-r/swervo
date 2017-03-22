const Ball = require('./ball.js')

CENTER_X = 400;
CENTER_Y = 300;

class Corridor {

  constructor(stage, swervo) {
    this.stage = stage;
    this.swervo = swervo;
    this.ball = new Ball(this.stage, 60);

    this.max_distance = 60;
    this.cpuTrackingRatio = 30;

    this.ticker = createjs.Ticker;
    this.ticker.setFPS(60);

    this.nearHit = new Audio('./audio/nearhit.mp3');
    this.farHit = new Audio('./audio/farhit.mp3');
    this.vWallHit = new Audio('./audio/wallhit.mp3');
    this.hWallHit = new Audio('./audio/wallhit0.mp3');
    this.goal = new Audio('./audio/goal.mp3');

    this.renderCorridor();
    this.renderPieces();
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
    if (this.ball.distance === this.max_distance){
      this.detectCpuHit();
      this.ball.direction = "in";
    } else if (this.ball.distance === 0){
      this.detectHumanHit();
      this.ball.direction = "out";
    }
  }

  drawRectangle(shape, { x, y, w, h }) {
    shape.graphics.beginStroke("#FFF8F0");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.drawRect(x, y, w, h);

    this.stage.addChild(shape);
  }

  drawCorner(shape, { mtx, mty, ltx, lty }) {
    shape.graphics.beginStroke("#FFF8F0");
    shape.graphics.setStrokeStyle(1);
    shape.snapToPixel = true;
    shape.graphics.moveTo(mtx, mty);
    shape.graphics.lineTo(ltx, lty);

    this.stage.addChild(shape);
  }

  buildHumanPaddle() {
    const humanPaddle = new createjs.Shape();
    humanPaddle.graphics
      .beginStroke("#2176FF")
      .setStrokeStyle(4)
      .beginFill("#2176FF")
      .drawRoundRect(0, 0, 120, 80, 10);
    humanPaddle.alpha = 0.5;
    humanPaddle.name = 'humanPaddle';
    humanPaddle.prevX = 0;
    humanPaddle.prevY = 0;

    this.stage.addChild(humanPaddle);
  }

  buildCpuPaddle() {
    const cpuPaddle = new createjs.Shape();
    cpuPaddle.graphics
      .beginStroke("#F26430")
      .setStrokeStyle(2)
      .beginFill("#F26430")
      .drawRoundRect(385, 290, 30, 20, 3);
    cpuPaddle.alpha = 0.5;
    cpuPaddle.name = 'cpuPaddle';
    cpuPaddle.rawX = 0;
    cpuPaddle.rawY = 0;
    cpuPaddle.prevRawX = 0;
    cpuPaddle.prevRawY = 0;

    this.stage.addChild(cpuPaddle);
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

  moveHumanPaddle() {
    const humanPaddle = this.stage.getChildByName('humanPaddle');
    let difX;
    let difY;

    if (this.stage.mouseX < 652 && this.stage.mouseX > 148){
      difX = this.stage.mouseX - humanPaddle.x - 60;
    } else if (this.stage.mouseX <= 148){
      difX = 148 - humanPaddle.x - 60;
    } else {
      difX = 652 - humanPaddle.x - 60;
    }

    if (this.stage.mouseY < 469 && this.stage.mouseY > 131){
      difY = this.stage.mouseY - humanPaddle.y - 40;
    } else if (this.stage.mouseY <= 131){
      difY = 131 - humanPaddle.y - 40;
    } else {
      difY = 469 - humanPaddle.y - 40;
    }

    humanPaddle.prevX = humanPaddle.x;
    humanPaddle.prevY = humanPaddle.y;
    humanPaddle.x += difX/1.2;
    humanPaddle.y += difY/1.2;
  }

  moveCpuPaddle() {
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
    const cpuDifX = this.ball.rawX - 400 - cpuPaddle.rawX;
    const cpuDifY = this.ball.rawY - 300 - cpuPaddle.rawY;

    cpuPaddle.prevX = cpuPaddle.rawX;
    cpuPaddle.prevY = cpuPaddle.rawY;
    cpuPaddle.rawX += cpuDifX / (5 + this.cpuTrackingRatio);
    cpuPaddle.rawY += cpuDifY / (5 + this.cpuTrackingRatio);

    if (cpuPaddle.rawX > 249){
      cpuPaddle.rawX = 249;
    } else if (cpuPaddle.rawX < -241) {
      cpuPaddle.rawX = -241;
    }

    if (cpuPaddle.rawY > 161){
      cpuPaddle.rawY = 161;
    } else if (cpuPaddle.rawY < -161) {
      cpuPaddle.rawY = -161;
    }

    cpuPaddle.x = cpuPaddle.rawX * 79/312;
    cpuPaddle.y = cpuPaddle.rawY * 53/209;
  }

  movePaddles() {
    this.moveHumanPaddle();
    this.moveCpuPaddle();
    this.stage.update();
  }

  renderPieces() {
    this.buildCpuPaddle();
    this.ball.draw();
    this.buildHumanPaddle();
    this.drawBallMarker();

    this.ticker.addEventListener('tick', this.movePaddles.bind(this));
  }

  renderCorridor() {
    const border1 = new createjs.Shape();
    const border2 = new createjs.Shape();
    const border3 = new createjs.Shape();
    const border4 = new createjs.Shape();
    const border5 = new createjs.Shape();
    const border6 = new createjs.Shape();
    const border7 = new createjs.Shape();
    const border8 = new createjs.Shape();
    const border9 = new createjs.Shape();

    this.drawRectangle(border1, { x: 88, y: 91, w: 624, h: 418 });
    this.drawRectangle(border2, { x: 146, y: 130, w: 508, h: 340 });
    this.drawRectangle(border3, { x: 195, y: 162, w: 410, h: 276 });
    this.drawRectangle(border4, { x: 234, y: 190, w: 332, h: 221 });
    this.drawRectangle(border5, { x: 263, y: 208, w: 275, h: 184 });
    this.drawRectangle(border6, { x: 283, y: 222, w: 234, h: 157 });
    this.drawRectangle(border7, { x: 299, y: 233, w: 202, h: 135 });
    this.drawRectangle(border8, { x: 312, y: 240, w: 176, h: 120 });
    this.drawRectangle(border9, { x: 322, y: 247, w: 158, h: 106 });

    let cornerNW = new createjs.Shape();
    let cornerNE = new createjs.Shape();
    let cornerSE = new createjs.Shape();
    let cornerSW = new createjs.Shape();

    this.drawCorner(cornerNW, { mtx: 88, mty: 91, ltx: 322, lty: 247 });
    this.drawCorner(cornerNW, { mtx: 712, mty: 91, ltx: 479, lty: 247 });
    this.drawCorner(cornerNW, { mtx: 712, mty: 509, ltx: 479, lty: 353 });
    this.drawCorner(cornerNW, { mtx: 88, mty: 509, ltx: 322, lty: 353 });

    this.stage.update();
  }

  detectHumanHit() {
    const humanPaddle = this.stage.getChildByName('humanPaddle');
    if (this.ball.shape.x - (this.ball.radius) <= humanPaddle.x + 120
        && this.ball.shape.x + (this.ball.radius) >= humanPaddle.x
        && this.ball.shape.y - (this.ball.radius) <= humanPaddle.y + 60
        && this.ball.shape.y + (this.ball.radius) >= humanPaddle.y) {
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
    const humanPaddle = this.stage.getChildByName('humanPaddle');
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');

    this.ball.xSpin += humanPaddle.x - humanPaddle.prevX;
    this.ball.ySpin += humanPaddle.y - humanPaddle.prevY;
  }

  detectCpuHit() {
    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
    if (this.ball.shape.x - 400 - (this.ball.radius) <= cpuPaddle.x + 15
        && this.ball.shape.x - 400 + (this.ball.radius) >= cpuPaddle.x - 15
        && this.ball.shape.y - 300 - (this.ball.radius) <= cpuPaddle.y + 10
        && this.ball.shape.y - 300 + (this.ball.radius) >= cpuPaddle.y - 10) {
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

    const markerX = 88 + this.ball.distance * (321 - 88) / this.max_distance;
    const markerY = 91 + this.ball.distance * (247 - 91) / this.max_distance;
    const markerW = 624 - this.ball.distance * (624 - 158) / this.max_distance;
    const markerH = 418 - this.ball.distance * (418 - 106) / this.max_distance;

    ballMarker.graphics.clear().beginStroke("#009B72").drawRect(markerX, markerY, markerW, markerH);
  }


  hitBall(e) {
    const humanPaddle = this.stage.getChildByName('humanPaddle');
    if (this.ball.shape.x - 35 <= humanPaddle.x + 120
        && this.ball.shape.x + 35 >= humanPaddle.x
        && this.ball.shape.y - 35 <= humanPaddle.y + 60
        && this.ball.shape.y + 35 >= humanPaddle.y) {
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
