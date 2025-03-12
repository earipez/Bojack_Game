class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // loading bar
        // see: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/loader/
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();                                 // reset fill/line style
            loadingBar.fillStyle(0xFFFFFF, 1);                  // (color, alpha)
            loadingBar.fillRect(0, centerY, w * value, 5);  // (x, y, w, h)
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        this.load.path = './assets/';
        // load graphics assets
        this.load.image('slash', 'img/slash.png');
        this.load.image('squiggle', 'img/squiggle.png');
        this.load.image('triangle', 'img/triangle.png');
        this.load.image('backGround', 'img/background.png');
        this.load.image('title', 'img/title_screen.png');
        this.load.image('over_bg', 'img/endScreen.jpeg');


        // load audio asset
        this.load.audio('line_clear', ['audio/Line_Clear.mp3']);
        this.load.audio('main', ['audio/main_menu.mp3']);
        this.load.audio('piece1', ['audio/piece_1.mp3']);
        this.load.audio('piece2', 'audio/piece_2.mp3');
        this.load.audio('piece3', 'audio/piece_3.mp3');
        this.load.audio('rotate', 'audio/piece_move.mp3');
        this.load.audio('background', 'audio/Background.mp3')
        this.load.audio('gameOverMusic', 'audio/Gameover.mp3')
        // load font
        this.load.bitmapFont('Metal', 'font/Heavy_Metal.png', 'font/Heavy_Metal.xml');
    }

    create() {
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }
        // go to Title scene
        this.scene.start('titleScene');
    }
}