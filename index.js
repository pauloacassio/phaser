
var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var platforms;

var player;

var cursors;

var bonfires;

var score = 0;

var scoreText;

var fireballs;

var gameOver =false;

function preload ()
{
    

    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ground1', 'assets/platform1.png');
    this.load.image('ground2', 'assets/platform2.png');
    this.load.image('bonfire', 'assets/bonfire.png');
    this.load.image('fireball', 'assets/fireball.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{

    this.add.image(400, 300, 'sky');
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 800, 'ground').setScale(6).refreshBody();
    platforms.create(750, 200, 'ground');
    platforms.create(450, 500, 'ground');
    platforms.create(1050, 500, 'ground');
    platforms.create(100, 150, 'ground1');
    platforms.create(750, 620, 'ground1');
    platforms.create(750, 350, 'ground1');
    platforms.create(100, 350, 'ground1');
    platforms.create(1400, 150, 'ground1');
    platforms.create(1400, 350, 'ground1');
    platforms.create(1200, 250, 'ground2');
    platforms.create(300, 250, 'ground2');
    platforms.create(100, 600, 'ground2');
    platforms.create(1400, 600, 'ground2');

    //  Player
    player = this.physics.add.sprite(150, 150, 'dude');
    player.setBounce(0.0);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    player.body.setGravityY(50);
    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    //  Criação das bonfires
    bonfires = this.physics.add.group({
        key: 'bonfire',
        repeat: 21,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    bonfires.children.iterate(function (child) 
    {
        child.setBounceY(Phaser.Math.FloatBetween(0, 0));
    });
    this.physics.add.collider(bonfires, platforms);
    this.physics.add.overlap(player, bonfires, collectBonfires, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


    fireballs = this.physics.add.group();

    this.physics.add.collider(fireballs, platforms);

    this.physics.add.collider(player, fireballs, hitFireball, null, this);
    
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}
function collectBonfires (player, bonfire)
{
    bonfire.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: '+ score);

    if (bonfires.countActive(true) === 0)
    {
        bonfires.children.iterate(function (child) 
        {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var fireball = fireballs.create(x, 100, 'fireball');
        var fireball1 = fireballs.create(x, 100, 'fireball');
        var fireball2 = fireballs.create(x, 100, 'fireball');
        fireball.setBounce(1);
        fireball.setCollideWorldBounds(true);
        fireball.setVelocity(Phaser.Math.Between(-300, 300), 20);
        fireball1.setBounce(1);
        fireball1.setCollideWorldBounds(true);
        fireball1.setVelocity(Phaser.Math.Between(-300, 300), 20);
        fireball2.setBounce(1);
        fireball2.setCollideWorldBounds(true);
        fireball2.setVelocity(Phaser.Math.Between(-300, 300), 20);

    }
}
function hitFireball (player, fireball)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
    if (gameOver)
    {
        location.reload();
    }
}
