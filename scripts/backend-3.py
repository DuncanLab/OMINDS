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

    memorability = int(memorability)
    nameability = int(nameability)
    emotionality = int(emotionality)
    num_folders = int(num_folders)
    num_stimuli = int(num_stimuli)
    os.chdir(current_dir)

    DT = pd.read_csv("full_dt_pf.csv")
    DT_list = [DT]
else:

    #### Run if not using GUI

    #### WHERE STUFF IS STORED ####

    # os.chdir("/Users/sarahberger/Desktop/ObjectProject/")
    #os.chdir("C:/Users/hanna/Documents/2019-2020/ObjectProject/")

    DT = pd.read_csv("full_dt_pf.csv")
    DT_list = [DT]

    # image_directory = "/Users/sarahberger/Desktop/ObjectProject/stimuli/"
    #image_directory = "C:/Users/hanna/Documents/2019-2020/ObjectProject/stimuli/"


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

    # add except for when they want too many?

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

    # target_directory = "C:/Users/hanna/Documents/2019-2020/ObjectProject/"
    # target_directory = "/Users/sarahberger/Desktop/ObjectProject/"  # user specifies


folder_list = []
total_stim = num_folders * num_stimuli

for folder in range(num_folders):
    folder_list.append(pd.DataFrame())

############################### STEP 1: ORIENTATION Q SPLITTING #######################################

# if shoebox == True or outdoors == True or manmade == True:
# figure out which one was selected -> use that column

# lowtable = items in DT that have a value below 0.2
# hightable = items in DT that have a value above 0.8

# DT_list = [lowtable, hightable]

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

# for table in DT_list:
for table in DT_list:
    ########################## STEP 2: DIFFERENCE SCORE ##########################
    # goldstandard = (memscore, namscore, emoscore)
    
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
    
    
    # table['dist'] = table.apply(
        # lambda row: distance.euclidean(goldstandard, [row['scaled_memory_hits'], row['scaled_name'], row['scaled_emotional']]),
        # axis=1) #this one works

    #worry about if they only second 1 or 2 options later

    # for stim in DT:
    # stimscore = (memscore, namscore, emoscore)
    # stimdist = distance.euclidean(goldstandard, stimscore)
    # add it to a column? "dist"

    # the smaller dist is, the closer it is to the ideal parameters

    # if we want to upweight memorability, we can scale the memorability score by some factor --> changes how far away it is
    # make sure we do that for the goldstandard so it's the same scale

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

    #test if this works after we do the 0 and 1 in a column thing

        #in dataframe we load in, add a column that says if the modal name is unique or not

    # if uniqueness: # elim all responses that are worse than the others of the same modal name
    # newtable = empty datatable?
    # # take column "modalname"
    # uniquemodalname = []
    # for name in uniquemodalname:
    # new datatable with the rows that have this modal name
    # arrange by dist
    # take the first row (lowest score)
    # add that row to the newtable

    # if uniqueness:
    # table = newtable

    ############################# STEP 4: CUT TO PREFERRED SIZE ##################################

    table = table.sort_values(['dist'], ascending=[True])

    cutoff = math.ceil(num_stimuli/len(DT_list)) * num_folders # items in table

    table = table.iloc[0:cutoff]

    # if we're using the dist score for this -->
    # organize table by dist
    # take N / len(DT_list) number of lowest dist scores, rounding up
    # alternatively, if they want something weird like 5 folders of 7 images, dividing by shoebox,
    # we can take num_folders * num_stimuli / len(DT_list) number of stimuli, rounding up
    # we tried to do math :')
    # make sure this works for larger numbers of stimuli per folder

    ############################ STEP 5: FOLDER ALLOCATION ################################

    folder_assignment = [n for n in range(0, num_folders)]
    shuffled_list=[]

    for group in range(math.ceil(num_stimuli/len(DT_list))):
        shuffled_list += random.sample(folder_assignment, num_folders)


    for i in range(len(shuffled_list)):
        stim_row = table.iloc[i]
        targ_folder = shuffled_list[i]
        folder_list[targ_folder] = folder_list[targ_folder].append(stim_row)




    # NOT randomize the rows (so organized by memorability unless otherwise specified)

    # for folder in folder_list:
    # grab num_stimuli / len(DT_list) number of rows, rounding up
    # rbind, basically

###################### STEP 6: DOUBLE CHECK ###########################

if num_stimuli % 2 ==1:
    for folder in folder_list:
        folder.sort_values(['dist'], ascending=[True]) #or memorability
        folder = folder.iloc[0:num_stimuli]


# if num_stimuli % 2 == 1:
# for folder in folder_list:
# organize by distance/memorability
# remove the one with the worst dist score (if odd)

#################### STEP 7: FOLDERS #####################

for folderpos in range(len(folder_list)):
    folder = folder_list[folderpos]
    folder.index = range(len(folder.index))
    folderletter = chr(65 + folderpos)

    folderpath = target_directory + folderletter + '/'
    if not os.path.exists(folderpath):
        os.makedirs(folderpath)

    folder['newname'] = folder.apply(lambda _: '', axis=1)

    for stimpos in range(len(folder)):
        stimrow= folder.iloc[stimpos]

        newname = folderletter + "/" + str(stimpos) + ".jpg"
        #folder.loc[stimrow, 'newname'] = newname
        folder.loc[stimpos,'newname'] = newname
        #folder[stimpos, 'newname'] = folder.apply(lambda row: str(newname), axis = 1)

        itempath = image_directory + folder.loc[stimpos, 'stimulus']
        targpath = target_directory + newname

        shutil.copy(itempath, targpath)






# for folder in folder_list:
# for stimnum in folder:
# grab the stimulus (from our database, by its original name)
# make new name --> [folderletter] + "/" + [stimnumber] + ".jpg"
# add the new name to a column (for the summary CSV)
# move it to a new folder -> filepath + "/" + newname

#################### STEP 8: SUMMARIZED CSV ##########################

outputCSV = pd.DataFrame()

for folder in folder_list:
    outputCSV = outputCSV.append(folder)

outputCSV.to_csv(target_directory + "summary.csv", index = False, encoding='utf-8')
# outputCSV = empty datatable?

# for folder in folder_list:
# create a new column called folder
# rbind it to outputCSV
# make sure it has all the stats we want to give them!!
# also stimulus filename

# create the CSV with the summarized information
# output it to the filepath!
sys.stdout.flush()