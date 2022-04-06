#!/bin/bash
# Script written to rigously test original python script's output to provide something to test against for the js version.

# TEST 1: does number of stimuli matter?

current_dir=/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/parity_testing/python_output/num_stimuli
image_directory=/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/objects/
num_folders=1
# num_stimuli=1
memorability=50
nameability=50
emotionality=50
orientationq=50
unique=0
target_directory=/Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/parity_testing/python_output/num_stimuli
newname=0
TESTING_ITER=0

for i in {1 ... 2}
do
    python3 backend.py current_dir image_directory num_folders num_stimuli memorability nameability emotionality orientationq unique target_directory newname TESTING_ITER
done
# TEST 2: variable memorability
python3 backend.py /Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/parity_testing/python_output/ /Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/objects/ 2 10 77 21 76 n 0 /Users/alexgordienko/Documents/work/science/duncanlab/OMINDS/scripts/parity_testing/python_output/ 0 1
# TEST 3: variable nameability

# TEST 4: variable emotionality

# TEST 5: all orientations

# TEST 6: uniqueness
