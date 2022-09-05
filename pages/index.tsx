import type { NextPage } from 'next'
import Head from 'next/head'
import { KeyPair } from 'p2panda-js'
import { useContext, useState, useEffect, ReactElement } from 'react'
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
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
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
            <PageContent page={currentPage} />
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
      <MainMenu setCurrentPage={setCurrentPage} />
    </PageContainer>
  )
}

export type Page = 'dashboard' | 'journal' | 'sport' | 'duty'

type PageContentProps = {
  page: Page
}

const PageContent = ({ page }: PageContentProps): ReactElement => {
  switch (page) {
    case 'dashboard':
      return (
        <>
          <SmallTitle>Dashboard</SmallTitle>
        </>
      )
    case 'journal':
      return (
        <>
          <SmallTitle>Tagebuch</SmallTitle>
          <AddJournalEntry />
          <EntryList />
        </>
      )
    case 'sport':
      return (
        <>
          <SmallTitle>Sport</SmallTitle>
        </>
      )
    case 'duty':
      return (
        <>
          <SmallTitle>Aufgaben</SmallTitle>
        </>
      )
  }
}

export default Home
