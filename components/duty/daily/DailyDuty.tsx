import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import { css, styled } from 'twin.macro';
import { DailyDuties, useDexieDb } from '../../../dexie/db';
import { JustText, SmallTitle } from '../../text';

export const DailyDuty = () => {
  const [db] = useDexieDb();
  const entries = useLiveQuery(() => db.dailyDuty.toArray());
  const settings = useLiveQuery(() => db.userSettings.get(1));

  const [today, setToday] = useState<DailyDuties | undefined>();

  useEffect(() => {
    if (settings && entries) {
      setToday(
        entries.find(
          entry =>
            new Date(entry.date).toDateString() === new Date().toDateString(),
        ) || {
          date: new Date().toISOString(),
          duties: settings.dailyDuty.duties.map(d => {
            return {
              id: d.id,
              label: d.label,
              done: false,
            };
          }),
        },
      );
    }
  }, [settings, entries]);

  if (!settings || !today) {
    return <BounceLoader color="red" />;
  }

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
        <br />
        {today.duties.map((duty, index) => {
          return (
            <DutyItem
              key={duty.id}
              onClick={() => {
                const modified = { ...today };
                modified.duties[index].done = !modified.duties[index].done;
                updateDailyDuty(modified);
                setToday(modified);
              }}
            >
              <Checkbox checked={duty.done} />
              <JustText>{duty.label}</JustText>
            </DutyItem>
          );
        })}
      </Entry>
    </div>
  );
};

type CheckboxProps = {
  checked: boolean;
};

const Checkbox = ({ checked }: CheckboxProps): ReactElement => (
  <>
    {checked ? (
      <Icon path={mdiCheckCircleOutline} size={1} color={'green'} />
    ) : (
      <Icon path={mdiCheckboxBlankCircleOutline} size={1} />
    )}
  </>
);

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);

export const DutyItem = styled.div(() => [
  css`
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  `,
]);
