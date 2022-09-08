import React, { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { css, styled } from 'twin.macro';
import { useDexieDb } from '../../dexie/db';
import { SlideButton } from '../button/SlideButton';

export function AddJournalEntry() {
  const [db] = useDexieDb();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('');

  async function addEntry() {
    try {
      const id = await db.journal.add({
        date: date.toISOString(),
        content,
      });
      setStatus(
        `Entry of ${date.toISOString()} successfully added. Got id ${id}`,
      );
      setContent('');
      setDate(new Date());
    } catch (error) {
      setStatus(`Failed to add entry of ${date.toISOString()}: ${error}`);
    }
  }

  return (
    <Frame>
      <ReactTextareaAutosize
        placeholder="Schreib was du willst!"
        value={content}
        onChange={ev => setContent(ev.target.value)}
      />
      <SlideButton onClick={addEntry} disabled={content === ''}>
        Speichern
      </SlideButton>
    </Frame>
  );
}

const Frame = styled.div(() => [
  css`
    margin-top: 2rem;
  `,
]);
