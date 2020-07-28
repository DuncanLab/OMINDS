const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const url = require('url');
const path = require('path');
let {PythonShell} = require('python-shell');

let win = null;

// no menu bar required
Menu.setApplicationMenu(null)

function createWindow() {
  // Initialize the window
  win = new BrowserWindow({
  //   webPreferences: {
  //     preload: __dirname + '/preload.js'
  // }
  });

  let options = {
    mode: 'text',
    // pythonPath: 'path/to/python',
    pythonOptions: ['-u', '-W ignore'], // get print results in real-time
    scriptPath: '/home/scott/Documents/Duncan Lab/ObjectProjectApp/scripts/',
    args: ['2', '3', '90', '80', '70', 'shoebox', 'y', '~/Documents/']
  };
   
  PythonShell.run('main.py', options, function (err, results) {
    if (err) throw err;
    console.log('results: %j', results);
  });
  
  win.loadURL("http://localhost:3000/")


  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}


app.on('ready', () => {
  createWindow(); 
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
    ipcMain.on('submitForm', function(event, data) {
      // Access form data here
      console.log(data);
   });
  }
})

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// ipcMain.on('form_data', function(event, data) {
//   console.log(data);
// });