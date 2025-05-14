const { app, BrowserWindow, nativeImage, Menu} = require('electron')
const os = require('os')
const osUtils = require('os-utils')
const path = require('path')

// modify your existing createWindow() function
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    center: true,
    resizable: false,
    fullscreen: false,
    darkTheme: true,
    icon: './static/images/icon_v2.icns',
    width: 930,
    minWidth: 930,
    minHeight: 700,
    webPreferences: {
        defaultEncoding: 'UTF-8',
        devTools: true,
        webSecurity: true,
        nodeIntegration : true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.once('ready-to-show', () => {
        mainWindow.show()
  })

  setInterval(() => {
        osUtils.cpuUsage(function (v) {
            mainWindow.webContents.send("cpu", v * 100 );
            let tmem = osUtils.totalmem()
            let fmem = osUtils.freemem()
            mainWindow.webContents.send("mem", (tmem-fmem) / 1024);
            mainWindow.webContents.send("total-mem", tmem / 1024);
        });
  }, 2000);

  mainWindow.loadFile('./static/main.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit the application when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})