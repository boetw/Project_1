var game;

function resetVar() {
    speed = 0;
    counter = 0;
    speedUp = 0;
    continueGame = true;
    score = -2;
    restartGame();
}

function restartGame() {
    if ($('canvas').length) {
        $('canvas').remove();
        if (game) {
            game.destroy();
        }
    }

    game = new Phaser.Game(400, 1000, Phaser.AUTO, 'Game', {
        preload: preload,
        create: create,
        update: update
    }, true);
}

function preload() {
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('end', 'assets/end.png');
    game.load.image('water', 'img/water.png');
    game.load.image('button', 'img/button.png');


}
//varibles
var sprite;
var rock;
var end;
var group;
var speed = 0;
var counter = 0;
var text;
var rockGroup;
var stateText;
var start;
var textLevel;
var speedUp = 0;
var continueGame = true;
var button;

function create() {
    //  Enable ARCADE physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;
    // Gravity
    game.physics.arcade.gravity.y = 300;
    //  background
    // tilesprite = game.add.tileSprite(0, 0, 400, 1100, 'water');
    // tilesprite.body.allowGravity = false;

    rockGroup = game.add.group() //  The hero!
    star = game.add.sprite(200, 750, 'star');
    game.physics.enable(star, Phaser.Physics.ARCADE);
    star.body.allowGravity = false;
    star.body.collideWorldBounds = true;
    //start bar
    end = game.add.sprite(0, 0, 'end');
    end.alpha = 0.4;
    game.physics.enable(end, Phaser.Physics.ARCADE);
    var style = {
        font: "18px Arial",
        // fill: "#ff0044",
        wordWrap: true,
        wordWrapWidth: end.width,
        align: "center",
        // backgroundColor: "#ffff00"
    };
    text = game.add.text(0, 0, "Get Ready");
    text.anchor.set(0.3);
    //cursors
    cursors = game.input.keyboard.createCursorKeys();
    //start
    // game.paused = true;
    // button = game.add.button(game.world.centerX - 50, 400, 'button', actionOnClick, this, 2, 1, 0);
    //timers
    game.time.events.repeat(Phaser.Timer.SECOND * 12, 20, accelerate, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 12, 220, winner, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 12 + 5000, 20, createEnd, this);
    // game.time.events.repeat(Phaser.Timer.SECOND * 84, victor, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 1, createRock, this);
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 1, createEnd, this);

    stateText = game.add.text(game.world.centerX, game.world.centerY, ' ', {
        font: '48px Arial',
        fill: '#fff',
        align: 'center',
    });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
}
// function actionOnClick() {

//         console.log("START");
//         game.paused = false;
//         button.destroy();
// }
//faster
function accelerate() {
    speed++;
}
//rock
function createRock() {
    if (continueGame === true) {
        rock = game.add.sprite(game.world.randomX, 0, 'diamond');
        game.physics.arcade.enable(rock);
        rockGroup.add(rock)
        rock.body.collideWorldBounds = false;
        score += 1;
        speedy();
    }
}

function speedy() {
    setTimeout(createRock, 250 - speedUp);
}
//level marker
function createEnd() {
    end = game.add.sprite(00, 0, 'end');
    end.alpha = 0.4;
    game.physics.arcade.enable(end);
    end.body.collideWorldBounds = false;
    counter++;
    speedUp += 25;
    var style = {
        font: "20px Arial",
        // fill: "#ff0044",
        wordWrap: true,
        wordWrapWidth: end.width,
        align: "center",
        // backgroundColor: "#ffff00"
    };
    text = game.add.text(0, 0, "Level " + counter, style);


    // text.anchor.set(0.3);
}
//finish
function winner() {
    if (counter === 20) {
        alert("You Finished " + score);
        game.time.events.stop();
    } else {
        console.log(counter + " : " + score);
    }
}

function update() {
    //level sign
    text.x = Math.floor(end.x + end.width / 2);
    text.y = Math.floor(end.y + end.height / 2);
    //star speed
    star.body.velocity.setTo(0, 0);
    if (cursors.left.isDown) {
        star.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
        star.body.velocity.x = 200;
    }
    // //  Run collision
    game.physics.arcade.overlap(star, rockGroup, collisionHandler, null, this);
}
// make rocks
function render() {
    for (var i = 0; i < rock.length; i++) {
        game.debug.body(rock.children[i]);
    }
}
//rock meets barrel
function collisionHandler(star, rock) {
    star.kill();
    game.time.events.stop();
    continueGame = false;
    stateText.text = game.add.text(100, 00, "You made it\n"+score+" meters.", {
        font: "40px Arial", fill: "#000000", align: "center" });
    stateText.body.velocity.y= -300;
    stateText.visible = true;
    player = !player;
    endTurn();
    // actionOnClick
}

// function actionOnClick() {
//     this.game.state.start("the_state_name");
// }