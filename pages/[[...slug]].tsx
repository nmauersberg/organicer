import type { GetServerSideProps, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { KeyPair } from 'p2panda-js';
import { useContext, useState, ReactElement, useEffect } from 'react';
import tw, { css, styled } from 'twin.macro';
import { PageContainer } from '../components/layout';
import { MainMenu, Page, PageId, pages } from '../components/menu/MainMenu';
import { EncryptStorageContext } from '../context/encryptStorage';
import { Settings } from '../components/views/Settings';
import { KeyPairLogin } from '../components/views/KeyPairLogin';
import { Journal } from '../components/views/Journal';
import { Dashboard } from '../components/views/Dashboard';
import { Sport } from '../components/views/Sport';
import { Duty } from '../components/views/Duty';

export type PageProps = {
  slug: string;
};

const Home = ({ slug }: PageProps) => {
  const [currentPage, setCurrentPage] = useState<Page>(
    pages.find(p => p.id === slug) || pages[0],
  );

  useEffect(() => {
    setCurrentPage(pages.find(p => p.id === slug) || pages[0]);
  }, [slug]);

  // Storage
  const [encryptStorage] = useContext(EncryptStorageContext);

  // Panda keys
  const [privKey, setPrivKey] = useState<string | undefined>();
  useEffect(() => {
    setPrivKey(encryptStorage?.getItem('privKey'));
  }, [encryptStorage]);

  const [pubKey, setPubKey] = useState<string | undefined>();
  useEffect(() => {
    setPubKey(privKey ? new KeyPair(privKey).publicKey() : undefined);
  }, [privKey]);

  return (
    <PageContainer>
      <Head>
        <title>OrgaNicer</title>
        <meta name="description" content="Orga your life Nicer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Frame>
        {pubKey ? (
          <>
            <PageContent page={currentPage} key={currentPage.id} />
            <MainMenu />
          </>
        ) : (
          <KeyPairLogin setPrivKey={setPrivKey} />
        )}
      </Frame>
    </PageContainer>
  );
};

type PageContentProps = {
  page: Page;
};

const PageContent = ({ page }: PageContentProps): ReactElement => {
  switch (page.id) {
    case '/':
      return <Dashboard page={page} />;
    case 'einstellungen':
      return <Settings />;
    case 'tagebuch':
      return <Journal page={page} />;
    case 'sport':
      return <Sport page={page} />;
    case 'aufgaben':
      return <Duty page={page} />;
  }
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.slug) {
    return {
      props: {
        slug: '/',
      },
    };
  }

  if (typeof params?.slug === 'string') {
    return {
      props: {
        slug: params.slug,
      },
    };
  }

  return {
    props: {
      slug: params.slug.join('/'),
    },
  };
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
    max-width: 80rem;
    width: 100%;
  `,
]);
