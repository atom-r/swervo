## Swervo - 3D Pong - With Curveball Action

### Background

Swervo is a JavaScript remake of Curveball, a Flash creation from the early 2000s, which itself was a take on the arcade classic Pong. Curveball features a 3-D corridor (though players' paddles move only in 2-D) and allows players to put spin on the ball, curving it down the corridor toward the opponent's goal.

As in the original, the game will be built for one player, who will use a mouse to control a paddle at the near end of the corridor. Should the ball land on the surface 'behind' the human player, he/she will receive a strike. If the computer puts 3 strikes by you, you're out.

The ball will have an angular velocity variable ('spin') which will determine the strength of the curve. The magnitude and direction of the ball's spin will be determined whenever the ball contacts a paddle. That is, if the paddle is moving directly 'up' at when the ball makes contact, the ball will receive a topwise spin velocity proportional to the speed at which the paddle was moving.

The computer opponent will track the ball as it travels up and down the corridor. Similar to Pong, the computer will not predict the ball's destination, but merely attempt to stay in front of it, limited by a max speed. The computer paddle will add angular velocity to the ball just as the human player's will.

If progress proceeds smoothly, a level system will be implemented, with difficulty level (i.e., computer player tracking speed) rising as the player progresses.

### Functionality & MVP  

At a minimum, players will be able to:

- [ ] Move their paddle in 2-D space at the near end of the game corridor
- [ ] Play against a computer opponent, positioned at the far end of the corridor
- [ ] Put some 'english' on the swervo ball by changing its angular momentum when striking it
- [ ] Play until one of the players reaches three strikes

In addition, this project will include:

- [ ] An About modal describing the background and rules of the game
- [ ] A production README

### Wireframes

This app will consist of a single screen with game board, and nav links to Github, LinkedIn,
and the About modal.  The player will click 'Start' on the main screen to load the corridor, paddles, and ball. The ball starts in front of the human player, who will click to initiate action.

![wireframes](https://github.com/atom-r/)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript for game physics computations
- `HTML5 Canvas` for rendering the corridor and pieces (paddles and game ball)
- CSS for general styling around the game display and in the About modal
- Webpack for bundling the following script files

In addition to the webpack entry file, there will be three scripts involved in this project:

`corridor.js`: this script will create, update, and render the corridor, paddles, game ball

`computer_player.js`: this script will control tracking of ball position and updating the computer player's paddle position

`swervo.js`: this script will control the refresh rate, compute ball velocity and scoring, and reset pieces after a scoring event

### Implementation Timeline

**Day 1**: Review HTML5 Canvas and construct the corridor and its aforementioned game pieces, including an event listener which will cause the player's paddle to track the cursor inside the game display. This will require fleshing out most of 'corridor.js' as outlined above, and a skeleton version of 'swervo.js'.

- Get a game board rendered and responsive to player input, and nail down the change in apparent game ball size depending on its distance from the near end of the corridor

**Days 2 and 3**: Build out the game physics, including ball speed up and down the corridor as well as lateral movement due to spin, momentum, and deflection off of corridor walls.

- Begin without implementing spin. Set the board up as described previously, click to start, and make the ball travel from one end of the corridor to the other, updating the ball's apparent size along the way
- Get a playable ball velocity nailed down
- Complete 'computer_player.js'
- Add 'spin', including proper response as a spinning ball deflects off a wall (Note: ball speed along the corridor will be constant, regardless of spin)

**Day 4**: Add scoring, start screen, about modal, and complete styling around the game display.


### Bonus features

- [ ] Ascending difficulty levels and altered scoring system, allowing the player 5 total strikes
- [ ] Accompanying 8-bit soundtrack with mute capability
