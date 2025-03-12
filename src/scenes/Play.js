class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }
    
    create() {
        this.grid = this.createGrid(10, 20);
        this.activePiece = null; // Only one active piece at a time
        this.pieceQueue = ['slash', 'squiggle', 'triangle']; // Preloaded piece queue
        
        this.spawnPiece();

        this.sound.stopAll();
        if (!this.sound.get('backgroundMusic') || !this.sound.get('backgroundMusic').isPlaying) {
            this.music = this.sound.add('background', { volume: 0.5, loop: true });
            this.music.play();
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'backGround')
            .setOrigin(0.5)
            .setDisplaySize(this.game.config.width, this.game.config.height);
        this.gridContainer = this.add.container((this.game.config.width - (this.grid[0].length * 32)) / 2, 50);
    }

    createGrid(cols, rows) {
        let grid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = new Array(cols).fill(null);
        }
        return grid;
    }

    spawnPiece() {
        if (this.activePiece) return; // Wait until the current piece is placed

        let pieceTypes = ['slash', 'squiggle', 'triangle'];
        let randomType = Phaser.Utils.Array.GetRandom(pieceTypes);
        this.activePiece = new Piece(this, randomType);
        
        let spawnX = Math.floor(this.grid[0].length / 2) * 32;
        this.activePiece.setPosition(spawnX, 0);
        this.activePiece.setVelocityY(200)
        this.add.existing(this.activePiece);

        if (!this.activePiece.canMove(0, 1)) {
            console.warn("Game over: No space to spawn a new piece!");
            this.scene.start('gameOverScene');
        }
    }

    update() {
        if (this.activePiece) {
            this.handlePieceMovement();
            if (!this.activePiece.canMove(0, 1)) {
                this.lockPiece();
            }
        }
    }

    handlePieceMovement() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.activePiece.canMove(-1, 0)) {
            this.activePiece.x -= 32;
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.activePiece.canMove(1, 0)) {
            this.activePiece.x += 32;
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.activePiece.canMove(0, 1)) {
            this.activePiece.y += 32;
        }
    }

    lockPiece() {
        let row = Math.floor(this.activePiece.y / 32);
        let col = Math.floor(this.activePiece.x / 32);
        if (row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length) {
            this.grid[row][col] = this.activePiece;
        }
        this.clearLines(); // Ensure clearLines is defined and called
        this.activePiece = null;
        this.spawnPiece();
    }

    clearLines() {
        for (let y = this.grid.length - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== null)) {
                this.grid[y].forEach(piece => piece.destroy()); // Remove pieces
                this.grid.splice(y, 1); // Remove row
                this.grid.unshift(new Array(10).fill(null)); // Add new empty row at the top
            }
        }
    }
}
