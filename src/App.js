import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { Switch, TextField, Checkbox, FormGroup } from "@material-ui/core";
import "fontsource-roboto";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormHelperText from "@material-ui/core/FormHelperText";
import Filter1RoundedIcon from "@material-ui/icons/Filter1Rounded";
import Filter2RoundedIcon from "@material-ui/icons/Filter2Rounded";
import Filter3RoundedIcon from "@material-ui/icons/Filter3Rounded";
import Filter4RoundedIcon from "@material-ui/icons/Filter4Rounded";
import Filter5RoundedIcon from "@material-ui/icons/Filter5Rounded";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Logo from './logos/ominds_2long.png'

const electron = window.require("electron");
const remote = electron.remote;
const { ipcRenderer } = window.require("electron");
const { BrowserWindow, dialog, Menu } = remote;

const StyledRadio = withStyles({
  root: {
    color: "#666666",
    "&$checked": {
      color: "#6200EE",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#ffffff",
    "&$checked": {
      color: "#6200EE",
    },
    "&$checked + $track": {
      backgroundColor: "#C39EF9",
    },
  },
  checked: {},
  track: {},
})(Switch);

const sliderMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 100,
    label: "100",
  },
];

// const sliderMarks = [
//   {
//     value: 0,
//     label: "N/A",
//   },
//   {
//     value: 10,
//     label: "0",
//   },
//   // {
//   //   value: 20,
//   //   label: "10",
//   // },
//   {
//     value: 28,
//     label: "20",
//   },
//   // {
//   //   value: 40,
//   //   label: "30",
//   // },
//   {
//     value: 46,
//     label: "40",
//   },
//   // {
//   //   value: 60,
//   //   label: "50",
//   // },
//   {
//     value: 64,
//     label: "60",
//   },
//   // {
//   //   value: 80,
//   //   label: "70",
//   // },
//   {
//     value: 82,
//     label: "80",
//   },
//   // {
//   //   value: 100,
//   //   label: "90",
//   // },
//   {
//     value: 100,
//     label: "100",
//   },
// ];

function App() {
  const [submitButton, setSubmitButton] = React.useState("Submit");

  const [dirSet, setDirSet] = React.useState(false);
  const [numGroups, setNumGroups] = React.useState("");
  const [numImages, setNumImages] = React.useState("");
  const [orientation, setOrientation] = React.useState("n");
  const [checkedMemorable, setMemorableUnique] = React.useState(false);
  const [checkedNameable, setNameableUnique] = React.useState(false);
  const [checkedEmotional, setEmotionalUnique] = React.useState(false);
  const [sliderA, setSliderA] = React.useState(50);
  const [sliderB, setSliderB] = React.useState(50);
  const [sliderC, setSliderC] = React.useState(50);
  const [checkedUnique, setCheckedUnique] = React.useState(false);
  const [checkedRenamed, setCheckedRenamed] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openErrorDialgue, setOpenErrorDialogue] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("Error!");
  const [errorMessageDialogue, setErrorMessageDialogue] =
    React.useState("Error!");

  const handleClickError = () => {
    setOpenError(true);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };

  const handleCheckedUniqueChange = (event) => {
    setCheckedUnique(event.target.checked);
  };

  const handleCheckedMemorableChange = (event) => {
    setMemorableUnique(event.target.checked);
  };
  const handleCheckedNameableChange = (event) => {
    setNameableUnique(event.target.checked);
  };
  const handleCheckedEmotionalChange = (event) => {
    setEmotionalUnique(event.target.checked);
  };

  const handleCheckedRenamedChange = (event) => {
    setCheckedRenamed(event.target.checked);
  };

  const handleNumGroupsChange = (event) => {
    setNumGroups(event.target.value);
  };
  const handleNumImagesChange = (event) => {
    setNumImages(event.target.value);
  };
  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };
  const handleSliderA = (event, newValue) => {
    setSliderA(newValue);
  };
  const handleSliderB = (event, newValue) => {
    setSliderB(newValue);
  };
  const handleSliderC = (event, newValue) => {
    setSliderC(newValue);
  };

  // submit dialogue
  const handleClickOpen = () => {
    setOpen(true);
    // reset form
    // setDirSet(false);
    // setNumGroups("");
    // setNumImages("");
    // setOrientation("n");
    // setSliderA("50");
    // setSliderB("50");
    // setSliderC("50");
    // setCheckedUnique(false);
    // setCheckedRenamed(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenError = () => {
    setOpenErrorDialogue(true);
    // reset form
    // setDirSet(false);
    // setNumGroups("");
    // setNumImages("");
    // setOrientation("n");
    // setSliderA("50");
    // setSliderB("50");
    // setSliderC("50");
    // setCheckedUnique(false);
    // setCheckedRenamed(true);
  };
  const handleCloseErrorDialogue = () => {
    setOpenErrorDialogue(false);
  };

  const separatingDivStyle = {
    height: 30,
  };
  const hiddenFileInput = React.useRef(null);

  const handleDirSelect = (event) => {
    // wait for the directory open window to open. This needs fixing,
    // need to send back confirmation of dir selection
    // setTimeout(function () {
    //   setDirSet(true);
    // }, 2000);
    console.log("Click");
    let dirSelected = ipcRenderer.sendSync("select-dirs", {

    })
    console.log("directory selection response", dirSelected);
      if (dirSelected[0] === "success") {
        setDirSet(true);
      } else {
        setDirSet(false);
      }
    // window.postMessage({
    //   type: "select-dirs",
    // });
  };

  const hitSubmit = () => {
    setSubmitButton("Building...");
    if (Number(numGroups) * Number(numImages) > 1748) {
      setErrorMessage("You have requested too many stimuli, please try again.");
      setOpenError(true);
      setSubmitButton("Submit");
    } else {
      console.log("Submit!", {
        groups: numGroups,
        images: numImages,
        orientation: orientation,
        checkedMemorable: checkedMemorable,
        checkedNameable: checkedNameable,
        checkedEmotional: checkedEmotional,
        sliderA: sliderA,
        sliderB: sliderB,
        sliderC: sliderC,
        checkedUnique: checkedUnique,
        checkedRenamed: checkedRenamed,
      });
      let response = ipcRenderer.sendSync("submitted", {
        groups: numGroups,
        images: numImages,
        orientation: orientation,
        checkedMemorable: checkedMemorable,
        checkedNameable: checkedNameable,
        checkedEmotional: checkedEmotional,
        sliderA: sliderA,
        sliderB: sliderB,
        sliderC: sliderC,
        checkedUnique: checkedUnique,
        checkedRenamed: checkedRenamed,
        submitted: "submitted",
      });
      console.log("response", response);
      if (response[0] === "success") {
        handleClickOpen();
        setSubmitButton("Submit");
      } else {
        handleClickOpenError();
        setErrorMessageDialogue(response[1].message);
        setSubmitButton("Submit");
      }

      // window.postMessage({
      //   groups: numGroups,
      //   images: numImages,
      //   orientation: orientation,
      //   checkedMemorable: checkedMemorable,
      //   checkedNameable: checkedNameable,
      //   checkedEmotional: checkedEmotional,
      //   sliderA: sliderA,
      //   sliderB: sliderB,
      //   sliderC: sliderC,
      //   checkedUnique: checkedUnique,
      //   checkedRenamed: checkedRenamed,
      //   submitted: "submitted",
      // });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        {/* <HeaderComponent/> */}

        <div style={{ textAlign: "center", marginTop: 60, marginBottom: 0 }}>
          <Typography
            variant="overline"
            style={{ position: "relative", fontSize: 15, opacity: 0.6 }}
          >
            Welcome to
          </Typography>
          <Typography component="div">
            <Box
              fontWeight="fontWeightLight"
              style={{ position: "relative", fontSize: 60 }}
            >
              <img src={Logo} alt="" width="400" />
            </Box>
          </Typography>
        </div>

        {/* Question One */}
        <Typography variant="body1" gutterBottom style={{ marginBottom: 35 }}>
          1. Please select your target directory.
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!dirSet ? (
            <Button
              onClick={handleDirSelect}
              varient="contained"
              disableElevation
              style={{
                backgroundColor: "#6200EE",
                color: "#ffffff",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              SELECT
            </Button>
          ) : (
            <Button
              onClick={handleDirSelect}
              varient="contained"
              disableElevation
              style={{
                backgroundColor: "#6200EE",
                color: "#ffffff",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              Selected!
            </Button>
          )}
        </div>
        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: 35, marginTop: 45 }}
        >
          2. How many groups of images would you like? How many images in each
          group?
        </Typography>
        <form
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <TextField
            type="number"
            value={numGroups}
            onChange={handleNumGroupsChange}
            label="# of Groups"
            variant="outlined"
          />
          <TextField
            type="number"
            value={numImages}
            onChange={handleNumImagesChange}
            label="# of Images per Group"
            variant="outlined"
          />
        </form>

        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: 35, marginTop: 45 }}
        >
          3. Please Select one from the following three orientation questions.
        </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="orientation"
              name="orientation1"
              value={orientation}
              onChange={handleOrientationChange}
            >
              <FormControlLabel
                value="n"
                control={<StyledRadio />}
                label="None"
              />
              <FormControlLabel
                value="shoebox"
                control={<StyledRadio />}
                label="Is the object larger or smaller than a shoebox?"
              />
              <FormControlLabel
                value="humanmade"
                control={<StyledRadio />}
                label="Is the object natural or humanmade?"
              />
              <FormControlLabel
                value="outdoors"
                control={<StyledRadio />}
                label="Is the object typically found indoors or outdoors?"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: 35, marginTop: 45 }}
        >
          4. Please fill out the following information about your images.
          (Optional)
        </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 400 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 30,
                marginTop: 5,
              }}
            >
              <Typography
                variant="body2"
                gutterBottom
                style={{ marginTop: 10 }}
              >
                a) How memorable should your objects be?
              </Typography>

              <FormControlLabel
                style={{}}
                control={
                  <PurpleSwitch
                    checked={checkedMemorable}
                    onChange={handleCheckedMemorableChange}
                    name="checkedMemorable"
                  />
                }
                label="N/A"
              />
            </div>
            {!checkedMemorable ? (
              <Slider
                value={sliderA}
                onChange={handleSliderA}
                style={{ color: "#6200EE" }}
                defaultValue={50}
                // step={10}
                marks={sliderMarks}
                valueLabelDisplay="on"
              />
            ) : (
              <Slider
                value={sliderA}
                onChange={handleSliderA}
                defaultValue={50}
                marks={sliderMarks}
                disabled
              />
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 30,
                marginTop: 5,
              }}
            >
              <Typography
                variant="body2"
                gutterBottom
                style={{ marginTop: 10 }}
              >
                b) How nameable should your objects be?
              </Typography>

              <FormControlLabel
                style={{}}
                control={
                  <PurpleSwitch
                    checked={checkedNameable}
                    onChange={handleCheckedNameableChange}
                    name="checkedNameable"
                  />
                }
                label="N/A"
              />
            </div>
            {!checkedNameable ? (
              <Slider
                value={sliderB}
                onChange={handleSliderB}
                style={{ color: "#6200EE" }}
                defaultValue={50}
                // step={10}
                marks={sliderMarks}
                valueLabelDisplay="on"
              />
            ) : (
              <Slider
                value={sliderB}
                onChange={handleSliderB}
                defaultValue={50}
                marks={sliderMarks}
                disabled
              />
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 30,
                marginTop: 5,
              }}
            >
              <Typography
                variant="body2"
                gutterBottom
                style={{ marginTop: 10 }}
              >
                c) How emotional should your objects be?
              </Typography>

              <FormControlLabel
                style={{}}
                control={
                  <PurpleSwitch
                    checked={checkedEmotional}
                    onChange={handleCheckedEmotionalChange}
                    name="checkedEmotional"
                  />
                }
                label="N/A"
              />
            </div>
            {!checkedEmotional ? (
              <Slider
                value={sliderC}
                onChange={handleSliderC}
                style={{ color: "#6200EE" }}
                defaultValue={50}
                // step={10}
                marks={sliderMarks}
                valueLabelDisplay="on"
              />
            ) : (
              <Slider
                value={sliderC}
                onChange={handleSliderC}
                defaultValue={50}
                marks={sliderMarks}
                disabled
              />
            )}
          </div>
        </div>

        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: 35, marginTop: 45 }}
        >
          5. Would you like the stimuli to be unique from one another? (eg. only
          one airplane)
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormGroup>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">No</Typography>
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={
                  <PurpleSwitch
                    checked={checkedUnique}
                    onChange={handleCheckedUniqueChange}
                    name="checkedUnique"
                  />
                }
                label=""
              />
              <Typography variant="body1">Yes</Typography>
            </div>
          </FormGroup>
        </div>

        <Typography
          variant="body1"
          gutterBottom
          style={{ marginBottom: 35, marginTop: 45 }}
        >
          6. Would you like the stimuli to be renamed automatically? (eg. 1.jpg,
          2.jpg, ...)
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormGroup>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">No</Typography>
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={
                  <PurpleSwitch
                    checked={checkedRenamed}
                    onChange={handleCheckedRenamedChange}
                    name="checkedRenamed"
                  />
                }
                label=""
              />
              <Typography variant="body1">Yes</Typography>
            </div>
          </FormGroup>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 35,
            marginTop: 45,
          }}
        >
          {dirSet && numGroups && numImages ? (
            <Button
              onClick={hitSubmit}
              // onClick={handleClickError}
              varient="contained"
              disableElevation
              style={{
                backgroundColor: "#6200EE",
                color: "#ffffff",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              {submitButton}
            </Button>
          ) : (
            <Button
              style={{ paddingLeft: 20, paddingRight: 20 }}
              variant="contained"
              disabled
            >
              Submit
            </Button>
          )}
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={openError}
          autoHideDuration={6000}
          onClose={handleCloseError}
          message={errorMessage}
          severity="error"
          action={
            <React.Fragment style={{ backgroundColor: "teal" }}>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseError}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Image Set Built!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check the directory that you selected, your images should
              be populated there.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              style={{ color: "#6200EE" }}
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openErrorDialgue}
          onClose={handleCloseErrorDialogue}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Error!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Something went wrong and your image set could not be built. Please
              verify the parameters you entered and try again.
              <br />
              <br />
              <b>Debugging:</b>
              <br />
              <p style={{ overflowWrap: "break-word" }}>
                {errorMessageDialogue}
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseErrorDialogue}
              style={{ color: "#6200EE" }}
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
