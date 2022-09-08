import Dexie, { Table } from 'dexie';
import { KeyPair } from 'p2panda-js';
import { useContext, useState } from 'react';
import { EncryptStorageContext } from '../context/encryptStorage';

export interface JournalEntry {
  id?: number;
  date: string;
  content: string;
}

export class ExtendedDexie extends Dexie {
  journal!: Table<JournalEntry>;

  constructor(pubKey: string) {
    super(pubKey);
    this.version(1).stores({
      journal: '++id, date, content',
    });
  }
}

export const useDexieDb = (): [ExtendedDexie] => {
  const [encryptStorage] = useContext(EncryptStorageContext);
  const [privKey, setPrivKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey'),
  );
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : 'default';

  const db = new ExtendedDexie(pubKey);

  return [db];
};
