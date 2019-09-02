const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow

// listen for app to be ready
app.on('ready', function(){
    // create a new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Quit app when Main window closes
    mainWindow.on('closed', function(){
        app.quit();
    });
    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);
})


// Handle new certificate window
function createNewWindow(){
    // create a new window
    newWindow = new BrowserWindow({
        width: 450,
        height: 450,
        title: 'Enter parameters for new certificate',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load html into window
    newWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Clear memory from closed window
    newWindow.on('closed', function(){
        newWindow = null;
    });
};

// Catch payloade from new certificate window
ipcMain.on('cert:new', function(e, payload){
    console.log(payload)
    mainWindow.webContents.send('cert:new', payload);
    newWindow.close();
});

// Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
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
];

// If mac, add empty object to menu
/*
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}
*/
// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
