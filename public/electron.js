const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const url = require("url");
const path = require("path");
const { PythonShell } = require("python-shell");
const isDev = require("electron-is-dev");
var DataFrame = require("dataframe-js").DataFrame;

const fs = require("fs");
const assert = require("assert");
const parse = require("csv-parse/lib/es5/sync");

const ObjectsToCsv = require('objects-to-csv');

// Load the full build.
var _ = require('lodash');

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

  

  let backend_promise = new Promise((resolve, reject) => {
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

let records = parse(csvString, {
  columns: true,
  skip_empty_lines: true,
});

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

function eucDistance(a, b) {
  // ensure type of both arrays
  // console.log("input array a: ", a)
  // console.log("input array b: ", b)
  let array1 = a.map(Number);
  let array2 = b.map(Number);
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

  // console.log("Dataframe", df);
  // let folder_list =  [...Array(num_folders).keys()];
  let folder_list =  create2DArray(num_folders)

function create2DArray(len){
  let temp = []
  for (let i = 0; i < Number(len); i++) {
    temp.push([])
  }
  return temp
}
  for (let i = 0; i < Number(num_folders); i++) {
    // add a dataframe to folder_list
    // folder_list.append([]);
  }

  let step_one_promise = new Promise((resolve, reject) => {
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

    resolve("step one complete")
  }
  );

  function step_two(){
      

  // STEP 2: UNIQUENESS TRIMMING

  // if unique was selected, only keep the items with the best score for each modal name
  if (unique == 1) {
    // only 1174 such items
    if (num_folders * num_stimuli > unique_stimuli) {
      console.log("ERR! Not enough unique stimuli to satisfy request.");
    } else {
      let nonunique = records.filter(obj => {
        return obj.unique === "0"
      })
      let unique = records.filter(obj => {
        return obj.unique === "1"
      })
      // console.log(nonunique.length)

      // grab the best item for each unique modal response

    const modalresponses = [];
    const map = new Map();
    for (const item of nonunique) {
        if(!map.has(item.modal_response)){
            map.set(item.modal_response, true);    // set any value to Map
            modalresponses.push(item);
        }
    }

    // Combine arrays back into records and sort again. 
    // console.log(unique.length, modalresponses.length, unique.length+modalresponses.length)
    records = unique.concat(modalresponses)
    records.sort(function (a, b) {
      return a.dist - b.dist;
    });
    // console.log(records.length)
    // console.log(map)
    // console.log(modalresponses.length)
    }
    
    
  }
  }

  let df_list = []


  function step_three() {
// STEP 3: ORIENTATION Q SPLITTING

  // If any of the orientation questions are selected, use the column to split the data.


  // filter into correct list
  if(orientationq === 'shoebox'){
    // split by shoebox
    df_list[0] = records.filter(obj => {
      return obj.shoebox_response === "larger than a shoebox"
    })
    df_list[1] = records.filter(obj => {
      return obj.shoebox_response === "smaller than a shoebox"
    })
  } else if(orientationq === 'humanmade') {
    // split by humanmade
    df_list[0] = records.filter(obj => {
      return obj.humanmade_response === "natural"
    })
    df_list[1] = records.filter(obj => {
      return obj.humanmade_response === "human-made"
    })
  } else if(orientationq === 'outdoors') {
    // split by outdoors
    df_list[0] = records.filter(obj => {
      return obj.outdoors_response === "indoors"
    })
    df_list[1] = records.filter(obj => {
      return obj.outdoors_response === "outdoors"
    })
  } else {
    // do not split
    df_list = [df]
  }
// console.log(df_list.length)


  }
  // if the items do not fit cleanly in the folders, store them
let leftovers = []
let shuffled_list = []

function step_four() {
  for (let list of df_list) {

    // console.log("list", list.length)
    
    // STEP 4: CUT TO PREFERRED SIZE
    let cutoff = Math.ceil(num_stimuli*num_folders/df_list.length)
    // console.log("cutoff", cutoff)
  
    let cutlist = list.slice(0, (cutoff))
    // console.log("cutlist", cutlist.length)
  
    // STEP 5: FOLDER ALLOCATION
  
    let folder_assignment = [...Array(num_folders).keys()]
    
    let range = Math.ceil(num_stimuli/df_list.length)
    
    // reset shuffled list
    let shuffled_list = []
    for (let i = 0; i < range; i++){
      shuffled_list.push(_.sampleSize(folder_assignment, num_folders))
    }
    // console.log(shuffled_list)
  
    // if there's no leftovers after dividing into folders, then it's no problem
    for(let a = 0; a < cutoff; a ++){
      // console.log("a", a)
      if(a < Math.floor((cutlist.length/num_folders))*num_folders){
        let stim_row = list[a]
        let targ_folder = _.flattenDeep(shuffled_list)[a]
        console.log("target folder", targ_folder)
        console.log(" folder list", folder_list.length)
        folder_list[targ_folder].push(stim_row)
      } else {
        leftovers.push(list[a])
      }
    }
  }
}

function step_six(){
  // console.log("shuffled_list", shuffled_list)
// console.log("folder_list", folder_list.length)
// console.log("leftovers", leftovers.length)

// STEP 6: DOUBLE CHECK

// If there are an odd number of requested stimuli, but an even number of stimuli in leftovers, cut the worst-fitting item.

if (leftovers.length !== 0 ){
  // leftovers are shuffled using Fisher Yates shuffle
  leftovers = _.shuffle(leftovers)

  for(let b = 0; b < num_folders; b++){
    // console.log("folder list b", folder_list[b])
    // folder_list[b] = folder_list[b].push(leftovers[b])
    folder_list[b].push(leftovers[b])
    // console.log("leftovers b", leftovers[b])
  }
}

// console.log("After leftovers folder_list", folder_list.length)
}

function step_seven(){
// STEP 7: FOLDERS

// create folders

for (let c = 0; c < num_folders; c++){
  // folder_list[c] = _.shuffle(folder_list[c])
  let folder = _.shuffle(folder_list[c])
  // console.log("folder final", folder)

  let folder_number = String(c + 1) // begin indexing at 1

  let folderpath = target_directory + folder_number + "/"
  console.log(folderpath)

  // create folder with checking if dir already exists
  if (!fs.existsSync(folderpath)) {
    fs.mkdir(folderpath, (err) => {
      if (err) {
          return console.error(err);
      }
      console.log('Directory created successfully!');
  });
  }

  // loop through all files requested to assign names and copy.
  
  for (let d = 0; d < folder.length; d++){
    // check to see if file is to be renamed. else use stimulus
    if (newname === 1){
      let assignedName = folder_number + "_" + String(d + 1) + ".jpg"

      // save and add to object
      folder[d].assignedName = assignedName

      fs.copyFile(image_directory + folder[d].stimulus, folderpath + assignedName, (err) => {
        if (err) {
            return console.error(err);
        }
        // console.log('Image moved successfully!');
    })
    } else {
      let assignedName = folder[d].stimulus

      // save and add to object
      folder[d].assignedName = assignedName

      fs.copyFile(image_directory + folder[d].stimulus, folderpath + assignedName, (err) => {
        if (err) {
            return console.error(err);
        }
        // console.log('Image moved successfully!');
    })
    }
  }
  
}
// console.log("folder list final", folder_list)

}

async function step_eight(){
  // Create an output CSV with chosen images.

  // use flattened folder_list and save to chosen directory

  const csv = new ObjectsToCsv(folder_list.flat());
  // console.log("flat folder", folder_list.flat())
  // Save to file:
  await csv.toDisk(dirSelected + 'objects.csv');
 
  // Return the CSV file as string:
  // console.log("CSV", await csv.toString());
}

// run promise chain for backend function in scope

step_one_promise
  .then(step_two)
  .then(step_three)
  .then(step_four)
  .then(step_six)
  .then(step_seven)
  .then(step_eight)
  .catch(err => { console.log(err) });



}


