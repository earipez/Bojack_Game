class Piece extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, type) {
        let pieceData = {
            'slash': { texture: 'slash', size: [[0, 0]] },
            'squiggle': { texture: 'squiggle', size: [[0, 0], [1, 0], [2, 0]] },
            'triangle': { texture: 'triangle', size: [[0, 0], [1, 0], [2, 0]] }
        };

        let pieceInfo = pieceData[type]
        super(scene, scene.game.config.width / 2, 0, pieceInfo.texture)

        this.scene = scene
        this.type = type
        this.setOrigin(0.5)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.body.setCollideWorldBounds(true)
        this.body.setVelocityY(50) // Slow descent

        this.moveSpeed = 30;  // Speed for left/right movement
        this.fallSpeed = 500;  // Time in milliseconds between falls
        this.fastDropSpeed = 100;  // Speed when pressing down
        this.isDropping = false; // Track if player is pressing down

        // Start automatic falling
        this.fallEvent = this.scene.time.addEvent({
            delay: this.fallSpeed,
            callback: this.moveDown,
            callbackScope: this,
            loop: true
        });
     // Adjust for smoothness
    }

    update() {
        let { cursors } = this.scene;

        if (Phaser.Input.Keyboard.JustDown(cursors.left) && this.canMove(-1, 0)) {
            this.x -= this.moveSpeed;
        }
        if (Phaser.Input.Keyboard.JustDown(cursors.right) && this.canMove(1, 0)) {
            this.x += this.moveSpeed;
        }

        // Enable fast drop
        if (cursors.down.isDown && !this.isDropping) {
            this.isDropping = true;
            this.fallEvent.timeScale = 5; // Speed up fall
        } 
        if (Phaser.Input.Keyboard.JustUp(cursors.down)) {
            this.isDropping = false;
            this.fallEvent.timeScale = 1; // Reset speed
        }

        // Stop if hitting the bottom or another piece
        if (!this.canMove(0, 1)) {
            this.lockPiece();
            this.scene.spawnPiece();
        }
    }

    moveDown() {
        if (this.canMove(0, 1)) {
            this.y += 32;
        } else {
            this.lockPiece();  // Stop falling when it reaches another piece or the bottom
        }
    }

    // Check if the piece can move in the given direction
    canMove(offsetX, offsetY) {
        let newRow = Math.floor((this.y + offsetY * 32) / 32)
        let newCol = Math.floor((this.x + offsetX * 32) / 32)
    
        if (newRow >= this.scene.grid.length) {
            return false;
        }
    
        // Prevent movement if another piece is already there
        if (this.scene.grid[newRow][newCol] !== null) {
            return false;
        }
    
        return true
    }
    
    lockPiece() {
        let row = Math.floor(this.y / 32);
        let col = Math.floor(this.x / 32);
    
        // Store piece in grid
        if (row <= 0) {
            this.scene.start('gameOverScene');
            return;
        }
    
        // Correct Y position to prevent overlap
        this.y = row * 32;
        
        // Store piece in grid
        if (row < this.scene.grid.length && col >= 0 && col < this.scene.grid[0].length) {
            this.scene.grid[row][col] = this;
        }
    
        this.fallEvent.remove(); // Stop the fall timer
        this.scene.time.delayedCall(200, () => {
            this.scene.spawnPiece();
        });
    
        this.scene.clearLines(); // Check for completed rows
    }
}