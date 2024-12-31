const { app, BrowserWindow } = require('electron');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      console.log(response.data); // Log response from the Python API

      // Send the response to renderer process (optional)
      mainWindow.webContents.send('api-response', response.data);
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// app.whenReady().then(createWindow);
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recreate the window if the app is activated (macOS behavior)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
    //   createMainWindow();
      createWindow();
    }
  });