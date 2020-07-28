import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Switch, TextField, Checkbox, FormGroup, FormControl, Slider} from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Filter1RoundedIcon from '@material-ui/icons/Filter1Rounded';
import Filter2RoundedIcon from '@material-ui/icons/Filter2Rounded';
import Filter3RoundedIcon from '@material-ui/icons/Filter3Rounded';
import Filter4RoundedIcon from '@material-ui/icons/Filter4Rounded';
import Filter5RoundedIcon from '@material-ui/icons/Filter5Rounded';

// const { ipcRenderer } = window.require("electron");

function App() {
  const separatingDivStyle = {
    height: 30
  }
  return (
    <div style={{position: 'absolute', left: '36%', fontFamily: 'Arial'}}>
      <HeaderComponent/>
      <OneComponent/>
      <div style={separatingDivStyle}></div>
      <TwoComponent/>
      <div style={separatingDivStyle}></div>
      <ThreeComponent/>
      <div style={separatingDivStyle}></div>
      <FourComponent/>
      <div style={separatingDivStyle}></div>
      <FiveComponent/>
      <div style={separatingDivStyle}></div>
      <Submit/>
    </div>
  );
}

function HeaderComponent(){
  return(
    <div>
      <p style={{position:'relative', left: '37%', fontSize: 14, fontWeight: "bold"}}>Welcome to the</p>
      <p style={{position: 'relative', left: '26%', fontSize: 28, fontWeight: "bold"}}>OBJECT PROJECT</p>
    </div>
  );
  
}
function OneComponent() {
  return(
    <div>
      <Filter1RoundedIcon style={{position: 'absolute', left: '-30px'}}/>
      <p style={{fontWeight: "bold"}}>
        Please select your target directory.
      </p>
      <Button varient="contained" component="label" style={{position: 'relative', left: '43%', backgroundColor:'#3f50b5'}}>
        SELECT
        <input directory="" webkitdirectory="" type="file" style={{display: "none"}}   />
      </Button>
    </div>
  );
}
function TwoComponent() {
  return(
    <div>
      <Filter2RoundedIcon style={{position: 'absolute', left: '-30px'}}/>
      <p style={{fontWeight: "bold"}}>
      How many groups of images would you like? How many images in each group?
      </p>
      <form>
        <TextField label="# of Groups"/>
        <TextField label="# of Images per Group"/>
      </form>
    </div>
    
  );
}

function ThreeComponent() {
  return(
    
    <div>
      <Filter3RoundedIcon style={{position: 'absolute', left: '-30px'}}/>
      <p style={{fontWeight: "bold"}}>
        Please Select one from the following three orientation questions.
      </p>
      <FormControl>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox/>}
            label="None"
          />
          <FormControlLabel
            control={<Checkbox/>}
            label="Is the object larger or smaller than a shoebox?"
          />
          <FormControlLabel
            control={<Checkbox/>}
            label="Is the object natural or humanmade?"
          />
          <FormControlLabel
            control={<Checkbox/>}
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
  return(
    <div style={divStyle}>
      <Filter4RoundedIcon style={{position: 'absolute', left: '-30px'}}/>
      <p style={{fontWeight: "bold"}}>Please fill out the following information about your images. (Optional)</p>
      <p>a) How memorable should your objects be?</p>
      <Slider
        style={{position: 'relative', top:30}}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>b) How nameable should your objects be?</p>
      <Slider
        style={{position: 'relative', top:30}}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>c) How emotional should your objects be?</p>
      <Slider
        style={{position: 'relative', top:30}}
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
    </div>
    
  );
}

function FiveComponent() {
  return(
    <div>
      <Filter5RoundedIcon style={{position: 'absolute', left: '-30px'}}/>
      <p style={{fontWeight: "bold"}}>
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