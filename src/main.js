// OUTDATED


const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const { PythonShell } = require("python-shell");
import DataFrame from "dataframe-js";

let win = null;
let dirSelected = null;
let script_dir = null;
let image_directory = null;
let num_folders = null;
let num_stimuli = null;
// let memorability = null;
// let nameability = null;
// let emotionality = null;
let orientationq = null;
let unique = null;
// let renamed = null;

// no menu bar required
// Menu.setApplicationMenu(null)

console.log("icon", path.join(__static, 'logos/ominds_2.png') )
function createWindow() {
  // test function

  // Initialize the window
  win = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 600, // set a min width!
    minHeight: 300, // and a min height!
    // Remove the window frame from windows applications
    frame: false,
    // Hide the titlebar from MacOS applications while keeping the stop lights
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // sandbox: true
    },
    icon: path.join(__static, 'logos/ominds_2.png') 
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

  win.loadURL("http://localhost:3000/");

  // Remove window once app is closed
  win.on("closed", function () {
    win = null;
  });
}

app.on("ready", () => {
  // backend(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0);

  createWindow();
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
    ipcMain.on("submitForm", function (event, data) {
      // Access form data here
      console.log(data);
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

// ipcMain.on('form_data', function(event, data) {
//   console.log(data);
// });

// grab directory to offload images onto
ipcMain.on("select-dirs", async (event, arg) => {
  const result = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  dirSelected = result.filePaths[0] + "/";
  console.log("directories selected", dirSelected);
});

// once data is submitted, run the python function

ipcMain.on("submitted", (event, arg) => {
  console.log("recieved inputs");
  console.log(arg); // prints "ping"
  num_folders = Number(arg.groups);
  num_stimuli = Number(arg.images);
  orientationq = arg.orientation;
  memorability = true(arg.checkedMemorable) ? Number(arg.sliderA) : "n";
  nameability = true(arg.checkedMemorable) ? Number(arg.sliderB) : "n";
  emotionality = true(arg.checkedMemorable) ? Number(arg.sliderC) : "n";
  unique = arg.checkedUnique;
  renamed = true(arg.checkedRenamed) ? 1 : 0;

  let current_dir = path.join(__dirname, "../scripts/");
  image_directory = path.join(__dirname, "../scripts/objects/");

  event.returnValue = "failure";

  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    args: [
      current_dir,
      image_directory,
      num_folders,
      num_stimuli,
      memorability,
      nameability,
      emotionality,
      orientationq,
      unique,
      dirSelected,
      renamed,
    ],
  };
  console.log(options.args);

  backend(
    current_dir,
    image_directory,
    num_folders,
    num_stimuli,
    memorability,
    nameability,
    emotionality,
    orientationq,
    unique,
    dirSelected,
    renamed
  );

  // PythonShell.run(
  //   path.join(__dirname, "../scripts/backend-3.py"),
  //   options,
  //   function (err, results) {
  //     if (err) throw err;
  //     console.log("results: %j", results);
  //     console.log("finished");
  //   }
  // );
});
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

function backend(
  current_dir,
  image_directory,
  num_folders,
  num_stimuli,
  memorability,
  nameability,
  emotionality,
  orientationq,
  unique,
  target_directory,
  newname
) {
  // STEP 0: ORGANIZE

  let df = new DataFrame.fromCSV("scripts/full_dt_pf.csv");
  console.log("Dataframe", df);
  let folder_list = [];

  for (let i = 0; i < Number(num_folders); i++) {
    // add a dataframe to folder_list
    folder_list.append(new DataFrame());
    console.log("appended another df", folder_list);
  }

  // STEP 1: DIFFERENCE SCORES
  // find how far the score is compared to the ideal scores given
  if (memorability === "n") {
    if (nameability === "n") {
      if (emotionality === "n") {
      }
    }
  }
}
