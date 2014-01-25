var ScoreLabel = enchant.Class.create(enchant.Label, {
    initialize: function(text){
        enchant.Label.call(this, text);
        this.moveTo(game.width - 100, 0);
    },
    onenterframe: function(){
        this.text = 'Score:' + game.score;
    }
});

var TimeLabel = enchant.Class.create(enchant.Label, {
    initialize: function(text){
        enchant.Label.call(this, text);
        this.moveTo((game.width / 2) - 50, 0);
    },
    onenterframe: function(){
        this.text = Math.floor(((gameLength - game.frame) / 20)) + ' seconds remaining';
    }
});

var LifeLabel = enchant.Class.create(enchant.Label, {
    initialize: function(text){
        enchant.Label.call(this, text);
        this.moveTo(0, 50);
    },
    onenterframe: function(){
        this.text = 'Life:' + game.player.life;
    }
});