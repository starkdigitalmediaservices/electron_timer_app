const {app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'PMS',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, './app/build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
}

app.whenReady().then(createMainWindow);

ipcMain.on('show-modal', (event, arg) => {
    // if (BrowserWindow.getAllWindows().length === 0) {
    //     createMainWindow();
    // }
    console.log(event,arg);
});