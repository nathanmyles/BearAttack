var Drop = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png']; // set image
        this.moveTo(x, y);
        this.tl.delay(300).then(function(){
            game.stage.removeChild(this);
        });
        this.frame = 30;
        game.stage.addChild(this);
    },
    onenterframe: function(){
        if(game.player.intersect(this)){
            game.stage.removeChild(this);
            game.score += 10;
        }
    }
});

var ChainGun = enchant.Class.create(Drop, {
    initialize: function(x, y){
        Drop.call(this, x, y);
        this.frame = 64;
    },
    onenterframe: function(){
        if(game.player.intersect(this)){
            game.stage.removeChild(this);
            if(game.bonusChainGunTimeout){
                clearTimeout(game.bonusChainGunTimeout);
            }
            game.bonusChainGunTimeout = setTimeout(function(){ game.bonusChainGun = false }, game.bonusLength);
            game.bonusChainGun = true;
        }
    }
});

var FireThroughObjects = enchant.Class.create(Drop, {
    initialize: function(x, y){
        Drop.call(this, x, y);
        this.frame = 65;
    },
    onenterframe: function(){
        if(game.player.intersect(this)){
            game.stage.removeChild(this);
            if(game.bonusFireThroughObjectsTimeout){
                clearTimeout(game.bonusFireThroughObjectsTimeout);
            }
            game.bonusFireThroughObjectsTimeout = setTimeout(function(){ game.bonusFireThroughObjects = false }, game.bonusLength);
            game.bonusFireThroughObjects = true;
        }
    }
});

var FanGun = enchant.Class.create(Drop, {
    initialize: function(x, y){
        Drop.call(this, x, y);
        this.frame = 66;
    },
    onenterframe: function(){
        if(game.player.intersect(this)){
            game.stage.removeChild(this);
            if(game.bonusFanGunTimeout){
                clearTimeout(game.bonusFanGunTimeout);
            }
            game.bonusFanGunTimeout = setTimeout(function(){ game.bonusFanGun = false }, game.bonusLength);
            game.bonusFanGun = true;
        }
    }
});