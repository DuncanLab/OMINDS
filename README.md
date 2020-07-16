## How to start the application
1. Install Node via an [installer](https://nodejs.org/en/download/) or a package manager  
2. Go to the root of the project directory and run `npm install`
3. Run `npm start` to serve @localhost:3000.
4. Run `npm run electron-start`, and you should see a window at this point :)

## Available Scripts

Please install required node modules via `npm install`
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run electron-start`
Starts electron.<br />
Note: this command has to be ran after `npm start` since electron displays `http://localhost:3000`

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
