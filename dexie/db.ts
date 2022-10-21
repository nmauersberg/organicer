import Dexie, { Table } from 'dexie';
import { KeyPair } from 'p2panda-js';
import { useContext, useState } from 'react';
import { Duty } from '../components/views/Duty';
import { EncryptStorageContext } from '../context/encryptStorage';
import { Settings } from '../components/views/Settings';
import { nanoid } from 'nanoid';

export interface UserSettings {
  id?: number;
  dailyDuty: Settings;
}

export type Settings = {
  duties: DailyDuty[];
};

export type DailyDuty = {
  id: string;
  label: string;
};

export type Task = {
  id: string;
  label: string;
  checked: boolean;
};

export const defaultUserSettings: UserSettings = {
  id: 1,
  dailyDuty: {
    duties: [],
  },
};

export interface JournalEntry {
  id?: number;
  date: string;
  content: string;
}

export interface DailyDuties {
  id?: number;
  date: string;
  duties: Duty[];
}

export interface TaskList {
  id?: number;
  date: string;
  label: string;
  tasks: Task[];
  sort: number;
  type: TaskListType;
}

export type TaskListType = 'checkable' | 'ordered' | 'unordered';

export class ExtendedDexie extends Dexie {
  userSettings!: Table<UserSettings>;
  journal!: Table<JournalEntry>;
  dailyDuty!: Table<DailyDuties>;
  taskLists!: Table<TaskList>;

  constructor(pubKey: string) {
    super(pubKey);
    this.version(1).stores({
      journal: '++id, date, content',
    });

    this.version(2)
      .stores({
        userSettings: '++id, settings',
        journal: '++id, date, content',
        dailyDuty: '++id, date, duties',
      })
      .upgrade(tx => {
        tx.table('userSettings').add(defaultUserSettings);
      });

    this.version(3).stores({
      userSettings: '++id, settings',
      journal: '++id, date, content',
      dailyDuty: '++id, date, duties',
      taskLists: '++id, date, label, tasks, sort, type',
    });

    this.version(4)
      .stores({
        userSettings: '++id, settings',
        journal: '++id, date, content',
        dailyDuty: '++id, date, duties',
        taskLists: '++id, date, label, tasks, sort, type',
      })
      .upgrade(tx => {
        return tx
          .table('taskLists')
          .toCollection()
          .modify(taskList => {
            taskList.tasks.forEach((task: Task) => {
              task.id = nanoid();
            });
          });
      });

    this.on('populate', tx => {
      tx.table('userSettings').add(defaultUserSettings);
    });

    this.open();
  }
}

export const useDexieDb = (): [ExtendedDexie] => {
  const [encryptStorage] = useContext(EncryptStorageContext);
  const [privKey] = useState<string | undefined>(
    encryptStorage?.getItem('privKey'),
  );
  const pubKey = privKey ? new KeyPair(privKey).publicKey() : 'default';

  const db = new ExtendedDexie(pubKey);

  return [db];
};
