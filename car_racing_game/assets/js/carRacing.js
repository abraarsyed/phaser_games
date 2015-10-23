var container = document.getElementById('container');
var game = new Phaser.Game(300, 600, Phaser.AUTO, 'container'),
    myCar,
    cursors,
    bg,
    otherCars,
    score=0,
    scoreText,
    sound,
    play,
    pause,
    resume;

//First Activity/Screen
var menuState = {
    //Load all the necessary resources.
    preload: function() {
        game.load.image('background', 'assets/images/bg.png');
        game.load.image('myCar', 'assets/images/Audi.png');
        game.load.image('otherCars', 'assets/images/Taxi.png');
    },
    //Initialize the first screen of the game.
    create: function() {
        //Set the screen background
        bg = game.add.tileSprite(0, 0, 300, 600, 'background');
        //Display myCar
        myCar=game.add.sprite(0,game.height-150,'myCar');
        //Display otherCars
        otherCars=game.add.group();
        otherCars.create(16,16,'otherCars');
        otherCars.create(200,200,'otherCars');
        //Display Play option
        play = game.add.text(game.world.centerX, game.world.centerY, 'Play', { fontSize: '32px', fill: '#fff', align: "center" });
        play.anchor.setTo(0.5, 0.5);
        play.inputEnabled=true;
        //On clicking Play Option
        play.events.onInputDown.add(function(){
            game.state.start('main');
        });
    },
    //update the screen
    update: function() {
         bg.tilePosition.y += 5;
    }
};
        
//Second Activity/Screen
var mainState = {
        //Load all the necessary Resources.
        preload: function() {
            game.load.image('background', 'assets/images/bg.png');
            game.load.image('myCar', 'assets/images/Audi.png');
            game.load.image('otherCars', 'assets/images/Taxi.png');
            game.load.audio('bgMusic', 'assets/sound/timetorun.mp3');  
        },
        //Initialize the second screen of the game.
        create: function() {
            //Set background music
            sound = game.add.audio('bgMusic');
            sound.play('',0,1,true);
            //Set the screen background
            bg = game.add.tileSprite(0, 0, 300, 600, 'background');
            //Display myCar
            myCar=game.add.sprite(0,game.height-250,'myCar');
            //Add physics to myCar
            game.physics.arcade.enable(myCar);
            myCar.body.collideWorldBounds = true;
            myCar.body.gravity.y = 500;
            //Display Score on top left corner
            scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
            //Display Pause option on top right corner
            pause = game.add.text(200, 16, 'Pause', { fontSize: '32px', fill: '#fff' });
            pause.inputEnabled = true;
            //On clicking Pause option
            pause.events.onInputUp.add(function () {
                //Pause the game
                game.paused = true;
                // Then add the resume menu
                resume = game.add.text(game.world.centerX, game.world.centerY, 'Click to Resume', { fontSize: '32px', fill: '#fff', align: "center" });
                resume.anchor.setTo(0.5, 0.5);
                resume.inputEnabled=true;
            });
            //on clicking anywhere on screen, game unpauses
            game.input.onDown.add(unpause, self);
            function unpause(event){
                // Remove the menu
                game.world.remove(resume);
                // Unpause the game
                game.paused = false;
            };    
            //Display otherCars
            otherCars=game.add.group();
            otherCars.enableBody=true;
            otherCars.createMultiple(3,'otherCars');
            game.time.events.loop(1000,this.otherCarsPositions, this);
            //Arrows keys movements
            cursors = game.input.keyboard.createCursorKeys();
        },
        //Update the application. This function will contain basic game logic.
        update: function() {
            //Looping Background sprite
            bg.tilePosition.y += 15;
            myCar.body.velocity.x = 0;
            //On pressing left arrow key,move myCar left
            if(cursors.left.isDown){
                myCar.body.velocity.x = -600;
            }
            //on pressing right arrow key,move myCar right
            else if(cursors.right.isDown){
                myCar.body.velocity.x = 600;
            }
            //Check and procress the collision between myCar and otherCars
            game.physics.arcade.overlap(myCar, otherCars,this.gameOver, null, this);
    
        }, 
        //Choose one the tracks(random selection) to display the new otherCars
        otherCarsPositions: function() {  
            var choose; 
            choose = Math.random();
            //Choose first track
            if(choose>=0 && choose<0.33){
                this.addOneCar(15,0);   
            }
            //choose second track
            else if (choose>=0.33 && choose<0.66){
                this.addOneCar(115,0);
            }
            //choose third track
            else if(choose>=0.66 && choose<1){
                this.addOneCar(215,0);
            }
        },
        //Display one more otherCars on screen in one of the three tracks
        addOneCar: function(x, y) {  
            var otherCar = otherCars.getFirstDead();
            otherCar.reset(x,y);
            otherCar.body.velocity.y = 600;  
            otherCar.checkWorldBounds = true;
            otherCar.outOfBoundsKill = true;
            //Increment the score
            score += 1;
            scoreText.text = 'Score: ' + score;
        },
        //If myCar and otherCar collides, game Over
        gameOver: function(mycar, othercars) {
            sound.stop();
            game.state.start('restart');
        }
};
    
//Third Activity/Screen
var restartState = {
    //Load all necessary Resources
    preload: function() {
        game.load.image('background', 'assets/images/bg.png');
        game.load.image('myCar', 'assets/images/Audi.png');
        game.load.image('otherCars', 'assets/images/Taxi.png');
    },
    create: function() {
        //Set the screen background
        bg = game.add.tileSprite(0, 0, 300, 600, 'background');
        //Display myCar
        myCar=game.add.sprite(0,game.height-150,'myCar');
        //Display otherCars
        otherCars=game.add.group();
        otherCars.create(16,16,'otherCars');
        //Display Final score
        scoreText = game.add.text(game.world.centerX, game.world.centerY, 'Your Score: '+score, { fontSize: '32px', fill: '#fff', align: "center" });
        scoreText.anchor.setTo(0.5,0.5);
        score=0;
        otherCars.create(200,150,'otherCars');
        //Display Play Again option
        play = game.add.text(game.world.centerX, game.world.centerY+50, 'Play Again', { fontSize: '32px', fill: '#fff', align: "center" });
        play.anchor.setTo(0.5, 0.5);
        play.inputEnabled=true;
        //On clicking Play Again, Restart game
        play.events.onInputDown.add(function(){
            game.state.start('main');
        });
    },
    //Update the screen.
    update: function() {
         bg.tilePosition.y += 5;
    }
};
  
//Different states of the game
game.state.add('menu', menuState);    
game.state.add('main', mainState);   
game.state.add('restart', restartState);
//Game starts from this state
game.state.start('menu'); 