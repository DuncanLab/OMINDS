'''
Object Project (to be renamed) backend!

The goal is to take a matrix of information about each stimulus, and export the specified number of
counterbalanced groups based on the input specifications.

'''


import os
import sys
# install packages in virtual environment. If running in Non GUI mode, comment out the line below.
os.system('python3 -m pip install pandas scipy --user --no-warn-script-location')
import math
import random
import shutil
import cmd
import pandas as pd
from scipy.spatial import distance

################################## STEP 0: ORGANIZE ###################################

#### user inputs overrides with arguments
if(sys.argv[1]):
    current_dir = sys.argv[1]
    image_directory = sys.argv[2]
    num_folders = sys.argv[3]
    num_stimuli = sys.argv[4]
    memorability = sys.argv[5]
    nameability = sys.argv[6]
    emotionality = sys.argv[7]
    orientationq = sys.argv[8]
    unique = sys.argv[9]
    target_directory = sys.argv[10]
    newname = sys.argv[11]

    print(newname)

    if(memorability != 'n'):
        memorability = int(memorability)
    if(nameability != 'n'):
        nameability = int(nameability)
    if(emotionality != 'n'):
        emotionality = int(emotionality)
    num_folders = int(num_folders)
    num_stimuli = int(num_stimuli)
    os.chdir(current_dir)

    DT = pd.read_csv("full_dt_pf.csv")
    DT_list = [DT]
else:

    DT = pd.read_csv("full_dt_pf.csv")
    DT_list = [DT]

    #### USER INPUTS ####
    num_folders = input("Please indicate the number of stimulus groups you would like: ")
    while True:
        try:
            int(num_folders)
        except:
            print("Only integers are allowed")
            num_folders = input("Please indicate the number of stimulus groups you would like: ")
        else:
            break
    print("you have entered that you would like " + str(num_folders) + " groups of stimuli")

    # TODO: add except for when they want too many

    num_stimuli = input("Please indicate the number of stimuli you would like per group: ")
    while True:
        try:
            int(num_stimuli)
        except:
            print("Only integers are allowed")
            num_stimuli = input("Please indicate the number of stimuli you would like per group: ")
        else:
            break
    print("you have entered that you would like " + str(num_stimuli) + " stimuli per group")

    num_folders = int(num_folders)
    num_stimuli = int(num_stimuli)

    if num_stimuli * num_folders >= 1748:
        print("You have requested too many stimuli, please try again.")
        num_folders = input("Please indicate the number of stimulus groups you would like: ")
        num_stimuli = input("Please indicate the number of stimuli you would like per group: ")

    num_folders = int(num_folders)
    num_stimuli = int(num_stimuli)

    total_stim = num_stimuli*num_folders
    print("You have requested " + str(total_stim) + " total stimuli.")

    memorability = input("On a scale from 0 to 100, how memorable should the stimuli be? (n for none): ")
    if memorability == "n":
        memorability = memorability
    else:
        memorability = int(memorability)
    try:
        0 <= memorability and memorability <= 100
    except TypeError:
        if memorability == "n":
            pass
        else:
            print("Please enter a number from 0-100, or n")
            memorability = input("On a scale from 0 to 100, how memorable should the stimuli be? (n for none): ")
    except:
        print("Please enter an integer from 0-100, or n")
        memorability = input("On a scale from 0 to 100, how memorable should the stimuli be? (n for none): ")
    memorability = memorability / 100

    nameability = input("On a scale from 0 to 100, how nameable should the stimuli be? (n for none): ")
    try:
        0 <= nameability and nameability <= 100
    except TypeError:
        if nameability == "n":
            pass
        else:
            print("Please enter a number from 0-100, or n")
            nameability = input("On a scale from 0 to 100, how nameable should the stimuli be? (n for none): ")
    except:
        print("Please enter an integer from 0-100, or n")
        nameability = input("On a scale from 0 to 100, how nameable should the stimuli be? (n for none): ")
    nameability = nameability / 100

    emotionality = input("On a scale from 0 to 100, how emotional should the stimuli be? (n for none): ")
    try:
        0 <= emotionality and emotionality <= 100
    except TypeError:
        if emotionality == "n":
            pass
        else:
            print("Please enter a number from 0-100, or n")
            emotionality = input("On a scale from 0 to 100, how emotional should the stimuli be? (n for none): ")
    except:
        print("Please enter an integer from 0-100, or n")
        emotionality = input("On a scale from 0 to 100, how emotional should the stimuli be? (n for none): ")
    emotionality = emotionality / 100


    print("You may specify a maximum of one of the following orientation questions:")
    print("shoebox: Is the object larger or smaller than a shoebox?")
    print("humanmade: Is the object natural or humanmade?")
    print("outdoors: Is the object typically found indoors or outdoors?")
    orientationq = input("Which of the above would you like to select? (n for none): ")

    unique = input("Should the stimuli be very unique from each other? (y/n): ")

    target_directory = input("Please type out the target directory for the output: ")

folder_list = []
total_stim = num_folders * num_stimuli

for folder in range(num_folders):
    folder_list.append(pd.DataFrame())

############################### STEP 1: ORIENTATION Q SPLITTING #######################################

# If any of the orientation questions are selected, use the column to split the data.
# We will have to calculate the distance separately for low and high scores.

if orientationq == "shoebox":
    lowtable = DT.loc[DT['shoebox_response'] == 'larger than a shoebox']
    hightable = DT.loc[DT['shoebox_response'] == 'smaller than a shoebox']
    DT_list = [lowtable, hightable]

elif orientationq == "humanmade":
    lowtable = DT.loc[DT['humanmade_response'] == 'natural']
    hightable = DT.loc[DT['humanmade_response'] == 'human-made']
    DT_list = [lowtable, hightable]

elif orientationq == "outdoors":
    lowtable = DT.loc[DT['outdoors_response'] == 'indoors']
    hightable = DT.loc[DT['outdoors_response'] == 'outdoors']
    DT_list = [lowtable, hightable]

for table in DT_list:
    
    ########################## STEP 2: DIFFERENCE SCORE ##########################
    # goldstandard = (memscore, namscore, emoscore)
    # The smaller dist is, the closer it is to the ideal parameters.

    
    if memorability == 'n':
        if nameability == 'n':
            if emotionality == 'n':
                # MAKE EDGE CASE WHERE ITS NONE OF THEM!
                table['dist'] = table.apply(0, axis=1)
            else:
                print("just emotional")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((emotionality), [row['scaled_emotional']]),
                                      axis=1)
        else:
            if emotionality == 'n':
                print("just nameable")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((nameability), [row['scaled_name']]),
                                      axis=1)
            else:
                print("nameability and emotional")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((nameability, emotionality), 
                                       [row['scaled_name'],row['scaled_emotional']]),
                                      axis=1)
    else:
        if nameability == 'n':
            if emotionality == 'n':
                print("just memorability")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((memorability), [row['scaled_memory_hits']]),
                                      axis=1)
            else:
                print("memorability and emotional")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((memorability, emotionality), [row['scaled_memory_hits'], row['scaled_emotional']]),
                                      axis=1)
        else:
            if emotionality == 'n':
                print("memorability and nameability")
                table['dist'] = table.apply(lambda row: 
                    distance.euclidean((memorability, nameability), [row['scaled_memory_hits'], row['scaled_name']]),
                                      axis=1)
            else:
                print("all 3")
                table['dist'] = table.apply(lambda row: distance.euclidean((memorability, nameability, emotionality), [row['scaled_memory_hits'], row['scaled_name'], row['scaled_emotional']]),axis=1)

    ######################### STEP 3: UNIQUENESS TRIMMING ##############################

    if unique == "y":
        nonunique = table.loc[table['unique'] == 0] #non-unique values
        nonunique = nonunique.sort_values(['modal_response','dist'], ascending= [True,True])
        modalresponses = nonunique.modal_response.unique()

        newtable = table.loc[table['unique'] == 1]

        for response in modalresponses:
            temp = nonunique.loc[nonunique['modal_response'] == response]
            addrow = temp.iloc[0]
            newtable = newtable.append(addrow, ignore_index = True)

        table = newtable

    ############################# STEP 4: CUT TO PREFERRED SIZE ##################################

    # round up, in case there are an odd number of stimuli. This will be cut later.
    table = table.sort_values(['dist'], ascending=[True])
    cutoff = math.ceil(num_stimuli/len(DT_list)) * num_folders 
    table = table.iloc[0:cutoff]

    ############################ STEP 5: FOLDER ALLOCATION ################################

    folder_assignment = [n for n in range(0, num_folders)]
    shuffled_list=[]

    for group in range(math.ceil(num_stimuli/len(DT_list))):
        shuffled_list += random.sample(folder_assignment, num_folders)


    for i in range(len(shuffled_list)):
        stim_row = table.iloc[i]
        targ_folder = shuffled_list[i]
        folder_list[targ_folder] = folder_list[targ_folder].append(stim_row)

###################### STEP 6: DOUBLE CHECK ###########################
# If there are an odd number of requested stimuli, but an even number of stimuli in the folder, cut the worst-fitting item.

if num_stimuli % 2 == 1:
    for folder in folder_list:
        folder.sort_values(['dist'], ascending=[True]) #or memorability
        folder = folder.iloc[0:num_stimuli]

#################### STEP 7: FOLDERS #####################

# create folders
for folderpos in range(len(folder_list)):
    folder = folder_list[folderpos]
    folder.index = range(len(folder.index))
    foldernumber = str(folderpos)
    folderletter = chr(65 + folderpos)

    folderpath = target_directory + folderletter + '/'
    if not os.path.exists(folderpath):
        os.makedirs(folderpath)

    folder['newname'] = folder.apply(lambda _: '', axis=1)

    for stimpos in range(len(folder)):
        
        stimrow = folder.iloc[stimpos]

        # If they want it re-named, change to numbers beginning at index 1.
        if newname == 1:
            newname = folderletter + "/" + str(stimpos + 1) + ".jpg" 
        else:
            oldname = folder.loc[stimpos, 'stimulus']
            newname = folderletter + "/" + str(oldname)
        
        # Record this in the output file in a new column
        folder.loc[stimpos,'newname'] = newname

        # Copy the image from the stored folder
        itempath = image_directory + folder.loc[stimpos, 'stimulus']
        targpath = target_directory + newname
        shutil.copy(itempath, targpath)



#################### STEP 8: SUMMARIZED CSV ##########################

outputCSV = pd.DataFrame()

for folder in folder_list:
    outputCSV = outputCSV.append(folder)

outputCSV.to_csv(target_directory + "summary.csv", index = False, encoding='utf-8')

sys.stdout.flush()