const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const url = require('url');
const path = require('path');
const { PythonShell } = require('python-shell');

let win = null;
let dirSelected = null;
let script_dir = null;
let image_directory = null;
let num_folders = null;
let num_stimuli = null;
let memorability = null;
let nameability = null;
let emotionality = null;
let orientationq = null;
let unique = null;
let renamed = null;

// no menu bar required
// Menu.setApplicationMenu(null)

function createWindow() {
  // Initialize the window
  win = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 600, // set a min width!
    minHeight: 300, // and a min height!
    // Remove the window frame from windows applications
    frame: false,
    // Hide the titlebar from MacOS applications while keeping the stop lights
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // sandbox: true
    }
  });

  // let pyshell = new PythonShell('../scripts/test_file.py');

  // pyshell.on('message', function (message) {
  //   console.log(message);
  // })

  // pyshell.end(function (err) {
  //   if (err) {
  //     throw err;
  //   };
  //   console.log('finished');
  // });
  // PythonShell.run('main.py', options, function (err, results) {
  //   if (err) throw err;
  //   console.log('results: %j', results);
  // });

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
    ipcMain.on('submitForm', function (event, data) {
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

// grab directory to offload images onto
ipcMain.on('select-dirs', async (event, arg) => {
  const result = await dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  })
  dirSelected = result.filePaths[0] + "/"
  console.log('directories selected', dirSelected)
})

// once data is submitted, run the python function

ipcMain.on('submitted', (event, arg) => {
  console.log(arg)  // prints "ping"
  num_folders = Number(arg.groups)
  num_stimuli = Number(arg.images)
  orientationq = arg.orientation
  memorability = Number(arg.sliderA)
  nameability = Number(arg.sliderB)
  emotionality = Number(arg.sliderC)
  unique = arg.checkedUnique
  renamed = arg.checkedRenamed
  let current_dir = path.join(__dirname, '../scripts/')
  image_directory = path.join(__dirname, '../scripts/objects/')

  event.returnValue = 'success'

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    args: [current_dir, image_directory, num_folders, num_stimuli, memorability, nameability, emotionality, orientationq, unique, dirSelected]
  };
  console.log(options.args)

  PythonShell.run(path.join(__dirname, '../scripts/backend-3.py'), options, function (err, results) {
    if (err) throw err;
    console.log('results: %j', results);
    console.log('finished');
  });

})
// ipcMain.on('submitted', async (event, arg) => {
//   console.log("received submission")
//   console.log(event)
//   console.log(arg)
  

  // PythonShell.run(path.join(__dirname, '../scripts/test_file.py'), options, function (err, results) {
  //   if (err) throw err;
  //   console.log('results: %j', results);
  //   console.log('finished');
  // });
  // console.log(path.join(__dirname, '../scripts/test_file.py'))
  // console.log('directories selected', dirSelected)
// })