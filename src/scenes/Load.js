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
        this.load.spritesheet('spice_harvester', 'img/spice_harvest.png', {
            frameWidth: 53,
            frameHeight: 56
        });
        this.load.spritesheet('tanker', 'img/tank.png', {
            frameWidth: 53,
            frameHeight: 40
        })
        this.load.spritesheet('outposter', 'img/outpost.png', {
            frameWidth: 95,
            frameHeight: 75
});
        this.load.spritesheet('shai_hulud', 'img/Shai-Hulud.png', {
            frameWidth: 40,
            frameHeight: 56
});
        
        // load graphics assets
        this.load.image('paddle', 'img/paddle.png');
        this.load.image('fragment', 'img/fragment.png');
        this.load.image('cross', 'img/white_cross.png');
        this.load.image('title_bg', 'img/worm.png');
        this.load.image('over_bg', 'img/gameOver.png');
        this.load.image('sand_bg', 'img/sand.png');
        // load audio asset
        this.load.audio('beats', ['audio/beats.mp3']);
        this.load.audio('clang', ['audio/clang.mp3']);
        this.load.audio('death', ['audio/death.mp3']);
        this.load.audio('gameover_music', 'audio/GameOver.mp3');
        this.load.audio('title_music', 'audio/MainTitle.mp3');
        this.load.audio('thump_sfx', 'audio/thumper.mp3');
        // load font
        this.load.bitmapFont('dune', 'font/dune.png', 'font/dune.xml');
    }

    create() {
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to Title scene
        this.textures.remove('outpost');
        this.textures.remove('tank');
        this.textures.remove('spice_refinery');
        this.textures.remove('spice_harvest');
        console.log("Removed old textures. Reloading...");
        this.scene.start('titleScene');
    }
}