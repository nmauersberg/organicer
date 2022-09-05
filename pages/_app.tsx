import '../styles/globals.css'
import '../styles/fonts.css'
import type { AppProps } from 'next/app'
import { initWebAssembly } from 'p2panda-js'
import { useContext, useEffect, useState } from 'react'

import {
  EncryptStorageContext,
  EncryptStorageProvider,
} from '../context/encryptStorage'
import GlobalStyles from '../styles/GlobalStyles'
import { CacheProvider } from '@emotion/react'
import { cache } from '@emotion/css'

// Initialize p2panda wasm code
initWebAssembly() //.then(() => console.log('p2panda initialized'));

type AppState = 'loading' | 'askPin' | 'initialized'

function MyApp(appProps: AppProps) {
  return (
    <CacheProvider value={cache}>
      <GlobalStyles />
      <EncryptStorageProvider>
        <InitApp appProps={appProps} />
      </EncryptStorageProvider>
    </CacheProvider>
  )
}

type InitAppProps = {
  appProps: AppProps
}

const InitApp = ({ appProps: { Component, pageProps } }: InitAppProps) => {
  const [appState, setAppState] = useState<AppState>('loading')
  const [, setEncryptStorage] = useContext(EncryptStorageContext)

  useEffect(() => {
    if (appState !== 'initialized') {
      const storagePin = localStorage.getItem('pin')
      if (storagePin) {
        const setupStorage = async () => {
          const { EncryptStorage } = await import('encrypt-storage')
          const encryptStorage = new EncryptStorage(
            'Storage-Encryption-Pin-' + storagePin,
          )
          setEncryptStorage(encryptStorage)
        }
        setupStorage().then(() => setAppState('initialized'))
      } else {
        setAppState('askPin')
      }
    }
  }, [appState])

  switch (appState) {
    case 'loading':
      return (
        <div className={'center'}>
          <h2>Loading...</h2>
        </div>
      )
    case 'askPin':
      return <EnterPin pinSaved={() => setAppState('loading')} />
    case 'initialized':
      return <Component {...pageProps} />
  }
}

type EnterPinProps = {
  pinSaved: () => void
}

const EnterPin = ({ pinSaved }: EnterPinProps) => {
  const [pin, setPin] = useState<string | undefined>()

  const savePin = () => {
    if (pin) {
      localStorage.setItem('pin', pin)
      pinSaved()
    }
  }

  return (
    <div className={'center'}>
      <h2>Please enter a PIN to access your encrypted storage:</h2>
      <input
        type="number"
        placeholder="Encryption PIN"
        onChange={e => setPin(e.target.value)}
      />
      <button
        disabled={!pin}
        onClick={() => {
          savePin()
        }}
      >
        Save
      </button>
    </div>
  )
}

export default MyApp
