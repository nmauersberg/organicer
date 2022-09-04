import type { NextPage } from 'next';
import Head from 'next/head';
import { KeyPair } from 'p2panda-js';
import { useContext, useState } from 'react';
import { AddJournalEntry } from '../components/MicroJournal/AddEntry';
import { EntryList } from '../components/MicroJournal/EntryList';
import { EncryptStorageContext } from '../context/encryptStorage';

const Home: NextPage = () => {
  const [encryptStorage] = useContext(EncryptStorageContext);
  const [privKey, setPrivKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey')
  );
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : null;

  return (
    <div>
      <Head>
        <title>OrgaNicer</title>
        <meta name='description' content='Orga your life Nicer' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={'center'}>
        <h1>Welcome to OrgaNicer</h1>
        {pubKey ? (
          <div>
            <p>You are signed is as {pubKey.substring(0, 10)}...</p>
            <br />

            <h2>Add an entry to your Journal:</h2>
            <AddJournalEntry />
            <EntryList />
          </div>
        ) : (
          <>
            <p>Generate your Keys!</p>
            <button
              onClick={() => {
                const keyPair = new KeyPair();
                encryptStorage?.setItem('privKey', keyPair.privateKey());
                setPrivKey(keyPair.privateKey());
              }}>
              Generate Keys
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
