const {app, globalShortcut, BrowserWindow, Tray} = require('electron')

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
    return win
}
app.on('ready', function() {
  createDefaultWindow()
});
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
