## Swervo - A game of 3D Curve Pong

### Background

![swervo](https://github.com/atom-r/swervo/blob/master/swervo.gif)

[Swervo Live](http://www.adamjrichard.com/swervo)

Swervo is a JavaScript remake of Curveball, a Flash creation from the early 2000s, which itself was a take on the arcade classic Pong. Curveball features a 3-D corridor (though players' paddles move only in 2-D) and allows players to put spin on the ball, curving it down the corridor toward the opponent's goal.

### Gameplay

As of now, the only gameplay mode pits the human player, situated at the near end of the corridor, playing against an AI opponent. The player's objective is to progress as far as possible in the game given 6 "strikes". The game begins at Level 1, where the ball moves relatively slowly down the corridor, and the AI opponent does not track the gameball very well. Levels progress after every three goals against the AI.

### Implementation

Swervo is written in vanilla JavaScript, using the Easel.js API to render the corridor frame and the game's ball and paddles.

#### Drawing in Easel

```JavaScript
//corridor.js
buildHumanPaddle() {
  //set the the paddle colors and shape
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

  //append the shape to the stage
  this.stage.addChild(humanPaddle);
  //must later call stage.update() in order to render all children
}
```

Easel.js provides a Ticker object, and an associated 'tick' event, which are used to set a game clock.

```JavaScript
// corridor.js
this.ticker = createjs.Ticker;
this.ticker.setFPS(60);
```

Allowing the corridor's shapes to be updated on every 'tick':

```JavaScript
//the same listener calls this.movePaddles elsewhere
this.ticker.addEventListener('tick', this.moveBall.bind(this));
```

#### 3D Rendering
Two operations must be performed in order to give the impression that the ball is traveling in/out on the screen.

First, the ball's size must scale with distance. After setting attributes on the ball to mark its current distance from the player and its direction of travel, adjustment of size is easily accomplished in Easel.

```JavaScript
//scales the ball to a quarter of its original size at max_distance
ball.scaleX = 1 - ball.distance * 3 / (4 * this.max_distance);
ball.scaleY = 1 - ball.distance * 3 / (4 * this.max_distance);
```

Second, the ball's position on the screen must be adjusted to account for 3D perspective. This was perhaps the most challenging aspect of writing Swervo. My solution stores the ball's "raw" 2-dimensional positions. That is, the coordinates at which the ball would be rendered if it were at a distance of 0.

From there, the game calculates where the ball would be rendered at the far end of the corridor. These near and far positions can be thought of as endpoints on a line that extends into the screen. As the ball's distance increases, it travels "down" this line toward the far endpoint.

```JavaScript
//note that at ball.distance = 0, ball.x = ball.rawX
//and at ball.distance = max_distance, ball.x = ball.farX
ball.x = ball.rawX - (ball.rawX - ball.farX) * ball.distance / this.max_distance;
ball.y = ball.rawY - (ball.rawY - ball.farY) * ball.distance / this.max_distance;
```

#### Lateral Velocity and Curving
Spin gets applied whenever the player's paddle strikes the ball. The paddle's previous position is subtracted from its current position, and this difference is added to the ball's spin vector.

The ball's lateral velocity vector is constant unless the ball has a non-zero spin. The spin vector (scaled by the corridor's max_distance to prevent wild amounts of curve) gets added to the velocity vector every frame. This results in a nice acceleration effect when a spin is placed on the ball.

Ball spin gets killed on wall bounces. This also helps to prevent wild amounts of ball spin.

#### AI Paddle
The AI paddle is set to track the ball's raw position at all times. This is done by comparing the AI's raw position to the ball's raw position and then adjusting paddle position by an amount proportional to the difference between the two. The proportion of this "catching-up" with the ball is dependent on Level.

For example, on Level 1, the AI paddle only makes up 1/35 of the distance between it and the ball on every frame. By Level 7, it's making up about 1/8 of that distance per frame.

### Going Forward
Swervo stands alone as an entertaining single-player, browser-based game. Possible future plans for Swervo include PvP support, as well as a mobile implementation.
