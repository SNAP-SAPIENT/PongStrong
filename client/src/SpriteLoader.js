module.exports = function LoadSprites() {
  return {
    ARM: {
      w: 758,
      h: 758,
      animations: {
        idle: {
          img: document.querySelector('#Arm_asset'),
          rate: 200,
          frames: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 768,
              y: 0,
            },
            {
              x: 1536,
              y: 0,
            },
            {
              x: 0,
              y: 768,
            },
            {
              x: 768,
              y: 768,
            },
            {
              x: 1536,
              y: 768,
            },
            {
              x: 0,
              y: 1536,
            },
            {
              x: 768,
              y: 1536,
            },
            {
              x: 1536,
              y: 1536,
            },
            {
              x: 0,
              y: 2304,
            },
            {
              x: 768,
              y: 2304,
            },
            {
              x: 1536,
              y: 2304,
            },
          ],
        },
      },
    },
    UFO: {
      w: 224,
      h: 224,
      animations: {
        idle: {
          img: document.querySelector('#UFO_idle_asset'),
          rate: 200,
          frames: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 224,
              y: 0,
            },
            {
              x: 0,
              y: 224,
            },
            {
              x: 224,
              y: 224,
            },
          ],
        },
        death: {
          img: document.querySelector('#UFO_death_asset'),
          rate: 250,
          frames: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 224,
              y: 0,
            },
            {
              x: 448,
              y: 0,
            },
            {
              x: 0,
              y: 224,
            },
            {
              x: 224,
              y: 224,
            },
            {
              x: 448,
              y: 224,
            },
            {
              x: 0,
              y: 448,
            },
            {
              x: 224,
              y: 448,
            },
          ],
        },
      },
    },
    ALIEN: {
      w: 224,
      h: 224,
      animations: {
        idle: {
          img: document.querySelector('#Alien_asset'),
          rate: 300,
          frames: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 224,
              y: 0,
            },
          ],
        },
        death: {
          img: document.querySelector('#Alien_asset'),
          rate: 200,
          frames: [
            {
              x: 448,
              y: 0,
            },
            {
              x: 0,
              y: 224,
            },
            {
              x: 224,
              y: 224,
            },
            {
              x: 448,
              y: 224,
            },
            {
              x: 0,
              y: 448,
            },
            {
              x: 224,
              y: 448,
            },
            {
              x: 448,
              y: 448,
            },

          ],
        },
      },
    },
    BRICK: {
      w: 224,
      h: 224,
      animations: {
        idle: {
          img: document.querySelector('#Brick_asset'),
          rate: 300,
          frames: [
            {
              x: 0,
              y: 0,
            }
          ],
        },
        death: {
          img: document.querySelector('#Brick_asset'),
          rate: 200,
          frames: [
            {
              x: 224,
              y: 0,
            },
            {
              x: 448,
              y: 0,
            },
            {
              x: 0,
              y: 224,
            },
            {
              x: 224,
              y: 224,
            },
            {
              x: 448,
              y: 224,
            },
            {
              x: 0,
              y: 448,
            },
            {
              x: 224,
              y: 448,
            },
            {
              x: 448,
              y: 448,
            },
          ],
        },
      },
    },
  }
};
