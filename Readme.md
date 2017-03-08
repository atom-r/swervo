## Swervo - A game of 3D Curve Pong

### Background

![swervo](https://github.com/atom-r/swervo/blob/master/swervo.gif)

Swervo is a JavaScript remake of Curveball, a Flash creation from the early 2000s, which itself was a take on the arcade classic Pong. Curveball features a 3-D corridor (though players' paddles move only in 2-D) and allows players to put spin on the ball, curving it down the corridor toward the opponent's goal.

### Gameplay

As of now, the only gameplay mode pits the human player, situated at the near end of the corridor, playing against an AI opponent. The player's objective is to progress as far as possible in the game given 6 "strikes". The game begins at Level 1, where the ball moves relatively slowly down the corridor, and the AI opponent does not track the gameball very well. Levels progress after every three goals against the AI.

### Implementation

Swervo is written in vanilla JavaScript, using the Easel.js API to render the corridor frame and the game's ball and paddles.

####Drawing in Easel

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

Easel.js provides a Ticker object, and an associated 'tick' event, which can be used to set a game clock.

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

####3D rendering
The ball has direction of travel and distance attributes. Distance increments with every frame. When the ball reaches one of the ends of the corridor, ball.direction flips from "in" to "out" or vice versa.

The ball's size is scaled in Easel based on its current distance.

The ball's screen position must also be shifted in order to adjust for 3D perspective.


### Bonus features

- [ ] Ascending difficulty levels and altered scoring system, allowing the player 5 total strikes
- [ ] Accompanying 8-bit soundtrack with mute capability
