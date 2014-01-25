var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        var image = new Surface(96, 128);
        image.draw(game.assets['img/chara0.gif'], 0, 0, 96, 128, 0, 0, 96, 128);
        this.image = image;

        this.isMoving = false;
        this.direction = 0;
        this.walk = 1;
        this.health = 20;
    },
    onenterframe: function(){
        this.frame = this.direction * 3 + this.walk;
        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);

            if (!(game.frame % 3)) {
                this.walk++;
                this.walk %= 3;
            }
            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                this.isMoving = false;
                this.walk = 1;
            }
        } else {
            this.vx = this.vy = 0;
            if (game.input.left || game.pad.input.left) {
                this.direction = 1;
                this.vx = -4;
            } else if (game.input.right || game.pad.input.right) {
                this.direction = 2;
                this.vx = 4;
            } else if (game.input.up || game.pad.input.up) {
                this.direction = 3;
                this.vy = -4;
            } else if (game.input.down || game.pad.input.down) {
                this.direction = 0;
                this.vy = 4;
            }
            if (this.vx || this.vy) {
                var x = this.x + (this.vx ? this.vx / Math.abs(this.vx) * 16 : 0) + 16;
                var y = this.y + (this.vy ? this.vy / Math.abs(this.vy) * 16 : 0) + 16;
                if (0 <= x && x < game.map.width && 0 <= y && y < game.map.height && !game.map.hitTest(x, y)) {
                    this.isMoving = true;
                    arguments.callee.call(this);
                }
            }
        }
        if (game.stick.isTouched) {
            if((Math.abs(game.stick.vx) > 0.5 || Math.abs(game.stick.vy) > 0.5) &&
                Projectile.collection.length < game.maxShots){
                var projectile = new Projectile(this.x, this.y, game.stick.vx * 5, game.stick.vy * 5);
                game.stage.addChild(projectile);
            }
        }
    }
});