import '../styles/globals.css';
import '../styles/fonts.css';
import type { AppProps } from 'next/app';
import { initWebAssembly } from 'p2panda-js';
import { useContext, useEffect, useState } from 'react';
import {
  EncryptStorageContext,
  EncryptStorageProvider,
} from '../context/encryptStorage';
import GlobalStyles from '../styles/GlobalStyles';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { FadeIn } from 'anima-react';
import { SlideButton } from '../components/button/SlideButton';
import { SmallTitle, Title } from '../components/text';
import { Toaster } from 'react-hot-toast';

type AppState = 'loading' | 'askPin' | 'initialized';

function MyApp(appProps: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Initialize p2panda wasm code
    const init = async () => {
      await initWebAssembly();
      setReady(true);
    };

    init();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <CacheProvider value={cache}>
      <GlobalStyles />
      <Toaster />
      <EncryptStorageProvider>
        <InitApp appProps={appProps} />
      </EncryptStorageProvider>
    </CacheProvider>
  );
}

type InitAppProps = {
  appProps: AppProps;
};

const InitApp = ({ appProps: { Component, pageProps } }: InitAppProps) => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [, setEncryptStorage] = useContext(EncryptStorageContext);

  useEffect(() => {
    if (appState !== 'initialized') {
      const storagePin = localStorage.getItem('pin');
      if (storagePin) {
        const setupStorage = async () => {
          const { EncryptStorage } = await import('encrypt-storage');
          const encryptStorage = new EncryptStorage(
            'Storage-Encryption-Pin-' + storagePin,
          );
          setEncryptStorage(encryptStorage);
        };
        setupStorage().then(() => setAppState('initialized'));
      } else {
        setAppState('askPin');
      }
    }
  }, [appState]);

  switch (appState) {
    case 'loading':
      return (
        <div className={'center'}>
          <FadeIn orientation="up" duration={0.5} delay={0.1}>
            <h2>Loading...</h2>
          </FadeIn>
        </div>
      );
    case 'askPin':
      return <EnterPin pinSaved={() => setAppState('loading')} />;
    case 'initialized':
      return <Component {...pageProps} />;
  }
};

type EnterPinProps = {
  pinSaved: () => void;
};

const EnterPin = ({ pinSaved }: EnterPinProps) => {
  const [pin, setPin] = useState<string | undefined>();

  const savePin = () => {
    if (pin) {
      localStorage.setItem('pin', pin);
      pinSaved();
    }
  };

  return (
    <div className={'center'}>
      <div style={{ maxWidth: '50rem' }}>
        <FadeIn orientation="up" duration={0.5} delay={0.1}>
          <Title>Hi! Es sieht aus, als wärst du neu hier.</Title>
          <p>
            Diese App funktioniert etwas anders, als übliche Webapps. Alle Daten
            werden grundsätzlich nur auf deinem Gerät gespeichert und nur auf
            deine explizite Anweisung mit anderen geteilt.
          </p>
          <p>
            Für ein sicheres und verschlüsseltes Teilen von Daten, kannst du im
            nächsten Schritt ein neues Schlüsselpaar generieren, oder dich mit
            einem vorhandenen privaten Schlüssel anmelden. Der private Schlüssel
            wird auf deinem Gerät gespeichert und mit der folgenden Pin
            verschlüsselt.
          </p>
          <SmallTitle>Bitte lege eine Pin fest:</SmallTitle>
          <input
            type="number"
            placeholder="Verschlüsselungs PIN"
            onChange={e => setPin(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                savePin();
              }
            }}
          />
          <SlideButton
            disabled={!pin}
            onClick={() => {
              savePin();
            }}
          >
            Speichern
          </SlideButton>
        </FadeIn>
      </div>
    </div>
  );
};

export default MyApp;
