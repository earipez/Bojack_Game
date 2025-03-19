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
        this.load.image("block-j", "img/Blue.png");
        this.load.image("j1", "img/J1.png")
        this.load.image("j2", "img/J2.png")
        this.load.image("j3", "img/J3.png")
        this.load.image("block-i", "img/LightBlue.png");
        this.load.image("i1", "img/I1.png")
        this.load.image("block-l", "img/Orange.png");
        this.load.image("l1", "img/L1.png")
        this.load.image("l2", "img/L2.png")
        this.load.image("l3", "img/L3.png")
        this.load.image("block-s", "img/Green.png");
        this.load.image("s1", "img/S1.png")
        this.load.image("block-t", "img/Purple.png");
        this.load.image("t1", "img/T1.png")
        this.load.image("t2", "img/T2.png")
        this.load.image("t3", "img/T3.png")
        this.load.image("block-o", "img/Yellow.png");
        this.load.image("block-z", "img/Red.png")
        this.load.image("z1", "img/Z1.png")
        this.blockSize = 30
        let blockKey = `block-${this.currentTetriminoType}`;
console.log(`Using texture: ${blockKey}`);

// Ensure texture exists
if (!this.textures.exists(blockKey)) {
    console.warn(` Texture "${blockKey}" not found! Check assets.`);
}


        this.load.image('j', 'img/J.png');
        this.load.image('i', 'img/I.png')
        this.load.image('l', 'img/L.png')
        this.load.image('z', 'img/Z.png')
        this.load.image('s', 'img/S.png')
        this.load.image('t', 'img/T.png')
        this.load.image('o', 'img/O.png')

        
        this.load.image('board', 'img/Board.png');
        this.load.image('backGround', 'img/background.png');
        this.load.image('title', 'img/title_screen.png');
        this.load.image('over_bg', 'img/endScreen.png');


        // load audio asset
        this.load.audio('lineClear', ['audio/clear-lines.mp3']);
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
        console.log("Textures loaded:", this.textures.list);  // Debugging output

    this.scene.start('titleScene');

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