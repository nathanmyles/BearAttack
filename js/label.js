var LevelCompleteLabel = enchant.Class.create(enchant.ui.MutableText, {
    initialize: function(x, y, displayTime, callback) {
        enchant.ui.MutableText.call(this, 0, 0);

        this.text = "Level Complete!";

        this.x = x - (this.width / 2);
        this.y = y;

        this.tl.delay(displayTime * game.fps).then(function(){
            game.rootScene.removeChild(this);
            if(typeof callback === "function"){
                callback();
            }
            delete this;
        });
    }
});

var LevelLabel = enchant.Class.create(enchant.ui.MutableText, {
    initialize: function(x, y, level) {
        enchant.ui.MutableText.call(this, 0, 0);

        this.level = (level) ? level : 0;
        this.label = "Level:";
        this.text = this.label + this.level;

        this.x = x - (this.width / 2);
        this.y = y;
    },
    onenterframe: function(){
        this.text = this.label + this.level;
    }
});

var TotalScoreLabel = enchant.Class.create(enchant.ui.MutableText, {
    initialize: function(x, y, score) {
        enchant.ui.MutableText.call(this, 0, 0);

        this.score = (score) ? score : 0;
        this.label = "Total Score:";
        this.text = this.label + score;

        this.x = x - (this.width / 2);
        this.y = y;
    }
});