class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        this.add.image(centerX, centerY, 'title_bg').setOrigin(0.5).setDisplaySize(game.config.width, this.game.config.height)
        // add title screen text
        let title01 = this.add.bitmapText(centerX, centerY, 'dune', 'The Trial of Shai-Hulud', 40).setOrigin(0.5).setTint(0xffa500)
        this.tweens.add({
            targets: title01,
            x: centerX + 5,
            y: centerY + 2,
            duration: 100,
            ease: 'Sine.easeInOut',
            yoyo:true,
            repeat: -1
        });

       
        this.add.bitmapText(centerX, centerY + textSpacer, 'dune', 'Use the ARROW keys to move and dodge the rocks', 17).setOrigin(0.5);
        this.add.bitmapText(centerX, h - textSpacer, 'dune', 'Elias Aripez, inspired by the DUNE series Written by Frank Herbert', 14).setOrigin(0.5);

        // set up cursor keys
        
        cursors = this.input.keyboard.createCursorKeys() 
        this.sound.stopAll()
        this.titleMusic = this.sound.add('title_music', { volume: 1.0, loop: true})

        this.input.keyboard.once('keydown', () => {
            if (!this.titleMusic.isPlaying){
                this.titleMusic.play()
            }
        });
        this.requiredThumps = Phaser.Math.Between(5, 10)
        this.currentThumps = 0

        this.thumperText = this.add.bitmapText(centerX, centerY + textSpacer * 3, 'dune', `Press UP ${this.requiredThumps} times to use your thumper and summon Shai-Hulud`, 15).setOrigin(0.5).setTint(0xffa500)
        this.input.keyboard.on('keydown-UP', () => {
            if(this.currentThumps < this.requiredThumps){
                this.currentThumps++
                this.sound.play('thump_sfx', {volume: 1.0})
            
        let remaining = this.requiredThumps - this.currentThumps;
        if (remaining > 0) {
            this.thumperText.setText(`Thump ${remaining} more times...`).setTint(0xffa500)
        }else{
            this.thumperText.setText('SHAI-Hulud approaches!!').setTint(0xffa500)
            this.time.delayedCall(1000, () => {
                if(this.titleMusic) {
                    this.titleMusic.stop()

                }
                console.log("Transitioning to playScene...")
                this.scene.start('playScene')
            });
        }
    }
            
    });
}
}
        



    