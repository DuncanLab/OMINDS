import React from 'react';
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

function App() {
  return (
    <div>
      <HeaderComponent/>
      <OneComponent/>
      <TwoComponent/>
      <ThreeComponent/>
      <FourComponent/>
      <FiveComponent/>
    </div>

    
  );
}

function HeaderComponent(){
  return(
    <div>
      <p>Welcome to the</p>
      <p>Object Project</p>
    </div>
  );
  
}
function OneComponent() {
  return(
    <div>
      <Filter1RoundedIcon/>
      <Filter2RoundedIcon/>
      <Filter3RoundedIcon/>
      <Filter4RoundedIcon/>
      <Filter5RoundedIcon/>
      <p>
        Please select your target directory.
      </p>
      <Button>
        SELECT
      </Button>
    </div>
  );
}
function TwoComponent() {
  return(
    <div>
      <p>
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
      <p>
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
  return(
    <div>
      <p>Please fill out the following information about your images. (Optional)</p>
      <p>a) How memorable should your objects be?</p>
      <Slider
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>b) How nameable should your objects be?</p>
      <Slider
        defaultValue={50}
        step={1}
        valueLabelDisplay="on"
      />
      <p>c) How emotional should your objects be?</p>
      <Slider
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
      <p>
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
export default App;