var path = require("path");
var SpriteLoader = require('./src/SpriteLoader');
var Game = require('./src/Game');

window.onload = function () {
  var SerialPort = require('serialport');
  SerialPort.list(function(err, ports) {
    console.log(ports);
  });

  var port = new SerialPort('/dev/cu.usbmodem1421', {
    baudRate: 115200,
    parser: SerialPort.parsers.readline('\n'),
  });
  port.on('data', function (stuff) {
    console.log(stuff);
  });

  var sprites = SpriteLoader();

  var canvas = document.querySelector('#screen');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext('2d');

  Game(ctx, sprites)();
}
