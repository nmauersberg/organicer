import { useLiveQuery } from 'dexie-react-hooks';
import { css, styled } from 'twin.macro';
import { useDexieDb } from '../../../dexie/db';
import { JustText, SmallTitle } from '../../text';

export function ListDailyDuty() {
  const [db] = useDexieDb();
  const settings = useLiveQuery(() => db.userSettings.get(1));

  if (!settings) {
    return null;
  }

  return (
    <div>
      <SmallTitle>Deine täglichen Aufgaben:</SmallTitle>
      {settings.dailyDuty ? (
        <Entry>
          {settings.dailyDuty.duties.map(duty => {
            return <JustText key={duty.id}>{duty.label}</JustText>;
          })}
        </Entry>
      ) : (
        <JustText>Du hast noch keine täglichen Aufgaben angelegt.</JustText>
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
