// Preload script for Electron security
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // You can add secure APIs here if needed
});
