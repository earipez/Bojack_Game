const tetriminos = {
    i:[
        [
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        ],
        [
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        ],
    ],
    j:[
        [
        [1,0,0],
        [1,1,1],
        [0,0,0],
        ],
        [
        [1,1,0],
        [1,0,0],
        [1,0,0],
        ],
        [
        [1,1,1],
        [0,0,1],
        [0,0,0],
        ],
        [
        [0,1,0],
        [0,1,0],
        [1,1,0],
        ],
    ],
    l: [
        [
        [0,0,1],
        [1,1,1],
        [0,0,0],
        ],
        [
        [1,0,0],
        [1,0,0],
        [1,1,0],
        ],
        [
        [1,1,1],
        [1,0,0],
        [0,0,0],
        ],
        [
        [1,1,0],
        [0,1,0],
        [0,1,0],
        ],
    ],
    o: [
        [
        [1,1],
        [1,1]
        ],
    ],
    s: [
        [
        [0,1,1],
        [1,1,0],
        [0,0,0],
        ],
        [
        [1,0,0],
        [1,1,0],
        [0,1,0],
        ],
    ],
    t: [
        [
        [0,1,0],
        [1,1,1],
        [0,0,0],
        ],
        [
        [1,0,0],
        [1,1,0],
        [1,0,0],
        ],
        [
        [1,1,1],
        [0,1,0],
        [0,0,0],
        ],
        [
        [0,1,0],
        [1,1,0],
        [0,1,0],
        ],
    ],
    z: [
        [
        [1,1,0],
        [0,1,1],
        [0,0,0],
        ],
        [
        [0,1,0],
        [1,1,0],
        [1,0,0],
        ],
    ]
 };
 class TetrisScene extends Phaser.Scene {
    constructor() {
        super({ key: "TetrisScene" })
        this.gameBoard = Array.from({ length: 20 }, () => Array(10).fill(0))
        this.currentTetrimino = null
        this.blockSize = 32
        this.rotationState = 0
        this.gameOver = false
        this.ambitionGauge = 0; // Gauge value
        this.ambitionMax = 100; // Max gauge value
        this.ambitionRate = 0.05;
    }
    preload() {
        this.load.image("board", "assets/Board/Board.png");
        ["i", "j", "l", "o", "s", "t", "z"].forEach(type => {
            this.load.image(type, `assets/Shape Blocks/${type.toUpperCase()}.png`);
        })
        this.load.on("complete", () => {
            const oTetrimino = this.textures.get("o").getSourceImage();
            if (oTetrimino) {
                this.blockSize = oTetrimino.width / 4
            }
        })
    }
    create() {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'backGround').setOrigin(0.5).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height)
        this.gameOver = false
        this.gameBoard = Array.from({ length: 20 }, () => Array(10).fill(0))
        this.blockSprites = Array.from({ length: 20 }, () => Array(10).fill(null))
        this.moveCounter = 0
        this.moveInterval = 20
      
        this.scoreText = this.add.text(this.sys.game.config.width - 10, 10, 'Score: 0', {
            fontSize: '20px',
            fill: '#FFF',
            fontFamily: 'Metal'
        }).setOrigin(1, 0);
       
        this.linesText = this.add.text(this.sys.game.config.width - 10, 40, 'Lines: 0', {
            fontSize: '20px',
            fill: '#FFF',
            fontFamily: 'Metal'
        }).setOrigin(1, 0);
       
        this.levelText = this.add.text(this.sys.game.config.width - 10, 70, 'Level: 1', {
            fontSize: '20px',
            fill: '#FFF',
            fontFamily: 'Metal'
        }).setOrigin(1, 0);
        this.ambitionBarBg = this.add.rectangle(this.sys.game.config.width - 50, 300, 20, 200, 0x555555).setOrigin(0.5);
        this.ambitionBar = this.add.rectangle(this.sys.game.config.width - 50, 300, 20, 100, 0xff0000).setOrigin(0.5,1);
 
 
        this.ambitionText = this.add.text(this.sys.game.config.width - 130, 190, 'Friends Ambition', {
            fontSize: '24px', fill: '#FFF'
        }).setOrigin(0.5);
 
 
       
        this.ambitionGauge = 0
        this.ambitionMax = 100
        this.ambitionRate = .07
        this.time.addEvent({
            delay: 5000,
            callback: this.increaseAmbition,
            callbackScope: this,
            loop: true
        })
        const playAreaX = 3; // Adjust X position if necessary
        const playAreaY = 10;  // Adjust Y position if necessary
        const playAreaWidth = this.blockSize * 10;
        const playAreaHeight = this.blockSize * 20;
 
 
 // Create a graphics object
 this.playAreaBorder = this.add.graphics();
 
 
 // Set line style (thickness, color, alpha)
 this.playAreaBorder.lineStyle(4,  0xff0000, 1); 
 
 
 
 this.playAreaBorder.strokeRect(playAreaX, playAreaY, playAreaWidth, playAreaHeight)
 
 
        this.score = 0
        this.lines = 0
        this.level = 1
        this.scoreText.setText('Score: 0')
        this.linesText.setText('Lines: 0')
        this.levelText.setText('Level: 1')
        this.scoreText.x = this.sys.game.config.width - 100
        this.linesText.x = this.sys.game.config.width - 100
        this.levelText.x = this.sys.game.config.width - 100
        this.sound.stopAll()
        this.backgroundMusic = this.sound.add('background', { volume: 0.5, loop: true })
        this.backgroundMusic.play()
 
 
        this.lineClear = this.sound.add('lineClear', { volume: 1.0 })
        this.cursors = this.input.keyboard.createCursorKeys();
        if (this.currentTetrimino) {
            this.currentTetrimino.destroy()
            this.currentTetrimino = null
        }
 
 
        this.spawnTetrimino()
    }
    canSpawn(matrix) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1) {
                    let x = 4 + col
                    let y = row
                    if (this.gameBoard[y] && this.gameBoard[y][x] === 1) {
                        return false
                    }
                }
            }
        }
        return true
    }
    spawnTetrimino() {
        if (this.gameOver) return
        const tetriminoTypes = Object.keys(tetriminos)
        this.currentTetriminoType = Phaser.Utils.Array.GetRandom(tetriminoTypes)
        this.rotationState = 0
        const matrix = tetriminos[this.currentTetriminoType][this.rotationState]
        if (!this.canSpawn(matrix)) {
            this.gameOver = true
            this.scene.start('gameOverScene', { finalScore: this.score })
            return
        }
        this.currentTetrimino = this.add.container(4 * this.blockSize, 0)
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1) {
                    let block = this.physics.add.image(col * this.blockSize, row * this.blockSize, `block-${this.currentTetriminoType}`)
                    block.setOrigin(0, 0)
                    block.setScale(this.blockSize / 64)
                    block.body.setSize(64, 64)
                    block.body.setOffset(0, 0)
                    this.currentTetrimino.add(block)
                }
            }
        }
    }
    rotatePiece() {
        let newRotationState = (this.rotationState + 1) % tetriminos[this.currentTetriminoType].length
        let newMatrix = tetriminos[this.currentTetriminoType][newRotationState]
        if (!this.isRotationValid(newMatrix)) return
        this.rotationState = newRotationState
        this.currentTetrimino.removeAll(true)
        for (let row = 0; row < newMatrix.length; row++) {
            for (let col = 0; col < newMatrix[row].length; col++) {
                if (newMatrix[row][col] === 1) {
                    let block = this.physics.add.image(col * this.blockSize, row * this.blockSize, `block-${this.currentTetriminoType}`)
                    block.setOrigin(0, 0)
                    block.setScale(this.blockSize / 64)
                    block.body.setSize(64, 64)
                    block.body.setOffset(0, 0)
                    this.currentTetrimino.add(block)
                }
            }
        }
    }
    isRotationValid(matrix) {
        return true;
    }
    update() {
        if (this.gameOver || !this.currentTetrimino) {
            console.warn("Skipping update: No active tetrimino.");
            return;
        }
        this.ambitionGauge += this.ambitionRate;
        if (this.gameOver || !this.currentTetrimino) {
            return;
        }
 
 
        // Update ambition gauge visuals
        let fillHeight = (this.ambitionGauge / this.ambitionMax) * 200;
        this.ambitionBar.setSize(20, fillHeight);
        this.ambitionBar.setY(500 - fillHeight)
        // Check if gauge is full (Game Over)
        if (this.ambitionGauge >= this.ambitionMax) {
            this.gameOver = true;
            this.scene.start('gameOverScene');
        }
   
        this.moveCounter++
        if (this.moveCounter >= this.moveInterval) {
            this.moveCounter = 0;
   
            if (!this.hasLanded()) {
                if (this.currentTetrimino) {  // Ensure it's not null
                    this.currentTetrimino.y += this.blockSize;
                }
            } else {
                this.landTetrimino();
            }
        }
   
   
 
 
   
        if (this.moveCounter >= this.moveInterval) {
            this.moveCounter = 0
   
            if (!this.hasLanded()) {
                this.currentTetrimino.y += this.blockSize;
            } else {
                this.landTetrimino()
            }
        }
   
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.rotatePiece()
        }
   
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            if (this.isMoveValid(-1)) {
                this.currentTetrimino.x -= this.blockSize
            }
        }
   
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            if (this.isMoveValid(1)) {
                this.currentTetrimino.x += this.blockSize
            }
        }
   
        if (this.cursors.down.isDown) {
            if (!this.hasLanded()) {
                this.currentTetrimino.y += this.blockSize
            }
        }
   
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            while (!this.hasLanded()) {
                this.currentTetrimino.y += this.blockSize
            }
            this.landTetrimino()
        }
    }
    replaceTetriminoWithBlocks() {
        for (let block of this.currentTetrimino.list) {
            let x = this.currentTetrimino.x + block.x
            let y = this.currentTetrimino.y + block.y
   
            let blockType = `block-${this.currentTetriminoType}`
   
            if (!this.textures.exists(blockType)) {
                console.warn(`Texture "${blockType}" not found! Check assets.`)
                continue
            }
   
            let blockSprite = this.physics.add.image(x, y, blockType)
            blockSprite.setOrigin(0, 0)
            blockSprite.setScale(0.5)
            this.physics.world.enable(blockSprite)
   
            let i = Math.floor(y / this.blockSize)
            let j = Math.floor(x / this.blockSize)
   
            if (!this.blockSprites[i]) this.blockSprites[i] = new Array(10).fill(null)
            this.blockSprites[i][j] = blockSprite
        }
   
        this.currentTetrimino.destroy()
        this.currentTetrimino = null
    }
    checkLines() {
        let linesToRemove = []
        let completedTweenCount = 0
   
        for (let i = 19; i >= 0; i--) {
            if (!this.gameBoard[i]) continue
   
            if (this.gameBoard[i].every(cell => cell === 1)) {
                console.log(`Line ${i} is full!`)
                linesToRemove.push(i)
            if (linesToRemove.length > 0) {
                    // Reset the ambition gauge when a line is cleared
                this.ambitionGauge = 0;
                }
   
                for (let j = 0; j < 10; j++) {
                    if (this.blockSprites[i] && this.blockSprites[i][j]) {
                        if (this.lineClear) {
                            this.lineClear.play()
                        } else {
                            console.warn("Warning: Line clear sound is not loaded!");
                        }
   
                        this.tweens.add({
                            targets: this.blockSprites[i][j],
                            alpha: 0,
                            ease: "Power1",
                            duration: 50,
                            yoyo: true,
                            repeat: 3,
                            onComplete: () => {
                               
                                if (this.blockSprites[i][j]) {
                                    this.blockSprites[i][j].destroy()
                                    this.blockSprites[i][j] = null
                                }
                                completedTweenCount++
   
                                if (completedTweenCount === linesToRemove.length * 10) {
                                    this.updateScoreAndLevel(linesToRemove)
                                    this.shiftBlocks(linesToRemove)
                                }
                            },
                        })
                    }
                }
   
                this.gameBoard[i] = new Array(10).fill(0)
            }
        }
    }
    shiftBlocks(linesToRemove) {
        for (let line of linesToRemove.reverse()) {
            for (let k = line; k >= 1; k--) {
                if (!this.gameBoard[k] || !this.gameBoard[k - 1]) continue
   
                if (!this.blockSprites[k]) this.blockSprites[k] = new Array(10).fill(null)
                if (!this.blockSprites[k - 1]) this.blockSprites[k - 1] = new Array(10).fill(null)
   
                for (let j = 0; j < 10; j++) {
                    this.blockSprites[k][j] = this.blockSprites[k - 1][j]
   
                    if (this.blockSprites[k][j] !== null) {
                        this.blockSprites[k][j].y += this.blockSize
                    }
                }
   
                this.gameBoard[k] = [...this.gameBoard[k - 1]]
            }
   
            this.gameBoard[0] = new Array(10).fill(0)
            this.blockSprites[0] = new Array(10).fill(null)
        }
    }
   
    updateScoreAndLevel(linesToRemove) {
    let linesCleared = linesToRemove.length
    if (linesCleared > 0) {
        let scores = [0, 40, 100, 300, 1200]
        this.score += scores[linesCleared] * this.level
        this.lines += linesCleared
 
 
        // Update UI text
        this.scoreText.setText(`Score: ${this.score}`)
        this.linesText.setText(`Lines: ${this.lines}`)
       
        this.level = Math.floor(this.lines / 10 + 1)
        this.levelText.setText(`Level: ${this.level}`)
 
 
       
        this.moveInterval = Math.max(3, 60 - (this.level * 5))
    }
    console.log(`Level: ${this.level}, Move Interval: ${this.moveInterval}`)
 }
    hasLanded() {
        if (!this.currentTetrimino) return false
        let landed = false
        let nextY = this.currentTetrimino.y + this.blockSize
  
        this.currentTetrimino.each((block) => {
            const x = Math.floor((this.currentTetrimino.x + block.x) / this.blockSize)
            const y = Math.floor((nextY + block.y) / this.blockSize)
  
            if (y >= 19 || (this.gameBoard[y] && this.gameBoard[y][x] === 1)) {
                landed = true
            }
        })
  
        return landed;
    }
  
    landTetrimino() {
        this.setTetriminoOnBoard(1)
        this.replaceTetriminoWithBlocks()
        this.checkLines()
        this.spawnTetrimino()
    }
    isMoveValid(direction) {
        let moveValid = true
  
        this.currentTetrimino.each((block) => {
            const x = Math.floor((this.currentTetrimino.x + block.x + direction * this.blockSize) / this.blockSize)
            const y = Math.floor((this.currentTetrimino.y + block.y) / this.blockSize)
  
           
            if (x < 0 || x >= 10 || (this.gameBoard[y] && this.gameBoard[y][x] === 1)) {
                moveValid = false
            }
        })
  
        return moveValid
    }
    setTetriminoOnBoard(value) {
        if (!this.currentTetrimino) return
  
        this.currentTetrimino.each((block) => {
            let snapX = Math.round(this.currentTetrimino.x / this.blockSize) * this.blockSize
            let snapY = Math.round(this.currentTetrimino.y / this.blockSize) * this.blockSize
  
            const x = Math.floor((snapX + block.x) / this.blockSize)
            const y = Math.floor((snapY + block.y) / this.blockSize)
  
           
            if (x >= 0 && x < 10 && y >= 0 && y < 20) {
                this.gameBoard[y][x] = value
            }
        })
    }
 }
 
 