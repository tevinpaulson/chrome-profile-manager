"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld(`thiswindow`, {
  minimize: async () => {
    electron.ipcRenderer.invoke("minimize-window");
  },
  maximize: async () => {
    electron.ipcRenderer.invoke("maximize-window");
  },
  close: async () => {
    electron.ipcRenderer.invoke("close-window");
  }
});
electron.contextBridge.exposeInMainWorld("system", {
  getBrowserPath: async () => {
    let r = electron.ipcRenderer.invoke("get-browser-path");
    electron.ipcRenderer.once("GET_BROWSER_PATH", (_, _result) => {
    });
    return r;
  },
  saveProfiles: async (text) => {
    electron.ipcRenderer.invoke("save-profiles", text);
    electron.ipcRenderer.once("SAVE-PROFILES", () => {
    });
  },
  readSettings: async () => {
    let r = electron.ipcRenderer.invoke("read-settings");
    electron.ipcRenderer.once("READ-SETTINGS", (_, _result) => {
    });
    return r;
  }
});
electron.contextBridge.exposeInMainWorld("tasks", {
  launchBrowser: async (url, browserPath, profileNum) => {
    let r = electron.ipcRenderer.invoke("launch-browser", url, browserPath, profileNum);
    electron.ipcRenderer.once("LAUNCH_BROWSER", async () => {
    });
    return r;
  },
  killBrowsers: async (pid) => {
    let r = electron.ipcRenderer.invoke("kill-browsers", pid);
    electron.ipcRenderer.once("KILL_BROWSERS", async () => {
    });
    return r;
  },
  deleteProfile: async (profileName) => {
    let r = electron.ipcRenderer.invoke("delete-profile", profileName);
    electron.ipcRenderer.once("DELETE_PROFILE ${}", async () => {
    });
    return r;
  }
});
