// Elias Aripez
// keep me honest
//
//credits:
// Assets: I used this persons pieces named SimpleCodingTutorials and line clear sounds effect. I also linked the video I used to help me code this assignment:
// https://youtu.be/Lt3zTinTlrY?si=bVZkt78swtQOX3AP
// I made the title screen and gave over screen
//For the music I used this as the title screen: "Torn Flesh" by: Karl Casey @ White Bat Audio  https://www.youtube.com/watch?v=58PCM-x7jlg&list=PLLEnbi5KRv6Z8CMUtLiA81-wQCLVUOKYs
//for the in game music i used: "Royalty Free Heavy Metal: game over" by Robzkull https://www.youtube.com/watch?v=DpxZ5PHa6xo&list=PLbvDAuOrGtGGA5OuDhQwpT9lSzAFe04Pt
//for the  game over music I used "Back in the 90's" by Grouplove in 2017
'use strict';

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { 
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, TetrisScene, GameOver ]
}

// uncomment the following line if you need to purge local storage data
//localStorage.clear();

// define game
let game = new Phaser.Game(config);

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
const textSpacer = 64;
let paddle = null;
const paddleWidth = 16;
const paddleHeight = 128;
const paddleVelocity = 150;
let highScore;
let newHighScore = false;
let cursors;