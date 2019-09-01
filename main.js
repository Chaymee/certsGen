const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow

// listen for app to be ready
app.on('ready', function(){
    // create a new window
    mainWindow = new BrowserWindow({});
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build mennu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle new certificate window
function createNewWindow(){
    // create a new window
    newWindow = new BrowserWindow({
        width: 400,
        height: 600,
        title: 'Enter parameters for new certificate'
    });
    // Load html into window
    newWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
}

// Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
            label: 'New Certificate',
            accelerator: process.platform == 'darwin' ? 'Command+N' :
            'Ctrl+N',
            click(){
                createNewWindow();
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 
            'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
    }
]
