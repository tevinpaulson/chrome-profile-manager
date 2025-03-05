import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path, { join } from 'node:path'
import { spawn, execSync } from 'node:child_process'
import fs from 'fs'

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

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
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

const getBrowserPath = () => {
  try {
    const commandChrome = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve`
    const commandEdge = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\msedge.exe" /ve`
    const commandBrave = `reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\brave.exe" /ve`
    const outputChrome = execSync(commandChrome, { encoding: "utf-8" })
    const outputEdge = execSync(commandEdge, { encoding: "utf-8" });
    const outputBrave = execSync(commandBrave, { encoding: "utf-8" })
    const matchChrome = outputChrome.match(/REG_SZ\s+([^\r\n]+)/)
    const matchEdge = outputEdge.match(/REG_SZ\s+([^\r\n]+)/)
    const matchBrave = outputBrave.match(/REG_SZ\s+([^\r\n]+)/)
    return [matchChrome ? matchChrome[1].trim() : null, matchEdge ? matchEdge[1].trim() : null, matchBrave ? matchBrave[1].trim() : null]
  } catch (error) {
    return []
  }
}

let spawnBrowser = (name: string, browserPath: string, url: string) => {
  let profilePath = join(app.getPath('userData'), 'UserDataSaves')
  
  if (!url.includes('.')) {
    url = 'chrome:newtab'
  }

  let flags = [
    `--user-data-dir=${profilePath}\\${name}\\Default`,
    '--disable-popup-blocking',
    '--no-first-run',
    '--hide-crash-restore-bubble',
    '--disable-sync',
    `--no-default-browser-check`,
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
      return true
    } catch (error) { return true }
  }
}

const deleteProfile = async (_event: Electron.IpcMainInvokeEvent, profileName: string) => {
  let folderPath = join(app.getPath('userData'), 'UserDataSaves', profileName)
  try {
    fs.rmSync(folderPath, { recursive: true, force: true })
  } catch (error) {

  }
}

interface Profile {
  name: string
  icon: string
  exePath: string
  folderPath: string
  pid: number
  delete: boolean
}

const saveProfiles = async (_event: Electron.IpcMainInvokeEvent, text: Profile[]) => {
  let directory = join(app.getPath('userData'), 'settings.json')
  try {
    await fs.promises.writeFile(directory, JSON.stringify(text, null, 2));
  }
  catch (error) {
    console.log(error)
  }
  _event.sender.send(`SAVED_PROFILES`)
}

const readSettings = async (event: Electron.IpcMainInvokeEvent) => {
  let text = undefined
  let path = join(app.getPath('userData'), 'settings.json')
  try {
    text = await fs.promises.readFile(path, 'utf8')
  }
  catch (error) {
    try {
      let obj: Profile[] = []

      fs.writeFile(path, JSON.stringify(obj, null, 2), () => {
      });
      event.sender.send(`READ_SETTINGS`, '0')
    }
    catch (error) { }
  }
  event.sender.send(`READ_SETTINGS`, text)
  return text
}








ipcMain.handle('get-browser-path', async (_event) => {
  let result = await getBrowserPath()
  return result
})

ipcMain.handle('launch-browser', async (event, url, browserPath, name) => {
  let r = await launchBrowser(event, url, browserPath, name)
  return r
})

ipcMain.handle('kill-browsers', async (event, pid) => {
  let r = await killBrowsers(event, pid)
  return r
})

ipcMain.handle('delete-profile', async (event, profileName) => {
  let r = await deleteProfile(event, profileName)
  return r
})

ipcMain.handle('save-profiles', async (event, text) => {
  let r = await saveProfiles(event, text)
  return r
})

ipcMain.handle('read-settings', async (event) => {
  let r = await readSettings(event)
  return r
})