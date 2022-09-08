import { KeyPair } from 'p2panda-js';
import { SetStateAction, useContext } from 'react';
import { EncryptStorageContext } from '../../context/encryptStorage';
import { SlideButton } from '../button/SlideButton';
import { SmallTitle } from '../text';

type KeyPairLoginProps = {
  setPrivKey: React.Dispatch<SetStateAction<string | undefined>>;
};

export const KeyPairLogin = ({ setPrivKey }: KeyPairLoginProps) => {
  const [encryptStorage] = useContext(EncryptStorageContext);

  return (
    <div style={{ maxWidth: '50rem', width: '100%' }}>
      <SmallTitle>Erstelle ein neues Schlüsselpaar:</SmallTitle>
      <SlideButton
        onClick={() => {
          const keyPair = new KeyPair();
          encryptStorage?.setItem('privKey', keyPair.privateKey());
          setPrivKey(keyPair.privateKey());
        }}
      >
        Generate Keys
      </SlideButton>
      <br />
      <br />

      <SmallTitle>Oder nutze einen bestehenden Schlüssel:</SmallTitle>
      <input
        type="password"
        placeholder="Privater Schlüssel"
        onChange={e => {
          try {
            const keyPair = new KeyPair(e.target.value);
            encryptStorage?.setItem('privKey', keyPair.privateKey());
            setPrivKey(keyPair.privateKey());
          } catch (error) {
            console.log('keypair Invalid');
          }
        }}
      />
    </div>
  );
};
