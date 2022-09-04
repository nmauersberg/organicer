import type { NextPage } from 'next'
import Head from 'next/head'
import { KeyPair } from 'p2panda-js'
import { useContext, useState, useEffect } from 'react'
import { PageContainer } from '../components/layout'
import { MainMenu } from '../components/menu/MainMenu'
import { AddJournalEntry } from '../components/MicroJournal/AddEntry'
import { EntryList } from '../components/MicroJournal/EntryList'
import { SmallTitle, Title } from '../components/text'
import { EncryptStorageContext } from '../context/encryptStorage'

const Home: NextPage = () => {
  const [encryptStorage] = useContext(EncryptStorageContext)
  const [privKey, setPrivKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey'),
  )
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : null

  return (
    <PageContainer>
      <Head>
        <title>OrgaNicer</title>
        <meta name="description" content="Orga your life Nicer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={'center'}>
        <Title>OrgaNicer</Title>
        {pubKey ? (
          <div>
            {/* <p>You are signed is as {pubKey.substring(0, 10)}...</p> */}
            <SmallTitle>Tagebuch</SmallTitle>
            <AddJournalEntry />
            <EntryList />
            <MainMenu />
          </div>
        ) : (
          <>
            <p>Generate your Keys!</p>
            <button
              onClick={() => {
                const keyPair = new KeyPair()
                encryptStorage?.setItem('privKey', keyPair.privateKey())
                setPrivKey(keyPair.privateKey())
              }}
            >
              Generate Keys
            </button>
          </>
        )}
      </div>
      <MainMenu />
    </PageContainer>
  )
}

export default Home
