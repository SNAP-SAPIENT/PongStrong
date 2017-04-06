window.onload = function () {
  var c=document.querySelector('#screen');
  var ctx=c.getContext('2d');
  ctx.beginPath();
  ctx.arc(100,75,50,0,2*Math.PI);
  ctx.stroke();

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
}
