#load data
library(tidyverse); library(data.table); library(dtplyr); library(effsize)

setwd("~/Desktop/ObjectProject")
data = setDT(read.csv("data.csv"))
data = data[trialcode == "old_objects"]
data_corrected = setDT(read.csv("data_corrected.csv"))
data_corrected = data_corrected[trialcode == "old_objects"]

#create a vector with each individual subject and their hit rate
HR_sub = data[, .(HR = mean(correct)), by = participant]
HR_sub = sample_n(as.data.frame(HR_sub), 20, replace = TRUE)

HR_sub$HR_2 = (HR_sub$HR - rnorm(1, mean = .1, sd = .1)) #condition 2 is 1 sd lower than cond 1
HR_sub$HR_2[HR_sub$HR_2>=1] <- .999 #hit rate can't be above 1
HR_sub = setDT(HR_sub)

#create a vector with each individual stimulus and their hit rate
HR_stim = data[, .(HR = mean(correct)), by = stimulus]

stimpergroup = seq(1,21,5)


####### with stimulus variability ######

sim_SPC_iter <- function (n_iter = 5) { #input how many iterations to run
  
  ef1=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef1) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  ef2=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef2) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  eflist = list()

  stim1index = 0
  stim2index = 0
  
  for (h in c(1:n_iter)){  
    
    print(paste("iteration =", h))
    stimindex = 0
    for (i in stimpergroup){ # 1-50 stim per group, going up by 5 each time
      #print(paste("number of stimuli per group =", i))
      
      stimindex = stimindex+1
      
      for (j in HR_sub$participant){
        
        #print(paste("current participant =", j))
        
        cond1_stim = sample(HR_stim$stimulus, size = i, replace = TRUE) # sample each stimulus i times with replacement
        cond2_stim = sample(HR_stim$stimulus, size = i, replace = TRUE)

        
        for (stim1 in cond1_stim){
          stim1index = stim1index +1
          
          prob1_stim = HR_stim[stimulus == stim1]$HR #probability of getting that stimulus correct
          odds1_stim = (prob1_stim/(1-prob1_stim)) #odds of getting that stimulus correct
          prob1_sub = HR_sub[participant == j]$HR #probability participant is correct
          odds1_sub = (prob1_sub/(1-prob1_sub)) #odds participant is correct
          
          los = (log(odds1_stim) + log(odds1_sub))/2 #log odds sum
          odds1 = exp(los) 
          prob1 = odds1/(1+odds1) #convert log odds back to probability
          
          cond1_correct = rbinom(1, 1, prob = prob1) 
          
          
          ef1[stim1index,1] = h
          ef1[stim1index,2] = i
          ef1[stim1index,3] = j
          ef1[stim1index,4] = stim1
          ef1[stim1index,5] = cond1_correct
          #cond1 = append(cond1, cond1_correct)
          }
        
        for (stim2 in cond2_stim){
          
          stim2index = stim2index +1
          
          prob2_stim = HR_stim[stimulus == stim2]$HR #probability of getting that stimulus correct
          odds2_stim = (prob2_stim/(1-prob2_stim)) #odds of getting that stimulus correct
          prob2_sub = HR_sub[participant == j]$HR_2 #probability participant is correct
          odds2_sub = (prob2_sub/(1-prob2_sub)) #odds participant is correct
          
          los2 = (log(odds2_stim) + log(odds2_sub))/2 #log odds sum
          odds2 = exp(los2) 
          prob2 = odds2/(1+odds2) #convert log odds back to probability
          
          cond2_correct = rbinom(1, 1, prob = prob2)
          
          ef2[stim2index,1] = h
          ef2[stim2index,2] = i
          ef2[stim2index,3] = j
          ef2[stim2index,4] = stim2
          ef2[stim2index,5] = cond2_correct
          
          #cond2 = append(cond2, cond2_correct)
          
        }
      }
      #ef[h,stimindex] = cohen.d(cond1, cond2, paired = T, na.rm = T)$estimate
      #cond1 = vector()
      #cond2 = vector()
    }
  }
  eflist = list(ef1,ef2)
  return(eflist)
}

w_stim_var = sim_SPC_iter(n_iter = 15)

ef1 = setDT(w_stim_var[[1]])
ef2 = setDT(w_stim_var[[2]])

mean(ef1$correct, na.rm = T)
mean(ef2$correct, na.rm = T)

to_join_1 = ef1[, .(cond1_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]
to_join_2 = ef2[, .(cond2_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]

stimvartable = left_join(to_join_1,to_join_2)

cohensdtestrun = as.data.frame(matrix(ncol=5))
colnames(cohensdtestrun) <- c(stimpergroup)

cohensdtestrun[,1]= cohen.d(stimvartable[stimpergroup == 1]$cond1_mean, stimvartable[stimpergroup == 1]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun[,2]= cohen.d(stimvartable[stimpergroup == 6]$cond1_mean, stimvartable[stimpergroup == 6]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun[,3]= cohen.d(stimvartable[stimpergroup == 11]$cond1_mean, stimvartable[stimpergroup == 11]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun[,4]= cohen.d(stimvartable[stimpergroup == 16]$cond1_mean, stimvartable[stimpergroup == 16]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun[,5]= cohen.d(stimvartable[stimpergroup == 21]$cond1_mean, stimvartable[stimpergroup == 21]$cond2_mean, paired = T, na.rm = T)$estimate

cohensdtestrun

with_stimulus_variability = cohensdtestrun

####### without stimulus variability ######


sim_SPC_iter_nostimvar <- function (n_iter = 15) { #input how many interations to run
  
  ef1=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef1) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  ef2=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef2) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  eflist = list()
  
  stim1index = 0
  stim2index = 0
  
  for (h in c(1:n_iter)){  
    
    print(paste("iteration =", h))
    for (i in stimpergroup){ # 1-50 stim per group, going up by 5 each time
      #print(paste("number of stimuli per group =", i))
      
      for (j in HR_sub$participant){

        #print(paste("current participant =", j))
        
        cond1_stim = sample(HR_stim$stimulus, size = i, replace = TRUE) # sample each stimulus i times with replacement
        cond2_stim = sample(HR_stim$stimulus, size = i, replace = TRUE)
  
        
        for (stim1 in cond1_stim){
          stim1index = stim1index +1
          
          prob1_sub = HR_sub[participant == j]$HR #probability participant is correct
          
          cond1_correct = rbinom(1, 1, prob = prob1_sub) 
          
          ef1[stim1index,1] = h
          ef1[stim1index,2] = i
          ef1[stim1index,3] = j
          ef1[stim1index,4] = stim1
          ef1[stim1index,5] = cond1_correct
          #cond1 = append(cond1, cond1_correct)
        }
        
        
        for (stim2 in cond2_stim){
          
          stim2index = stim2index +1
          
          prob2_sub = HR_sub[participant == j]$HR_2 #probability participant is correct
          
          cond2_correct = rbinom(1, 1, prob = prob2_sub)
          
          ef2[stim2index,1] = h
          ef2[stim2index,2] = i
          ef2[stim2index,3] = j
          ef2[stim2index,4] = stim2
          ef2[stim2index,5] = cond2_correct
          
          #cond2 = append(cond2, cond2_correct)
          
        }
      }
      #ef[h,stimindex] = cohen.d(cond1, cond2, paired = T, na.rm = T)$estimate
      #cond1 = vector()
      #cond2 = vector()
    }
  }
  eflist = list(ef1,ef2)
  return(eflist)
}

without_stim_var = sim_SPC_iter_nostimvar(n_iter = 15)

ef_1_nsv = setDT(without_stim_var[[1]])
ef_2_nsv = setDT(without_stim_var[[2]])

mean(ef_1_nsv$correct)
mean(ef_2_nsv$correct)

to_join_1_nsv = ef_1_nsv[, .(cond1_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]
to_join_2_nsv = ef_2_nsv[, .(cond2_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]

nostimvartable = left_join(to_join_1_nsv,to_join_2_nsv)

cohensdtestrun3 = as.data.frame(matrix(ncol=5))
colnames(cohensdtestrun3) <- c(stimpergroup)

cohensdtestrun3[,1]= cohen.d(nostimvartable[stimpergroup == 1]$cond1_mean, nostimvartable[stimpergroup == 1]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun3[,2]= cohen.d(nostimvartable[stimpergroup == 6]$cond1_mean, nostimvartable[stimpergroup == 6]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun3[,3]= cohen.d(nostimvartable[stimpergroup == 11]$cond1_mean, nostimvartable[stimpergroup == 11]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun3[,4]= cohen.d(nostimvartable[stimpergroup == 16]$cond1_mean, nostimvartable[stimpergroup == 16]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdtestrun3[,5]= cohen.d(nostimvartable[stimpergroup == 21]$cond1_mean, nostimvartable[stimpergroup == 21]$cond2_mean, paired = T, na.rm = T)$estimate

cohensdtestrun3

without_stimulus_variability = cohensdtestrun3

####### using the software to equate stimulus variability ######

#create a vector with each individual subject and their hit rate
HR_sub = data[, .(HR = mean(correct)), by = participant]
HR_sub = sample_n(as.data.frame(HR_sub), 20, replace = TRUE)

HR_sub$HR_2 = (HR_sub$HR - rnorm(1, mean = .1, sd = .1)) #condition 2 is 1 sd lower than cond 1
HR_sub = setDT(HR_sub)
HR_sub$HR_2[HR_sub$HR_2<=0] <- 0.01

#create a vector with each individual stimulus and their hit rate
HR_stimc = data_corrected[, .(HR_corrected = mean(correct)), by = stimulus]
HR_grand_mean = mean(data$correct)
HR_stimc[, HR := HR_corrected + HR_grand_mean]
HR_stimc$HR[HR_stimc$HR>=1] <- 1 #hit rate can't be above 1


cond1_1 = c("Kiwi.jpg")
cond1_6 = c("Box_FirstAid.jpg",
            "PillBottle_Closed.jpg",
            "Bottle_Oil.jpg",
            "NeedlesAcupuncture.jpg",
            "Shoes_Snow.jpg",
            "Bread_Melon.jpg")
cond1_11 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Bottle_Oil.jpg",
             "NeedlesAcupuncture.jpg",
             "LeafBlower.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Shed.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Banana.jpg",
             "Toy_Helicopter.jpg")
cond1_16 = c("Kiwi.jpg",
             "PillBottle_Closed.jpg",
             "Paddle_Canoe.jpg",
             "Wallet_ClosedBrown.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Banana.jpg",
             "Toy_Taxi.jpg",
             "PedestalGreek.jpg",
             "Pillar.jpg",
             "FloorTile.jpg",
             "AirVent.jpg",
             "Sign_Caution.jpg")
cond1_21 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "NeedlesAcupuncture.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Taxi.jpg",
             "PedestalGreek.jpg",
             "Mitt_Oven.jpg",
             "Guacamole.jpg",
             "Hook_Double.jpg",
             "Sign_Caution.jpg",
             "Weights_Dumbells.jpg",
             "Giraffe.jpg",
             "Hat_Cowboy.jpg",
             "PokerChips.jpg",
             "Statue_Cat.jpg")
cond1_26 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "NeedlesAcupuncture.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Helicopter.jpg",
             "PedestalGreek.jpg",
             "Pillar.jpg",
             "Guacamole.jpg",
             "Hook_Double.jpg",
             "Sign_Caution.jpg",
             "Weights_Dumbells.jpg",
             "Nametag.jpg",
             "Stool_Metal.jpg",
             "PokerChips.jpg",
             "Mask_Gas.jpg",
             "Bag_Gym.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Leaf_Yellow.jpg",
             "Battery_AA.jpg")
cond1_31 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "NeedlesAcupuncture.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Helicopter.jpg",
             "Gun_Glue.jpg",
             "Pillar.jpg",
             "Guacamole.jpg",
             "AirVent.jpg",
             "Sign_Caution.jpg",
             "Weights_Dumbells.jpg",
             "Nametag.jpg",
             "Stool_Metal.jpg",
             "PokerChips.jpg",
             "Mask_Gas.jpg",
             "Compact_Mirror.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Pepperoni.jpg",
             "Battery_AA.jpg",
             "BicycleGear.jpg",
             "Jug_GallonRed.jpg",
             "PuppetTheatre_BlueRed.jpg",
             "Bolt.jpg",
             "Pumpkin.jpg")
cond1_36 = c("Kiwi.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "NeedlesAcupuncture.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Taxi.jpg",
             "Gun_Glue.jpg",
             "Pillar.jpg",
             "Guacamole.jpg",
             "AirVent.jpg",
             "Sign_Caution.jpg",
             "Cord_Ethernet.jpg",
             "Giraffe.jpg",
             "Hat_Cowboy.jpg",
             "PokerChips.jpg",
             "Mask_Gas.jpg",
             "Compact_Mirror.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Leaf_Yellow.jpg",
             "Battery_AA.jpg",
             "BicycleGear.jpg",
             "Jug_GallonRed.jpg",
             "HairScrunchie.jpg",
             "Bolt.jpg",
             "Pumpkin.jpg",
             "Bird_Duck.jpg",
             "BrainSagittal.jpg",
             "Box_Jewellery.jpg",
             "Blanket.jpg",
             "Makeup_Compact.jpg")
cond1_41 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "NeedlesAcupuncture.jpg",
             "LeafBlower.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Taxi.jpg",
             "Gun_Glue.jpg",
             "Mitt_Oven.jpg",
             "FloorTile.jpg",
             "AirVent.jpg",
             "PotatoMasher_Grate.jpg",
             "Weights_Dumbells.jpg",
             "Giraffe.jpg",
             "Stool_Metal.jpg",
             "Pipe_Drain.jpg",
             "Statue_Cat.jpg",
             "Compact_Mirror.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Leaf_Yellow.jpg",
             "Battery_AA.jpg",
             "Clock_Digital.jpg",
             "Jug_GallonRed.jpg",
             "PuppetTheatre_BlueRed.jpg",
             "Playdoh.jpg",
             "Pumpkin.jpg",
             "Hotdog_Weiner.jpg",
             "Mug_Travel.jpg",
             "Briefcase_Open.jpg",
             "Blanket.jpg",
             "BearPolar.jpg",
             "Gloves_WhiteKnit.jpg",
             "Mask_Ski.jpg",
             "Pot_Crock.jpg",
             "Chicken_Dinner.jpg",
             "Nail.jpg")
cond1_46 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "Wallet_ClosedBrown.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Banana.jpg",
             "Toy_Taxi.jpg",
             "PedestalGreek.jpg",
             "Pillar.jpg",
             "Guacamole.jpg",
             "Hook_Double.jpg",
             "PotatoMasher_Grate.jpg",
             "Cord_Ethernet.jpg",
             "Giraffe.jpg",
             "Hat_Cowboy.jpg",
             "PokerChips.jpg",
             "Statue_Cat.jpg",
             "Bag_Gym.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Pepperoni.jpg",
             "Stick_Honey.jpg",
             "Clock_Digital.jpg",
             "Jug_GallonRed.jpg",
             "PuppetTheatre_BlueRed.jpg",
             "Playdoh.jpg",
             "Thermometer_Room.jpg",
             "Bird_Duck.jpg",
             "BrainSagittal.jpg",
             "Box_Jewellery.jpg",
             "Blanket.jpg",
             "Makeup_Compact.jpg",
             "Gloves_WhiteKnit.jpg",
             "Lychee.jpg",
             "Pot_Crock.jpg",
             "Chicken_Dinner.jpg",
             "Nail.jpg",
             "Notepad.jpg",
             "Jug_ClayAncient.jpg",
             "Drink_Cocktail.jpg",
             "Blueprints.jpg",
             "Butterfly.jpg")
cond1_51 = c("Box_FirstAid.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "NeedlesAcupuncture.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Tombstone.jpg",
             "Peeler.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Taxi.jpg",
             "Gun_Glue.jpg",
             "Mitt_Oven.jpg",
             "Guacamole.jpg",
             "AirVent.jpg",
             "Sign_Caution.jpg",
             "Cord_Ethernet.jpg",
             "Nametag.jpg",
             "Hat_Cowboy.jpg",
             "PokerChips.jpg",
             "Mask_Gas.jpg",
             "Bag_Gym.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Pepperoni.jpg",
             "Stick_Honey.jpg",
             "BicycleGear.jpg",
             "Monitor.jpg",
             "HairScrunchie.jpg",
             "Bolt.jpg",
             "Thermometer_Room.jpg",
             "Hotdog_Weiner.jpg",
             "Mug_Travel.jpg",
             "Box_Jewellery.jpg",
             "Blanket.jpg",
             "Makeup_Compact.jpg",
             "RugRoled.jpg",
             "Mask_Ski.jpg",
             "Umbrella_Retractable.jpg",
             "Balalaika.jpg",
             "Stovetop.jpg",
             "Notepad.jpg",
             "Origami_Boat.jpg",
             "Drink_Cocktail.jpg",
             "Blueprints.jpg",
             "TestTube_Single.jpg",
             "Pasta_Fusilli.jpg",
             "Chair_Airplane.jpg",
             "Stamp.jpg",
             "Swan.jpg",
             "Jar_Strawberry.jpg")


cond1_stim_list = list(cond1_1, cond1_6, cond1_11,cond1_16, cond1_21, cond1_26, cond1_31, cond1_36, cond1_41, cond1_46, cond1_51)


cond2_1 = c("Box_FirstAid.jpg")
cond2_6 = c("Kiwi.jpg",
            "Toy_Witch.jpg",
            "Paddle_Canoe.jpg",
            "Wallet_ClosedBrown.jpg",
            "LeafBlower.jpg",
            "Nuts_PeanutsPeeled.jpg")
cond2_11 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Paddle_Canoe.jpg",
             "Wallet_ClosedBrown.jpg",
             "Shoes_Snow.jpg",
             "Bread_Melon.jpg",
             "Tombstone.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Taxi.jpg")
cond2_16 = c("Box_FirstAid.jpg",
             "Toy_Witch.jpg",
             "Bottle_Oil.jpg",
             "NeedlesAcupuncture.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Helicopter.jpg",
             "Gun_Glue.jpg",
             "Mitt_Oven.jpg",
             "Guacamole.jpg",
             "Hook_Double.jpg",
             "PotatoMasher_Grate.jpg")
cond2_21 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "Wallet_ClosedBrown.jpg",
             "Shoes_Snow.jpg",
             "Nuts_PeanutsPeeled.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Helicopter.jpg",
             "Gun_Glue.jpg",
             "Pillar.jpg",
             "FloorTile.jpg",
             "AirVent.jpg",
             "PotatoMasher_Grate.jpg",
             "Cord_Ethernet.jpg",
             "Nametag.jpg",
             "Stool_Metal.jpg",
             "Pipe_Drain.jpg",
             "Mask_Gas.jpg")
cond2_26 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "Wallet_ClosedBrown.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Tombstone.jpg",
             "Photocopier.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Taxi.jpg",
             "Gun_Glue.jpg",
             "Mitt_Oven.jpg",
             "FloorTile.jpg",
             "AirVent.jpg",
             "PotatoMasher_Grate.jpg",
             "Cord_Ethernet.jpg",
             "Giraffe.jpg",
             "Hat_Cowboy.jpg",
             "Pipe_Drain.jpg",
             "Statue_Cat.jpg",
             "Compact_Mirror.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Pepperoni.jpg",
             "Stick_Honey.jpg")
cond2_31 = c("Box_FirstAid.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "Wallet_ClosedBrown.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Photocopier.jpg",
             "Loveseat.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Taxi.jpg",
             "PedestalGreek.jpg",
             "Mitt_Oven.jpg",
             "FloorTile.jpg",
             "Hook_Double.jpg",
             "PotatoMasher_Grate.jpg",
             "Cord_Ethernet.jpg",
             "Giraffe.jpg",
             "Hat_Cowboy.jpg",
             "Pipe_Drain.jpg",
             "Statue_Cat.jpg",
             "Bag_Gym.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Leaf_Yellow.jpg",
             "Stick_Honey.jpg",
             "Clock_Digital.jpg",
             "Monitor.jpg",
             "HairScrunchie.jpg",
             "Playdoh.jpg",
             "Thermometer_Room.jpg")
cond2_36 = c("Box_FirstAid.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "Wallet_ClosedBrown.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Helicopter.jpg",
             "PedestalGreek.jpg",
             "Mitt_Oven.jpg",
             "FloorTile.jpg",
             "Hook_Double.jpg",
             "PotatoMasher_Grate.jpg",
             "Weights_Dumbells.jpg",
             "Nametag.jpg",
             "Stool_Metal.jpg",
             "Pipe_Drain.jpg",
             "Statue_Cat.jpg",
             "Bag_Gym.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Pepperoni.jpg",
             "Stick_Honey.jpg",
             "Clock_Digital.jpg",
             "Monitor.jpg",
             "PuppetTheatre_BlueRed.jpg",
             "Playdoh.jpg",
             "Thermometer_Room.jpg",
             "Hotdog_Weiner.jpg",
             "Mug_Travel.jpg",
             "Briefcase_Open.jpg",
             "Tag_Price.jpg",
             "BearPolar.jpg")
cond2_41 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "Wallet_ClosedBrown.jpg",
             "Shoes_Snow.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Helicopter.jpg",
             "PedestalGreek.jpg",
             "Pillar.jpg",
             "Guacamole.jpg",
             "Hook_Double.jpg",
             "Sign_Caution.jpg",
             "Cord_Ethernet.jpg",
             "Nametag.jpg",
             "Hat_Cowboy.jpg",
             "PokerChips.jpg",
             "Mask_Gas.jpg",
             "Bag_Gym.jpg",
             "Pants.jpg",
             "Broom_Short.jpg",
             "Pepperoni.jpg",
             "Stick_Honey.jpg",
             "BicycleGear.jpg",
             "Monitor.jpg",
             "HairScrunchie.jpg",
             "Bolt.jpg",
             "Thermometer_Room.jpg",
             "Bird_Duck.jpg",
             "BrainSagittal.jpg",
             "Box_Jewellery.jpg",
             "Tag_Price.jpg",
             "Makeup_Compact.jpg",
             "RugRoled.jpg",
             "Lychee.jpg",
             "Umbrella_Retractable.jpg",
             "Balalaika.jpg",
             "Stovetop.jpg")
cond2_46 = c("Kiwi.jpg",
             "Toy_Witch.jpg",
             "Paddle_Canoe.jpg",
             "NeedlesAcupuncture.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Peeler.jpg",
             "Dreidel.jpg",
             "Tractor_Yellow.jpg",
             "Toy_Helicopter.jpg",
             "Gun_Glue.jpg",
             "Mitt_Oven.jpg",
             "FloorTile.jpg",
             "AirVent.jpg",
             "Sign_Caution.jpg",
             "Weights_Dumbells.jpg",
             "Nametag.jpg",
             "Stool_Metal.jpg",
             "Pipe_Drain.jpg",
             "Mask_Gas.jpg",
             "Compact_Mirror.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Leaf_Yellow.jpg",
             "Battery_AA.jpg",
             "BicycleGear.jpg",
             "Monitor.jpg",
             "HairScrunchie.jpg",
             "Bolt.jpg",
             "Pumpkin.jpg",
             "Hotdog_Weiner.jpg",
             "Mug_Travel.jpg",
             "Briefcase_Open.jpg",
             "Tag_Price.jpg",
             "BearPolar.jpg",
             "RugRoled.jpg",
             "Mask_Ski.jpg",
             "Umbrella_Retractable.jpg",
             "Balalaika.jpg",
             "Stovetop.jpg",
             "Boxcutter.jpg",
             "Origami_Boat.jpg",
             "Handcuffs.jpg",
             "Toy_Lizard.jpg",
             "TestTube_Single.jpg")
cond2_51 = c("Kiwi.jpg",
             "PillBottle_Closed.jpg",
             "Bottle_Oil.jpg",
             "Wallet_ClosedBrown.jpg",
             "LeafBlower.jpg",
             "Bread_Melon.jpg",
             "Shed.jpg",
             "Photocopier.jpg",
             "Dreidel.jpg",
             "Banana.jpg",
             "Toy_Helicopter.jpg",
             "PedestalGreek.jpg",
             "Pillar.jpg",
             "FloorTile.jpg",
             "Hook_Double.jpg",
             "PotatoMasher_Grate.jpg",
             "Weights_Dumbells.jpg",
             "Giraffe.jpg",
             "Stool_Metal.jpg",
             "Pipe_Drain.jpg",
             "Statue_Cat.jpg",
             "Compact_Mirror.jpg",
             "Knee.jpg",
             "Camel_Dromedary.jpg",
             "Leaf_Yellow.jpg",
             "Battery_AA.jpg",
             "Clock_Digital.jpg",
             "Jug_GallonRed.jpg",
             "PuppetTheatre_BlueRed.jpg",
             "Playdoh.jpg",
             "Pumpkin.jpg",
             "Bird_Duck.jpg",
             "BrainSagittal.jpg",
             "Briefcase_Open.jpg",
             "Tag_Price.jpg",
             "BearPolar.jpg",
             "Gloves_WhiteKnit.jpg",
             "Lychee.jpg",
             "Pot_Crock.jpg",
             "Chicken_Dinner.jpg",
             "Nail.jpg",
             "Boxcutter.jpg",
             "Jug_ClayAncient.jpg",
             "Handcuffs.jpg",
             "Toy_Lizard.jpg",
             "Butterfly.jpg",
             "VialLab.jpg",
             "Hammock.jpg",
             "MilkPitcher.jpg",
             "Currants.jpg",
             "Trophy.jpg")


cond2_stim_list = list(cond2_1, cond2_6, cond2_11, cond2_16, cond2_21, cond2_26, cond2_31, cond2_36, cond2_41, cond2_46, cond2_51)

stimpergroup = seq(1,51,5)

sim_software <- function (n_iter = 5) { #input how many iterations to run
  
  ef1=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef1) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  ef2=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef2) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  eflist = list()
  
  stim1index = 0
  stim2index = 0
  
  for (h in c(1:n_iter)){  
    
    print(paste("iteration =", h))
    stimindex = 0
    
    for (i in stimpergroup){ # 1-x stim per group, going up by 5 each time
      
      stimindex = stimindex+1
      rows <- sample(nrow(HR_sub)) #shuffle the participant list so on each iteration its random who gets which images as cond1 and cond2
      HR_sub <- HR_sub[rows,]
      
      subindex = 0
      for (j in HR_sub$participant){
      
        subindex = subindex +1
        if (subindex <= (length(HR_sub$participant)/2)) { #counterbalancing: half the participants get stimuli from list 1 as their cond1, other half get list 2 as cond1
        cond1_stim = cond1_stim_list[[stimindex]]# get stimulus from list created by software
        cond2_stim = cond2_stim_list[[stimindex]]
        } else {
          cond1_stim = cond2_stim_list[[stimindex]]
          cond2_stim = cond1_stim_list[[stimindex]]
        }
        
        
        for (stim1 in cond1_stim){
          stim1index = stim1index +1
          
          prob1_stim = HR_stimc[stimulus == stim1]$HR #probability of getting that stimulus correct
          odds1_stim = (prob1_stim/(1-prob1_stim)) #odds of getting that stimulus correct
          prob1_sub = HR_sub[participant == j]$HR #probability participant is correct
          odds1_sub = (prob1_sub/(1-prob1_sub)) #odds participant is correct
          
          los = (log(odds1_stim) + log(odds1_sub))/2 #log odds sum
          odds1 = exp(los) 
          prob1 = odds1/(1+odds1) #convert log odds back to probability
          
          cond1_correct = rbinom(1, 1, prob = prob1) 
          
          
          ef1[stim1index,1] = h
          ef1[stim1index,2] = i
          ef1[stim1index,3] = j
          ef1[stim1index,4] = stim1
          ef1[stim1index,5] = cond1_correct

        }
        
        for (stim2 in cond2_stim){
          
          stim2index = stim2index +1
          
          prob2_stim = HR_stimc[stimulus == stim2]$HR #probability of getting that stimulus correct
          odds2_stim = (prob2_stim/(1-prob2_stim)) #odds of getting that stimulus correct
          prob2_sub = HR_sub[participant == j]$HR_2 #probability participant is correct
          odds2_sub = (prob2_sub/(1-prob2_sub)) #odds participant is correct
          
          los2 = (log(odds2_stim) + log(odds2_sub))/2 #log odds sum
          odds2 = exp(los2) 
          prob2 = odds2/(1+odds2) #convert log odds back to probability
          
          cond2_correct = rbinom(1, 1, prob = prob2)
          
          ef2[stim2index,1] = h
          ef2[stim2index,2] = i
          ef2[stim2index,3] = j
          ef2[stim2index,4] = stim2
          ef2[stim2index,5] = cond2_correct
          
          
        }
      }

    }
  }
  eflist = list(ef1,ef2)
  return(eflist)
}

sim_software_run = sim_software(n_iter = 2)

software_ef1 = setDT(sim_software_run[[1]])
software_ef2 = setDT(sim_software_run[[2]])

mean(software_ef1$correct, na.rm = T)
mean(software_ef2$correct, na.rm = T)

to_join_1_sw = software_ef1[, .(cond1_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]
to_join_2_sw = software_ef2[, .(cond2_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]

softwaretable = left_join(to_join_1_sw,to_join_2_sw)

cohensdsoftware = as.data.frame(matrix(ncol=11))
colnames(cohensdsoftware) <- c(stimpergroup)

cohensdsoftware[,1]= cohen.d(softwaretable[stimpergroup == 1]$cond1_mean, softwaretable[stimpergroup == 1]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,2]= cohen.d(softwaretable[stimpergroup == 6]$cond1_mean, softwaretable[stimpergroup == 6]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,3]= cohen.d(softwaretable[stimpergroup == 11]$cond1_mean, softwaretable[stimpergroup == 11]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,4]= cohen.d(softwaretable[stimpergroup == 16]$cond1_mean, softwaretable[stimpergroup == 16]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,5]= cohen.d(softwaretable[stimpergroup == 21]$cond1_mean, softwaretable[stimpergroup == 21]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,6]= cohen.d(softwaretable[stimpergroup == 26]$cond1_mean, softwaretable[stimpergroup == 26]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,7]= cohen.d(softwaretable[stimpergroup == 31]$cond1_mean, softwaretable[stimpergroup == 31]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,8]= cohen.d(softwaretable[stimpergroup == 36]$cond1_mean, softwaretable[stimpergroup == 36]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,9]= cohen.d(softwaretable[stimpergroup == 41]$cond1_mean, softwaretable[stimpergroup == 41]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,10]= cohen.d(softwaretable[stimpergroup == 46]$cond1_mean, softwaretable[stimpergroup == 46]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdsoftware[,11]= cohen.d(softwaretable[stimpergroup == 51]$cond1_mean, softwaretable[stimpergroup == 51]$cond2_mean, paired = T, na.rm = T)$estimate

cohensdsoftware

funky_results_from_software = cohensdsoftware


####### Use counterbalancing but random stimulus selection ######

#randomly select 62 images
set.seed(31)
images = sample(HR_stim$stimulus, size = 102)

rcond1_1= (images[1])
rcond1_6= (images[2:7])
rcond1_11= (images[c(2:3,8:10, 5,13:17)])
rcond1_16 = (images[c(2:3, 9:14, 19:21, 23:27)])
rcond1_21 = (images[c(1,3,5,7:11,15:17,22:24,30:31, 33:37)])
rcond1_26 = (images[c(1,4:7, 10:13, 16:19, 22:24, 32:34, 39:40, 43:47)])
rcond1_31 = (images[c(2:4, 8:11, 14:16,20:21, 24:26, 32:33, 38:42, 46:49, 53:57)])
rcond1_36 = (images[c(2:3, 5:8, 12:13, 17:19, 22:23, 25:28, 32:34, 38:39, 42:44, 51:53, 57:59, 63:67)])
rcond1_41 = (images[c(1, 3:4, 7:8, 10:12, 15:17, 21:23, 26:27, 29:30, 37:39, 42:44, 47:49, 53:54, 60:63, 67:69, 73:77)])
rcond1_46 = (images[c(1, 4:6,9, 12:14, 18:20, 23, 26:27, 30:31, 34:36, 38:40, 43:44, 48:50, 53:54, 57, 59:61, 64:65, 70:72, 77:79, 83:87)])
rcond1_51 = (images[c(2:4, 7:9, 12:13, 16, 19:21, 25:27, 29, 32:33, 37:40, 45:48, 51:53, 55, 59:61, 64, 69:71,73:74, 79:80, 83:85, 91:97)])

rcond1_stim_list = list(rcond1_1, rcond1_6, rcond1_11, rcond1_16, rcond1_21, rcond1_26, rcond1_31, rcond1_36, rcond1_41, rcond1_46, rcond1_51)

rcond2_1 = (images[2])
rcond2_6 = (images[c(1,8:12)])
rcond2_11 = (images[c(1,4,6:7,11:12,18:22)])
rcond2_16 = (images[c(1,4:8,15:18,22, 28:32)])
rcond2_21 = (images[c(2,4,6,12:14,18:21,25:29,32, 38:42)])
rcond2_26 = (images[c(2:3,8:9,14:15,20:21,25:31,35:38,41:42,48:52)])
rcond2_31 = (images[c(1,5:7,12:13,17:19,22:23,27:31,34:37,43:45,50:52,58:62)])
rcond2_36 = (images[c(1,4,9:11,14:16,20:21,24,29:31,35:37,40:41,45:50,54:56,60:62,68:72)])
rcond2_41 = (images[c(2,5:6,9,13:14,18:20,24:25,28,31:36,40:41,45:46,50:52,55:59,64:66,70:72,78:82)])
rcond2_46 = (images[c(2:3,7:8,10:11,15:17,21:22,24:25,28:29,32:33,37,41:42,45:47,51:52,55:56,58,62:63,66:69,73:76,80:82,88:92)])
rcond2_51 = (images[c(1,5:6,10:11,14:15,17:18,22:24,28,30:31,34:36,41:44,49:50,54,56:58,62:63,65:68,72,75:78,81:82,86:90,98:102)])

rcond2_stim_list = list(rcond2_1, rcond2_6, rcond2_11, rcond2_16, rcond2_21, rcond2_26, rcond2_31, rcond2_36, rcond2_41, rcond2_46, rcond2_51)

sim_counterbalance <- function (n_iter = 15) { #input how many iterations to run
  
  ef1=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef1) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  ef2=as.data.frame(matrix(nrow=n_iter*length(HR_sub)*length(stimpergroup),ncol=5))
  colnames(ef2) <- c("iteration","stimpergroup","subject","stimulus","correct")
  
  eflist = list()
  
  stim1index = 0
  stim2index = 0
  
  for (h in c(1:n_iter)){  
    
    print(paste("iteration =", h))
    stimindex = 0
    
    for (i in stimpergroup){ # 1-x stim per group, going up by 5 each time
      
      stimindex = stimindex+1
      rows <- sample(nrow(HR_sub)) #shuffle the participant list so on each iteration its random who gets which images as cond1 and cond2
      HR_sub <- HR_sub[rows,]
      
      subindex = 0
      for (j in HR_sub$participant){
        
        subindex = subindex +1
        if (subindex <= (length(HR_sub$participant)/2)) { #counterbalancing: half the participants get stimuli from list 1 as their cond1, other half get list 2 as cond1
          cond1_stim = rcond1_stim_list[[stimindex]]# get stimulus from list created by software
          cond2_stim = rcond2_stim_list[[stimindex]]
        } else {
          cond1_stim = rcond2_stim_list[[stimindex]]
          cond2_stim = rcond1_stim_list[[stimindex]]
        }
        
        
        for (stim1 in cond1_stim){
          stim1index = stim1index +1
          
          prob1_stim = HR_stimc[stimulus == stim1]$HR #probability of getting that stimulus correct
          odds1_stim = (prob1_stim/(1-prob1_stim)) #odds of getting that stimulus correct
          prob1_sub = HR_sub[participant == j]$HR #probability participant is correct
          odds1_sub = (prob1_sub/(1-prob1_sub)) #odds participant is correct
          
          los = (log(odds1_stim) + log(odds1_sub))/2 #log odds sum
          odds1 = exp(los) 
          prob1 = odds1/(1+odds1) #convert log odds back to probability
          
          cond1_correct = rbinom(1, 1, prob = prob1) 
          
          
          ef1[stim1index,1] = h
          ef1[stim1index,2] = i
          ef1[stim1index,3] = j
          ef1[stim1index,4] = stim1
          ef1[stim1index,5] = cond1_correct
          
        }
        
        for (stim2 in cond2_stim){
          
          stim2index = stim2index +1
          
          prob2_stim = HR_stimc[stimulus == stim2]$HR #probability of getting that stimulus correct
          odds2_stim = (prob2_stim/(1-prob2_stim)) #odds of getting that stimulus correct
          prob2_sub = HR_sub[participant == j]$HR_2 #probability participant is correct
          odds2_sub = (prob2_sub/(1-prob2_sub)) #odds participant is correct
          
          los2 = (log(odds2_stim) + log(odds2_sub))/2 #log odds sum
          odds2 = exp(los2) 
          prob2 = odds2/(1+odds2) #convert log odds back to probability
          
          cond2_correct = rbinom(1, 1, prob = prob2)
          
          ef2[stim2index,1] = h
          ef2[stim2index,2] = i
          ef2[stim2index,3] = j
          ef2[stim2index,4] = stim2
          ef2[stim2index,5] = cond2_correct
          
          
        }
      }
      
    }
  }
  eflist = list(ef1,ef2)
  return(eflist)
}

sim_random_counter = sim_counterbalance(n_iter = 10)

counter_ef1 = setDT(sim_random_counter[[1]])
counter_ef2 = setDT(sim_random_counter[[2]])

mean(counter_ef1$correct, na.rm = T)
mean(counter_ef2$correct, na.rm = T)

to_join_1_rc = counter_ef1[, .(cond1_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]
to_join_2_rc = counter_ef2[, .(cond2_mean = mean(correct)), by = .(iteration, subject, stimpergroup)]

rctable = left_join(to_join_1_rc,to_join_2_rc)

cohensdrandcounter = as.data.frame(matrix(ncol=11))
colnames(cohensdrandcounter) <- c(stimpergroup)

cohensdrandcounter[,1]= cohen.d(rctable[stimpergroup == 1]$cond1_mean, rctable[stimpergroup == 1]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,2]= cohen.d(rctable[stimpergroup == 6]$cond1_mean, rctable[stimpergroup == 6]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,3]= cohen.d(rctable[stimpergroup == 11]$cond1_mean, rctable[stimpergroup == 11]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,4]= cohen.d(rctable[stimpergroup == 16]$cond1_mean, rctable[stimpergroup == 16]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,5]= cohen.d(rctable[stimpergroup == 21]$cond1_mean, rctable[stimpergroup == 21]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,6]= cohen.d(rctable[stimpergroup == 26]$cond1_mean, rctable[stimpergroup == 26]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,7]= cohen.d(rctable[stimpergroup == 31]$cond1_mean, rctable[stimpergroup == 31]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,8]= cohen.d(rctable[stimpergroup == 36]$cond1_mean, rctable[stimpergroup == 36]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,9]= cohen.d(rctable[stimpergroup == 41]$cond1_mean, rctable[stimpergroup == 41]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,10]= cohen.d(rctable[stimpergroup == 46]$cond1_mean, rctable[stimpergroup == 46]$cond2_mean, paired = T, na.rm = T)$estimate
cohensdrandcounter[,11]= cohen.d(rctable[stimpergroup == 51]$cond1_mean, rctable[stimpergroup == 51]$cond2_mean, paired = T, na.rm = T)$estimate


cohensdrandcounter










