import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Switch, TextField, Checkbox, FormGroup } from '@material-ui/core';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Filter1RoundedIcon from '@material-ui/icons/Filter1Rounded';
import Filter2RoundedIcon from '@material-ui/icons/Filter2Rounded';
import Filter3RoundedIcon from '@material-ui/icons/Filter3Rounded';
import Filter4RoundedIcon from '@material-ui/icons/Filter4Rounded';
import Filter5RoundedIcon from '@material-ui/icons/Filter5Rounded';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledRadio = withStyles({
  root: {
    color: "#666666",
    '&$checked': {
      color: "#6200EE",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#ffffff",
    '&$checked': {
      color: "#6200EE",
    },
    '&$checked + $track': {
      backgroundColor: "#C39EF9",
    },
  },
  checked: {},
  track: {},
})(Switch);

const sliderMarks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 100,
    label: '100'
  }
];

function App() {

  const [dirSet, setDirSet] = React.useState(false);
  const [numGroups, setNumGroups] = React.useState('');
  const [numImages, setNumImages] = React.useState('');
  const [orientation, setOrientation] = React.useState('n');
  const [sliderA, setSliderA] = React.useState(50);
  const [sliderB, setSliderB] = React.useState(50);
  const [sliderC, setSliderC] = React.useState(50);
  const [checkedUnique, setCheckedUnique] = React.useState(false);
  const [checkedRenamed, setCheckedRenamed] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const handleCheckedUniqueChange = (event) => {
    setCheckedUnique(event.target.checked);
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
    setDirSet(false)
    setNumGroups('')
    setNumImages('')
    setOrientation('n')
    setSliderA('50')
    setSliderB('50')
    setSliderC('50')
    setCheckedUnique(false)
    setCheckedRenamed(true)
  };
  const handleClose = () => {
    setOpen(false);
  };


  const separatingDivStyle = {
    height: 30
  }
  const hiddenFileInput = React.useRef(null);

  const handleDirSelect = event => {
    // wait for the directory open window to open. This needs fixing, 
    // need to send back confirmation of dir selection
    setTimeout(function () { setDirSet(true); }, 2000)
    console.log("Click")
    window.postMessage({
      type: 'select-dirs'
    })
  };

  const hitSubmit = event => {
    console.log("Submit!", {
      "groups": numGroups,
      "images": numImages,
      "orientation": orientation,
      "sliderA": sliderA,
      "sliderB": sliderB,
      "sliderC": sliderC,
      "checkedUnique": checkedUnique,
      "checkedRenamed": checkedRenamed
    })
    window.postMessage({
      groups: numGroups,
      images: numImages,
      orientation: orientation,
      sliderA: sliderA,
      sliderB: sliderB,
      sliderC: sliderC,
      checkedUnique: checkedUnique,
      checkedRenamed: checkedRenamed,
      submitted: 'submitted'
    })
    handleClickOpen()
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>


        {/* <HeaderComponent/> */}

        <div style={{ textAlign: "center", marginTop: 60, marginBottom: 60 }}>
          <Typography variant="overline" style={{ position: 'relative', fontSize: 15, opacity: 0.6 }}>Welcome to the</Typography>
          <Typography component="div">
            <Box fontWeight="fontWeightLight" style={{ position: 'relative', fontSize: 60 }}>Object Project</Box>
          </Typography>
        </div>

        {/* Question One */}
        <Typography variant="body1" gutterBottom style={{ marginBottom: 35 }}>
          1. Please select your target directory.
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!dirSet
            ? <Button onClick={handleDirSelect} varient="contained" disableElevation style={{ backgroundColor: '#6200EE', color: '#ffffff', paddingLeft: 20, paddingRight: 20 }}>
              SELECT
          </Button>
            : <Button onClick={handleDirSelect} varient="contained" disableElevation style={{ backgroundColor: '#6200EE', color: '#ffffff', paddingLeft: 20, paddingRight: 20 }}>
              Selected!
          </Button>
          }

        </div>
        <Typography variant="body1" gutterBottom style={{ marginBottom: 35, marginTop: 45 }}>
          2. How many groups of images would you like? How many images in each group?
        </Typography>
        <form style={{ width: "100%", display: "flex", justifyContent: "space-evenly" }}>
          <TextField type="number" value={numGroups} onChange={handleNumGroupsChange} label="# of Groups" variant="outlined" />
          <TextField type="number" value={numImages} onChange={handleNumImagesChange} label="# of Images per Group" variant="outlined" />
        </form>

        <Typography variant="body1" gutterBottom style={{ marginBottom: 35, marginTop: 45 }}>
          3. Please Select one from the following three orientation questions.
          </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormControl component="fieldset">
            <RadioGroup aria-label="orientation" name="orientation1" value={orientation} onChange={handleOrientationChange}>
              <FormControlLabel value="n" control={<StyledRadio />} label="None" />
              <FormControlLabel value="shoebox" control={<StyledRadio />} label="Is the object larger or smaller than a shoebox?" />
              <FormControlLabel value="humanmade" control={<StyledRadio />} label="Is the object natural or humanmade?" />
              <FormControlLabel value="outdoors" control={<StyledRadio />} label="Is the object typically found indoors or outdoors?" />
            </RadioGroup>
          </FormControl>
        </div>

        <Typography variant="body1" gutterBottom style={{ marginBottom: 35, marginTop: 45 }}>
          4. Please fill out the following information about your images. (Optional)
          </Typography>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 400 }}>
            <Typography variant="body2" gutterBottom style={{ marginBottom: 40, marginTop: 5 }}>
              a) How memorable should your objects be?
            </Typography>
            <Slider
              value={sliderA}
              onChange={handleSliderA}
              style={{ color: "#6200EE" }}
              defaultValue={50}
              step={10}
              marks={sliderMarks}
              valueLabelDisplay="on"
            />
            <Typography variant="body2" gutterBottom style={{ marginBottom: 40, marginTop: 5 }}>
              b) How nameable should your objects be?
            </Typography>
            <Slider
              value={sliderB}
              onChange={handleSliderB}
              style={{ color: "#6200EE" }}
              defaultValue={50}
              step={10}
              marks={sliderMarks}
              valueLabelDisplay="on"
            />
            <Typography variant="body2" gutterBottom style={{ marginBottom: 40, marginTop: 5 }}>
              c) How emotional should your objects be?
            </Typography>
            <Slider
              value={sliderC}
              onChange={handleSliderC}
              style={{ color: "#6200EE" }}
              defaultValue={50}
              step={10}
              marks={sliderMarks}
              valueLabelDisplay="on"
            />

          </div>
        </div>

        <Typography variant="body1" gutterBottom style={{ marginBottom: 35, marginTop: 45 }}>
          5. Would you like the stimuli to be unique from one another? (eg. only one airplane)
          </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormGroup>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">
                No
            </Typography>
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={<PurpleSwitch checked={checkedUnique} onChange={handleCheckedUniqueChange} name="checkedUnique" />}
                label=""
              />
              <Typography variant="body1">
                Yes
            </Typography>
            </div>
          </FormGroup>
        </div>

        <Typography variant="body1" gutterBottom style={{ marginBottom: 35, marginTop: 45 }}>
          6. Would you like the stimuli to be renamed automatically? (eg. A0.jpg, A1.jpg, ...)
          </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FormGroup>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1">
                No
            </Typography>
              <FormControlLabel
                style={{ marginLeft: 20 }}
                control={<PurpleSwitch checked={checkedRenamed} onChange={handleCheckedRenamedChange} name="checkedRenamed" />}
                label=""
              />
              <Typography variant="body1">
                Yes
            </Typography>
            </div>
          </FormGroup>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 35, marginTop: 45 }}>
          {(dirSet && numGroups && numImages)
            ? <Button onClick={hitSubmit} varient="contained" disableElevation style={{ backgroundColor: '#6200EE', color: '#ffffff', paddingLeft: 20, paddingRight: 20 }}>
              Submit
          </Button>
            : <Button style={{ paddingLeft: 20, paddingRight: 20 }} variant="contained" disabled>
              Submit
              </Button>
          }
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Image Set Built!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please check the directory that you selected, your images should be populated there.
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{color: "#6200EE"}} autoFocus>
              Close
          </Button>
          </DialogActions>
        </Dialog>
    </div>
    </div >
  );
}

function HeaderComponent() {
  return (
    <div>
      <Typography variant="overline" style={{ position: 'relative', left: '37%', fontSize: 14, fontWeight: "bold" }}>Welcome to the</Typography>
      <Typography variant="h2" style={{ position: 'relative', left: '26%', fontWeight: 200 }}>Object Project</Typography>
    </div>
  );

}
function OneComponent() {
  return (
    <div>
      <Filter1RoundedIcon style={{ position: 'absolute', left: '-30px' }} />
      <p style={{ fontWeight: "bold" }}>
        Please select your target directory.
      </p>
      <Button varient="contained" component="label" style={{ position: 'relative', left: '43%', backgroundColor: '#3f50b5' }}>
        SELECT
        <input directory="" webkitdirectory="" type="file" style={{ display: "none" }} />
      </Button>
    </div>
  );
}
function TwoComponent() {
  return (
    <div>
      <Filter2RoundedIcon style={{ position: 'absolute', left: '-30px' }} />
      <p style={{ fontWeight: "bold" }}>
        How many groups of images would you like? How many images in each group?
      </p>
      <form>
        <TextField label="# of Groups" />
        <TextField label="# of Images per Group" />
      </form>
    </div>

  );
}

function ThreeComponent() {
  return (

    <div>
      <Filter3RoundedIcon style={{ position: 'absolute', left: '-30px' }} />
      <p style={{ fontWeight: "bold" }}>
        Please Select one from the following three orientation questions.
      </p>
      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="None"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Is the object larger or smaller than a shoebox?"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Is the object natural or humanmade?"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Is the object typically found indoors or outdoors?"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}

function FourComponent() {
  const divStyle = {
    width: 360,
  }
  return (
    <div style={divStyle}>
      <Filter4RoundedIcon style={{ position: 'absolute', left: '-30px' }} />
      <p style={{ fontWeight: "bold" }}>Please fill out the following information about your images. (Optional)</p>
      <p>a) How memorable should your objects be?</p>
      <Slider
        style={{ position: 'relative', top: 30 }}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>b) How nameable should your objects be?</p>
      <Slider
        style={{ position: 'relative', top: 30 }}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>c) How emotional should your objects be?</p>
      <Slider
        style={{ position: 'relative', top: 30 }}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
    </div>

  );
}

function FiveComponent() {
  return (
    <div>
      <Filter5RoundedIcon style={{ position: 'absolute', left: '-30px' }} />
      <p style={{ fontWeight: "bold" }}>
        Would you like the stimuli to be unique from one another? (i.e. only one airplane)
      </p>
      <span>No</span>
      <Switch>
        Hi
      </Switch>
      <span>Yes</span>
    </div>
  );
}

function Submit() {
  return (<Button variant="contained" onClick={() => {
    let ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('submitForm', "test");
  }
  }>Submit</Button>);
}

export default App;