import Dexie, { Table } from 'dexie';
import { KeyPair } from 'p2panda-js';
import { useContext, useState } from 'react';
import { Duty } from '../components/views/Duty';
import { EncryptStorageContext } from '../context/encryptStorage';
import { nanoid } from 'nanoid';

export interface UserSettings {
  id?: number;
  dailyDuty: DailyDutySettings;
  sports: SportsSettings;
}

export type DailyDutySettings = {
  duties: DailyDuty[];
};

export type SportsSettings = {
  exercises: Exercise[];
};

export type DailyDuty = {
  id: string;
  label: string;
};

export type Exercise = {
  id: string;
  label: string;
};

export type Task = {
  id: string;
  label: string;
  checked: boolean;
  archived: boolean;
};

export const defaultUserSettings: UserSettings = {
  id: 1,
  dailyDuty: {
    duties: [],
  },
  sports: {
    exercises: [],
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

export interface SportSession {
  id?: number;
  date: string;
  rounds: Round[];
}

export type Round = {
  id: string;
  exercises: ExerciseRound[];
};

export type ExerciseRound = {
  exerciseId: string;
  count: number;
  type: ExerciseType;
};

export type ExerciseType = 'repetitions' | 'minutes';

export class ExtendedDexie extends Dexie {
  userSettings!: Table<UserSettings>;
  journal!: Table<JournalEntry>;
  dailyDuty!: Table<DailyDuties>;
  taskLists!: Table<TaskList>;
  sports!: Table<SportSession>;

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

    this.version(5)
      .stores({
        userSettings: '++id, settings',
        journal: '++id, date, content',
        dailyDuty: '++id, date, duties',
        taskLists: '++id, date, label, tasks, sort, type',
        sports: '++id, date, rounds',
      })
      .upgrade(tx => {
        tx.table('userSettings')
          .toCollection()
          .modify(userSettings => {
            if (!('sports' in userSettings)) {
              userSettings.sports = defaultUserSettings.sports;
            }
          });
        tx.table('taskLists')
          .toCollection()
          .modify(taskList => {
            taskList.tasks.forEach((x: Task) => (x.archived = false));
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
