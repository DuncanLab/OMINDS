'''
STREAMLINED VERSION FOR TESTING PURPOSES

O-MINDS algorithm for sorting stimuli.

Takes in a matrix of information about each stimulus, and creates folders of 
stimuli based on the specified parameters.
'''

import os
import sys
# install packages in virtual environment. If running in Non GUI mode, comment out the line below.
# os.system('python3 -m pip install pandas scipy --user --no-warn-script-location')
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
    TESTING_ITER = sys.argv[12]

    if(memorability != 'n'):
        memorability = int(memorability)
    if(nameability != 'n'):
        nameability = int(nameability)
    if(emotionality != 'n'):
        emotionality = int(emotionality)
    newname = int(newname)
    num_folders = int(num_folders)
    num_stimuli = int(num_stimuli)
    os.chdir(current_dir)
    df = pd.read_csv("full_dt_pf.csv")
    total_stim = num_folders * num_stimuli
else:
    print('Please use the app!')

######################################################################################################

def assert_exit(num_possible):
    try:
        assert total_stim <= num_possible
    except AssertionError:
        err_message = 'Too many stimuli requested given the parameters. Asked for ' + \
        str(total_stim) + ' but the maximum number of possible stimuli is ' + str(num_possible)  
        sys.exit(err_message)

folder_list = []

for i in range(num_folders):
    folder_list.append(pd.DataFrame())

#################################### STEP 1: DIFFERENCE SCORES ######################################
# find how far the score is compared to the ideal scores given

if memorability == 'n':
    if nameability == 'n':
        if emotionality == 'n':
            # print('random scores')
            df['dist'] = df.apply(lambda row: random.random(), axis=1)
        else:
            # print("just emotional")
            df['dist'] = df.apply(lambda row: 
                distance.euclidean((emotionality), [row['scaled_emotional']]),
                                  axis=1)
    else:
        if emotionality == 'n':
            # print("just nameable")
            df['dist'] = df.apply(lambda row: 
                distance.euclidean((nameability), [row['scaled_name']]),
                                  axis=1)
        else:
            # print("nameability and emotional")
            df['dist'] = df.apply(lambda row: 
                distance.euclidean((nameability, emotionality), 
                                   [row['scaled_name'],row['scaled_emotional']]),
                                  axis=1)
else:
    if nameability == 'n':
        if emotionality == 'n':
            # print("just memorability")
            df['dist'] = df.apply(lambda row: 
                distance.euclidean((memorability), [row['scaled_memory_hits']]),
                                  axis=1)
        else:
            # print("memorability and emotional")
            df['dist'] = df.apply(lambda row:
                                  distance.euclidean((memorability, emotionality), [row['scaled_memory_hits'], row['scaled_emotional']]),
                                  axis=1)
    else:
        if emotionality == 'n':
            # print("memorability and nameability")
            df['dist'] = df.apply(lambda row: 
                distance.euclidean((memorability, nameability), [row['scaled_memory_hits'], row['scaled_name']]),
                                  axis=1)
        else:
            # print("all 3")
            df['dist'] = df.apply(lambda row: 
                                  distance.euclidean((memorability, nameability, emotionality), 
                                                     [row['scaled_memory_hits'], row['scaled_name'], row['scaled_emotional']]),axis=1)
            print(df['dist'].mean())
            print(df['dist'].sum())

# sort by distance scores; should affect the rest of the script
df = df.sort_values(by='dist', ascending=True)

######################### STEP 2: UNIQUENESS TRIMMING ##############################

# if unique was selected, only keep the items with the best score for each modal name
if unique == "y":
    assert_exit(num_possible = 1174)
    # separate unique and non-unique values
    nonunique = df.loc[df['unique'] == 0]
    newtable = df.loc[df['unique'] == 1]

    # grab the best item for each unique modal response
    modalresponses = nonunique.modal_response.unique()
    for modalname in modalresponses:
        temp = nonunique.loc[nonunique['modal_response'] == modalname,].reset_index(drop=True)
        # temp = temp.sort_values(['dist'], ascending = [True])
        newtable = newtable.append(temp.iloc[0], ignore_index = True)

    df = newtable
else:
    assert_exit(num_possible = 1748)
print(df.head(5))

############################### STEP 3: ORIENTATION Q SPLITTING #######################################

# If any of the orientation questions are selected, use the column to split the data.

if orientationq == "shoebox":
    lowtable = df.loc[df['shoebox_response'] == 'larger than a shoebox']
    hightable = df.loc[df['shoebox_response'] == 'smaller than a shoebox']
    assert_exit(len(hightable)*2)
    df_list = [lowtable, hightable]
elif orientationq == "humanmade":
    lowtable = df.loc[df['humanmade_response'] == 'natural']
    hightable = df.loc[df['humanmade_response'] == 'human-made']
    assert_exit(len(lowtable)*2)
    df_list = [lowtable, hightable]
elif orientationq == "outdoors":
    lowtable = df.loc[df['outdoors_response'] == 'indoors']
    hightable = df.loc[df['outdoors_response'] == 'outdoors']
    assert_exit(len(hightable)*2)
    df_list = [lowtable, hightable]
else:
    df_list = [df]

# if the items do not fit cleanly in the folders, store them
leftovers = pd.DataFrame()

for table in df_list:
    table = table.reset_index(drop=True)
    ############################# STEP 4: CUT TO PREFERRED SIZE ##################################

    # table = table.sort_values(['dist'], ascending=[True])
    cutoff = math.ceil(num_stimuli * num_folders/len(df_list))
    table = table.iloc[0:cutoff]

    ############################ STEP 5: FOLDER ALLOCATION ################################

    folder_assignment = [n for n in range(0, num_folders)]
    shuffled_list = []

    for group in range(math.ceil(num_stimuli/len(df_list))):
        shuffled_list += random.sample(folder_assignment, num_folders)
    
    # if there's no leftovers after dividing into folders, then it's no problem
    for i in range(len(table)):
        if (i < math.floor(len(table)/num_folders)*num_folders):
            stim_row = table.iloc[i]
            targ_folder = shuffled_list[i]
            folder_list[targ_folder] = folder_list[targ_folder].append(stim_row)
        # put leftovers in a separate folder
        else:
            leftovers = leftovers.append(table.iloc[i])

###################### STEP 6: DOUBLE CHECK ###########################
# If there are an odd number of requested stimuli, but an even number of stimuli in leftovers, cut the worst-fitting item.

if len(leftovers) != 0:
    leftovers = leftovers.sample(frac=1).reset_index(drop=True)
    for i in range(num_folders):
        folder_list[i] = folder_list[i].append(leftovers.iloc[i])

#################### STEP 7: FOLDERS #####################

# create folders
# for i in range(num_folders):
#     folder_list[i] = folder_list[i].sample(frac=1)
#     folder = folder_list[i]
#     folder.index = range(len(folder.index))
#     foldernumber = str(i + 1) # begin indexing at 1

#     folderpath = target_directory + foldernumber + "/"

#     if not os.path.exists(folderpath):
#         os.makedirs(folderpath)

#     folder['newname'] = folder.apply(lambda _: '', axis=1)

#     for j, row in folder.iterrows():
        
#         stimname = row['stimulus']

#         # If they want it re-named, change to numbers beginning at index 1.
#         if newname == 1:
#             changedname = foldernumber + "_" + str(j + 1) + ".jpg" 
#         else:
#             changedname = foldernumber + "_" + stimname
        
#         # Record this in the output file in a new column
#         folder.loc[j,'newname'] = changedname

#         # Copy the image from the stored folder
#         itempath = image_directory + stimname
#         targpath = folderpath + changedname
#         # move it over
#         shutil.copy(itempath, targpath)

#################### STEP 8: SUMMARIZED CSV ##########################

outputCSV = pd.DataFrame()

for folder in folder_list:
    outputCSV = outputCSV.append(folder).reset_index(drop=True)

outputCSV.to_csv(target_directory + "summary" + TESTING_ITER + ".csv", index = False, encoding='utf-8')

sys.stdout.flush()