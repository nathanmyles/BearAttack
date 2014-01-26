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
var scale = windowWidth / 320;
var windowHeight = getHeight();
enchant();
var game;
window.onload = function() {
    game = new Game(320, windowHeight / scale);
    game.fps = 15;

    game.inPlay = false;

    game.level = 1;
    game.totalScore = 0;

    game.enemySpeed = 1;
    game.lastShot = 0;
    game.weaponCoolDown = 500;
    game.enemysInLevel = 0;
    game.maxEnemysInLevel = 25;
    game.score = 0;

    game.bonusChainGunTimeout = 0;
    game.bonusChainGun = false;
    game.bonusFireThroughObjectsTimeout = 0;
    game.bonusFireThroughObjects = false;
    game.bonusFanGunTimeout = 0;
    game.bonusFanGun = false;

    game.preload('img/map1.gif', 'img/chara0.gif', 'img/graphic.png', 'img/EvilBearSprite.gif');
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
                game.stage.insertBefore(badGuy, game.map.foreground);
                game.enemysInLevel++;
            }
            if(game.enemysInLevel >= game.maxEnemysInLevel && BadGuy.collection.length == 0 && game.inPlay){
                game.inPlay = false;

                game.levelCompleteLabel = new LevelCompleteLabel(game.width / 2, game.height / 2, 10, function(){
                    game.reload();
                });

                game.rootScene.insertBefore(game.levelCompleteLabel, game.pad);
            }
        });

        game.inPlay = true;
    };
    game.loadLevel = function(){
        var index = rand(MapList.length);
        var map = MapList[index];
        game.loadStage(map);

        game.scoreLabel = new ScoreLabel(0, 15);
        game.rootScene.addChild(game.scoreLabel);

        game.lifeLabel = new LifeLabel(0, 0, game.player.health);
        game.rootScene.addChild(game.lifeLabel);

        game.levelLabel = new LevelLabel((game.width / 2), game.height - 20, game.level);
        game.rootScene.addChild(game.levelLabel);

        game.pad = new Pad();
        game.pad.x = game.width - 115;
        game.pad.y = game.height - 115;
        game.rootScene.addChild(game.pad);

        game.stick = new APad();
        game.stick.x = 15;
        game.stick.y = game.height - 115;
        game.rootScene.addChild(game.stick);

        game.inPlay = true;
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
