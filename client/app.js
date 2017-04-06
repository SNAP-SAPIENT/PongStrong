// Fix es imports
// import { app, browserWindow } from 'electron';
// import path from 'path';
// import url from 'url';
var electron = require('electron');
var path = require('path');
var url = require('url');

var window = null;

electron.app.once('ready', function () {
  // Create a new window
  window = new electron.BrowserWindow({
    // Set the initial width to 500px
    width: 500,
    // Set the initial height to 400px
    height: 400,
    // Show the minimize/maximize buttons inset in the window on macOS
    titleBarStyle: 'hidden-inset',
    // Set the default background color of the window to match the CSS
    // background color of the page, this prevents any white flickering
    backgroundColor: "#fff",
    // Don't show the window until it ready, this prevents any white flickering
    show: false
  });

  window.maximize();
  window.setFullScreen(true);

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Show window when page is ready
  window.once('ready-to-show', function () {
    window.show()
  })
})
