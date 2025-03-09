class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        this.sand = this.add.tileSprite(centerX, centerY,this.game.config.width, this.game.config.height, 'sand_bg').setOrigin(0.5);
        this.anims.create({
            key: 'harvester_move',
            frames: this.anims.generateFrameNumbers('spice_harvest', { start: 0, end: 10}),
            frameRate: 10,
            repeate: -1
        })
        this.anims.create({
            key: 'tank_move',
            frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 7}),
            frameRate: 10,
            repeate: -1
        })
        console.log("Available animations:", this.anims.anims.entries)
        this.barrierSpeed = -450;
        this.barrierSpeedMax = -1000;
        level = 0;
        this.extremeMODE = false;
        this.shadowLock = false;

        
        this.bgm = this.sound.add('beats', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

        // add snapshot image from prior Scene
        if (this.textures.exists('titlesnapshot')) {
            let titleSnap = this.add.image(centerX, centerY, 'titlesnapshot').setOrigin(0.5);
            this.tweens.add({
                targets: titleSnap,
                duration: 4500,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                repeat: 0
            });
        } else {
            console.log('texture error');
        }
        this.time.addEvent({
            delay: 4000, 
            callback: this.addBarrier,
            callbackScope: this,
            loop: true
        });


        // set up player paddle (physics sprite) and set properties
        paddle = this.physics.add.sprite(100, centerY, 'shai_hulud').setOrigin(0.5);
        paddle.setScale(2.0);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(0.2);
        paddle.setImmovable();
        paddle.setMaxVelocity(600, 600);
        paddle.setDragY(100);
        paddle.setDepth(1);
        paddle.setAlpha(1)
        paddle.setTint(0xFF8C00) 
        paddle.destroyed = false;       // custom property to track paddle life
        //paddle.setBlendMode('SCREEN');
        

        // set up barrier group
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        // wait a few seconds before spawning barriers
        this.time.delayedCall(2500, () => { 
            this.addBarrier(); 
        });

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        this.sandParticles = this.add.particles('cross')
        this.sandTrail = this.sandParticles.createEmitter({
            x: paddle.x -20,
            y: paddle.y,
            lifespan: 500,
            speedX: { min: -50, max: -100 },
            speedY: {min: -20, max: 20 },
            scale: {start: 0.5, end: 0.1 },
            alpha: {start: 0.6, end: 0 },
            frequency: 60
        })
    }

    // create new barriers and add them to existing barrier group
    addBarrier() {
        let barrierX = this.game.config.width + 100
        let barrierY = Phaser.Math.Between(100, game.config.height - 100)
        let barrier = new Barrier(this, 0);
        barrier.setPosition(barrierX, barrierY)
        this.barrierGroup.add(barrier);
        console.log(`Barrier spawned at (${barrierX}, ${barrierY}), Total Obstacles: ${this.barrierGroup.getChildren().length}`);

    }

    update() {
        this.cameras.main.y = Math.sin(this.time.now * 0.0005) * 10;
        this.sand.tilePositionX -= 10;
        // make sure paddle is still alive
        if(!paddle.destroyed) {
            let targetVelocityY = 0
            let targetVelocityX = 0
            
            if(cursors.up.isDown) {
                targetVelocityY -= paddleVelocity
            } else if(cursors.down.isDown) {
                targetVelocityY += paddleVelocity
            
            }
            if (cursors.left.isDown){
                targetVelocityX -= paddleVelocity
            }else if (cursors.right.isDown) {
                targetVelocityX += paddleVelocity
            }
            paddle.body.velocity.y += (targetVelocityY - paddle.body.velocity.y) * 0.5;
            paddle.body.velocity.x += (targetVelocityX - paddle.body.velocity.x) * 0.5;
    
            // check for collisions
            this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);
        }
        this.barrierGroup.children.each(barrier => {
            barrier.x -= 5
            if (barrier.x < -barrier.width) {
                barrier.destroy();
            }
        })

    }

    levelBump() {
        // increment level (ie, score)
        level++;

        // bump speed every 5 levels (until max is hit)
        if(level % 5 == 0) {
            //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            this.sound.play('clang', { volume: 0.5 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
            }
            
            // make flying score text (using three stacked)
            let lvltxt01 = this.add.bitmapText(w, centerY, 'dune', `<${level}>`, 96).setOrigin(0, 0.5);
            let lvltxt02 = this.add.bitmapText(w, centerY, 'dune', `<${level}>`, 96).setOrigin(0, 0.5);
            let lvltxt03 = this.add.bitmapText(w, centerY, 'dune', `<${level}>`, 96).setOrigin(0, 0.5);
            lvltxt01.setBlendMode('ADD').setTint(0xff00ff);
            lvltxt02.setBlendMode('SCREEN').setTint(0x0000ff);
            lvltxt03.setBlendMode('ADD').setTint(0xffff00);
            this.tweens.add({
                targets: [lvltxt01, lvltxt02, lvltxt03],
                duration: 2500,
                x: { from: w, to: 0 },
                alpha: { from: 0.9, to: 0 },
                onComplete: function() {
                    lvltxt01.destroy();
                    lvltxt02.destroy();
                    lvltxt03.destroy();
                }
            });
            this.tweens.add({
                targets: lvltxt02,
                duration: 2500,
                y: '-=20'       // slowly nudge y-coordinate up
            });
            this.tweens.add({
                targets: lvltxt03,
                duration: 2500,
                y: '+=20'       // slowly nudge y-coordinate down
            });


            // cam shake: .shake( [duration] [, intensity] )
            this.cameras.main.shake(100, 0.01);
        }
    }

    // random HTML hex color generator from:
    // https://stackoverflow.com/questions/1484506/random-color-generator
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    spawnShadowPaddles() {
        // add a "shadow paddle" at main paddle position
        let shadowPaddle = this.add.image(paddle.x, paddle.y, 'paddle').setOrigin(0.5);
        shadowPaddle.scaleY = paddle.scaleY;            // scale to parent paddle
        shadowPaddle.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
        shadowPaddle.alpha = 0.5;                       // make semi-transparent
        // tween shadow paddle alpha to 0
        this.tweens.add({ 
            targets: shadowPaddle, 
            alpha: { from: 0.5, to: 0 }, 
            duration: 750,
            ease: 'Linear',
            repeat: 0 
        });
        // set a kill timer for trail effect
        this.time.delayedCall(750, () => { shadowPaddle.destroy(); } );
    }

    paddleCollision() {
        paddle.destroyed = true;                    // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        this.sound.play('death', { volume: 0.25 }); // play death sound
        this.cameras.main.shake(2500, 0.0075);      // camera death shake
        
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });

        // create particle explosion
        let deathParticleManager = this.add.particles('cross');
        let deathEmitter = deathParticleManager.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: -150, max: 150 },
            lifespan: 4000,
            blendMode: 'ADD'
        });
        // store current paddle bounds so we can create a paddle-shaped death emitter
        let pBounds = paddle.getBounds();
        deathEmitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(pBounds.x, pBounds.y, pBounds.width, pBounds.height),
            type: 'edge',
            quantity: 1000
        });
        // make it boom 💥
        deathEmitter.explode(1000);
        
        // create two gravity wells: one offset from paddle and one at center screen
        deathParticleManager.createGravityWell({
            x: pBounds.centerX + 200,
            y: pBounds.centerY,
            power: 0.5,
            epsilon: 100,
            gravity: 100
        });
        deathParticleManager.createGravityWell({
            x: centerX,
            y: centerY,
            power: 2,
            epsilon: 100,
            gravity: 150
        });
       
        // kill paddle
        paddle.destroy();    

        // switch states after timer expires
        this.time.delayedCall(4000, () => { this.scene.start('gameOverScene'); });
    }
}