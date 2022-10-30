import {
  mdiArrowRightDropCircleOutline,
  mdiCalendarArrowRight,
  mdiDotsHorizontalCircleOutline,
  mdiRotateRight,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useLiveQuery } from 'dexie-react-hooks';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import { css, styled } from 'twin.macro';
import {
  ExerciseRound,
  ExerciseType,
  Round,
  SportSession,
  useDexieDb,
} from '../../dexie/db';
import { JustText, SmallTitle } from '../text';
import { Spacer } from '../helper';
import { NoStyleButton } from '../button/NoStyleButton';
import { useEffect, useState } from 'react';
import { SlideButton } from '../button/SlideButton';
import Select from 'react-select';
import { nanoid } from 'nanoid';

type Option = {
  label: string;
  value: string;
};

export const AppSports = () => {
  const [db] = useDexieDb();
  const entries = useLiveQuery(() => db.sports.toArray());
  const settings = useLiveQuery(() => db.userSettings.get(1));

  const [showAddRound, setShowAddRound] = useState<boolean>(false);
  const [newRoundExercises, setNewRoundExercises] = useState<Option[]>([]);

  useEffect(() => {
    setNewRoundExercises([]);
  }, [showAddRound]);

  if (!settings || !entries) {
    return <BounceLoader color="red" />;
  }

  const options = settings.sports.exercises.map(e => ({
    label: e.label,
    value: e.id,
  }));

  const updateSession = async (session: SportSession) => {
    try {
      if (session.id) {
        await db.sports.update(session.id, session);
        toast.success('Session aktualisiert!');
      }
    } catch (error) {
      toast.error('Session konnte nicht angelegt werden!');
    }
  };

  return (
    <div>
      <Entry>
        <SmallTitle>Deine Sessions</SmallTitle>
        <br />
        {entries.map((session, index) => {
          return (
            <SessionItem key={session.id}>
              <SessionItemHead>
                <LabledIcon
                  iconPath={mdiArrowRightDropCircleOutline}
                  label={new Date(session.date).toLocaleDateString('de-DE')}
                />

                <LabledIcon
                  iconPath={mdiRotateRight}
                  label={session.rounds.length.toString()}
                />

                <Spacer />

                <NoStyleButton onClick={() => setShowAddRound(!showAddRound)}>
                  <Icon
                    path={mdiDotsHorizontalCircleOutline}
                    size={1.5}
                    color={'#53a2be'}
                  />
                </NoStyleButton>
              </SessionItemHead>
              {entries.length > 0 && (
                <SessionItemBody>
                  <Rounds>
                    {session.rounds.map(entry => (
                      <div key={entry.id}>
                        {entry.exercises.map(exercise => (
                          <h2 key={exercise.exerciseId}>
                            <>
                              {settings.sports.exercises.find(
                                e => e.id === exercise.exerciseId,
                              )?.label || 'Übung'}
                              : {exercise.count}
                            </>
                          </h2>
                        ))}
                      </div>
                    ))}
                  </Rounds>
                </SessionItemBody>
              )}
              {showAddRound && (
                <SessionItemEdit>
                  <SmallTitle>Eine neue Runde anlegen:</SmallTitle>
                  <Select
                    isMulti
                    closeMenuOnSelect={
                      newRoundExercises.length === 1 ? true : false
                    }
                    onChange={e => {
                      if (!e) {
                        setNewRoundExercises([]);
                      } else {
                        setNewRoundExercises(e as Option[]);
                      }
                    }}
                    options={options}
                    placeholder={'Übungen auswählen...'}
                    styles={{
                      control: provided => ({
                        ...provided,
                        border: '1px solid black',
                        '&:hover': {
                          border: '1px solid black',
                        },
                      }),
                    }}
                  />
                  <SlideButton
                    disabled={newRoundExercises.length === 0}
                    onClick={() => {
                      const modSession = { ...session };
                      modSession.rounds.push({
                        id: nanoid(),
                        exercises: newRoundExercises.map(e =>
                          mkRound(e.value, 0, 'count'),
                        ),
                      });
                      if (modSession.id) {
                        updateSession(modSession);
                        setShowAddRound(false);
                      }
                    }}
                  >
                    Let&apos;s go!
                  </SlideButton>
                </SessionItemEdit>
              )}
            </SessionItem>
          );
        })}
      </Entry>
    </div>
  );
};

const mkRound = (
  id: string,
  count: number,
  type: ExerciseType,
): ExerciseRound => {
  return {
    exerciseId: id,
    count,
    type,
  };
};

type LabledIconProps = {
  iconPath: string;
  label: string;
};

const LabledIcon = ({ iconPath, label }: LabledIconProps) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Icon size={1.5} path={iconPath} />
      <JustText bottomMargin={0} size={1.5}>
        {label}
      </JustText>
    </div>
  );
};

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);

export const Rounds = styled.div(() => [
  css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `,
]);

export const SessionItemHead = styled.div(() => [
  css`
    display: flex;
    gap: 1.5rem;
  `,
]);

export const SessionItemBody = styled.div(() => [css``]);
export const SessionItemEdit = styled.div(() => [css``]);

export const SessionItem = styled.div(() => [
  css`
    border: 1px solid lightgray;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `,
]);
