function createBasicAlien() {
  return { type: 'ALIEN', frame: 0, frameTime: 0, state: 'idle', deathFrame: 9 };
}

function createBasicBrick() {
  return { type: 'BRICK', frame: 0, frameTime: 0, state: 'idle', deathFrame: 8 };
}

var STATES = { MAIN: 'MAIN' }

module.exports = function Game(ctx, sprites) {
  var gameState = STATES.MAIN;
  var previousTime = Date.now();
  var CELL_SIZE = 224;
  var gridX = window.innerWidth / 2 - CELL_SIZE * 4 / 2;
  var gridY = 230;
  var gridCoords = [
    [0, 0], [CELL_SIZE, 0], [CELL_SIZE * 2, 0], [CELL_SIZE * 3, 0],
    [0, CELL_SIZE], [CELL_SIZE, CELL_SIZE], [CELL_SIZE * 2, CELL_SIZE], [CELL_SIZE * 3, CELL_SIZE],
    [0, CELL_SIZE * 2], [CELL_SIZE, CELL_SIZE * 2], [CELL_SIZE * 2, CELL_SIZE * 2], [CELL_SIZE * 3, CELL_SIZE * 2],
  ];
  var gridMap = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];

  var grid = gridCoords.map(function(coords) {
    return {
      x: coords[0],
      y: coords[1],
      entity: createBasicBrick(),
    }
  });

  function updateAndDraw(dt) {
    return function(gridSpace) {
      var entity = gridSpace.entity;
      if (!entity) return gridSpace;

      var sprite = sprites[entity.type];
      var animation = sprite.animations[entity.state];
      entity.frameTime += dt;

      if (entity.frameTime >= animation.rate) {
        entity.frameTime = 0;
        var newFrame = entity.frame + 1;
        entity.frame = newFrame;

        if (entity.state === 'death' && newFrame === entity.deathFrame) {
          if (entity.type === 'BRICK') {
            gridSpace.entity = createBasicAlien();
          } else {
            gridSpace.entity = null;
          }

          return gridSpace;
        }

        if (newFrame >= animation.frames.length) {
          entity.frame = 0;
        }
      }

      var frame = animation.frames[entity.frame];
      ctx.drawImage(sprite.img, frame.x, frame.y, sprite.w, sprite.h, gridSpace.x + gridX, gridSpace.y + gridY, sprite.w, sprite.h);

      return gridSpace;
    }
  }

  var stateUpdates = {
    MAIN: function(dt) {
      grid.map(updateAndDraw(dt));
    },
  }

  document.querySelector('#screen').addEventListener('click', (e) => {
    var x = e.pageX;
    var y = e.pageY;
    // calc cell collision
    if (x > gridX && x < CELL_SIZE * 4 + gridX && y > gridY && y < CELL_SIZE * 4 + gridY) {
      var col = Math.floor((x - gridX) / CELL_SIZE);
      var row = Math.floor((y - gridY) / CELL_SIZE);

      var cellId = gridMap[row][col];
      if (grid[cellId].entity) grid[cellId].entity.state = 'death';
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
