const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  fetchAPIData: () => ipcRenderer.invoke('fetch-api-data') // Handle data fetch
});
