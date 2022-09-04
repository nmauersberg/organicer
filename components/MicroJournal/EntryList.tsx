import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../dexie/db';

export function EntryList() {
  const entries = useLiveQuery(() => db.journal.toArray());

  return (
    <ul>
      {entries?.map((entry) => (
        <li key={entry.id}>
          {entry.date}, {entry.content}
        </li>
      ))}
    </ul>
  );
}
