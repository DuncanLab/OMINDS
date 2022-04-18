# O-MINDS

Welcome to the Object Memorability Image Normed Database Software! 

![The OMINDS App](/resources/Header.png "The OMINDS App")

## Abstract

Much of what we know about neural and cognitive memory mechanisms comes from experiments that use natural images. However, latent stimulus characteristics are rarely considered when designing memory experiments. These stimulus characteristics may contribute substantial noise, distorting memory performance; however, standardizing images can be arduous, especially with no accessible tools for memory researchers. To combat this problem, we developed the Object Memorability Image Normed Database Software (O-MINDS), which generates custom stimulus sets from a bank of 1748 normed images. The images have been normed using a memory recognition task (n=682) for memorability, nameability, and emotionality, along with responses for common encoding orientation questions (i.e., larger or smaller than a shoebox, humanmade or natural, indoors or outdoors). The software quickly creates low-variability stimulus sets based on user-specified inputs through a modern and simple visual interface. By reducing latent variability, the software-selected stimulus sets yielded empirically greater effect sizes than random assignment in 97.2%-100% of designs with 5-80 images per condition (n=95), amounting to a 52.59% average increase in effect size. Thus, the increased statistical power afforded by the software would be helpful for many memory experiments, especially when participants or trials are limited, such as research with clinical populations or resource-intensive methods, such as neuroimaging. O-MINDS is the first easily accessible cross-platform software solution designed for memory researchers that provides a sophisticated and elegant solution to object image selection.

This repository will help you get set up with the latest OMINDS build so that you can start using the app in your studies ASAP! We will also cover how to install the development version of OMINDS to your local machine in case you are interested in modifying the code yourself.

## Getting Started

OMINDS is a native application that you can install on your computer and use offline. It is built with Electron. It is designed for memory researchers interested in assigning object images to different conditions within an experiment. The researcher specifies desired object qualities through a graphical interface and the application selects and divides images from our large, normed stimulus bank. The images are then saved in separate folders, each of which can be assigned to an experimental condition (counterbalanced across participants, if desired). The distributions of intrinsic image memorability are roughly equated across folders, as are other parameters selected by the researcher. A csv file containing the corresponding norming data for each image is also provided.

### Install the OMINDS App for MacOS

Currently, OMINDS works on MacOS for both Apple Silicon and Intel Processor Macs. Windows and Linux support is planned and will be released later on.

Getting a copy of OMINDS is simple, start by opening up the [releases page](https://github.com/DuncanLab/OMINDS/releases) and clicking on the latest release. From here, follow the instructions and download the build that you are interested in. 

Once the `.dmg` file is downloaded, open it and drag the O-MINDS app into your application folder, or wherever else you might want to keep it.

![The OMINDS App](/resources/open_dmg.png "The OMINDS App")

When opening the build for the first time, you will likely be prompted by a message stating that "O-MINDS cannot be opened because the developer cannot be verified." To bypass this, simply right-click on the application and click "Open" from the options provided. 

Once the OMINDS application opens, that's it! You are ready to create image sets. Below, there is a step-by-step guide to creating your first image set that you can follow. 

### Step 1: Select your target directory

Once you have the application open, click on the "Select" button to begin. 

![Select Directory](/resources/Select_Directory.png "Select Directory")

The directory that you choose here will be where all of your image folders and output csv will populate. 

> Note: if you are going through these steps multiple times, please be advised that O-MINDS will overwrite the images and output CSVs from previous uses of this application. This will only occur if you select the same directory multiple times, which already contains outputs from a previous use.

### Step 2: Specify Groups and Images

Next, fill out the text fields under step 2. The first field will specify how many folders you want created, and the second field will specify how many images you would like per folder. Generally, the number of folders will equal the number of conditions in your design. However, if you have different numbers of stimuli per condition or more complex counterbalancing schemes, you will need to determine the optimal number of groups for your purpose.  

> Note: Since there are 1748 images in the set, please make sure that you are asking for fewer than 1748 images at this point.

![Choose Groups and Images](/resources/Choose_Groups.png "Choose Groups and Images")

In our example here we chose 5 groups and 10 images per group. This would correspond to a design with 5 conditions and 10 trials per condition. 

### Step 3: Choose your orientation question

We obtained normative responses to three orientation questions that are commonly used while participants form memories (larger vs. smaller than a shoebox, human-made vs. natural, and indoor vs. outdoor). Here you have the option to select one of these orientation questions if you plan to use it in your experiment. 

If one of these orientation questions are selected, then the software will select only the object images which show a high degree of category agreement across participants (e.g., over 80% of people said that this object belongs inside). It will also ensure 50% of images in each folder are commonly given each response. 

> Note: If you select one of these questions, please request an even number of images per group. Also, selecting a question will further reduce the number of viable stimuli. Of all eight answers, we have the smallest number of natural images. 

![Choose Orientation Question](/resources/Choose_Orientation.png "Choose Orientation Question")

For our example we chose "Is the object larger or smaller than a shoebox?"

### Step 4: Memorability, Nameability, and Emotionality

Next, you can make some detailed selections of different stimulus properties which you want to remain as consistent as possible between groups. Use the sliders to choose a percent value for each dimension, and use the "N/A" slider to specify that this dimension is not applicable.

![Choose Dimensions](/resources/Choose_Memorability.png "Choose Dimensions")

Object images’ memorability, nameability, and emotionality were normed by participants, then transformed into a percentile score across the image database. So, a value of 50 on memorability would mean that the software would select for images which were about average memorability across the current image set. 

> Note: Not all images can be at your desired percentile; the more images you need, the further they will stray from your target value. However, we select the images that are closest to your target and match the distributions of each selected parameter across folders. Since all selected attributes are equally weighted in our algorithm, we recommend only selecting the attributes that you really care about if you require a large number of images.  

### Step 5: Stimuli Uniqueness

While all the stimuli in the image bank are distinct, some are images of the objects that belong to the same basic category. One such example is airplanes. As you can in the image below, these two stimuli are of different kinds of planes, but clearly planes nonetheless.

![Two Airplanes](/resources/Similar_Stimuli.png "Two Airplanes")

We identified non-unique stimuli as those that had the same modal response in our normative naming data. If you would like to remove all such non-unique stimuli, and only keep one of these stimuli (eg. only one airplane) you can click on the switch and set it to "Yes". 

![Specify Uniqueness](/resources/Choose_Uniqueness.png "Specify Uniqueness")

> Note: If you do select this option, please note that the maximum available image pool is reduced to 1174 instead of 1748.

### Step 6: Renaming Stimuli

This switch allows you to choose if you would like your output stimuli to be renamed to something generic instead of maintaining their original, descriptive database names. This could be helpful if you are scripting and selecting files based on which group they are in. For our example, though, we will uncheck this option.

![Renaming Stimuli](/resources/Choose_Renaming.png "Renaming Stimuli")

### Generate your Stimuli

From here, just click on the "Submit" button at the bottom and your stimuli will be generated. If the button is greyed out for you, please double check that you added your target folder and put in valid inputs into all of the fields. 

Once your stimuli are generated, you will get a notification like the one you see below: 

![Success!](/resources/Image_Set_Built.png "Success!")

You can now navigate through your computer's file system to the folder that you selected in step 1. If you followed along with the selections made in this guide, you should see something like this: 

![Folders](/resources/View_Image_Set.png "Folders")

Try click on the first folder to take a look at the images generated. Here's an example of our folder: 

![Stimuli](/resources/View_Image_Folder.png "Stimuli")

Please keep in mind that image allocation within folders is shuffled, so your output may not look exactly the same. That being said, the images that were generated from this input will always be the same, it is just a matter of which folders they were allocated to. 

Finally, you will see that a spreadsheet called `objects.csv` is created in the directory you chose in step 1. This will contain information about all of the stimuli generated for you. 

![Objects.csv](/resources/View_Objects_CSV.png "Objects.csv")

Feel free to experiment with the kinds of image set produced and the different options you have available. Enjoy!

## Getting Started - Development

To get the latest dev build on your machine, follow the steps below. 

### Prerequisites

As mentioned previously, this application is built with ElectronJS, which requires a node backend to run. Please make sure that you have node installed on your machine before you get started. 

Install Node via an [installer](https://nodejs.org/en/download/) or a package manager of your choice.

You will also need either `npm` or `yarn` as your package manager to continue. This project was built using `yarn`. Check out [this installation guide](https://yarnpkg.com/getting-started/install) if you don't have `yarn` installed yet.

### Installing

To procede, clone this repository somewhere on your machine. Next, open up a terminal window on your computer and change directories into the directory you just cloned this repo into. 

Make sure that you are on the same level as `package.json` before continuing. 

To begin, execute the following command. 

```
yarn install
```

This will create a `node_modules` folder in your directory and prepare the project for development. 

Next, execute the following in your terminal window

```
yarn start
```

This will open up the development server on `localhost:3000`. If you navigate to this address through your browser (depending on your IDE your browser might open automatically), you will get an error that you can disregard. Since this project uses electron, some of the functionality is not available in browsers, hence the error. 

To start Electron locally, open a new terminal window and type

```
yarn run electron-start
```

After a few moment, the O-MINDS window should open up and you can begin developing normally.

## Deployment

This project currently deploys to MacOS. To create a new version, please complete the following steps. 

### 1. Ensure you have the latest code from the master branch

Before making a release, do a quick `git pull` from master to make sure that you aren't overwriting any code. 

### 2. Increment the version in `package.json`

This project follows [Semantic Versioning](http://semver.org/) as mentioned below. Please make sure that you change the version number in `package.json` appropriately. 

### 3. Create a production build with React

Before you can make a production build with Electron, you need to build your new version with React. Simply open up a new terminal window, ensure you are in the root directory of this project and type 

```
yarn run build
```

This will create (or update) a `build` folder within this project which will be used by Electron. 

### 4. Transfer over the logos to the `build` directory

In this project, under `/public/logos`, you will find both an `icon.icns` and an `icon.png` file. Copy both of these directly into the `build` file that was created in the previous step. If you don't do this, the new build will not have the O-MINDS icon available. 

### 5. Create the native build

The final step is to create the native build. To do so, type the following in your terminal in the root directory of this project

```
yarn run dist-all
```

This might take some time to run, but once it is complete, you will find a number of different builds in a `/dist` folder. They will be labelled with the version number you specified in the `package.json`. For MacOS, the ones you are looking for are the `-mac.dmg` and `-arm64.dmg` files. These can be uploaded to Github as a new release. 

You now have a new build of the O-MINDS application!

<!-- ## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us. -->

## Versioning

We use [Semantic Versioning](http://semver.org/) for versioning.

## Authors

  - **Author 1** - *Role in the Project and/or Affiliation* -
    [Link](https://github.com/)

<!-- ## License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code is used
  - Inspiration
  - etc -->
