// JS port of backend.py for O-Minds

// import DataFrame from "dataframe-js";
// const path = require("path");

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

  let pathToCSV = path.join(__dirname, "./full_dt_pf.csv");
  let df = new DataFrame.fromCSV(pathToCSV);
  console.log(df);
  let folder_list = [];

  for (let i = 0; i < Number(num_folders); i++) {
    // add a dataframe to folder_list
    folder_list.append(new DataFrame());
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

backend(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0);
