import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import './App.css'

function App() {
  // Define Type for Profile or else there will be errors when array is empty and types cannot be assumed
  interface Profile {
    name: string
    icon: ReactElement
    exePath: string
    pid: number
    delete: boolean
  }

  const [availableNumbers, setAvailableNumbers] = useState<Set<number>>(new Set())
  const [profileArray, setProfileArray] = useState<Profile[]>([])
  const [launchUrl, setLaunchUrl] = useState('')
  const [browserPath, setBrowserPath] = useState('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')


  const getSmallestNumber = (): number => {
    let helperSet = new Set(availableNumbers)
    if (helperSet.size > 0) {
      let min = Math.min(...Array.from(helperSet))
      helperSet.delete(min)
      setAvailableNumbers(new Set(helperSet))
      return min
    }
    return profileArray.length > 0 ? profileArray.length + 1 : 1
  }


  let icon = (height: number, width: number, type: string) => {
    if (type == 'chrome') {
      return (
        <svg className={`-mt-0.5  ${hoverBrowser == 'chrome' ? ' fill-green-500 ' : ' '}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" height={`${String(height)}`} width={`${String(width)}`} stroke-width="2">
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
          <path d="M12 9h8.4"></path>
          <path d="M14.598 13.5l-4.2 7.275"></path>
          <path d="M9.402 13.5l-4.2 -7.275"></path>
        </svg>
      )
    }
    // else if (type == 'edge') {
    //   return (
    //     <svg className={`-mt-0.5 ${hoverBrowser == 'edge' ? ' fill-blue-500 ' : ' '}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" height={`${String(height)}`} width={`${String(width)}`} stroke-width="2">
    //       <path d="M20.978 11.372a9 9 0 1 0 -1.593 5.773"></path>
    //       <path d="M20.978 11.372c.21 2.993 -5.034 2.413 -6.913 1.486c1.392 -1.6 .402 -4.038 -2.274 -3.851c-1.745 .122 -2.927 1.157 -2.784 3.202c.28 3.99 4.444 6.205 10.36 4.79"></path>
    //       <path d="M3.022 12.628c-.283 -4.043 8.717 -7.228 11.248 -2.688"></path>
    //       <path d="M12.628 20.978c-2.993 .21 -5.162 -4.725 -3.567 -9.748"></path>
    //     </svg>
    //   )
    // }
    // else if (type = 'brave') {
    //   return (
    //     <svg className={`-mt-0.5  ${hoverBrowser == 'brave' ? ' fill-orange-500 ' : ' '}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" height={`${String(height)}`} width={`${String(width)}`} stroke-width="2">
    //       <path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z"></path>
    //       <path d="M2 16h5l-4 4"></path>
    //       <path d="M22 16h-5l4 4"></path>
    //       <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
    //       <path d="M9 11v.01"></path>
    //       <path d="M15 11v.01"></path>
    //     </svg>
    //   )
    // }
    return (<></>)
  }


  // Logic for addimg browser profiles
  let handleAddProfile = async (browserType: string) => {
    setProfileArray(prevArray => {
      let number = getSmallestNumber()
      let newProfile: Profile = {
        name: '',
        icon: <></>,
        exePath: '',
        pid: 0,
        delete: false
      }

      newProfile = {
        name: String(number),
        icon: icon(100, 100, browserType),
        exePath: browserPath,
        pid: 0,
        delete: false
      }
      return [...prevArray, newProfile]
    })
  }

  const [hoverBrowser, setHoverBrowser] = useState('')
  let browserButtons = (
    <button title='Create Chrome Profile' className='h-[25px] p-1 flex flex-row bg-white rounded-lg'
      onMouseEnter={() => { setHoverBrowser('chrome') }}
      onMouseLeave={() => { setHoverBrowser('') }}
      onClick={() => handleAddProfile('chrome')}
    >
      {icon(22, 22, 'chrome')}
      <svg className="fill-white -mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="22" fill="none" viewBox="3 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
      </svg>
    </button>
  )


  let profileCards = profileArray.map((profile) => (
    <div className=' flex flex-col bg-white h-[160px] w-[100px] rounded-lg border '>
      <div className={'flex justify-center' + `${profile.exePath.includes('chrome') ? ' hover:fill-red-500 ' : (profile.exePath.includes('edge')) ? ' hover:fill-sky-500 ' : ' hover:fill-orange-500 '}`}>
        {profile.icon}
      </div>

      <div className='flex justify-center font-bold'>
        Profile {profile.name}
      </div>

      <div className='flex flex-row justify-between p-1'>
        <button title='Delete Profile'

        >
          <svg className='hover:fill-black' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M4 7l16 0"></path>
            <path d="M10 11l0 6"></path>
            <path d="M14 11l0 6"></path>
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
          </svg>
        </button>

        <button title='Kill Process'
          onClick={async () => {
            try {
              await window.tasks.killBrowsers(profile.pid)
              profile.pid = 0
            } catch (error) { }
          }}
        >
          <svg className='hover:fill-red-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
          </svg>
        </button>

        <button title='Launch Browser'
          onClick={async () => {
            if (profile.pid == 0) {
              profile.pid = await window.tasks.launchBrowser(launchUrl, profile.exePath, profile.name)
            }
            else {
              await window.tasks.launchBrowser(launchUrl, profile.exePath, profile.name)
            }
          }
          }
        >
          <svg className='hover:fill-green-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M7 4v16l13 -8z"></path>
          </svg>
        </button>
      </div>
    </div >
  ))


  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>, inputElement: string) => {
    const { target } = e
    if (inputElement == 'url') {
      setLaunchUrl(target.value)
    }
  }

  return (
    <>
      <div className='flex flex-col'>

        {/* Title Bar */}
        <div className='titleBar flex flex-row gap-1 justify-end bg-neutral-800 '>
          {/* Add Browser Profile Button(s) */}
          <div className='flex flex-row gap-1 p-1 ml-0.5'>
            {browserButtons}
          </div>
          <div className='flex grow justify-center'>
            <h1 className='text-white mt-1'>Chrome Profile Manager</h1>
          </div>
          {/* settings button */}
          {/* <button className=''>
            <svg className='fill-neutral-200 hover:fill-sky-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            </svg>
          </button> */}

          <div className='flex gap-2.5 mr-1'>
            {/* minimize */}
            <button className=''
              onClick={() => { window.thiswindow.minimize() }}
            >
              <svg className='fill-neutral-200 hover:fill-green-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                <path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z"></path>
                <path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path>
                <path d="M15 13h-4v-4"></path>
                <path d="M11 13l5 -5"></path>
              </svg>
            </button>

            {/* maximize */}
            <button className=''
              onClick={() => { window.thiswindow.maximize() }}
            >
              <svg className='fill-neutral-200 hover:fill-yellow-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                <path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z"></path>
                <path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path>
                <path d="M12 8h4v4"></path>
                <path d="M16 8l-5 5"></path>
              </svg>
            </button>

            {/* close */}
            <button className=''
              onClick={() => { window.thiswindow.close() }}
            >
              <svg className='fill-neutral-200 hover:fill-red-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path>
                <path d="M9 9l6 6m0 -6l-6 6"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Url bar */}
        <div className="relative w-full bg-neutral-400 px-1 ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
            <svg className=" w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M8.64 4.737A7.97 7.97 0 0 1 12 4a7.997 7.997 0 0 1 6.933 4.006h-.738c-.65 0-1.177.25-1.177.9 0 .33 0 2.04-2.026 2.008-1.972 0-1.972-1.732-1.972-2.008 0-1.429-.787-1.65-1.752-1.923-.374-.105-.774-.218-1.166-.411-1.004-.497-1.347-1.183-1.461-1.835ZM6 4a10.06 10.06 0 0 0-2.812 3.27A9.956 9.956 0 0 0 2 12c0 5.289 4.106 9.619 9.304 9.976l.054.004a10.12 10.12 0 0 0 1.155.007h.002a10.024 10.024 0 0 0 1.5-.19 9.925 9.925 0 0 0 2.259-.754 10.041 10.041 0 0 0 4.987-5.263A9.917 9.917 0 0 0 22 12a10.025 10.025 0 0 0-.315-2.5A10.001 10.001 0 0 0 12 2a9.964 9.964 0 0 0-6 2Zm13.372 11.113a2.575 2.575 0 0 0-.75-.112h-.217A3.405 3.405 0 0 0 15 18.405v1.014a8.027 8.027 0 0 0 4.372-4.307ZM12.114 20H12A8 8 0 0 1 5.1 7.95c.95.541 1.421 1.537 1.835 2.415.209.441.403.853.637 1.162.54.712 1.063 1.019 1.591 1.328.52.305 1.047.613 1.6 1.316 1.44 1.825 1.419 4.366 1.35 5.828Z" clip-rule="evenodd" />
            </svg>

          </div>
          <input type="text" id="simple-search" value={launchUrl} onChange={(e) => { handleUrlChange(e, 'url') }} className="h-[30px] mt-1.5 mb-1.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Initial Launch URL" />
        </div>

        {/* Profiles Container */}
        <div className='flex flex-wrap content-start bg-neutral-200 h-[calc(100vh-80px)] w-[] p-2 gap-2 overflow-auto '>
          {profileCards}
        </div>
      </div>
    </>
  )
}

export default App
