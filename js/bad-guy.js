var BadGuy = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image = game.assets['img/chara1.png'];
        this.frame = 5;
        this.isMoving = false;
        this.health = rand(5);
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

        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);

            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                this.isMoving = false;
                this.frame = 5;
            }
        } else {
            this.vx = this.vy = 0;
            var dx = game.enemySpeed;
            var distanceX = Math.abs(this.x - game.player.x);
            var distanceY = Math.abs(this.y - game.player.y);
            var moveX = false;
            if(Math.abs(distanceX - distanceY) > 25){
                moveX = distanceX > distanceY;
            } else {
                moveX = rand(2);
            }
            if(moveX){
                if(this.x > game.player.x){
                    this.vx = -dx;
                    this.scaleX = -1;
                } else {
                    this.vx = dx;
                    this.scaleX = 1;
                }
            } else {
                var dy = game.enemySpeed;
                this.vy = (this.y > game.player.y) ? -dy : dy;
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
        this.frame = [0, 1, 0, 2][Math.floor(this.age/5) % 4] + 5;
    }
});