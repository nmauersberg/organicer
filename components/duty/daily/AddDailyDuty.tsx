import { FadeIn } from 'anima-react';
import { SlideButton } from '../../button/SlideButton';
import { DailyDuty, useDexieDb } from '../../../dexie/db';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { SmallTitle } from '../../text';

export const AddDailyDuty = () => {
  const [db] = useDexieDb();

  const [newDuty, setNewDuty] = useState<string>('');

  const addDuty = async () => {
    const toUpdate = await db.userSettings.get(1);
    if (newDuty !== '' && toUpdate) {
      const dutyToAdd: DailyDuty = {
        id: nanoid(),
        label: newDuty,
      };
      toUpdate?.dailyDuty.duties.push(dutyToAdd);
      db.userSettings.update(1, toUpdate);
      setNewDuty('');
      toast.success('Tägliche Aufgabe hinzugefügt!');
    } else {
      toast.error('Bitte die Aufgabe benennen!');
    }
  };

  return (
    <>
      <SmallTitle>Eine tägliche Aufgabe hinzufügen:</SmallTitle>
      <input
        value={newDuty}
        onChange={e => setNewDuty(e.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addDuty();
          }
        }}
      />
      <SlideButton disabled={!newDuty} onClick={() => addDuty()}>
        Speichern
      </SlideButton>
    </>
  );
};
