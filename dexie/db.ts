import Dexie, { Table } from 'dexie'

export interface JournalEntry {
  id?: number
  date: string
  content: string
}

export class ExtendedDexie extends Dexie {
  journal!: Table<JournalEntry>

  constructor() {
    super('microJournal')
    this.version(1).stores({
      journal: '++id, date, content',
    })
  }
}

export const db = new ExtendedDexie()
