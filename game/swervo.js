const Corridor = require('./corridor.js')
const Ball = require('./ball.js')

// CORRIDOR ATTRIBUTES
WIDTH = 700;
HEIGHT = 500;
DEPTH = 1600;
NUM_SEGMENTS = 9;

NARROWNESS_FACTOR = DEPTH / 400;

NEAR_X = (800 - WIDTH) / 2;
NEAR_Y = (600 - HEIGHT) / 2;

FAR_HEIGHT = HEIGHT / NARROWNESS_FACTOR;
FAR_WIDTH = WIDTH / NARROWNESS_FACTOR;

FAR_X = (800 - FAR_WIDTH) / 2;
FAR_Y = (600 - FAR_HEIGHT) / 2;

class Swervo {

  constructor() {
    this.stage = this.stage || new createjs.Stage("myCanvas");
    this.stage.canvas.style.cursor = "none";

    this.corridor = new Corridor(WIDTH, HEIGHT, DEPTH);
    this.renderCorridor();
  }

  renderCorridor() {
    this.drawRectangles();
    this.drawCorners();
    this.stage.update()
  }

  drawCorners() {
    const coords = this.getCornerCoords();
    coords.forEach( coordSet => {
      this.drawCorner(coordSet);
    });
  }

  drawCorner(coordSet) {
    const corner = new createjs.Shape();
    corner.graphics.beginStroke("#FFF8F0");
    corner.graphics.setStrokeStyle(1);
    corner.snapToPixel = true;
    corner.graphics.moveTo(coordSet.x, coordSet.y);
    corner.graphics.lineTo(coordSet.ltx, coordSet.lty);

    this.stage.addChild(corner);
  }

  drawRectangles() {
    let distance = 0;
    for (var i = 0; i <= NUM_SEGMENTS; i++) {
      this.drawRectangle(distance);
      distance += DEPTH / NUM_SEGMENTS;
    }
  }

  drawRectangle(distance) {
    const [x, y, w, h] = this.getDimensions(distance)
    const rect = new createjs.Shape();
    rect.graphics.beginStroke("#FFF8F0");
    rect.graphics.setStrokeStyle(1);
    rect.snapToPixel = true;
    rect.graphics.drawRect(x, y, w, h);

    this.stage.addChild(rect);
  }

  getCornerCoords() {
    const coords = [];
    coords.push({ x: NEAR_X, y: NEAR_Y, ltx: FAR_X, lty: FAR_Y });
    coords.push({ x: NEAR_X + WIDTH, y: NEAR_Y, ltx: FAR_X + FAR_WIDTH, lty: FAR_Y });
    coords.push({ x: NEAR_X + WIDTH, y: NEAR_Y + HEIGHT, ltx: FAR_X + FAR_WIDTH, lty: FAR_Y + FAR_HEIGHT});
    coords.push({ x: NEAR_X, y: NEAR_Y + HEIGHT, ltx: FAR_X, lty: FAR_Y + FAR_HEIGHT });
    return coords;
  }

  getDimensions(distance) {
    const x = NEAR_X - (NEAR_X - FAR_X) * Math.sqrt(distance) / Math.sqrt(DEPTH);
    const y = NEAR_Y - (NEAR_Y - FAR_Y) * Math.sqrt(distance) / Math.sqrt(DEPTH);
    const w = (800 - 2 * x);
    const h = (600 - 2 * y);

    return [x, y, w, h];
  }
}

const init = () => {
  const swervo = new Swervo;
};

document.addEventListener("DOMContentLoaded", init)
