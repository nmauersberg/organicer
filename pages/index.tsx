import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { initWebAssembly, KeyPair } from 'p2panda-js';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OrgaNicer</title>
        <meta name='description' content='Orga your life Nicer' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to OrgaNicer</h1>
        <p>Generate some Keys! :D</p>
        <button
          onClick={() => {
            initWebAssembly().then(() => {
              const keyPair = new KeyPair();
              console.log(keyPair.publicKey());
            });
          }}>
          Generate Keys
        </button>
      </main>
    </div>
  );
};

export default Home;
