class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        this.sound.stopAll();

        this.gameOverMusic = this.sound.add('gameOverMusic', { volume: 1.0, loop: true })
        this.gameOverMusic.play();
    
        this.add.image(centerX, centerY, 'over_bg').setOrigin(0.5).setDisplaySize(this.game.config.width, this.game.config.height)
    
        let gameOverText = this.add.bitmapText(centerX, centerY - 50, "Metal", "GAME OVER").setOrigin(0.5).setTint(0xffa500)
        let restartText = this.add.bitmapText(centerX, centerY + 50,"Metal", "Press SPACE to Restart").setOrigin(0.5).setTint(0xffa500)
    
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    
        // Restart game on SPACE key press
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log("Restarting game...");
            this.scene.stop('gameOverScene');
            this.scene.start('playScene');
        });
    }
    

    update() {
        // wait for UP input to restart game
        if (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
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
            this.scene.stop('gameOverScene')// Fully stop Game Over scene
            this.scene.start('playScene')
        }
    }
}
    
