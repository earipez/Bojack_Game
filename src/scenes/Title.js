class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        this.add.image(centerX, centerY, 'title').setOrigin(0.5).setDisplaySize(game.config.width, this.game.config.height)
        // add title screen text


        // set up cursor keys
        let startText = this.add.bitmapText(centerX, centerY + 100, 'Metal', 'Press SPACE to Start', 60)
        .setOrigin(0.5)
        .setTint(0xffa500);

    // Set up cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // Play background music (only after user interaction)
    this.sound.stopAll();
    this.titleMusic = this.sound.add('main', { volume: 1.0, loop: true });

    this.input.once('pointerdown', () => {
        if (!this.titleMusic.isPlaying) {
            this.titleMusic.play();
        }
    });

    // Transition to Play Scene when SPACE is pressed
    this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start('playScene'); // Switch to Play Scene
    });
}
}



    