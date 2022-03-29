const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const { PythonShell } = require("python-shell");
const isDev = require("electron-is-dev");
var DataFrame = require("dataframe-js").DataFrame;

const helpers = require("./helpers")
const main = require("./ominds");
const fs = require("fs");
const assert = require("assert");
const parse = require("csv-parse/lib/es5/sync");


// const dfd = require("danfojs-node");

// load in DF when app loads
// let pathToCSV = path.join(__dirname, "../scripts/full_dt_pf.csv");
// console.log(pathToCSV)

let csvString = fs.readFileSync(
  path.resolve(__dirname, "./full_dt_pf.csv"),
  "utf-8"
);
// console.log(csvString);
// console.log(csvString)


function convertCSVToJSON(str, delimiter = ',') {
  const titles = str.slice(0, str.indexOf('\n')).split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');
  return rows.map(row => {
      const values = row.split(delimiter);
      return titles.reduce((object, curr, i) => (object[curr] = values[i], object), {})
  });
};
let df = convertCSVToJSON(csvString, ',')

// df
//   .read_csv(pathToCSV) //assumes file is in CWD
//   .then((data) => {
//     data.head().print();
//     df = data;
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// DataFrame.fromCSV(pathToCSV).then((data) => {
//   console.log("dataframe promise returned");
//   // data.show();
//   data.withColumn("dist", () => 0);

//   df = data;
// });

const winURL = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../build/index.html")}`;

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
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "../src/preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      // contextIsolation: true,
      // sandbox: true
    },
    icon: path.join(__dirname, 'logos/ominds_2.icns') 
  });
// console.log(path.join(__dirname, 'logos/ominds_2.png') )
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

  win.loadURL(winURL);

  // Remove window once app is closed
  win.on("closed", function () {
    win = null;
  });
}

app.on("ready", () => {
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
  console.log("Trying to select a directory")
  dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }).then(result => {
    console.log("result", result)
    if(result.canceled){
      console.log("File Selection Canceled.")
      event.returnValue = ["failure"];
    } else {
      event.returnValue = ["success"];
    }
    console.log(result.filePaths)
    dirSelected = result.filePaths[0] + "/";
  console.log("directories selected", dirSelected);
  }).catch(err => {
    console.log(err)
    event.returnValue = ["failure"];
  })

  // const result = await dialog.showOpenDialog(win, {
  //   properties: ["openDirectory"],
  // });
  
});

// once data is submitted, run the python function

ipcMain.on("submitted", (event, arg) => {

  // backend(
    //   "/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/",
    //   "/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/objects/",
    //   3,
    //   12,
    //   "75",
    //   "20",
    //   "50",
    //   "shoebox",
    //   1,
    //   "/Users/alexgordienko/Desktop",
    //   1
    // );
  console.log("recieved inputs");
  // console.log(arg); // prints "ping"
  // num_folders = 6;
  // num_stimuli = 40;
  // orientationq = "shoebox";
  // memorability = 75;
  // nameability = 20;
  // emotionality = 50;
  // unique = 1;
  // renamed = 1;

  console.log(arg); // prints "ping"
  num_folders = Number(arg.groups);
  num_stimuli = Number(arg.images);
  orientationq = arg.orientation;
  memorability = arg.checkedMemorable ? "n" : Number(arg.sliderA);
  nameability = arg.checkedMemorable ?  "n" : Number(arg.sliderB);
  emotionality = arg.checkedMemorable ? "n" : Number(arg.sliderC);
  unique = arg.checkedUnique ? 1 : 0;
  renamed = arg.checkedRenamed ? 1 : 0;

  let current_dir = path.join(__dirname, "./");
  image_directory = path.join(__dirname, "./objects/");

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
  console.log("Submitted Options", options.args);

  let records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
  });

  let backend_promise = new Promise((resolve, reject) => {
    main.ominds(
      records,
      df,
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
      // "/Users/alexgordienko/Desktop/",
      renamed
    );
    resolve("run backend")
  })
  backend_promise
  .then(value => { event.returnValue = ["success", value]; })
  .catch(err => { console.log(err) });
  

  // PythonShell.run(
  //   path.join(__dirname, "../scripts/backend.py"),
  //   options,
  //   function (err, results) {
  //     //send reply to frontend
  //     if (err) {
  //       event.returnValue = ["failure", err];
  //       // throw err;
  //     } else {
  //       console.log("results: %j", results);
  //       console.log("finished");
  //       event.returnValue = ["success", results];
  //     }
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

const total_stimuli = 1748;
const unique_stimuli = 1174;


// console.log("Run BACKEND Function")
// backend(
//   "/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/",
//   "/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/objects/",
//   3,
//   12,
//   "75",
//   "20",
//   "50",
//   "shoebox",
//   1,
//   "/Users/alexgordienko/Desktop/",
//   1
// );



