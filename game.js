/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Corridor = __webpack_require__(1)
	const Ball = __webpack_require__(2)
	const Paddle = __webpack_require__(3)

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

	// PADDLE ATTRIBUTES
	PADDLE_WIDTH = 120;
	PADDLE_HEIGHT = 80;
	BLUE = "#2176FF";

	class Swervo {

	  constructor() {
	    this.stage = this.stage || new createjs.Stage("myCanvas");
	    this.stage.canvas.style.cursor = "none";

	    this.corridor = new Corridor(WIDTH, HEIGHT, DEPTH);
	    this.renderCorridor();

	    this.bluePaddle = new Paddle(this.stage, this.corridor, BLUE, PADDLE_WIDTH, PADDLE_HEIGHT);

	    this.ticker = createjs.Ticker();
	    this.ticker.setFPS(60);
	    this.ticker.addEventListener('tick', this.handleTick.bind(this))
	  }

	  handleTick() {
	    this.bluePaddle.getPos();
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Ball = __webpack_require__(2)
	const Paddle = __webpack_require__(3)

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

	  drawBallMarker() {
	    const ballMarker = new createjs.Shape();

	    ballMarker.graphics.beginStroke("#009B72");
	    ballMarker.graphics.setStrokeStyle(1);
	    ballMarker.snapToPixel = true;
	    ballMarker.graphics.drawRect(88, 91, 624, 418);
	    ballMarker.name = 'ballMarker';

	    this.stage.addChild(ballMarker);
	  };



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


/***/ },
/* 2 */
/***/ function(module, exports) {

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

	    this.xSpin = 10 * Math.random();
	    this.ySpin = 10 * Math.random();

	    this.rawX = 400;
	    this.rawY = 300;

	    this.farX = 400;
	    this.farY = 300;

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


/***/ },
/* 3 */
/***/ function(module, exports) {

	class Paddle {

	  constructor(stage, corridor, color, w, h) {
	    this.width = w;
	    this.height = h;
	    this.color = color;
	    this.corridor = corridor;
	    this.stage = stage;

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

	  move(ball = null, trackingRatio = null) {
	    if (this.type === 'near') {
	      this.moveNearPaddle(ball);
	    } else {
	      this.moveFarPaddle(ball, trackingRatio);
	    }
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


/***/ }
/******/ ]);