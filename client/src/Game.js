var Soundtrack = new Audio(__dirname + '/../assets/Sounds/LoopingMusic.wav');
Soundtrack.loop = true;
var Soundtrack2 = new Audio(__dirname + '/../assets/Sounds/LoopingMusic2.wav');
Soundtrack2.loop = true;
Soundtrack2.volume = 0.3;
var endMusic = new Audio(__dirname + '/../assets/Sounds/EndMusic.wav');
var BallHitSound = new Audio(__dirname + '/../assets/Sounds/BallHit.wav');
var Alien1DeathSound = new Audio(__dirname + '/../assets/Sounds/Brixplosion.wav');
var Alien2DeathSound = new Audio(__dirname + '/../assets/Sounds/Alienplosion.wav');
var UFODeathSound = new Audio(__dirname + '/../assets/Sounds/Saucerxplosion.wav');
var UFOMoveSound = new Audio(__dirname + '/../assets/Sounds/SaucerFlying.wav');
var UFOSpawnSound = new Audio(__dirname + '/../assets/Sounds/Spawn.wav');
UFOSpawnSound.volume = 0.2;

function createBasicAlien() {
  return {
    type: 'ALIEN',
    frame: 0,
    frameTime: 0,
    state: 'enter',
    enterFrame: 8,
    deathFrame: 26,
    points: 50,
    deathSound: Alien2DeathSound,
  };
}

function createBasicBrick() {
  return {
    type: 'BRICK',
    frame: 0,
    frameTime: 0,
    state: 'enter',
    enterFrame: 10,
    deathFrame: 23,
    points: 10,
    deathSound: Alien1DeathSound,
  };
}

function createUFO() {
  return {
    type: 'UFO',
    frame: 0,
    frameTime: 0,
    state: 'idle',
    deathFrame: 27,
    points: 100,
    currentTile: 0,
    isActive: false,
    moveTimer: 1500,
    spawnTimer: 6000,
    spawnFrame: 9,
    deathSound: UFODeathSound,
  };
}

var STATES = { START: 'START', INTRO: 'INTRO', MAIN: 'MAIN', END: 'END', SCORES: 'SCORES' };

module.exports = function Game(ctx, sprites) {
  Soundtrack.play();
  Soundtrack2.play();

  var gameState = STATES.START;
  var previousTime = Date.now();
  var CELL_SIZE = 256;
  var countDown = 60 * 1000 * 2; // 3 min
  var score = 0;
  var gridX = window.innerWidth / 2 - CELL_SIZE * 4 / 2;
  var gridY = 128;
  var gridCoords = [
    [0, 0], [CELL_SIZE, 0], [CELL_SIZE * 2, 0], [CELL_SIZE * 3, 0],
    [0, CELL_SIZE], [CELL_SIZE, CELL_SIZE], [CELL_SIZE * 2, CELL_SIZE], [CELL_SIZE * 3, CELL_SIZE],
    [0, CELL_SIZE * 2], [CELL_SIZE, CELL_SIZE * 2], [CELL_SIZE * 2, CELL_SIZE * 2], [CELL_SIZE * 3, CELL_SIZE * 2],
  ];
  var gridMap = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];
  var gameOverTimer = 5000;
  var scoreScreenTimer = 10000;
  var ufo = createUFO();

  var mainScreenAnimations = [
    { type: 'ARM', frame: 0, frameTime: 0, x: 10, y: 150, reversed: false },
    { type: 'ARM', frame: 0, frameTime: 0, x: 1425, y: 150, reversed: true },
  ];

  var score = 0;
  var grid = gridCoords.map((coords) => {
    return {
      x: coords[0],
      y: coords[1],
      entity: createBasicBrick(),
    }
  });

  function resetGame() {
    grid = gridCoords.map((coords) => {
      return {
        x: coords[0],
        y: coords[1],
        entity: createBasicBrick(),
      }
    });
    score = 0;
    countDown = 60 * 1000 * 2;
    gameOverTimer = 5000;
    scoreScreenTimer = 20000;
    gameState = STATES.START;
    ufo = createUFO();
    document.querySelector('#start_ui').className = 'is-visible';
    document.querySelector('#game_ui').className = 'is-hidden';
    document.querySelector('#game_over_ui').className = 'is-hidden';
    Soundtrack.pause();
    Soundtrack2.pause();
  }

  function displayTime() {
    var timeDiv = document.querySelector('#time');
    var timeString = '';
    timeString += Math.floor(countDown / 60000);
    timeString += ':';
    var seconds = Math.floor(countDown / 1000) % 60;
    timeString += seconds < 10 ? '0' + seconds : seconds;
    timeDiv.innerHTML = timeString;
  }

  function displayScore() {
    var scoreDiv = document.querySelector('#score');

    // dis nasty right here
    var scoreString = '';
    if (score < 1000) {
      scoreString += '0';

      if (score < 100) {
        scoreString += '0';

        if (score < 10) {
          scoreString += '0';
        }
      }
    }
    scoreString += score;
    scoreDiv.innerHTML = scoreString;
  }

  function updateShip(dt) {
    if (ufo.isActive) {
      ufo.moveTimer -= dt;

      if (ufo.moveTimer <= 0 && ufo.state === 'idle') {
        UFOMoveSound.currentTime = 0;
        UFOMoveSound.play();
        ufo.moveTimer = 1500;
        ufo.currentTile += 1;

        if(grid[ufo.currentTile] && grid[ufo.currentTile].entity === null && Math.random() > 0.7) {
          ufo.state = 'spawn';
          UFOSpawnSound.play();
          grid[ufo.currentTile].entity = createBasicBrick();
        }

        if (ufo.currentTile >= grid.length) {
          ufo = createUFO();
        }
      }
    } else {
      ufo.spawnTimer -= dt;

      if (ufo.spawnTimer <= 0) {
        ufo.isActive = true;
      }
    }
  }

  function updateAndDraw(dt) {
    return function(gridSpace, i) {
      var isUFO = (ufo.isActive && i === ufo.currentTile);
      var entity = isUFO ? ufo : gridSpace.entity;
      if (!entity) return gridSpace;

      var sprite = sprites[entity.type];
      var animation = sprite.animations[entity.state];
      entity.frameTime += dt;

      if (entity.frameTime >= animation.rate) {
        entity.frameTime = 0;
        var newFrame = entity.frame + 1;
        entity.frame = newFrame;

        if (entity.type === 'UFO' && entity.spawnFrame === newFrame) {
          entity.state = 'idle';
          entity.frame = 0;
        }

        if (entity.state === 'death' && newFrame === entity.deathFrame) {
          score += entity.points;
          if (entity.type === 'BRICK') {
            gridSpace.entity = createBasicAlien();
          } else if (entity.type === 'UFO') {
            ufo = createUFO();
          } else {
            gridSpace.entity = null;
          }

          return;
        }

        if (entity.state === 'enter' && newFrame === entity.enterFrame) {
          entity.frame = 0;
          entity.state = 'idle';
          animation = sprite.animations[entity.state];
        }

        if (newFrame >= animation.frames.length) {
          entity.frame = 0;
        }
      }

      var frame = animation.frames[entity.frame];
      ctx.drawImage(animation.img, frame.x, frame.y, sprite.w, sprite.h, gridSpace.x + gridX, gridSpace.y + gridY, 256, 256); // sprite.w, sprite.h);
    }
  }

  function drawIntroElement(dt) {
    return function(entity) {
      var sprite = sprites[entity.type];
      var animation = sprite.animations['idle'];
      entity.frameTime += dt;

      if (entity.frameTime >= animation.rate) {
        entity.frameTime = 0;
        var newFrame = entity.frame + 1;
        entity.frame = newFrame;

        if (newFrame >= animation.frames.length) {
          entity.frame = 0;
        }
      }

      var frame = animation.frames[entity.frame];
      if (!entity.reversed) {
        ctx.drawImage(animation.img, frame.x, frame.y, sprite.w, sprite.h, window.innerWidth/2 - 710, entity.y, 384, 384);
      } else {
        ctx.save();
        ctx.translate(window.innerWidth/2 + 705, entity.y);
        ctx.scale(-1,1);
        ctx.drawImage(animation.img, frame.x, frame.y, sprite.w, sprite.h, 0, 0, 384, 384);
        ctx.restore();
      }

      return entity;
    }
  }

  var stateUpdates = {
    START: function(dt) {
      var logoImg = document.querySelector('#Logo_asset');
      var logoWidth = 1300;
      ctx.drawImage(logoImg, window.innerWidth / 2 - logoWidth / 2, 0, logoWidth, logoWidth * 0.511);

      // Draw arms
      mainScreenAnimations.map(drawIntroElement(dt));
    },
    INTRO: function() {

    },
    MAIN: function(dt) {
      updateShip(dt);
      grid.forEach(updateAndDraw(dt));
      countDown -= dt;

      if (countDown <= 0) {
        gameState = STATES.END;
        Soundtrack.pause();
        Soundtrack2.pause();
        endMusic.play();
        document.querySelector('#game_ui').className = 'is-hidden';
        document.querySelector('#game_over_ui').className = 'is-visible';
      }

      displayScore();
      displayTime(dt);
    },
    END: function(dt) {
      gameOverTimer -= dt;
      if (gameOverTimer <= 0) {
        resetGame();
      }
    },
    SCORES: function() {

    },
  }

  // switch this to listen to serial ports
  document.querySelector('#screen').addEventListener('click', (e) => {
    var x = e.pageX;
    var y = e.pageY;
    // calc cell collision
    if (gameState === STATES.MAIN) {
      BallHitSound.play();
      if (x > gridX && x < CELL_SIZE * 4 + gridX && y > gridY && y < CELL_SIZE * 4 + gridY) {
        var col = Math.floor((x - gridX) / CELL_SIZE);
        var row = Math.floor((y - gridY) / CELL_SIZE);

        var cellId = gridMap[row][col];
        var entity = grid[cellId].entity;
        if (ufo.isActive && cellId === ufo.currentTile && ufo.state !== 'death') {
          ufo.state = 'death';
          ufo.frame = 0;
          ufo.frameTime = 0;
          ufo.deathSound.currentTime = 0;
          ufo.deathSound.play();
        } else if (entity && entity.state === 'idle') {
          entity.state = 'death';
          entity.frame = 0;
          entity.frameTime = 0;
          entity.deathSound.currentTime = 0;
          entity.deathSound.play();
        }
      }
    } else if (gameState === STATES.START) {
      gameState = STATES.MAIN;
      document.querySelector('#start_ui').className = 'is-hidden';
      document.querySelector('#game_ui').className = 'is-visible';
    }
  });

  return function loop() {
    var currentTime = Date.now();
    var dt = currentTime - previousTime;
    previousTime = currentTime;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    stateUpdates[gameState](dt);

    window.requestAnimationFrame(loop);
  };
}
