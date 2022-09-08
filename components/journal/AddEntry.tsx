import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { css, styled } from 'twin.macro';
import { useDexieDb } from '../../dexie/db';
import { SlideButton } from '../button/SlideButton';

export function AddJournalEntry() {
  const [db] = useDexieDb();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());

  async function addEntry() {
    try {
      await db.journal.add({
        date: date.toISOString(),
        content,
      });
      toast.success('Tagebucheintrag angelegt!');
      setContent('');
      setDate(new Date());
    } catch (error) {
      toast.error('Tagebucheintrag konnte nicht angelegt werden!');
    }
  }

  return (
    <Frame>
      <ReactTextareaAutosize
        placeholder="Schreib was du willst!"
        value={content}
        onChange={ev => setContent(ev.target.value)}
        maxRows={12}
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
