import { KeyPair } from 'p2panda-js';
import {
  MutableRefObject,
  ReactElement,
  useContext,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { css, styled } from 'twin.macro';
import { EncryptStorageContext } from '../../context/encryptStorage';
import { useDexieDb } from '../../dexie/db';
import { exportDexieDb, importDexieDb } from '../../dexie/importExport';
import { theme } from '../../styles/theme';
import { SlideButton } from '../button/SlideButton';
import { SmallTitle } from '../text';
import { Title } from '../text/index';
import { SettingsElement } from '../views/Settings';

const ImportExport = ({ back }: { back: () => void }): ReactElement => {
  const [db] = useDexieDb();
  const [file, setFile] = useState();
  const [encryptStorage] = useContext(EncryptStorageContext);
  const [privKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey'),
  );
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : null;

  let upload: any = useRef<MutableRefObject<any>>(null);

  const onChangeFile = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    setFile(file);
  };

  return (
    <>
      <SettingsElement>
        <Title>Export & Backup:</Title>
        <SmallTitle>
          Datenbank exportieren und als Datei herunterladen:
        </SmallTitle>
        <SlideButton onClick={() => exportDexieDb(db)}>
          DB Exportieren
        </SlideButton>
      </SettingsElement>

      <Title>Import & Restore:</Title>
      <SmallTitle>Backup hochladen:</SmallTitle>
      <input
        id="myInput"
        type="file"
        ref={ref => (upload = ref)}
        style={{ display: 'none' }}
        onChange={onChangeFile.bind(this)}
      />

      <SlideButton
        onClick={() => {
          upload.click();
        }}
      >
        Backup Hochladen
      </SlideButton>

      {file && (
        <>
          <SmallTitle>Backup importieren:</SmallTitle>
          <SlideButton
            color={theme.colors.green}
            onClick={async () => {
              await importDexieDb(
                db,
                file,
                pubKey,
                () => toast.success('Datenbank erfolgreich importiert!'),
                () => toast.error('Datenbank konnte nicht importiert werden!'),
              );
            }}
          >
            DB Importieren
          </SlideButton>
        </>
      )}
      <br />

      <SlideButton onClick={() => back()} color={theme.colors.red}>
        Zurück
      </SlideButton>
    </>
  );
};

export default ImportExport;
