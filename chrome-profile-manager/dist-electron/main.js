var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
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
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
ipcMain.handle("minimize-window", () => {
  if (win) {
    win.minimize();
  }
});
ipcMain.handle("maximize-window", () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});
ipcMain.handle("close-window", () => {
  if (win) {
    win.close();
  }
});
class Browser {
  constructor(name, browserPath, url) {
    __publicField(this, "name");
    __publicField(this, "browserPath");
    __publicField(this, "url");
    this.name = name;
    this.browserPath = browserPath;
    this.url = url;
  }
  async init() {
    let pid = spawnBrowser(this.name, this.browserPath, this.url);
    return pid;
  }
}
let spawnBrowser = (name, browserPath, url) => {
  if (!url.includes(".")) {
    url = "chrome:newtab";
  }
  let flags = [
    `--profile-directory=Profile ${name}`,
    "--disable-popup-blocking",
    "--no-first-run",
    "--hide-crash-restore-bubble",
    "--disable-sync",
    `--no-default-browser-check`,
    "--proxy-server=185.221.217.128:48365",
    `${url}`
  ];
  let chrome = spawn(
    path.join(browserPath),
    flags,
    { detached: true, stdio: "ignore" }
  );
  chrome.unref();
  console.log(chrome.pid);
  return chrome.pid;
};
const launchBrowser = async (_event, url, browserPath, name) => {
  let context = new Browser(name, browserPath, url);
  let browserPid = context.init();
  return browserPid;
};
const killBrowsers = async (_event, pid) => {
  if (pid != 0) {
    try {
      await process.kill(pid);
      console.log("killt");
      return true;
    } catch (error) {
      return true;
    }
  }
};
ipcMain.handle("launch-browser", async (event, url, browserPath, name) => {
  let r = await launchBrowser(event, url, browserPath, name);
  return r;
});
ipcMain.handle("kill-browsers", async (event, pid) => {
  let r = await killBrowsers(event, pid);
  return r;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
