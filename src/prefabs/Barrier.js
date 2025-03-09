class Barrier extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity) {
        const obstacleTypes = ['spice_harvester', 'tanker', 'outposter']
        let chosenObstacle = Phaser.Math.RND.pick(obstacleTypes)
        // call Phaser Physics Sprite constructor
        super(scene, game.config.width + paddleWidth, Phaser.Math.Between(100, game.config.height - 100), chosenObstacle)
        
        this.parentScene = scene;               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this);    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this);    // add to physics system
        this.setVelocityX(0);            
        this.setImmovable(true);                    
        this.setTint(0xD2B48C); 
        this.newBarrier = true; 
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newBarrier && this.x < centerX) {
            // (recursively) call parent scene method from this context
            this.parentScene.addBarrier(this.parent, this.velocity);
            this.newBarrier = false;
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.x < -this.width) {
            this.destroy();
        }
    }
}