const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const { PythonShell } = require("python-shell");
const isDev = require("electron-is-dev");
var DataFrame = require("dataframe-js").DataFrame;

const fs = require("fs");
const assert = require("assert");
const parse = require("csv-parse/lib/es5/sync");

// const dfd = require("danfojs-node");

// load in DF when app loads
let pathToCSV = path.join(__dirname, "../scripts/full_dt_pf.csv");
let df;

let csvString = fs.readFileSync(
  path.resolve(__dirname, "../scripts/full_dt_pf.csv"),
  "utf-8"
);
// console.log(csvString);

// dfd
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
  memorability = arg.checkedMemorable ? Number(arg.sliderA) : "n";
  nameability = arg.checkedMemorable ? Number(arg.sliderB) : "n";
  emotionality = arg.checkedMemorable ? Number(arg.sliderC) : "n";
  unique = arg.checkedUnique ? 1 : 0;
  renamed = arg.checkedRenamed ? 1 : 0;

  let current_dir = path.join(__dirname, "../scripts/");
  image_directory = path.join(__dirname, "../scripts/objects/");

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

const records = parse(csvString, {
  columns: true,
  skip_empty_lines: true,
});

backend(
  "/Users/alexgordienko/Desktop/AG/Academics/DuncanLab/ObjectProjectApp/scripts/",
  "/Users/alexgordienko/Desktop/AG/Academics/DuncanLab/ObjectProjectApp/scripts/objects/",
  2,
  2,
  "n",
  "n",
  "n",
  "n",
  0,
  "/Users/alexgordienko/Desktop/temp/",
  1
);

function eucDistance(a, b) {
  // ensure type of both arrays
  let array1 = a.split(",").map(Number);
  let array2 = b.split(",").map(Number);
  return (
    array1
      .map((x, i) => Math.abs(x - array2[i]) ** 2) // square the difference
      .reduce((sum, now) => sum + now) ** // sum
    (1 / 2)
  );
}

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

  console.log("Dataframe", df);
  let folder_list = [];

  for (let i = 0; i < Number(num_folders); i++) {
    // add a dataframe to folder_list
    // folder_list.append([]);
  }

  // STEP 1: DIFFERENCE SCORES
  // find how far the score is compared to the ideal scores given
  if (memorability === "n") {
    if (nameability === "n") {
      if (emotionality === "n") {
        // for each entry in 'records', add 'dist' and set a random number for each row.
        records.forEach(function (record) {
          record["dist"] = Math.random();
        });
      } else {
        // just emotional
        records.forEach(function (record) {
          record["dist"] = eucDistance(
            [emotionality],
            [record["scaled_emotional"]]
          );
        });
      }
    }
  }

  switch (true) {
    case memorability === "n" && nameability === "n" && emotionality === "n":
      // for each entry in 'records', add 'dist' and set a random number for each row.
      records.forEach(function (record) {
        record["dist"] = Math.random();
      });
      break;
    case memorability === "n" && nameability === "n" && emotionality != "n":
      // just emotional
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [emotionality],
          [record["scaled_emotional"]]
        );
      });
      break;
    case memorability === "n" && nameability != "n" && emotionality === "n":
      // just nameable
      records.forEach(function (record) {
        record["dist"] = eucDistance([nameability], [record["scaled_name"]]);
      });
      break;
    case memorability === "n" && nameability != "n" && emotionality != "n":
      // nameable and emotional
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [nameability, emotionality],
          [record["scaled_name"], record["scaled_emotional"]]
        );
      });
      break;
    case memorability != "n" && nameability === "n" && emotionality === "n":
      // just memorable
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [emotionality],
          [record["scaled_memory_hits"]]
        );
      });
      break;
    case memorability != "n" && nameability === "n" && emotionality != "n":
      // just memorable and emotional
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [memorability, emotionality],
          [record["scaled_memory_hits"], record["scaled_emotional"]]
        );
      });
      break;
    case memorability != "n" && nameability != "n" && emotionality === "n":
      // just memorable and nameable
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [memorability, nameability],
          [record["scaled_memory_hits"], record["scaled_name"]]
        );
      });
      break;
    case memorability != "n" && nameability != "n" && emotionality != "n":
      // all three
      records.forEach(function (record) {
        record["dist"] = eucDistance(
          [memorability, nameability, emotionality],
          [
            record["scaled_memory_hits"],
            record["scaled_name"],
            record["scaled_emotional"],
          ]
        );
      });
      break;
  }

  // sort by distance scores
  records.sort(function (a, b) {
    return a.dist - b.dist;
  });

  // STEP 2: UNIQUENESS TRIMMING

  // if unique was selected, only keep the items with the best score for each modal name
  if (unique == "y") {
    // only 1174 such items
    if (num_folders * num_stimuli > unique_stimuli) {
      console.log("ERR! Not enough unique stimuli to satisfy request.");
    } else {
    }
  }
}
