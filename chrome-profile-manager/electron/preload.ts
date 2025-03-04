import { ipcRenderer, contextBridge } from 'electron'

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

  


})