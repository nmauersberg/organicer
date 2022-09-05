import { FadeIn } from 'anima-react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { KeyPair } from 'p2panda-js'
import { useContext, useState, useEffect, ReactElement } from 'react'
import tw, { css, styled } from 'twin.macro'
import { DashboardChart } from '../components/charts/DashboardChart'
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

      <PageTitle>
        <FadeIn orientation="up" duration={0.5} distance={10}>
          OrgaNicer
        </FadeIn>
      </PageTitle>

      <Frame>
        {pubKey ? (
          <PageContent page={currentPage} key={currentPage} />
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
      </Frame>
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
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <SmallTitle>Dashboard</SmallTitle>
          <DashboardChart />
        </FadeIn>
      )
    case 'journal':
      return (
        <JustifyBetween>
          <Journal>
            <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
              <SmallTitle>Tagebuch</SmallTitle>
              <EntryList />
            </FadeIn>
          </Journal>
          <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
            <AddJournalEntry />
          </FadeIn>
        </JustifyBetween>
      )
    case 'sport':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <SmallTitle>Sport</SmallTitle>
        </FadeIn>
      )
    case 'duty':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <SmallTitle>Aufgaben</SmallTitle>
        </FadeIn>
      )
  }
}

export default Home

const Frame = styled.div(() => [
  css`
    height: 100vh;
    min-width: 50vw;
    padding: 6rem 1rem 2rem 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  `,
])

const Journal = styled.div(() => [
  css`
    overflow-y: auto;
    height: 100%;
  `,
])

const PageTitle = styled.h2(() => [
  css`
    font-weight: 600;
    font-size: 2rem;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 1.5rem;
  `,
])

export const JustifyBetween = styled.div(() => [
  tw`flex flex-col justify-between`,
  css`
    height: calc(100vh - 8rem);
  `,
])
