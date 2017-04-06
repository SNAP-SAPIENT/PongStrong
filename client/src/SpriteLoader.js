module.exports = function LoadSprites() {
  return {
    UFO: {
      img: document.querySelector('#UFO_asset'),
      w: 128,
      h: 128,
      animations: {
        main: {
          rate: 300,
          frames: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 128,
              y: 0,
            },
            {
              x: 0,
              y: 128,
            },
            {
              x: 128,
              y: 128,
            },
          ],
        },
      },
    },
    ALIEN: {
      img: document.querySelector('#Alien_asset'),
      w: 224,
      h: 224,
      animations: {
        idle: {
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
              x: 224,
              y: 448,
            },
            {
              x: 448,
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
      img: document.querySelector('#Brick_asset'),
      w: 224,
      h: 224,
      animations: {
        idle: {
          rate: 300,
          frames: [
            {
              x: 0,
              y: 0,
            }
          ],
        },
        death: {
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
