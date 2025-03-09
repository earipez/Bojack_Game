class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        this.sound.stopAll();
        this.gameOverMusic = this.sound.add('gameover_music', {volume: 0.7})
        this.gameOverMusic.play()
        this.tweens.add({
            targets: this.gameOverMusic,
            volume: {from: 0, to: 1.0 },
            duration: 3000

        })

        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            if(level > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }
        this.add.image(centerX, centerY, 'over_bg').setOrigin(0.5).setDisplaySize(game.config.width, this.game.config.height)

        // add GAME OVER text
        if(newHighScore) {
            this.add.bitmapText(centerX, centerY - textSpacer * 2, 'dune', 'New Longest Ride!', 32).setOrigin(0.5).setTint(0xffa500);
        }
        let gameOverText = this.add.bitmapText(centerX, centerY - textSpacer, 'dune', 'The Desert Has Claimed Your Water', 27).setOrigin(0.5).setAlpha(0).setTint(0xFF0000)
        let highScoreText = this.add.bitmapText(centerX, centerY + textSpacer, 'dune', `Your Longest Journey - ${highScore}`, 24).setOrigin(0.5).setAlpha(0).setTint(0xFF0000)
        let restartText = this.add.bitmapText(centerX, centerY + textSpacer * 2, 'dune', 'Press UP ARROW to Ride Again', 24).setOrigin(0.5).setAlpha(0).setTint(0xFF0000)

        this.tweens.add({
            targets: [gameOverText, highScoreText, restartText],
            alpha: { from: 0, to: 1},
            duration: 2000,
            delay: 500
        });

        

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            let textureManager = this.textures;
            console.log(textureManager)
            // take snapshot of the entire game viewport (same as title screen)
            this.game.renderer.snapshot((snapshotImage) => {
                console.log('took snapshot in GameOver')
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });
            if (this.gameOverMusic){
                this.gameOverMusic.stop();
            }
       

            // start next scene
            this.scene.start('playScene');
        }
    }
}