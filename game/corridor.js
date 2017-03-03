

CENTER_X = 400;
CENTER_Y = 300;
MAX_DISTANCE = 80;

const init = () => {
  const stage = new createjs.Stage("myCanvas");

  const ball = new createjs.Shape();
  ball.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 35);
  ball.name = "ball";

  renderCorridor(stage);
  stage.addChild(ball);
  renderPaddles(stage);

  const ballMarker = new createjs.Shape();
  drawBallMarker(stage, ballMarker);

  setStage(ball, stage, ballMarker)();

};

const drawBallMarker = (stage, ballMarker) => {
  ballMarker.graphics.beginStroke("#32CD32");
  ballMarker.graphics.setStrokeStyle(1);
  ballMarker.snapToPixel = true;
  ballMarker.graphics.drawRect(88, 91, 624, 418);

  stage.addChild(ballMarker);
};

const setStage = (ball, stage, ballMarker) => () => {
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
  stage.on('stagemousedown', hitBall(ball, stage, ballMarker));
};


const hitBall = (ball, stage, ballMarker) => (e) => {
  e.remove();
  const humanPaddle = stage.getChildByName('humanPaddle');
  const cpuPaddle = stage.getChildByName('cpuPaddle');

  ball.xSpin += humanPaddle.x - humanPaddle.prevX;
  ball.ySpin += humanPaddle.y - humanPaddle.prevY;

  const ticker = createjs.Ticker;
  ticker.addEventListener('tick', scaleBall);
  ticker.setFPS(60);


  function detectHumanHit() {
    if (ball.x - (ball.radius - 10) <= humanPaddle.x + 120
        && ball.x + (ball.radius - 10) >= humanPaddle.x
        && ball.y - (ball.radius - 10) <= humanPaddle.y + 60
        && ball.y + (ball.radius - 10) >= humanPaddle.y) {
      console.log(`${humanPaddle.x}, ${humanPaddle.prevX}`);
      ball.xSpin += humanPaddle.x - humanPaddle.prevX;
      ball.ySpin += humanPaddle.y - humanPaddle.prevY;
    } else {
      ticker.removeEventListener('tick', scaleBall);
      setTimeout(setStage(ball, stage, ballMarker), 1000);
    }
  }

  function detectCpuHit() {

    if (ball.x - 400 - (ball.radius - 2) <= cpuPaddle.x + 15
        && ball.x - 400 + (ball.radius - 2) >= cpuPaddle.x - 15
        && ball.y - 300 - (ball.radius - 2) <= cpuPaddle.y + 10
        && ball.y - 300 + (ball.radius - 2) >= cpuPaddle.y - 10) {
      console.log(`cpu hit!`);
    } else {
      ticker.removeEventListener('tick', scaleBall);
      setTimeout(setStage(ball, stage, ballMarker), 1000);
    }
  }

  function scaleBall() {
    if (ball.direction === "out"){
      ball.distance += 1;
    } else {
      ball.distance -= 1;
    }

    if (ball.distance === MAX_DISTANCE){
      detectCpuHit();
      ball.direction = "in";
    } else if (ball.distance === 0){
      detectHumanHit();
      ball.direction = "out";
    }

    const markerX = 88 + ball.distance * (321 - 88) / MAX_DISTANCE;
    const markerY = 91 + ball.distance * (247 - 91) / MAX_DISTANCE;
    const markerW = 624 - ball.distance * (624 - 158) / MAX_DISTANCE;
    const markerH = 418 - ball.distance * (418 - 106) / MAX_DISTANCE;
    ballMarker.graphics.clear().beginStroke("#32CD32").drawRect(markerX, markerY, markerW, markerH);

    ball.scaleX = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);
    ball.scaleY = 1 - ball.distance * 3 / (4 * MAX_DISTANCE);

    ball.radius = 35 * ball.scaleX;

    //closest box right bound x = 712, left bound x = 88
    //            top boundy = 91, bottom bound y = 509

    //furthest box right bound x = 479, left bound x = 321
    //            top boundy = 353, bottom bound y = 247

    ball.xVelocity -= ball.xSpin / MAX_DISTANCE;
    ball.yVelocity -= ball.ySpin / MAX_DISTANCE;

    ball.rawX += ball.xVelocity;
    ball.farX = (ball.rawX - 400) * 79/312 + 400;

    if(ball.rawX >= 712 || ball.rawX <= 88){
      ball.xVelocity = ball.xVelocity * -1;
      ball.xSpin = 0;
    }

    ball.rawY += ball.yVelocity;
    ball.farY = (ball.rawY - 300) * 53/209 + 300;

    if(ball.rawY >= 509 || ball.rawY <= 91){
      ball.yVelocity = ball.yVelocity * -1;
      ball.ySpin = 0;
    }

    ball.x = ball.rawX - (ball.rawX - ball.farX) * ball.distance / MAX_DISTANCE;
    ball.y = ball.rawY - (ball.rawY - ball.farY) * ball.distance / MAX_DISTANCE;

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

    // const cpuPaddle = stage.getChildByName('cpuPaddle');

    stage.update();
  }
};

const drawRectangle = (stage, shape, { x, y, w, h }) => {
  shape.graphics.beginStroke("#FFF8F0");
  shape.graphics.setStrokeStyle(1);
  shape.snapToPixel = true;
  shape.graphics.drawRect(x, y, w, h);

  stage.addChild(shape);
};

const drawCorner = (stage, shape, { mtx, mty, ltx, lty }) => {
  shape.graphics.beginStroke("#FFF8F0");
  shape.graphics.setStrokeStyle(1);
  shape.snapToPixel = true;
  shape.graphics.moveTo(mtx, mty);
  shape.graphics.lineTo(ltx, lty);

  stage.addChild(shape);
};

const renderCorridor = stage => {

  const border1 = new createjs.Shape();
  const border2 = new createjs.Shape();
  const border3 = new createjs.Shape();
  const border4 = new createjs.Shape();
  const border5 = new createjs.Shape();
  const border6 = new createjs.Shape();
  const border7 = new createjs.Shape();
  const border8 = new createjs.Shape();
  const border9 = new createjs.Shape();

  drawRectangle(stage, border1, { x: 88, y: 91, w: 624, h: 418 });
  drawRectangle(stage, border2, { x: 146, y: 130, w: 508, h: 340 });
  drawRectangle(stage, border3, { x: 195, y: 162, w: 410, h: 276 });
  drawRectangle(stage, border4, { x: 234, y: 190, w: 332, h: 221 });
  drawRectangle(stage, border5, { x: 263, y: 208, w: 275, h: 184 });
  drawRectangle(stage, border6, { x: 283, y: 222, w: 234, h: 157 });
  drawRectangle(stage, border7, { x: 299, y: 233, w: 202, h: 135 });
  drawRectangle(stage, border8, { x: 312, y: 240, w: 176, h: 120 });
  drawRectangle(stage, border9, { x: 322, y: 247, w: 158, h: 106 });

  let cornerNW = new createjs.Shape();
  let cornerNE = new createjs.Shape();
  let cornerSE = new createjs.Shape();
  let cornerSW = new createjs.Shape();

  drawCorner(stage, cornerNW, { mtx: 88, mty: 91, ltx: 322, lty: 247 });
  drawCorner(stage, cornerNW, { mtx: 712, mty: 91, ltx: 479, lty: 247 });
  drawCorner(stage, cornerNW, { mtx: 712, mty: 509, ltx: 479, lty: 353 });
  drawCorner(stage, cornerNW, { mtx: 88, mty: 509, ltx: 322, lty: 353 });

};

const renderPaddles = stage => {
  let humanPaddle = new createjs.Shape();
  humanPaddle.graphics.beginStroke("DeepSkyBlue");
  humanPaddle.graphics.setStrokeStyle(4);
  humanPaddle.snapToPixel = true;
  humanPaddle.graphics.drawRoundRect(0, 0, 120, 80, 10);
  humanPaddle.name = 'humanPaddle';
  humanPaddle.prevX = 0;
  humanPaddle.prevY = 0;

  let cpuPaddle = new createjs.Shape();
  cpuPaddle.graphics.beginStroke("#92140C");
  cpuPaddle.graphics.setStrokeStyle(2);
  cpuPaddle.snapToPixel = true;
  cpuPaddle.graphics.drawRoundRect(385, 290, 30, 20, 3);
  cpuPaddle.name = 'cpuPaddle';
  cpuPaddle.rawX = 0;
  cpuPaddle.rawY = 0;
  cpuPaddle.prevRawX = 0;
  cpuPaddle.prevRawY = 0;

  stage.addChild(cpuPaddle);
  stage.addChild(humanPaddle);

  createjs.Ticker.addEventListener('tick', movePaddles);
  createjs.Ticker.setFPS(60);

  function movePaddles(event){
    let difX;
    let difY;

    if (stage.mouseX < 652 && stage.mouseX > 148){
      difX = stage.mouseX - humanPaddle.x - 60;
    } else if (stage.mouseX <= 148){
      difX = 148 - humanPaddle.x - 60;
    } else {
      difX = 652 - humanPaddle.x - 60;
    }

    if (stage.mouseY < 469 && stage.mouseY > 131){
      difY = stage.mouseY - humanPaddle.y - 40;
    } else if (stage.mouseY <= 131){
      difY = 131 - humanPaddle.y - 40;
    } else {
      difY = 469 - humanPaddle.y - 40;
    }

    const ball = stage.getChildByName('ball');
    cpuDifX = ball.rawX - 400 - cpuPaddle.rawX;
    cpuDifY = ball.rawY - 300 - cpuPaddle.rawY;


    cpuPaddle.prevX = cpuPaddle.rawX;
    cpuPaddle.prevY = cpuPaddle.rawY;
    cpuPaddle.rawX += cpuDifX/10;
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

    humanPaddle.prevX = humanPaddle.x;
    humanPaddle.prevY = humanPaddle.y;
    humanPaddle.x += difX/1.2;
    humanPaddle.y += difY/1.2;
    stage.update();
  }


};
