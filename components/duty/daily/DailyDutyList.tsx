import { useLiveQuery } from 'dexie-react-hooks';
import { css, styled } from 'twin.macro';
import { defaultUserSettings, useDexieDb } from '../../../dexie/db';
import { JustText, SmallTitle } from '../../text';

export function DailyDutyList() {
  const [db] = useDexieDb();
  const { dailyDuty } =
    useLiveQuery(() => db.userSettings.get(1)) || defaultUserSettings;

  return (
    <div>
      <SmallTitle>Deine täglichen Aufgaben:</SmallTitle>
      {dailyDuty ? (
        <Entry>
          {dailyDuty.duties.map(duty => {
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
