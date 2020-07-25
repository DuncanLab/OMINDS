'''
Object Project (to be renamed) backend!

The goal is to take a matrix of information about each stimulus, and export the specified number of
counterbalanced groups based on the input specifications.

'''

import pandas as pd
# import django
from scipy.spatial import distance
import os
import math
import random
import shutil
import cmd
import sys

if __name__ == "__main__":
    # usage: python3 main.py [num stimulus groups/num of folders] [num stimuli per group] [memorability (0-100; n for none)]
    #                        [namability (0-100; n for none)] [emotionality (0-100; n for none)] [orientationq] [unique] [target dir]


    # need to check num_stimuli * num_folders >= 1748 in front end
    num_folders = int(sys.argv[1])
    num_stimuli = int(sys.argv[2])

    # '' for now, dependents on how the data is processed on the front end; same for namability and emotionality
    memorability = int(sys.argv[3]) / 100 if sys.argv[3] != '' else "n" 
    nameability  = int(sys.argv[4]) / 100 if sys.argv[4] != '' else "n"
    emotionality = int(sys.argv[5]) / 100 if sys.argv[5] != '' else "n"

    orientationq = sys.argv[6]
    unique       = sys.argv[7]

    target_directory = sys.argv[8]
    
    ################################## STEP 0: ORGANIZE ###################################

    #### WHERE STUFF IS STORED ####
    curr = os.getcwd()
    DT = pd.read_csv("{}/scripts/full_dt_pf.csv".format(curr))
    DT_list = [DT]

    image_directory = "./objects/"

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
                    table['dist'] = table.apply(
            lambda row: distance.euclidean((memorability, nameability, emotionality), [row['scaled_memory_hits'], row['scaled_name'], row['scaled_emotional']]),
            axis=1)
        
        
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

