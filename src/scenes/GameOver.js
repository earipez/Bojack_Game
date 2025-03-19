class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        this.sound.stopAll()

        this.gameOverMusic = this.sound.add('gameOverMusic', { volume: 1.0, loop: true })
        this.gameOverMusic.play()
    
        this.add.image(centerX, centerY, 'over_bg').setOrigin(0.5).setDisplaySize(this.game.config.width * 2 , this.game.config.height * 2)
    
        let gameOverText = this.add.bitmapText(centerX, centerY - 50, "Metal", "GAME OVER").setOrigin(0.5).setTint(0xffa500)
        let restartText = this.add.bitmapText(centerX, centerY + 50,"Metal", "Press SPACE to Restart").setOrigin(0.5).setTint(0xffa500)
        let finalScore = this.scene.settings.data ? this.scene.settings.data.finalScore : 0;

       
        let scoreText = this.add.bitmapText(centerX, centerY + 150, "Metal", `Score: ${finalScore}`).setOrigin(0.5).setTint(0xffa500)
    
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        })
    
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log("Restarting game...")
            this.scene.stop('gameOverScene')
            this.scene.start('TetrisScene')
        })
    }
    

    update() {
        if (this.cursors.up && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            let textureManager = this.textures;
            console.log(textureManager)
            this.game.renderer.snapshot((snapshotImage) => {
                console.log('took snapshot in GameOver')
                if(textureManager.exists('titlesnapshot')) {
                    textureManager.remove('titlesnapshot');
                }
                textureManager.addImage('titlesnapshot', snapshotImage);
            });
            if (this.gameOverMusic){
                this.gameOverMusic.stop()
            }
       

            
            this.scene.stop('TetrisScene')
            this.scene.stop('gameOverScene')
            this.scene.start('TetrisScene')
        }
    }
}
    
