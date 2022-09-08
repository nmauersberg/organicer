import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { css, styled } from 'twin.macro';
import {
  DailyDuties,
  defaultUserSettings,
  useDexieDb,
} from '../../../dexie/db';
import { DateText, JustText, SmallTitle } from '../../text';

export const DailyDuty = () => {
  const [db] = useDexieDb();
  const entries = useLiveQuery(() => db.dailyDuty.toArray());
  const { dailyDuty } =
    useLiveQuery(() => db.userSettings.get(1)) || defaultUserSettings;

  const [today, setToday] = useState(
    entries?.find(
      entry =>
        new Date(entry.date).toDateString() === new Date().toDateString(),
    ) || {
      date: new Date().toISOString(),
      duties: dailyDuty.duties.map(d => {
        return {
          id: d.id,
          label: d.label,
          done: false,
        };
      }),
    },
  );

  useEffect(() => {
    setToday(
      entries?.find(
        entry =>
          new Date(entry.date).toDateString() === new Date().toDateString(),
      ) || {
        date: new Date().toISOString(),
        duties: dailyDuty.duties.map(d => {
          return {
            id: d.id,
            label: d.label,
            done: false,
          };
        }),
      },
    );
  }, [dailyDuty]);

  const updateDailyDuty = async (entry: DailyDuties) => {
    try {
      if (entry.id) {
        await db.dailyDuty.update(entry.id, entry);
        toast.success('Tagebucheintrag aktualisiert!');
      } else {
        await db.dailyDuty.add(entry);
        toast.success('Tagebucheintrag angelegt!');
      }
    } catch (error) {
      toast.error('Tagebucheintrag konnte nicht angelegt werden!');
    }
  };

  return (
    <div>
      <Entry>
        <SmallTitle>
          Deine Tagesaufgaben für den{' '}
          {new Date(today.date).toLocaleDateString('de-DE')}
        </SmallTitle>
        {today.duties.map((duty, index) => {
          return (
            <JustText
              key={duty.id}
              onClick={() => {
                const modified = { ...today };
                modified.duties[index].done = !modified.duties[index].done;
                updateDailyDuty(modified);
                setToday(modified);
              }}
            >
              {duty.label} : {duty.done ? '[x]' : '[ ]'}
            </JustText>
          );
        })}
      </Entry>
    </div>
  );
};

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);
