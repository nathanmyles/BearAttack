var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        var image = new Surface(128, 128);
        image.draw(game.assets['img/HeroSprite.gif'], 0, 0, 128, 128, 0, 0, 128, 128);
        this.image = image;

        this.isMoving = false;
        this.direction = 0;
        this.walk = 1;
        this.bulletSpeed = 10;
        this.health = game.maxPlayerHealth;
        this.scaleX = -1;
        this.lastShot = 0;
    },
    onenterframe: function(){
        this.frame = this.direction * 4 + this.walk;
        if (this.isMoving) {
            this.moveBy(this.vx, this.vy);

            if (this.walk % 4) {
                this.walk++;
                this.walk %= 4;
            }
            if ((this.vx && (this.x-8) % 16 == 0) || (this.vy && this.y % 16 == 0)) {
                this.isMoving = false;
                this.walk = 1;
            }
        } else {
            this.vx = this.vy = 0;
            if (game.input.moveLeft || game.pad.input.left) {
                this.direction = 1;
                this.vx = -4;
            } else if (game.input.moveRight || game.pad.input.right) {
                this.direction = 2;
                this.vx = 4;
            } else if (game.input.moveUp || game.pad.input.up) {
                this.direction = 3;
                this.vy = -4;
            } else if (game.input.moveDown || game.pad.input.down) {
                this.direction = 0;
                this.vy = 4;
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
        var vx, vy = 0;
        if (game.stick.isTouched) {
            if((Math.abs(game.stick.vx) > 0.5 || Math.abs(game.stick.vy) > 0.5)){

                vx = game.stick.vx * this.bulletSpeed;
                vy = game.stick.vy * this.bulletSpeed;
            }
        } else {
            if(game.input.left && !game.input.right){
                if(game.input.up && !game.input.down){
                    vx = -this.bulletSpeed;
                    vy = -this.bulletSpeed;
                } else if(game.input.down && !game.input.up) {
                    vx = -this.bulletSpeed;
                    vy = this.bulletSpeed;
                } else {
                    vx = -this.bulletSpeed;
                    vy = 0;
                }
            } else if(game.input.right && !game.input.left){
                if(game.input.up && !game.input.down){
                    vx = this.bulletSpeed;
                    vy = -this.bulletSpeed;
                } else if(game.input.down && !game.input.up) {
                    vx = this.bulletSpeed;
                    vy = this.bulletSpeed;
                } else {
                    vx = this.bulletSpeed;
                    vy = 0;
                }
            } else if(game.input.up && !game.input.down){
                vx = 0;
                vy = -this.bulletSpeed;
            } else if(game.input.down && !game.input.up){
                vx = 0;
                vy = this.bulletSpeed;
            }
        }
        var now = new Date().getTime();
        if((vx || vy) && (now - game.weaponCoolDown > this.lastShot || game.bonusChainGun)){
            this.lastShot = now;
            var projectileX = this.x;
            var projectileY = this.y;
            if(vx < -1){
                this.direction = 1;
            } else if(vx > 1){
                this.direction = 2;
            } else if(vy < -1){
                this.direction = 3;
            } else if(vy > 1){
                this.direction = 0;
            }

            if(vx < -1){
                projectileX -= 12;
            }
            if(vx > 1){
                projectileX += 12;
            }
            if(vy < -1){
                projectileY -= 12;
            }
            if(vy > 1){
                projectileY += 12;
            }

            var projectile = new Projectile(projectileX, projectileY, vx, vy);
            game.stage.addChild(projectile);
            if(game.bonusFanGun){
                var vx1;
                var vy1;
                var vx2;
                var vy2;
                if(vx - vy > -1 && vx - vy < 1){
                    vx1 = vx - 0.75;
                    vy1 = vy + 0.75;
                    vx2 = vx + 0.75;
                    vy2 = vy - 0.75;
                } else if(Math.abs(vx) - Math.abs(vy) > -1 && Math.abs(vx) - Math.abs(vy) < 1) {
                    vx1 = vx + 0.75;
                    vy1 = vy + 0.75;
                    vx2 = vx - 0.75;
                    vy2 = vy - 0.75;
                } else {
                    vx1 = (vx < 1) ? vx + 0.75 : vx;
                    vy1 = (vy < 1) ? vy - 0.75 : vy;
                    vx2 = (vx < 1) ? vx - 0.75 : vx;
                    vy2 = (vy < 1) ? vy + 0.75 : vy;
                }
                var projectile1 = new Projectile(projectileX, projectileY, vx1, vy1);
                game.stage.addChild(projectile1);
                var projectile2 = new Projectile(projectileX, projectileY, vx2, vy2);
                game.stage.addChild(projectile2);
            }
        }

    },
    hitByEnemy: function(){
        game.assets['sounds/mHitHurt.mp3'].play();
        if(--this.health < 0){
            game.assets['sounds/mPlayerDeath.mp3'].play();
            game.showEndScreen();
        }
    }
});
