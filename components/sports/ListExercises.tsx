import { useLiveQuery } from 'dexie-react-hooks';
import { css, styled } from 'twin.macro';
import { useDexieDb } from '../../dexie/db';
import { JustText, SmallTitle } from '../text';

export function ListExercises() {
  const [db] = useDexieDb();
  const settings = useLiveQuery(() => db.userSettings.get(1));

  if (!settings) {
    return null;
  }

  return (
    <div>
      <SmallTitle>Deine Übungen:</SmallTitle>
      {settings.sports && settings.sports.exercises[0] ? (
        <Entry>
          {settings.sports.exercises.map(exercise => {
            return <JustText key={exercise.id}>{exercise.label}</JustText>;
          })}
        </Entry>
      ) : (
        <JustText>Du hast noch keine Übungen angelegt.</JustText>
      )}
    </div>
  );
}

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);
