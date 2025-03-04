import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { spawn } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    minHeight: 256,
    minWidth: 390,
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Menu.setApplicationMenu(null)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)


ipcMain.handle('minimize-window', () => {
  if (win) {
    win.minimize();
  }
});
ipcMain.handle('maximize-window', () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});
ipcMain.handle('close-window', () => {
  if (win) {
    win.close();
  }
});








class Browser {
  name: string
  browserPath: string
  url: string
  constructor(name: string, browserPath: string, url: string) {
    this.name = name
    this.browserPath = browserPath
    this.url = url
  }

  async init() {
    let pid = spawnBrowser(this.name, this.browserPath, this.url)
    return pid
  }
}



let spawnBrowser = (name: string, browserPath: string, url: string) => {
  if (!url.includes('.')) {
    url = 'chrome:newtab'
  }

  let flags = [
    `--profile-directory=Profile ${name}`,
    '--disable-popup-blocking',
    '--no-first-run',
    '--hide-crash-restore-bubble',
    '--disable-sync',
    `--no-default-browser-check`,
    '--proxy-server=185.221.217.128:48365',
    `${url}`
  ]

  let chrome = spawn(
    path.join(browserPath),
    flags,
    { detached: true, stdio: 'ignore' }
  );
  chrome.unref();
  console.log(chrome.pid)
  return chrome.pid
}










const launchBrowser = async (_event: Electron.IpcMainInvokeEvent, url: string, browserPath: string, name: string) => {
  let context = new Browser(name, browserPath, url)
  let browserPid = context.init()

  return browserPid
}

const killBrowsers = async (_event: Electron.IpcMainInvokeEvent, pid: number) => {
  if (pid != 0) {
    try {
      await process.kill(pid)
      console.log('killt')
      return true
    } catch (error) { return true }
  }

}





// BROWSER TASKS
ipcMain.handle('launch-browser', async (event, url, browserPath, name) => {
  let r = await launchBrowser(event, url, browserPath, name)
  return r
})





ipcMain.handle('kill-browsers', async (event, pid) => {
  let r = await killBrowsers(event, pid)
  return r
})

