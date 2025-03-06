/// <reference types="vite/client" />
declare global {
    interface Window {
      system: {
        getBrowserPath,
        saveProfiles,
        readSettings
      },
      tasks:{
        deleteProfile,
        killBrowsers,
        launchBrowser,
      }
      thiswindow:{
        minimize,
        maximize,
        close
      }
    }
  }
  
  export {};