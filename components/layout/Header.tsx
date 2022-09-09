import { FadeIn } from 'anima-react';
import { useRouter } from 'next/router';
import { KeyPair } from 'p2panda-js';
import { useContext, useEffect, useState } from 'react';
import { css, styled } from 'twin.macro';
import { EncryptStorageContext } from '../../context/encryptStorage';
import { PageId, pages } from '../menu/MainMenu';
import { PageLogo } from './PageLogo';
import { PageUser } from './PageUser';

export const Header = () => {
  const router = useRouter();
  const [encryptStorage] = useContext(EncryptStorageContext);

  const currentPage = mapCurrentPage(router.asPath.slice(1));

  // Panda keys
  const [privKey, setPrivKey] = useState<string | undefined>();
  useEffect(() => {
    setPrivKey(encryptStorage?.getItem('privKey'));
  }, [encryptStorage]);

  const [pubKey, setPubKey] = useState<string | undefined>();
  useEffect(() => {
    setPubKey(privKey ? new KeyPair(privKey).publicKey() : undefined);
  }, [privKey]);

  if (!pubKey) {
    return (
      <PageTitle>
        <div />
        <FadeIn orientation="up" duration={0.5} distance={10}>
          {currentPage.label}
        </FadeIn>
        <div />
      </PageTitle>
    );
  }

  return (
    <PageTitle>
      <PageLogo onClick={() => router.push('/')} />
      <FadeIn orientation="up" duration={0.5} distance={10}>
        {currentPage.label}
      </FadeIn>
      <PageUser
        showSettings={() => {
          const settingsSlug: PageId = 'einstellungen';
          router.push(`/${settingsSlug}`);
        }}
      />
    </PageTitle>
  );
};

const mapCurrentPage = (currentRoute: string) =>
  pages.find(p => p.label === currentRoute) || pages[0];

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
