class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }
    create() {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.grid = this.createGrid(10, 20) // Create 10x20 grid for stacking
        this.spawnPiece()
    }

    createGrid(cols, rows) {
        let grid = []
        for (let y = 0; y < rows; y++) {
            grid[y] = []
            for (let x = 0; x < cols; x++) {
                grid[y][x] = null // Empty slots
            }
        }
        return grid;
    }

    spawnPiece() {
        let pieceTypes = ['slash', 'squiggle', 'triangle'];
        let randomType = Phaser.Utils.Array.GetRandom(pieceTypes);
    
        // Default spawn position
        let spawnX = Math.floor(this.grid[0].length / 2) * 32; // Center
        let spawnY = 0;
    
        // Check for an open row
        for (let row = 0; row < this.grid.length; row++) {
            let isRowEmpty = this.grid[row].every(cell => cell === null);
            if (isRowEmpty) {
                spawnY = row * 32;
                break;
            }
        }
    
        this.activePiece = new Piece(this, randomType);
        this.activePiece.setPosition(spawnX, spawnY);
    
        // Game Over check: If spawn row is blocked, end game
        if (!this.activePiece.canMove(0, 1)) {
            this.scene.start('gameOverScene');
        }
    }

    update() {
        if (this.activePiece) {
            this.activePiece.update()
            if (this.checkCollision(this.activePiece)) {
                this.lockPiece()
                this.spawnPiece()
            }
        }
    }

    checkCollision(piece) {
        let row = Math.floor((piece.y + 32) / 32);
        let col = Math.floor(piece.x / 32);
    
        // Stop movement if piece reaches bottom or another block
        return row >= this.grid.length || this.grid[row][col] !== null;
    }

    lockPiece() {
        // Add to the grid, preventing further movement
        let row = Math.floor(this.activePiece.y / 32)
        let col = Math.floor(this.activePiece.x / 32)
        this.grid[row][col] = this.activePiece
        this.activePiece.setVelocityY(0)
        this.clearLines()
    }

    clearLines() {
        for (let y = this.grid.length - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== null)) {
                this.grid[y].forEach(piece => piece.destroy()) // Remove pieces
                this.grid.splice(y, 1) // Remove row
                this.grid.unshift(new Array(10).fill(null)) // Add new empty row at the top
            }
        }
    }
}