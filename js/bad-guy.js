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
    },
    onenterframe: function(){
        if(game.player.within(this, 12)){
            game.stage.removeChild(this);
            if(--game.player.health < 0){
                game.end(game.score, "SCORE: " + game.score);
                game.totalScore += game.score;
                game.stage.addChild(new TotalScoreLabel(game.width / 2, (game.height / 2) + 50, game.totalScore));
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
    }
});