/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
    appId: "com.pmsDesktop",
    productName: "pmsDesktop",
    asar: false,
    files: [
      "electron/main.js",
      "electron/preload.js",
      "electron/package.json",
      "node_modules",
        "build"
      ],
      directories: {
          output: "../dist"
      },
    win: {
      target: "nsis",
    },
    linux: {
      target: "AppImage",
      icon: "assets/icon.png",
    },
     extends: null,
      publish: null
  };