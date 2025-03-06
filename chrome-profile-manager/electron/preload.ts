import { ipcRenderer, contextBridge } from 'electron'

interface Profile {
  name: string
  icon: string
  exePath: string
  folderPath: string
  pid: number
  delete: boolean
}

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

})

contextBridge.exposeInMainWorld(`thiswindow`, {
  minimize: async () => {
    ipcRenderer.invoke('minimize-window')
  },
  maximize: async () => {
    ipcRenderer.invoke('maximize-window')
  },
  close: async () => {
    ipcRenderer.invoke('close-window')
  }
})

contextBridge.exposeInMainWorld('system', {
  getBrowserPath: async () => {
    let r = ipcRenderer.invoke('get-browser-path')
    ipcRenderer.once('GET_BROWSER_PATH', (_, _result) => {
    })
    return r
  },
  saveProfiles: async (text: Profile[]) => {
    let r = ipcRenderer.invoke('save-profiles', text)
    ipcRenderer.once('SAVE-PROFILES', () => { })
  },
  readSettings: async () => {
    let r = ipcRenderer.invoke('read-settings')
    ipcRenderer.once('READ-SETTINGS', (_, _result) => { })
    return r
  },

})

contextBridge.exposeInMainWorld('tasks', {
  launchBrowser: async (url: string, browserPath: string, profileNum: string) => {
    let r = ipcRenderer.invoke('launch-browser', url, browserPath, profileNum)
    ipcRenderer.once('LAUNCH_BROWSER', async () => {

    })
    return r;
  },

  killBrowsers: async (pid: number) => {
    let r = ipcRenderer.invoke('kill-browsers', pid)
    ipcRenderer.once('KILL_BROWSERS', async () => {
    })
    return r;
  },

  deleteProfile: async (profileName: string) => {
    let r = ipcRenderer.invoke('delete-profile', profileName)
    ipcRenderer.once('DELETE_PROFILE ${}', async () => {
    })
    return r;
  },
})