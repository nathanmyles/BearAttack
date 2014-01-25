var Projectile = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, vx, vy){
        enchant.Sprite.call(this, 16, 16);
        this.x = x + 8;
        this.y = y + 8;
        this.vx = vx;
        this.vy = vy;
        var rotation = Math.atan2(vy, vx);
        rotation *= 180/Math.PI;
        this.rotate(rotation);
        this.image = game.assets['img/graphic.png'];
        this.frame = 1;
    },
    onenterframe: function(){

        var badGuys = BadGuy.collection.slice();
        for(var i = 0, len = badGuys.length; i < len; i++){
            var badGuy = badGuys[i];
            if(badGuy.within(this, 12)){
                game.stage.removeChild(this);
                if(--badGuy.health < 1){
                    game.stage.removeChild(badGuy);
                    //var drop = new Drop(hits[i][0].x, hits[i][0].y);
                    game.score++;
                }
            }
        }
        if(!game.map.main.hitTest(this.x + this.vx, this.y + this.vy)){
            this.moveBy(this.vx, this.vy);
        } else {
            game.stage.removeChild(this);
        }
        if((this.x < 0 || this.x > game.map.main.width) || (this.y < 0 || this.y > game.map.main.height)){
            game.stage.removeChild(this);
        }

    }
});