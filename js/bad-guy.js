var BadGuy = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        var image = new Surface(128, 128);
        image.draw(game.assets['img/EvilBearSprite.gif'], 0, 0, 128, 128, 0, 0, 128, 128);
        this.image = image;
        this.frame = 5;
        this.isMoving = false;
        this.health = rand(5);
        this.walk = 1;
        this.direction = 0;
        this.scaleX = -1;
        this.lastAttackHit = 0;
    },
    onenterframe: function(){
        if(game.player.within(this, 12)){
            var now = new Date().getTime();
            if(now - game.enemyAttackCoolDown > this.lastAttackHit){
                this.lastAttackHit = now;
                game.player.hitByEnemy();
            }
        }
        this.frame = this.direction * 4 + this.walk;
        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);
            if((this.x < 0 || this.x > game.map.main.width) || (this.y < 0 || this.y > game.map.main.height)){
                game.stage.removeChild(this);
            }

            if (!(game.frame % 4)) {
                this.walk++;
                this.walk %= 4;
            }
            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                this.isMoving = false;
                this.walk = 1;
            }
        } else {
            this.vx = this.vy = 0;
            var dx = game.enemySpeed;
            var distanceX = Math.abs(this.x - game.player.x);
            var distanceY = Math.abs(this.y - game.player.y);
            if(distanceX > distanceY){
                if(this.x > game.player.x){
                    this.vx = -dx;
                    this.direction = 1;
                } else {
                    this.vx = dx;
                    this.direction = 2;
                }
            } else {
                var dy = game.enemySpeed;
                if(this.y > game.player.y){
                    this.vy = -dy;
                    this.direction = 3;
                } else {
                    this.vy = dy;
                    this.direction = 0;
                }
            }

            if (this.vx || this.vy) {
                var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                if (0 <= x && x < game.map.main.width && 0 <= y && y < game.map.main.height && !game.map.main.hitTest(x, y)) {
                    this.isMoving = true;
                    arguments.callee.call(this);
                }
            }
        }
    },
    hitByPlayer: function(){
        if(--this.health < 1){
            game.assets['sounds/mBearDeath.mp3'].play();
            var shouldDrop = rand(30);
            switch(shouldDrop){
                case 0:
                case 1:
                    new Drop(this.x, this.y);
                    break;
                case 2:
                    new HealthOne(this.x, this.y);
                    break;
                case 3:
                    new HealthTwo(this.x, this.y);
                    break;
                case 4:
                    new HealthFive(this.x, this.y);
                    break;
                case 5:
                    new ChainGun(this.x, this.y);
                    break;
                case 6:
                    new FireThroughObjects(this.x, this.y);
                    break;
                case 7:
                    new FanGun(this.x, this.y);
                    break;
            }
            game.stage.removeChild(this);
            game.score += 5;
        }
    }
});
