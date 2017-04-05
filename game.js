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

	FONT = "Audiowide"

	class Swervo {

	  constructor() {
	    this.stage = this.stage || new createjs.Stage("myCanvas");
	    this.stage.canvas.style.cursor = "none";

	    this.cpuStrikes = 2;
	    this.humanStrikes = 5;
	    this.level = 1;

	    this.corridor = new Corridor(this.stage, this);

	    this.buildCpuScore();
	    this.buildHumanScore();
	    this.printLevel();
	    this.handleKeydown();
	    this.setStage();
	  }

	  toggleAudio() {
	    this.corridor.audio = !this.corridor.audio;
	  }

	  handleKeydown() {
	    document.addEventListener('keydown', this.toggleAudio.bind(this));
	  }

	  buildCpuScore() {
	    const text = new createjs.Text("CPU", `20px ${FONT}`, "#2B4162");
	    text.x = 100;
	    text.y = 70;
	    text.textBaseline = "alphabetic";

	    this.stage.addChild(text);
	    this.buildCpuStrikes();

	    this.stage.update();
	  }

	  buildCpuStrikes() {
	    this.cpuStrikeShapes = [];
	    for (let i = 0; i < this.cpuStrikes; i++) {
	      this.cpuStrikeShapes[i] = new createjs.Shape();
	      this.cpuStrikeShapes[i].graphics.beginFill("#721817").drawCircle((160 + i * 25), 62, 10);

	      this.stage.addChild(this.cpuStrikeShapes[i]);
	    }
	  }

	  buildHumanScore() {
	    const text = new createjs.Text("Player", `20px ${FONT}`, "#2B4162");
	    text.x = 650;
	    text.y = 70;
	    text.textBaseline = "alphabetic";

	    this.stage.addChild(text);
	    this.buildHumanStrikes();

	    this.stage.update();
	  }

	  buildHumanStrikes() {
	    this.humanStrikeShapes = [];
	    for (let i = 0; i < this.humanStrikes; i++) {
	      this.humanStrikeShapes[i] = new createjs.Shape();
	      this.humanStrikeShapes[i].graphics.beginFill("#2B4162").drawCircle((630 - i * 25), 62, 10);

	      this.stage.addChild(this.humanStrikeShapes[i]);
	    }
	  }

	  printGameOver() {
	    const frame = new createjs.Shape();
	    frame.graphics
	      .beginFill("#555")
	      .drawRoundRect(275, 250, 250, 100, 5);

	    const gameOver = new createjs.Text(`Game Over`, `42px ${FONT}`, "#FFF");
	    gameOver.x = 290;
	    gameOver.y = 315;
	    gameOver.textBaseline = "alphabetic";

	    const spaceText = new createjs.Text(`Click to restart`, `42px ${FONT}`, "#2B4162");
	    spaceText.x = 320;
	    spaceText.y = 570;
	    spaceText.textBaseline = "alphabetic";

	    this.stage.addChild(frame);
	    this.stage.addChild(gameOver);
	    this.stage.addChild(spaceText);

	    this.stage.update();

	    this.stage.on('mousedown', this.restart.bind(this));
	  }

	  printLevel() {
	    const text = new createjs.Text(`Level ${this.level}`, `24px ${FONT}`, "#2B4162");
	    text.x = 363;
	    text.y = 540;
	    text.textBaseline = "alphabetic";
	    text.name = "level";

	    this.stage.addChild(text);

	    this.stage.update();
	  }

	  resetPieces(loser) {
	    if(loser === 'cpu') {
	      this.updateCpuStrikes();
	    } else {
	      this.updateHumanStrikes();
	    }
	  }

	  restart() {
	    this.stage.removeAllEventListeners();
	    this.corridor.ticker.removeAllEventListeners();
	    this.stage.removeAllChildren();

	    this.cpuStrikes = 2;
	    this.humanStrikes = 5;
	    this.level = 1;

	    this.corridor = new Corridor(this.stage, this);

	    this.buildCpuScore();
	    this.buildHumanScore();
	    this.printLevel();
	    this.setStage();
	  }

	  setStage() {
	    const ballMarker = this.stage.getChildByName('ballMarker');

	    this.corridor.ball.reset();
	    ballMarker.graphics.clear().beginStroke("#444").drawRect(88, 91, 624, 418);
	    this.stage.on('stagemousedown', this.corridor.hitBall.bind(this.corridor));
	  }

	  updateCpuStrikes() {
	    if(this.cpuStrikes > 0){
	      this.cpuStrikeShapes[this.cpuStrikes - 1].graphics.clear();
	      this.cpuStrikes -= 1;
	    } else {
	      const level = this.stage.getChildByName('level');
	      this.level += 1;
	      level.text = `Level ${this.level}`
	      this.corridor.cpuTrackingRatio = this.corridor.cpuTrackingRatio / 1.4 ;
	      this.cpuStrikes = 2;
	      setTimeout( () => {
	        this.corridor.ball.maxDistance = Math.floor(this.corridor.ball.maxDistance * 0.95);
	        this.corridor.maxDistance = this.corridor.ball.maxDistance;
	      }, 1000);
	      setTimeout(this.buildCpuStrikes.bind(this), 1000);
	    }
	    setTimeout(this.setStage.bind(this), 1000);
	  }

	  updateHumanStrikes() {
	    if(this.humanStrikes > 0){
	      this.humanStrikeShapes[this.humanStrikes - 1].graphics.clear();
	      this.humanStrikes -= 1;
	      setTimeout(this.setStage.bind(this), 1000);
	    } else {
	      this.printGameOver();
	    }
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

	HUMAN_COLOR = "#2B4162";
	CPU_COLOR = "#721817";

	HUMAN_PADDLE_WIDTH = 120;
	HUMAN_PADDLE_HEIGHT = 80;
	CPU_PADDLE_WIDTH = 30;
	CPU_PADDLE_HEIGHT = 20;

	class Corridor {

	  constructor(stage, swervo) {
	    this.stage = stage;
	    this.swervo = swervo;

	    this.ball = new Ball(this.stage, 60);
	    this.humanPaddle = new Paddle(HUMAN_PADDLE_WIDTH, HUMAN_PADDLE_HEIGHT, HUMAN_COLOR, "near", this.stage)
	    this.cpuPaddle = new Paddle(CPU_PADDLE_WIDTH, CPU_PADDLE_HEIGHT, CPU_COLOR, "far", this.stage)

	    this.maxDistance = 60;
	    this.cpuTrackingRatio = 30;

	    this.ticker = createjs.Ticker;
	    this.ticker.setFPS(60);

	    this.audio = true;

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
	      if (this.audio) {
	        this.vWallHit.load();
	        this.vWallHit.play();
	      }
	    }

	    if(this.ball.rawY >= 509 || this.ball.rawY <= 91){
	      this.ball.yVelocity = this.ball.yVelocity * -1;
	      this.ball.ySpin = 0;
	      if (this.audio) {
	        this.vWallHit.load();
	        this.vWallHit.play();
	      }
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

	  drawRectangle(shape, { x, y, w, h }) {
	    shape.graphics.beginStroke("#2B4162");
	    shape.graphics.setStrokeStyle(3);
	    shape.snapToPixel = true;
	    shape.graphics.drawRect(x, y, w, h);

	    this.stage.addChild(shape);
	  }

	  drawCorner(shape, { mtx, mty, ltx, lty }) {
	    shape.graphics.beginStroke("#2B4162");
	    shape.graphics.setStrokeStyle(4);
	    shape.snapToPixel = true;
	    shape.graphics.moveTo(mtx, mty);
	    shape.graphics.lineTo(ltx, lty);

	    this.stage.addChild(shape);
	  }

	  drawBallMarker() {
	    const ballMarker = new createjs.Shape();

	    ballMarker.graphics.beginStroke("#444");
	    ballMarker.graphics.setStrokeStyle(3);
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
	    if (this.humanPaddle.hit(this.ball)) {
	      if (this.audio) {
	        this.nearHit.load();
	        this.nearHit.play();
	      }
	      this.getSpin();
	    } else {
	      this.ball.fillCommand.style = CPU_COLOR;
	      if (this.audio) {
	        this.goal.load();
	        this.goal.play();
	      }
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
	      if (this.audio) {
	        this.farHit.load();
	        this.farHit.play();
	      }
	    } else {
	      this.ball.fillCommand.style = HUMAN_COLOR;
	      if (this.audio) {
	        this.goal.load();
	        this.goal.play();
	      }
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

	    ballMarker.graphics.clear().beginStroke("#444").drawRect(markerX, markerY, markerW, markerH);
	  }


	  hitBall(e) {
	    if (this.humanPaddle.hit(this.ball)) {
	      e.remove();
	      if (this.audio) {
	        this.nearHit.load();
	        this.nearHit.play();
	      }
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

	    this.xSpin = 5 * (Math.random() - 0.5);
	    this.ySpin = 5 * (Math.random() - 0.5);

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

	  constructor(width, height, color, type, stage) {
	    this.width = width;
	    this.height = height;
	    this.color = color;
	    this.type = type;
	    this.stage = stage;

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