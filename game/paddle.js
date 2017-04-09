class Paddle {

  constructor(corridor, player, z) {
    this.corridor = corridor;
    this.player = player;

    this.w = corridor.w / 5;
    this.h = corridor.h / 5;

    this.x = 0;
    this.y = 0;
    this.z = z;
    this.prevX = 0;
    this.prevY = 0;
  }

  enforceBounds() {
    const bounds = this.corridor.bounds;
    if (this.x + this.w / 2 > bounds.r) {
      this.x = bounds.r - this.w / 2;
    } else if (this.x - this.w / 2 < bounds.l) {
      this.x = bounds.l + this.w / 2;
    }

    if (this.y + this.h / 2 > bounds.b) {
      this.y = bounds.b - this.h / 2;
    } else if (this.y - this.h / 2 < bounds.t) {
      this.y = bounds.t + this.h / 2;
    }
  }

  hit(ball) {
    if (ball.x - ball.r <= this.x + this.w / 2
        && ball.x + ball.r >= this.x - this.w / 2
        && ball.y - ball.r <= this.y + this.h / 2
        && ball.y + ball.r >= this.y - this.h / 2) {
      return true;
    } else {
      return false;
    }
  }

  move() {
    let x, y;
    [x, y] = this.player.getPos(this, this.corridor);
    this.x = x;
    this.y = y;

    this.enforceBounds();
  }

}

class PaddleView {
  constructor(paddle, stage, color) {
    this.paddle = paddle;
    this.stage = stage;
    this.color = color;

    this.shape = new createjs.Shape();
    this.draw();

    this.render();
  }

  center() {
    this.shape.x -= this.paddle.w / 2;
    this.shape.y -= this.paddle.h / 2;
  }

  draw() {
    let scaleFactor, x, y, w, h;
    [scaleFactor, x, y, w, h] = this.getAttributes();

    this.shape.graphics
      .beginStroke(this.color)
      .setStrokeStyle(4)
      .beginFill(this.color)
      .drawRoundRect(0, 0, w, h, 10);
    this.shape.alpha = 0.5;

    this.shape.scaleX = scaleFactor;
    this.shape.scaleY = scaleFactor;

    this.shape.x = x;
    this.shape.y = y;

    this.stage.addChild(this.shape);
  }

  getAttributes() {
    const scaleFactor = this.paddle.z === 0 ? 1 : 0.25;

    const x = this.stage.canvas.width / 2 - this.paddle.w * scaleFactor / 2;
    const y = this.stage.canvas.height / 2 - this.paddle.h * scaleFactor / 2;

    const w = this.paddle.w;
    const h = this.paddle.h;

    return [scaleFactor, x, y, w, h];
  }

  render() {
    this.shape.x = this.paddle.x;
    this.shape.y = this.paddle.y;
    this.center();
    this.stage.update();
  }
}


//

//
//   move(ball = null, trackingRatio = null) {
//     // if (this.type === 'near') {
//       this.moveNearPaddle(ball);
//     // } else {
//     //   this.moveFarPaddle(ball, trackingRatio);
//     // }
//   }
//
//   moveNearPaddle(ball = null) {
//     this.prevX = this.shape.x;
//     this.prevY = this.shape.y;
//
//     if (ball) {
//       this.shape.x = ball.x
//       this.shape.y = ball.y;
//     } else {
//       this.shape.x = this.stage.mouseX;
//       this.shape.y = this.stage.mouseY;
//     }
//
//     this.center();
//     this.enforceBounds({
//       top: this.corridor.nearY,
//       right: this.corridor.nearX + this.corridor.width,
//       bottom: this.corridor.nearY + this.corridor.height,
//       left: this.corridor.nearX
//     });
//   }
//
//   moveFarPaddle(ball, trackingRatio) {
//     const difX = ball.farX - this.shape.x - this.width / 2;
//     const difY = ball.farY - this.shape.y - this.height / 2;
//
//     this.shape.x += difX / (5 + trackingRatio);
//     this.shape.y += difY / (5 + trackingRatio);
//
//     this.enforceBounds({top: 247, right: 480, bottom: 353, left: 322});
//   }
//
//   spinVector() {
//     const xSpin = this.shape.x - this.prevX;
//     const ySpin = this.shape.y - this.prevY;
//
//     return [xSpin, ySpin];
//   }
//
// }

module.exports = {
  Paddle: Paddle,
  PaddleView: PaddleView
};
