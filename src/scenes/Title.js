class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        this.add.image(centerX, centerY, 'title').setOrigin(0.5).setDisplaySize(game.config.width, this.game.config.height)


        
        let controlsBg = this.add.rectangle(centerX - 200, centerY + 160, 550, 200, 0xffffff).setOrigin(0.5);
        let startText = this.add.bitmapText(centerX -250, centerY + 100, 'Metal', 'Press SPACE to Start', 60) .setOrigin(0.5).setTint(0x000000)
        let starTText = this.add.bitmapText(centerX - 250, centerY + 160, 'Metal', 'Arrow Keys to Move, UP to Rotate', 40).setOrigin(0.5).setTint(0x000000)
        let titleText = this.add.bitmapText(centerX- 250, centerY + 230, 'Metal', 'Click for Credits', 60).setOrigin(0.5).setTint(0xff0000).setInteractive()
        let creditsBg = this.add.rectangle(centerX, centerY + 0, 800, 250, 0xffffff).setOrigin(0.5).setVisible(false)


    
        let creditsText = this.add.bitmapText(centerX, centerY, 'Metal', 
            'Credits:\nAssests for pieces: SimpleCodingTutorials Github\nCoding Help: paddle parkour, TA Jared, SimpleCodingTutorials on Youtube \nIn Game-Music: "Torn Flesh" By: Karl Casey  White Bat Audio\nTitle Music: "Royalty Free Heavy Metal: game over" By Robzkull \nGame Over Music: "Back In the 90s" By: Grouplove 2017 \nArt: Elias Aripez', 30)
            .setOrigin(0.5)
            .setTint(0xffffff)
            .setVisible(false);

        
        titleText.on('pointerdown', () => {
            let isVisible = !creditsText.visible;
            creditsText.setVisible(isVisible);
            creditsBg.setVisible(isVisible);
        });


        


 
    this.cursors = this.input.keyboard.createCursorKeys()

    
    this.sound.stopAll()
    this.titleMusic = this.sound.add('main', { volume: 1.0, loop: true })

    this.input.once('pointerdown', () => {
        if (!this.titleMusic.isPlaying) {
            this.titleMusic.play()
        }
    });

    
    this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start('TetrisScene') 
    });
}
}



    