import React, { useState } from 'react';
import { db } from '../../dexie/db';

export function AddJournalEntry() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('');

  async function addEntry() {
    try {
      const id = await db.journal.add({
        date: date.toDateString(),
        content,
      });
      setStatus(
        `Entry of ${date.toDateString()} successfully added. Got id ${id}`
      );
      setContent('');
      setDate(new Date());
    } catch (error) {
      setStatus(`Failed to add entry of ${date.toDateString()}: ${error}`);
    }
  }

  return (
    <>
      <textarea
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
        style={{ width: '100%' }}
      />
      <br />
      <button onClick={addEntry}>Add</button>
    </>
  );
}
