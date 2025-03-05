/// <reference types="vite/client" />
declare global {
    interface Window {
      system: {
        getBrowserPath, // Adjust the return type based on what getPath returns
        saveProfiles,// Use later for new feature
        readSettings // Use later for new feature
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
  
  // This is required to make the file a module
  export {};