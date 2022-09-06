import { FadeIn } from 'anima-react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { KeyPair } from 'p2panda-js';
import { useContext, useState, useEffect, ReactElement } from 'react';
import tw, { css, styled } from 'twin.macro';
import { SlideButton } from '../components/button/SlideButton';
import { DashboardChart } from '../components/charts/DashboardChart';
import { PageContainer } from '../components/layout';
import { MainMenu, Page, pages } from '../components/menu/MainMenu';
import { AddJournalEntry } from '../components/MicroJournal/AddEntry';
import { EntryList } from '../components/MicroJournal/EntryList';
import { SmallTitle, Title } from '../components/text';
import { EncryptStorageContext } from '../context/encryptStorage';

import { mdiAccountHeart } from '@mdi/js';
import Icon from '@mdi/react';
import Image from 'next/image';
import { PageLogo } from '../components/layout/PageLogo';
import { PageUser } from '../components/layout/PageUser';
import { Settings } from '../components/pages/Settings';

const Home: NextPage = () => {
  const [encryptStorage] = useContext(EncryptStorageContext);
  const [privKey, setPrivKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey'),
  );
  const [currentPage, setCurrentPage] = useState<Page>(pages[0]);
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : null;

  return (
    <PageContainer>
      <Head>
        <title>OrgaNicer</title>
        <meta name="description" content="Orga your life Nicer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageTitle>
        <PageLogo onClick={() => setCurrentPage(pages[0])} />
        <FadeIn orientation="up" duration={0.5} distance={10}>
          {currentPage.label}
        </FadeIn>
        <PageUser
          showSettings={() =>
            setCurrentPage(pages.find(p => p.id === 'settings') || pages[0])
          }
        />
      </PageTitle>

      <Frame>
        {pubKey ? (
          <PageContent page={currentPage} key={currentPage.id} />
        ) : (
          <>
            <p>Generate your Keys!</p>
            <button
              onClick={() => {
                const keyPair = new KeyPair();
                encryptStorage?.setItem('privKey', keyPair.privateKey());
                setPrivKey(keyPair.privateKey());
              }}
            >
              Generate Keys
            </button>
          </>
        )}
      </Frame>
      <MainMenu setCurrentPage={setCurrentPage} />
    </PageContainer>
  );
};

type PageContentProps = {
  page: Page;
};

const PageContent = ({ page }: PageContentProps): ReactElement => {
  switch (page.id) {
    case 'dashboard':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
          <DashboardChart />
        </FadeIn>
      );
    case 'settings':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <Settings />
        </FadeIn>
      );
    case 'journal':
      return (
        <JustifyBetween>
          <Journal>
            <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
              <>
                {page.description !== '' && (
                  <SmallTitle>{page.description}</SmallTitle>
                )}
              </>
              <EntryList />
            </FadeIn>
          </Journal>
          <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
            <AddJournalEntry />
          </FadeIn>
        </JustifyBetween>
      );
    case 'sport':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
        </FadeIn>
      );
    case 'duty':
      return (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
        </FadeIn>
      );
  }
};

export default Home;

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
]);

const Journal = styled.div(() => [
  css`
    overflow-y: auto;
    height: 100%;
  `,
]);

const PageTitle = styled.h2(() => [
  css`
    font-weight: 600;
    font-size: 2rem;
    width: 100%;
    text-align: center;
    position: absolute;
    top: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  `,
]);

export const JustifyBetween = styled.div(() => [
  tw`flex flex-col justify-between`,
  css`
    height: calc(100vh - 8rem);
  `,
]);
