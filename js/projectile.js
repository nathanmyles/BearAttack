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
        var hits = this.intersect(BadGuy);
        if(hits.length){
            for(var i = 0, len = hits.length; i < len; i++){
                game.stage.removeChild(hits[0]);
                game.stage.removeChild(this);
                //var drop = new Drop(hits[i][0].x, hits[i][0].y);
                game.score ++;
            }
        } else {
            this.moveBy(this.vx, this.vy);
            if((this.x < 0 || this.x > game.map.width) || (this.y < 0 || this.y > game.map.height)){
                game.stage.removeChild(this);
            }
        }
    }
});