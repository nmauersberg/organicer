import { MutableRefObject, ReactElement, useRef, useState } from 'react';
import { db } from '../../dexie/db';
import { exportDexieDb, importDexieDb } from '../../dexie/importExport';
import { SlideButton } from '../button/SlideButton';
import { SmallTitle } from '../text';

const ImportExport = (): ReactElement => {
  const [file, setFile] = useState();

  let upload: any = useRef<MutableRefObject<any>>(null);

  const onChangeFile = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    setFile(file);
  };

  return (
    <>
      <SmallTitle>
        Datenbank exportieren und asl Datei herunterladen:
      </SmallTitle>
      <SlideButton onClick={() => exportDexieDb(db)}>
        DB Exportieren
      </SlideButton>

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
          <SlideButton onClick={() => importDexieDb(file)}>
            DB Importieren
          </SlideButton>
        </>
      )}
    </>
  );
};

export default ImportExport;
