// const {app, BrowserWindow, ipcMain } = require('electron');
// const url = require('url');
// const path = require('path');

// function createMainWindow() {
//     const mainWindow = new BrowserWindow({
//         title: 'PMS',
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js')
//         }
//     });

//     mainWindow.webContents.openDevTools();

//     const startUrl = url.format({
//         pathname: path.join(__dirname, './app/build/index.html'),
//         protocol: 'file:',
//         slashes: true
//     });

//     // mainWindow.loadURL('http://localhost:3000');
//     mainWindow.loadFile(path.join(__dirname, '..', 'build', 'index.html'));
// }

// app.whenReady().then(createMainWindow);

// ipcMain.on('show-modal', (event, arg) => {
//     // if (BrowserWindow.getAllWindows().length === 0) {
//     //     createMainWindow();
//     // }
//     console.log(event,arg);
// });


// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');

// function createMainWindow() {
//     const mainWindow = new BrowserWindow({
//         title: 'PMS',
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js'),
//             webSecurity: false,
//             allowRunningInsecureContent: true
//         }
//     });

//     mainWindow.webContents.openDevTools();

//     //  mainWindow.loadFile(path.join(__dirname, '..', '..', 'app', 'build', 'index.html'));
//     const isDev = process.env.NODE_ENV !== 'development';

//     if (isDev) {
//         mainWindow.loadURL('http://localhost:3000');
//     } else {
//         console.log('appPath: ');
//         // mainWindow.loadURL(`file://${path.join(__dirname, '../../build/index.html')}`);
//         const appPath =  app.getAppPath()
//         mainWindow.loadFile(path.join(appPath, 'app/build/index.html'));
//     }

//     mainWindow.on('closed', () => {
//     });
// }

// app.whenReady().then(createMainWindow);

// ipcMain.on('show-modal', (event, arg) => {
//     console.log(event,arg);
// });


const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'PMS',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
            allowRunningInsecureContent: true
        }
    });

    mainWindow.webContents.openDevTools();
    const isDev = process.env.NODE_ENV !== 'development';

    if (isDev) {
        let reactServer;
         if (process.platform === 'win32') {
            reactServer = spawn(process.execPath, ['npm', 'start'], { cwd: path.join(__dirname, '..', '..', 'app') });
        } else {
             reactServer = spawn('npm', ['start'], { cwd: path.join(__dirname, '..', '..', 'app') });
         }

        reactServer.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            mainWindow.loadURL('http://localhost:3000');
        });

        reactServer.stderr.on('data', (data) => {
           console.error(`stderr: ${data}`);
        });

        reactServer.on('close', (code) => {
           console.log(`React server exited with code ${code}`);
        });

    } else {
       const appPath =  app.getAppPath()
        mainWindow.loadFile(path.join(appPath, 'app/build/index.html'));
    }

    mainWindow.on('closed', () => {
    });
}

app.whenReady().then(createMainWindow);

ipcMain.on('show-modal', (event, arg) => {
    console.log(event,arg);
});