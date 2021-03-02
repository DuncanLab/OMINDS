

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron')

// const customTitlebar = require('..'); // Delete this line and uncomment top line
console.log("Hello!")

process.once('loaded', () => {
    console.log("Loaded!")
    window.addEventListener('message', evt => {
        console.log(evt)
        if (evt.data.type === 'select-dirs') {
            ipcRenderer.send('select-dirs')
        }
        if (evt.data.submitted === 'submitted') {
            ipcRenderer.sendSync('submitted', evt.data)
            // console.log("hit submit preload", evt.data)
            // ipcRenderer.send('evt.data.checkedRenamed')
        }
    })
})