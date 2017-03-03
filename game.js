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

	class Swervo {

	  constructor() {
	    this.stage = new createjs.Stage("myCanvas");

	    this.cpuStrikes = 2;
	    this.humanStrikes = 5;
	    this.level = 1;

	    this.corridor = new Corridor(this.stage, this);

	    this.buildCpuScore();
	    this.buildHumanScore();
	    this.setStage();

	  }

	  resetPieces(losingPlayer) {
	    if(losingPlayer === 'cpu') {
	      this.updateCpuStrikes();
	    } else {
	      this.humanStrikes -= 1;
	    }
	    setTimeout(this.setStage.bind(this), 1000);
	  }

	  setStage() {
	    const ball = this.stage.getChildByName('ball');
	    const ballMarker = this.stage.getChildByName('ballMarker');
	    ball.x = 400;
	    ball.y = 300;
	    ball.rawX = 400;
	    ball.rawY = 300;
	    ball.xVelocity = 0;
	    ball.yVelocity = 0;
	    ball.direction = "out";
	    ball.distance = 0;
	    ball.scaleX = 1;
	    ball.scaleY = 1;
	    ball.xSpin = 0;
	    ball.ySpin = 0;
	    ballMarker.graphics.clear().beginStroke("#009B72").drawRect(88, 91, 624, 418);
	    this.stage.on('stagemousedown', this.corridor.hitBall.bind(this.corridor));
	  }

	  updateCpuStrikes() {
	    if(this.cpuStrikes > 0){
	      this.strikes[this.cpuStrikes - 1].graphics.clear();
	      this.cpuStrikes -= 1;
	    } else {
	      this.level += 1;
	      this.cpuStrikes = 2;
	      setTimeout(this.buildCpuStrikes.bind(this), 1000);
	    }
	  }

	  printYouWon() {
	    const text = new createjs.Text("You Win", "36px Arial", "#FFF8F0");
	    text.x = 400;
	    text.y = 300;
	    text.textBaseline = "alphabetic";

	    this.stage.addChild(text);

	    this.stage.update();
	  }

	  buildCpuStrikes() {
	    this.strikes = [];
	    for (let i = 0; i < this.cpuStrikes; i++) {
	      this.strikes[i] = new createjs.Shape();
	      this.strikes[i].graphics.beginFill("#F26430").drawCircle((160 + i * 25), 62, 10);

	      this.stage.addChild(this.strikes[i]);
	    }
	  }

	  buildHumanStrikes() {
	    const ball = new createjs.Shape();
	    ball
	      .graphics
	      .beginRadialGradientFill(["#009B72","#006B42"], [0, 1], 15, -15, 0, 0, 0, 5)
	      .drawCircle(0, 0, 5);
	    ball.name = "ball";

	    this.stage.addChild(ball);
	  }

	  buildCpuScore() {
	    const text = new createjs.Text("CPU", "20px Arial", "#FFF8F0");
	    text.x = 100;
	    text.y = 70;
	    text.textBaseline = "alphabetic";

	    this.stage.addChild(text);
	    this.buildCpuStrikes();

	    this.stage.update();
	  }

	  buildHumanScore() {
	    const text = new createjs.Text("Player", "20px Arial", "#FFF8F0");
	    text.x = 650;
	    text.y = 70;
	    text.textBaseline = "alphabetic";

	    this.stage.addChild(text);
	    this.stage.update();
	  }
	}

	const init = () => {
	  const swervo = new Swervo;
	};

	document.addEventListener("DOMContentLoaded", init)


/***/ },
/* 1 */
/***/ function(module, exports) {

	CENTER_X = 400;
	CENTER_Y = 300;
	MAX_DISTANCE = 80;

	class Corridor {

	  constructor(stage, swervo) {
	    this.stage = stage;
	    this.swervo = swervo;

	    this.ticker = createjs.Ticker;
	    this.ticker.setFPS(60);

	    this.nearHit = new Audio('./audio/nearhit.mp3');
	    this.farHit = new Audio('./audio/farhit.mp3');
	    this.wallHit = new Audio('./audio/wallhit.mp3');
	    this.goal = new Audio('./audio/goal.mp3');

	    this.renderCorridor();
	    this.renderPieces();

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

	  buildBall() {
	    const ball = new createjs.Shape();
	    ball
	      .graphics
	      .beginRadialGradientFill(["#009B72","#006B42"], [0, 1], 15, -15, 0, 0, 0, 35)
	      .drawCircle(0, 0, 35);
	    ball.name = "ball";

	    this.drawBallMarker();
	    this.stage.addChild(ball);
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
	    const ball = this.stage.getChildByName('ball');
	    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
	    const cpuDifX = ball.rawX - 400 - cpuPaddle.rawX;
	    const cpuDifY = ball.rawY - 300 - cpuPaddle.rawY;

	    cpuPaddle.prevX = cpuPaddle.rawX;
	    cpuPaddle.prevY = cpuPaddle.rawY;
	    cpuPaddle.rawX += cpuDifX/25;
	    if (cpuPaddle.rawX > 249){
	      cpuPaddle.rawX = 249;
	    } else if (cpuPaddle.rawX < -241) {
	      cpuPaddle.rawX = -241;
	    }

	    cpuPaddle.rawY += cpuDifY/10;
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
	    this.buildBall();
	    this.buildHumanPaddle();

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
	    const ball = this.stage.getChildByName('ball');
	    const humanPaddle = this.stage.getChildByName('humanPaddle');
	    if (ball.x - (ball.radius) <= humanPaddle.x + 120
	        && ball.x + (ball.radius) >= humanPaddle.x
	        && ball.y - (ball.radius) <= humanPaddle.y + 60
	        && ball.y + (ball.radius) >= humanPaddle.y) {
	      this.nearHit.load();
	      this.nearHit.play();
	      this.getSpin();
	    } else {
	      this.goal.load();
	      this.goal.play();
	      this.ticker.removeAllEventListeners('tick');
	      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
	      this.swervo.resetPieces('human');
	    }
	  }

	  getSpin() {
	    const ball = this.stage.getChildByName('ball');
	    const humanPaddle = this.stage.getChildByName('humanPaddle');
	    ball.xSpin += humanPaddle.x - humanPaddle.prevX;
	    ball.ySpin += humanPaddle.y - humanPaddle.prevY;
	  }

	  detectCpuHit() {
	    const ball = this.stage.getChildByName('ball');
	    const cpuPaddle = this.stage.getChildByName('cpuPaddle');
	    if (ball.x - 400 - (ball.radius - 2) <= cpuPaddle.x + 15
	        && ball.x - 400 + (ball.radius - 2) >= cpuPaddle.x - 15
	        && ball.y - 300 - (ball.radius - 2) <= cpuPaddle.y + 10
	        && ball.y - 300 + (ball.radius - 2) >= cpuPaddle.y - 10) {
	      this.farHit.load();
	      this.farHit.play();
	    } else {
	      this.goal.load();
	      this.goal.play();
	      this.ticker.removeAllEventListeners('tick');
	      this.ticker.addEventListener('tick', this.movePaddles.bind(this));
	      this.swervo.resetPieces('cpu');
	    }
	  }

	  updateBallMarker() {
	    const ballMarker = this.stage.getChildByName('ballMarker');
	    const ball = this.stage.getChildByName('ball');

	    const markerX = 88 + ball.distance * (321 - 88) / MAX_DISTANCE;
	    const markerY = 91 + ball.distance * (247 - 91) / MAX_DISTANCE;
	    const markerW = 624 - ball.distance * (624 - 158) / MAX_DISTANCE;
	    const markerH = 418 - ball.distance * (418 - 106) / MAX_DISTANCE;

	    ballMarker.graphics.clear().beginStroke("#009B72").drawRect(markerX, markerY, markerW, markerH);
	  }

	  scaleBall() {
	    const ball = this.stage.getChildByName('ball');

	    ball.scaleX = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);
	    ball.scaleY = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);

	    ball.radius = 35 * ball.scaleX;
	  }

	  applySpin() {
	    const ball = this.stage.getChildByName('ball');
	    ball.xVelocity -= ball.xSpin / MAX_DISTANCE;
	    ball.yVelocity -= ball.ySpin / MAX_DISTANCE;
	  }

	  applyVelocity() {
	    const ball = this.stage.getChildByName('ball');
	    ball.rawX += ball.xVelocity;
	    ball.farX = (ball.rawX - 400) * 79/312 + 400;

	    ball.rawY += ball.yVelocity;
	    ball.farY = (ball.rawY - 300) * 53/209 + 300;
	  }

	  detectWallBounce() {
	    const ball = this.stage.getChildByName('ball');

	    if(ball.rawX >= 712 || ball.rawX <= 88){
	      ball.xVelocity = ball.xVelocity * -1;
	      ball.xSpin = 0;
	      this.wallHit.load();
	      this.wallHit.play();
	    }

	    if(ball.rawY >= 509 || ball.rawY <= 91){
	      ball.yVelocity = ball.yVelocity * -1;
	      ball.ySpin = 0;
	      this.wallHit.load();
	      this.wallHit.play();
	    }
	  }

	  applyPerspective() {
	    const ball = this.stage.getChildByName('ball');

	    ball.x = ball.rawX - (ball.rawX - ball.farX) * ball.distance / MAX_DISTANCE;
	    ball.y = ball.rawY - (ball.rawY - ball.farY) * ball.distance / MAX_DISTANCE;


	    //these lines shift the ball slightly so it doesn't appear to be out of bounds
	    if (ball.rawX > 400) {
	      ball.x -= ball.radius * (ball.rawX - 400)/312;
	    } else if (ball.rawX < 400) {
	      ball.x += ball.radius * (400 - ball.rawX)/312;
	    }

	    if (ball.rawY > 300) {
	      ball.y -= ball.radius * (ball.rawY - 300)/209;
	    } else if (ball.rawY < 300) {
	      ball.y += ball.radius * (300 - ball.rawY)/209;
	    }
	  }

	  updateDistance() {
	    const ball = this.stage.getChildByName('ball');
	    if (ball.direction === "out"){
	      ball.distance += 1;
	    } else {
	      ball.distance -= 1;
	    }
	  }

	  detectGoalOrHit() {
	    const ball = this.stage.getChildByName('ball');
	    if (ball.distance === MAX_DISTANCE){
	      this.detectCpuHit();
	      ball.direction = "in";
	    } else if (ball.distance === 0){
	      this.detectHumanHit();
	      ball.direction = "out";
	    }
	  }

	  moveBall() {
	    this.updateDistance();
	    this.updateBallMarker();
	    this.scaleBall();
	    this.detectGoalOrHit();
	    this.detectWallBounce();
	    this.applySpin();
	    this.applyVelocity();
	    this.applyPerspective();

	    this.stage.update();
	  }

	  hitBall(e) {
	    e.remove();
	    this.getSpin();
	    this.nearHit.play();

	    this.ticker.addEventListener('tick', this.moveBall.bind(this));
	  }


	}

	module.exports = Corridor;


/***/ }
/******/ ]);