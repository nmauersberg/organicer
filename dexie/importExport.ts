import { importDB, exportDB, ImportOptions } from 'dexie-export-import';
import { ExtendedDexie } from './db';

//
// Import from Blob or File to Dexie instance:
//

const importOptions: ImportOptions = {
  overwriteValues: true,
  acceptVersionDiff: true,
  clearTablesBeforeImport: true,
};

export const importDexieDb = async (
  db: ExtendedDexie,
  blob: Blob,
  pubKey: string | null,
  onSuccess: () => void,
  onError: () => void,
) => {
  try {
    if (pubKey) {
      const fr = new FileReader();

      fr.onload = async e => {
        if (e && e.target && typeof e.target.result == 'string') {
          const json = JSON.parse(e.target.result);
          json.data.databaseName = pubKey;
          const updatedBlob = new Blob([JSON.stringify(json, null, 2)]);
          await db.delete();
          const tempDb = await importDB(blob, importOptions);
          await importDB(updatedBlob, importOptions);
          tempDb.close();
          await db.open();
          await tempDb.delete();
          onSuccess();
        } else {
          onError();
        }
      };
      fr.readAsText(blob);
    } else {
      onError();
    }
  } catch (error) {
    console.log(error);
    onError();
  }
};

//
// Export to Blob
//
function downloadBlob(
  blob: Blob,
  name = `${new Date().toISOString()}-db.json`,
) {
  // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = name;

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // Remove link from body
  document.body.removeChild(link);
}

export const exportDexieDb = async (db: ExtendedDexie) => {
  const blob = await exportDB(db);
  downloadBlob(blob);

  // const fr = new FileReader();

  // fr.onload = e => {
  //   if (e && e.target && typeof e.target.result == 'string') {
  //     console.log(JSON.parse(e.target.result));
  //   }
  // };

  // fr.readAsText(blob);
};

//
// Import from Blob or File to existing Dexie instance
//
// await importInto(db, blob, [options]);

//
// If you need to peek the metadata from the import file without actually
// performing any import operation
// (since v1.0.0)
//
// const importMeta = await peekImportFile(blob);
// assert.areEqual(importMeta.formatName, "dexie");
// assert.isTrue(importMeta.formatVersion === 1);
// console.log("Database name:", importMeta.data.databaseName);
// console.log("Database version:", importMeta.data.databaseVersion);
// console.log("Database version:", importMeta.data.databaseVersion);
// console.log("Tables:", importMeta.data.tables.map(t =>
//   `${t.name} (${t.rowCount} rows)`
// ).join('\n\t'));
