const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')  // Use preload.js to expose IPC safely
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle API call for daily tasks
ipcMain.handle('fetch-daily-task', async () => {
  try {
    const response = await axios.get('https://api.example.com/daily-task'); // Replace with your actual API
    return response.data;  // Send the API response to renderer
  } catch (error) {
    console.error('Error fetching daily task:', error);
    return { error: 'Failed to fetch daily task' };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
