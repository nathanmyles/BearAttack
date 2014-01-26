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

    game.inPlay = false;

    game.level = 1;
    game.totalScore = 0;

    game.enemySpeed = 1;
    game.maxShots = 3;
    game.enemysInLevel = 0;
    game.maxEnemysInLevel = 25;
    game.score = 0;

    game.bonusChainGunTimeout = 0;
    game.bonusChainGun = false;
    game.bonusFireThroughObjectsTimeout = 0;
    game.bonusFireThroughObjects = false;

    game.preload('img/map1.gif', 'img/chara0.gif', 'img/chara1.png', 'img/graphic.png');
    game.onload = function() {

        game.keybind(65, 'fireLeft');
        game.keybind(68, 'fireRight');
        game.keybind(87, 'fireUp');
        game.keybind(83, 'fireDown');

        MapHelper.loadMaps();

        game.loadLevel();

        game.rootScene.addEventListener('enterframe', function(e) {
            game.scoreLabel.score = game.score;
            game.lifeLabel.life = game.player.health;
            game.levelLabel.level = game.level;

            var x = Math.min((game.width  - 16) / 2 - game.player.x, 0);
            var y = Math.min((game.height - 16) / 2 - game.player.y, 0);
            x = Math.max(game.width,  x + game.map.main.width)  - game.map.main.width;
            y = Math.max(game.height, y + game.map.main.height) - game.map.main.height;
            game.stage.x = x;
            game.stage.y = y;
            if(rand(1000) < game.frame / 20 * Math.sin(game.frame / 100) + game.frame / 20 + 25 &&
                game.enemysInLevel < game.maxEnemysInLevel) {

                var spawnPoint = game.map.spawnPoints[rand(game.map.spawnPoints.length)];
                var badGuy = new BadGuy(spawnPoint.x - 8, spawnPoint.y);
                game.stage.addChild(badGuy);
                game.enemysInLevel++;
            }
            if(Math.floor(game.age / game.fps) % 30 == 0){
                game.enemySpeed++;
            }
            if(game.enemysInLevel >= game.maxEnemysInLevel && BadGuy.collection.length == 0 && game.inPlay){
                game.inPlay = false;

                var levelCompleteLabel = new LevelCompleteLabel(game.width / 2, game.height / 2, 15, function(){
                    game.reload();
                });

                game.stage.addChild(levelCompleteLabel);
            }

            game.inPlay = true;
        });
    };
    game.loadLevel = function(){
        var index = rand(MapList.length);
        var map = MapList[index];
        game.loadStage(map);

        game.scoreLabel = new ScoreLabel(game.width - 145, 0);
        game.stage.addChild(game.scoreLabel);

        game.lifeLabel = new LifeLabel(0, 0, game.player.health);
        game.stage.addChild(game.lifeLabel);

        game.levelLabel = new LevelLabel((game.width / 2), game.height - 20, game.level);
        game.stage.addChild(game.levelLabel);

        game.pad = new Pad();
        game.pad.x = game.width - 100;
        game.pad.y = game.height - 100;
        game.rootScene.addChild(game.pad);

        game.stick = new APad();
        game.stick.x = 0;
        game.stick.y = game.height - 100;
        game.rootScene.addChild(game.stick);
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
    game.reload = function(){

        game.totalScore += game.score;
        game.level++;

        game.score = 0;
        game.enemysInLevel = 0;
        game.maxEnemysInLevel = game.maxEnemysInLevel * (game.level * 0.5);
        if(game.enemySpeed < 4) game.enemySpeed++;
        game.rootScene.removeChild(game.stage);

        game.loadLevel();
    };
    game.start();
};
