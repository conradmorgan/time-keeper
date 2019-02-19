const {app, globalShortcut, BrowserWindow, Tray, ipcMain, dialog} = require('electron')
const {autoUpdater} = require("electron-updater")

let win

function createDefaultWindow() {
    win = new BrowserWindow({width: 400, height: 500, resizable: false})
    win.confirmation = function(message, callback) {
        dialog.showMessageBox(win, {
            buttons: ["Yes", "Cancel"],
            message: message
        }, callback)
    }
    win.redTray = function() {
        win.setOverlayIcon(app.getAppPath() + '/assets/red-icon.png', 'Time Keeper')
    }
    win.greenTray = function() {
        win.setOverlayIcon(app.getAppPath() + '/assets/green-icon.png', 'Time Keeper')
    }
    win.redTray()
    win.loadFile('index.html')
    const ret = globalShortcut.register('Alt+W', () => {win.webContents.executeJavaScript('next()')})
    win.on('closed', () => app.quit())
}

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
})

autoUpdater.on('download-progress', (progress) => {
    win.webContents.send("downloadProgress", progress.percent)
})

ipcMain.on('quitAndInstall', (event, arg) => {
    autoUpdater.quitAndInstall()
})

app.on('ready', function() {
    createDefaultWindow()
    autoUpdater.checkForUpdates()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('quit', () => {
  globalShortcut.unregisterAll()
})
