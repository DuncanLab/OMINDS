const {app, BrowserWindow, Menu} = require('electron')
const url = require('url');
const path = require('path');

let win = null;

// no menu bar required
Menu.setApplicationMenu(null)

function createWindow() {
  // Initialize the window
  win = new BrowserWindow({});

  // for static file, we can see which one we actually need
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, '../public/index.html'),
  //   protocol: 'file',
  //   slashes: true
  // }));

  // this loads localhost
  win.loadURL("http://localhost:3000/")


  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}


app.on('ready', function () {
  createWindow();
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});