    var container = document.getElementById('container');
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'container', { preload: preload, create: create, update: update }),
            playerPaddle,
            computerPaddle,
            ball,
            computerPaddleSpeed = 300,
            ballSpeed = 300,
            ballReleased = false;
        //Display the two paddles.
        function createPaddle(x, y, pad) {
            var paddle = game.add.sprite(x, y, pad);
            paddle.anchor.setTo(0.5, 0.5);
            paddle.body.collideWorldBounds = true;
            paddle.body.bounce.setTo(1, 1);
            paddle.body.immovable = true;
            return paddle;
        };
        //Begin the game by releasing the ball from initial position.
        function releaseBall() {
            if (!ballReleased) {
                ball.body.velocity.x = ballSpeed;
                ball.body.velocity.y = -ballSpeed;
                ballReleased = true;
            }
        };
        //Events that occur if ball and paddle collide.
        function ballHitsPaddle (_ball, _paddle) {
            var diff = 0;
            if (_ball.x < _paddle.x) {
                //If ball is in the left hand side on the paddle.
                diff = _paddle.x - _ball.x;
                _ball.body.velocity.x = (-10 * diff);
            }
            else if (_ball.x > _paddle.x) {
                //If ball is in the right hand side on the paddle.
                diff = _ball.x -_paddle.x;
                _ball.body.velocity.x = (10 * diff);
            }
            else {
                //The ball hit the center of the paddle, let's add a little bit of a tragic accident(random) of his movement.
                _ball.body.velocity.x = 2 + Math.random() * 8;
            }
        };
        //Reset ball to initial position.
        function setBall() {
            if (ballReleased) {
                ball.x = game.world.centerX;
                ball.y = game.world.centerY;
                ball.body.velocity.x = 0;
                ball.body.velocity.y = 0;
                ballReleased = false;
            }
        };
        //Check if anyone misses a score and loses the match.
        function checkGoal() {
            if (ball.y < 65) {
                setBall();
            }
            else if (ball.y > 535) {
                setBall();
            }
        };
        //Load all the necessary resources.
        function preload() { 
            game.load.image('playerPaddle','assets/images/playerPaddle.png');
            game.load.image('computerPaddle','assets/images/computerPaddle.png');
            game.load.image('ball','assets/images/ball.png');
            game.load.image('background','assets/images/background.jpg');
        };
        //Initialize the game.
        function create() {
            //Set the game background.
            game.add.tileSprite(0, 0, 800, 600, 'background');
            //Display the Player paddle sprite.
            playerPaddle = createPaddle(game.world.centerX, 570, 'playerPaddle');
            //Display the Computer paddle sprite.
            computerPaddle = createPaddle(game.world.centerX, 0, 'computerPaddle');
            //Display the Ball sprite.
            ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
            ball.anchor.setTo(0.5, 0.5);
            ball.body.collideWorldBounds = true;
            ball.body.bounce.setTo(1, 1);
            //On Mouse click
            game.input.onDown.add(releaseBall, this);
        };
        //Update the application. This function will contain basic game logic.
        function update() {
            //Control the player paddle
            playerPaddle.x = game.input.x;
            var playerPaddleHalfWidth = playerPaddle.width / 2;
            if (playerPaddle.x < playerPaddleHalfWidth) {
                playerPaddle.x = playerPaddleHalfWidth;
            }
            else if (playerPaddle.x > game.width - playerPaddleHalfWidth) {
                playerPaddle.x = game.width - playerPaddleHalfWidth;
            }
            //Control the computer paddle
            if(computerPaddle.x - ball.x < -10) {
                computerPaddle.body.velocity.x = computerPaddleSpeed;
            }
            else if(computerPaddle.x - ball.x > 10) {
                computerPaddle.body.velocity.x = -computerPaddleSpeed;
            }
            else {
                computerPaddle.body.velocity.x = 0;
            }
            //Check and process the collision ball and paddles
            game.physics.collide(ball, playerPaddle, ballHitsPaddle, null, this);
            game.physics.collide(ball, computerPaddle, ballHitsPaddle, null, this);
            //check if anyone scores
            checkGoal();
        };