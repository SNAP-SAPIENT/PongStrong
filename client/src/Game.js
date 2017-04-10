function createBasicAlien() {
  return { type: 'ALIEN', frame: 0, frameTime: 0, state: 'idle', deathFrame: 7, points: 100 };
}

function createBasicBrick() {
  return { type: 'BRICK', frame: 0, frameTime: 0, state: 'idle', deathFrame: 8, points: 10 };
}

function createUFO() {
  return { type: 'UFO', frame: 0, frameTime: 0, state: 'idle', deathFrame: 8, points: 1000, currentTile: 0, isActive: false, moveTimer: 1500, spawnTimer: 30000 };
}

var STATES = { START: 'START', INTRO: 'INTRO', MAIN: 'MAIN', END: 'END', SCORES: 'SCORES' };

module.exports = function Game(ctx, sprites) {
  var gameState = STATES.START;
  var previousTime = Date.now();
  var CELL_SIZE = 256;
  var countDown = 60 * 1000 * 3; // 3 min
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
    countDown = 60 * 1000 * 3;
    gameOverTimer = 5000;
    scoreScreenTimer = 20000;
    gameState = STATES.START;
    document.querySelector('#start_ui').className = 'is-visible';
    document.querySelector('#game_ui').className = 'is-hidden';
    document.querySelector('#game_over_ui').className = 'is-hidden';
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

      if (ufo.moveTimer <= 0 && ufo.state !== 'death') {
        ufo.moveTimer = 1500;
        ufo.currentTile += 1;

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
        ctx.drawImage(animation.img, frame.x, frame.y, sprite.w, sprite.h, entity.x, entity.y, 384, 384);
      } else {
        ctx.save();
        ctx.translate(entity.x, entity.y);
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
      if (x > gridX && x < CELL_SIZE * 4 + gridX && y > gridY && y < CELL_SIZE * 4 + gridY) {
        var col = Math.floor((x - gridX) / CELL_SIZE);
        var row = Math.floor((y - gridY) / CELL_SIZE);

        var cellId = gridMap[row][col];
        if (ufo.isActive && cellId === ufo.currentTile) {
          ufo.state = 'death';
          ufo.frameTime = 0;
        } else if (grid[cellId].entity) {
          grid[cellId].entity.state = 'death';
          grid[cellId].entity.frameTime = 0;
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
