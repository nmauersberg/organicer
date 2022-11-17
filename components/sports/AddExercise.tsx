import { FadeIn } from 'anima-react';
import { SlideButton } from '../button/SlideButton';
import { Exercise, useDexieDb } from '../../dexie/db';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { nanoid } from 'nanoid';
import { SmallTitle } from '../text';

export const AddExercise = () => {
  const [db] = useDexieDb();

  const [newExercise, setNewExercise] = useState<string>('');

  const addExercise = async () => {
    const toUpdate = await db.userSettings.get(1);
    if (newExercise !== '' && toUpdate) {
      const exerciseToAdd: Exercise = {
        id: nanoid(),
        label: newExercise,
      };
      toUpdate?.sports.exercises.push(exerciseToAdd);
      db.userSettings.update(1, toUpdate);
      setNewExercise('');
      toast.success('Neue Übung hinzugefügt!');
    } else {
      toast.error('Bitte die Übung benennen!');
    }
  };

  return (
    <>
      <SmallTitle>Eine neue Übung hinzufügen:</SmallTitle>
      <input
        value={newExercise}
        onChange={e => setNewExercise(e.target.value)}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addExercise();
          }
        }}
      />
      <SlideButton disabled={!newExercise} onClick={() => addExercise()}>
        Speichern
      </SlideButton>
    </>
  );
};
