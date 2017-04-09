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

  constructor(width, height, depth) {
    this.w = width;
    this.h = height;
    this.d = depth;

    this.bounds = this.getBounds();
  }

  getBounds() {
    return {
      l: 400 - this.w / 2,
      r: 400 + this.w / 2,
      t: 300 - this.h / 2,
      b: 300 + this.h / 2
    };
  }

}

class CorridorView {

  constructor(corridor, stage, color) {
    this.corridor = corridor;
    this.stage = stage;
    this.color = color;

    this.numSegments = 9;

    this.getDimensions();
    this.render();
  }

  render() {
    this.drawRectangles();
    this.drawCorners();
    this.stage.update()
  }

  drawCorner(coordSet) {
    const corner = new createjs.Shape();
    corner.graphics.beginStroke(this.color);
    corner.graphics.setStrokeStyle(4);
    corner.snapToPixel = true;
    corner.graphics.moveTo(coordSet.x, coordSet.y);
    corner.graphics.lineTo(coordSet.ltx, coordSet.lty);

    this.stage.addChild(corner);
  }

  drawCorners() {
    const coords = this.getCornerCoords();
    coords.forEach( coordSet => {
      this.drawCorner(coordSet);
    });
  }

  drawRectangle(distance) {
    const [x, y, w, h] = this.getRect(distance)
    const rect = new createjs.Shape();
    rect.graphics.beginStroke(this.color).setStrokeStyle(3).drawRect(x, y, w, h);
    rect.snapToPixel = true;

    this.stage.addChild(rect);
  }

  drawRectangles() {
    let distance = 0;
    for (let i = 0; i <= this.numSegments; i++) {
      this.drawRectangle(distance);
      distance += this.corridor.d / this.numSegments;
    }
  }

  getCornerCoords() {
    const coords = [
      { x: this.nearX, y: this.nearY, ltx: this.farX, lty: this.farY },
      { x: this.nearX + this.corridor.w, y: this.nearY, ltx: this.farX + this.farWidth, lty: this.farY },
      { x: this.nearX + this.corridor.w,
        y: this.nearY + this.corridor.h,
        ltx: this.farX + this.farWidth,
        lty: this.farY + this.farHeight },
      { x: this.nearX, y: this.nearY + this.corridor.h, ltx: this.farX, lty: this.farY + this.farHeight }
    ];
    return coords;
  }

  getDimensions() {
    this.narrowFactor = this.corridor.d / 400;

    this.nearX = (800 - this.corridor.w) / 2;
    this.nearY = (600 - this.corridor.h) / 2;

    this.farHeight = this.corridor.h / this.narrowFactor;
    this.farWidth = this.corridor.w / this.narrowFactor;

    this.farX = (800 - this.farWidth) / 2;
    this.farY = (600 - this.farHeight) / 2;
  }

  getRect(distance) {
    const x = this.nearX - (this.nearX - this.farX) * Math.sqrt(distance) / Math.sqrt(this.corridor.d);
    const y = this.nearY - (this.nearY - this.farY) * Math.sqrt(distance) / Math.sqrt(this.corridor.d);
    const w = (800 - 2 * x);
    const h = (600 - 2 * y);

    return [x, y, w, h];
  }

}

  //===========================================

//   detectWallBounce() {
//     if(this.ball.rawX >= 712 || this.ball.rawX <= 88){
//       this.ball.xVelocity = this.ball.xVelocity * -1;
//       this.ball.xSpin = 0;
//       this.vWallHit.load();
//       this.vWallHit.play();
//     }
//
//     if(this.ball.rawY >= 509 || this.ball.rawY <= 91){
//       this.ball.yVelocity = this.ball.yVelocity * -1;
//       this.ball.ySpin = 0;
//       this.hWallHit.load();
//       this.hWallHit.play();
//     }
//   }
//
//   detectGoalOrHit() {
//     if (this.ball.distance === this.maxDistance){
//       this.detectCpuHit();
//       this.ball.direction = "in";
//     } else if (this.ball.distance === 0){
//       this.detectHumanHit();
//       this.ball.direction = "out";
//     }
//   }
//
//   drawBallMarker() {
//     const ballMarker = new createjs.Shape();
//
//     ballMarker.graphics.beginStroke("#009B72");
//     ballMarker.graphics.setStrokeStyle(1);
//     ballMarker.snapToPixel = true;
//     ballMarker.graphics.drawRect(88, 91, 624, 418);
//     ballMarker.name = 'ballMarker';
//
//     this.stage.addChild(ballMarker);
//   };
//
//
//
//   detectHumanHit() {
//     if (this.humanPaddle.hit(this.ball)) {
//       this.nearHit.load();
//       this.nearHit.play();
//       this.getSpin();
//     } else {
//       this.ball.fillCommand.style = "#F26430";
//       this.goal.load();
//       this.goal.play();
//       this.ticker.removeAllEventListeners('tick');
//       this.ticker.addEventListener('tick', this.movePaddles.bind(this));
//       this.swervo.resetPieces('human');
//     }
//   }
//
//   getSpin() {
//     let [xSpin, ySpin] = this.humanPaddle.spinVector();
//     this.ball.xSpin += xSpin;
//     this.ball.ySpin += ySpin;
//   }
//
//   detectCpuHit() {
//     const cpuPaddle = this.stage.getChildByName('cpuPaddle');
//     if (this.cpuPaddle.hit(this.ball)) {
//       this.farHit.load();
//       this.farHit.play();
//     } else {
//       this.ball.fillCommand.style = "#2176FF";
//       this.goal.load();
//       this.goal.play();
//       this.ticker.removeAllEventListeners('tick');
//       this.ticker.addEventListener('tick', this.movePaddles.bind(this));
//       this.swervo.resetPieces('cpu');
//     }
//   }
//
//   updateBallMarker() {
//     const ballMarker = this.stage.getChildByName('ballMarker');
//
//     const markerX = 88 + this.ball.distance * (321 - 88) / this.maxDistance;
//     const markerY = 91 + this.ball.distance * (247 - 91) / this.maxDistance;
//     const markerW = 624 - this.ball.distance * (624 - 158) / this.maxDistance;
//     const markerH = 418 - this.ball.distance * (418 - 106) / this.maxDistance;
//
//     ballMarker.graphics.clear().beginStroke("#009B72").drawRect(markerX, markerY, markerW, markerH);
//   }
//
//
//   hitBall(e) {
//     if (this.humanPaddle.hit(this.ball)) {
//       e.remove();
//       this.nearHit.load();
//       this.nearHit.play();
//       this.getSpin();
//       if (this.ball.xSpin > 15) {
//         this.ball.xSpin = 15;
//       }
//       if (this.ball.xSpin < -15) {
//         this.ball.xSpin = -15;
//       }
//       if (this.ball.ySpin > 15) {
//         this.ball.ySpin = 15;
//       }
//       if (this.ball.ySpin < -15) {
//         this.ball.ySpin = -15;
//       }
//       this.ticker.addEventListener('tick', this.doTheStuff.bind(this));
//     }
//   }
//
//   doTheStuff() {
//     this.ball.move();
//     this.detectWallBounce();
//     this.detectGoalOrHit();
//     this.updateBallMarker();
//   }
//
//
// }


module.exports = {
  Corridor : Corridor,
  CorridorView : CorridorView
};
