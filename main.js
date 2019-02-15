const {app, globalShortcut, BrowserWindow, Tray, ipcMain} = require('electron')
const {autoUpdater} = require("electron-updater")

let win

function createDefaultWindow() {
    win = new BrowserWindow({width: 400, height: 600, resizable: false})
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
    return win
}
app.on('ready', function() {
  createDefaultWindow()
    autoUpdater.checkForUpdates()
})
autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
})
ipcMain.on("quitAndInstall", (event, arg) => {
    autoUpdater.quitAndInstall()
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
