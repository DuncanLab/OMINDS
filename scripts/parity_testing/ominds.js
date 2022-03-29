// the function that handles the heavy lifting and image sorting based on O-MINDS GUI input.

// helpful imports
const ObjectsToCsv = require('objects-to-csv');
const helpers = require("../../public/helpers");
// Load the full build.
var _ = require('lodash');
const fs = require("fs");

const total_stimuli = 1748;
const unique_stimuli = 1174;

// let records = parse(csvString, {
//   columns: true,
//   skip_empty_lines: true,
// });

function ominds(
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
              record["dist"] = helpers.helpers.eucDistance(
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
            record["dist"] = helpers.eucDistance(
              [emotionality],
              [record["scaled_emotional"]]
            );
          });
          break;
        case memorability === "n" && nameability != "n" && emotionality === "n":
          // just nameable
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance([nameability], [record["scaled_name"]]);
          });
          break;
        case memorability === "n" && nameability != "n" && emotionality != "n":
          // nameable and emotional
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance(
              [nameability, emotionality],
              [record["scaled_name"], record["scaled_emotional"]]
            );
          });
          break;
        case memorability != "n" && nameability === "n" && emotionality === "n":
          // just memorable
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance(
              [emotionality],
              [record["scaled_memory_hits"]]
            );
          });
          break;
        case memorability != "n" && nameability === "n" && emotionality != "n":
          // just memorable and emotional
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance(
              [memorability, emotionality],
              [record["scaled_memory_hits"], record["scaled_emotional"]]
            );
          });
          break;
        case memorability != "n" && nameability != "n" && emotionality === "n":
          // just memorable and nameable
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance(
              [memorability, nameability],
              [record["scaled_memory_hits"], record["scaled_name"]]
            );
          });
          break;
        case memorability != "n" && nameability != "n" && emotionality != "n":
          // all three
          records.forEach(function (record) {
            record["dist"] = helpers.eucDistance(
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
    await csv.toDisk(target_directory + 'objects.csv');
   
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
  

// export functions for use and unit testing
exports.ominds = ominds;