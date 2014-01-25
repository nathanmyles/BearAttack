function getWidth() {
    if (self.innerWidth) {
        return self.innerWidth;
    }
    else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientWidth;
    }
    else if (document.body) {
        return document.body.clientWidth;
    }
    return 650;
}
function getHeight() {
    if (self.innerHeight) {
        return self.innerHeight;
    }
    else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientHeight;
    }
    else if (document.body) {
        return document.body.clientHeight;
    }
    return 320;
}
var windowWidth = getWidth();
var windowHeight = getHeight();
if(windowWidth > 480) windowWidth = 480;
if(windowHeight > 480) windowHeight = 480;
enchant();
var game;
window.onload = function() {
    game = new Game(windowWidth, windowHeight);
    game.fps = 15;
    game.enemySpeed = 1;
    game.maxShots = 3;
    game.enemysInLevel = 25;
    game.score = 0;
    game.preload('img/map1.gif', 'img/chara0.gif', 'img/chara1.png', 'img/graphic.png');
    game.onload = function() {
        MapHelper.loadMaps();

        var index = rand(MapList.length - 1);
        var map = MapList[index];
        game.loadStage(map);

        var ScoreLabel = enchant.Class.create(enchant.Label, {
            initialize: function(text){
                enchant.Label.call(this, text);
                this.moveTo(windowWidth - 100, 0);
                game.rootScene.addChild(this);
            },
            onenterframe: function(){
                this.text = 'Score:' + game.score;
            }
        });

        var scoreLabel = new ScoreLabel('Score: ');


        var LifeLabel = enchant.Class.create(enchant.Label, {
            initialize: function(text){
                enchant.Label.call(this, text);
                this.moveTo(0, 0);
                game.rootScene.addChild(this);
            },
            onenterframe: function(){
                this.text = 'Life:' + game.player.health;
            }
        });

        var lifeLabel = new LifeLabel('Life: ');

        game.pad = new Pad();
        game.pad.x = game.width - 100;
        game.pad.y = game.height - 100;
        game.rootScene.addChild(game.pad);

        game.stick = new APad();
        game.stick.x = 0;
        game.stick.y = game.height - 100;
        game.rootScene.addChild(game.stick);

        game.rootScene.addEventListener('enterframe', function(e) {
            var x = Math.min((game.width  - 16) / 2 - game.player.x, 0);
            var y = Math.min((game.height - 16) / 2 - game.player.y, 0);
            x = Math.max(game.width,  x + game.map.main.width)  - game.map.main.width;
            y = Math.max(game.height, y + game.map.main.height) - game.map.main.height;
            game.stage.x = x;
            game.stage.y = y;
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 25 &&
                game.enemysInLevel > BadGuy.collection.length) {

                var spawnPoint = game.map.spawnPoints[rand(game.map.spawnPoints.length)];
                var badGuy = new BadGuy(spawnPoint.x - 8, spawnPoint.y);
                game.stage.addChild(badGuy);
            }
            if(Math.floor(game.age / game.fps) % 30 == 0){
                game.enemySpeed++;
            }
        });
    };
    game.loadStage = function(map){
        game.map = map;

        game.player = new Player(map.playerPosition.x, map.playerPosition.y);

        game.stage = new Group();
        game.stage.addChild(game.map.main);
        game.stage.addChild(game.player);
        game.stage.addChild(game.map.foreground);
        game.rootScene.addChild(game.stage);
    };
    game.start();
};
