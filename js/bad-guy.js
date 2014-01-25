var BadGuy = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image = game.assets['img/chara1.png'];
        this.frame = 5;
        this.isMoving = false;
    },
    onenterframe: function(){

        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);

            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                this.isMoving = false;
                this.frame = 5;
            }
        } else {
            this.vx = this.vy = 0;
            var dx = Math.floor(Math.random() * game.enemySpeed);
            if(this.x > game.player.x){
                this.vx = -dx;
                this.scaleX = -1;
            } else {
                this.vx = dx;
                this.scaleX = 1;
            }
            var dy = Math.floor(Math.random() * game.enemySpeed);
            this.vy = (this.y > game.player.y) ? -dy : dy;

            if (this.vx || this.vy) {
                var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                if (0 <= x && x < game.map.width && 0 <= y && y < game.map.height && !game.map.hitTest(x, y)) {
                    this.isMoving = true;
                    arguments.callee.call(this);
                }
            }
        }
        this.frame = [0, 1, 0, 2][Math.floor(this.age/5) % 4] + 5;
    }
});