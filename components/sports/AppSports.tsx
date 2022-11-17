import {
  mdiArrowRightDropCircleOutline,
  mdiCalendarArrowRight,
  mdiDotsHorizontalCircleOutline,
  mdiRotateRight,
  mdiSigma,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useLiveQuery } from 'dexie-react-hooks';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import { css, styled } from 'twin.macro';
import {
  Exercise,
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
import { theme } from '../../styles/theme';

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

  const printExerciseCount = (exerciseId: string, count: number) =>
    `${printExerciseLabel(exerciseId)}: ${count}`;

  const printExerciseLabel = (exerciseId: string) =>
    settings.sports.exercises.find(e => e.id === exerciseId)?.label || 'Übung';

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
                    color={theme.colors.blue}
                  />
                </NoStyleButton>
              </SessionItemHead>
              {entries.length > 0 && (
                <SessionItemBody>
                  <Exercises>
                    {sumExercises(session.rounds).map(sum => {
                      return (
                        <h2 key={sum.exerciseId}>
                          <ExerciseSummary>
                            <Icon path={mdiSigma} size={1} />
                            {printExerciseCount(sum.exerciseId, sum.sum)}
                          </ExerciseSummary>
                        </h2>
                      );
                    })}
                  </Exercises>
                </SessionItemBody>
              )}
              {showAddRound && (
                <SessionItemEdit>
                  {entries.length > 0 && (
                    <SessionItemBody>
                      <SmallTitle>Deine Runden:</SmallTitle>
                      <Rounds>
                        {session.rounds.map((entry, rIndex) => (
                          <Exercises key={entry.id}>
                            <IconAndNumber>
                              <Icon path={mdiRotateRight} size={1} />
                              <p
                                style={{
                                  textAlign: 'center',
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                <b>{rIndex + 1}</b>
                              </p>
                            </IconAndNumber>
                            {entry.exercises.map((exercise, eIndex) => (
                              <h2 key={exercise.exerciseId}>
                                <ExerciseSummary>
                                  {printExerciseLabel(exercise.exerciseId)}
                                  <InputNumber
                                    value={exercise.count}
                                    update={(value: number) => {
                                      const newSession = { ...session };
                                      newSession.rounds[rIndex].exercises[
                                        eIndex
                                      ].count = value;
                                      updateSession(newSession);
                                    }}
                                  />
                                </ExerciseSummary>
                              </h2>
                            ))}
                          </Exercises>
                        ))}
                      </Rounds>
                    </SessionItemBody>
                  )}

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

const sumExercises = (
  rounds: Round[],
): {
  exerciseId: string;
  sum: number;
}[] => {
  const ids = rounds.reduce((acc, curr) => {
    curr.exercises.forEach(exercise => acc.push(exercise.exerciseId));
    return [...new Set(acc)];
  }, [] as string[]);
  return ids.map(id => ({
    exerciseId: id,
    sum: rounds.reduce((acc, curr) => {
      curr.exercises.forEach(exercise => {
        if (exercise.exerciseId === id) {
          acc = acc + exercise.count;
        }
      });
      return acc;
    }, 0),
  }));
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

type InputNumberProps = {
  value: number;
  update: (value: number) => void;
};

const InputNumber = ({ value, update }: InputNumberProps) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <Input
      value={inputValue}
      type="number"
      onChange={e => {
        const parsedVal = parseInt(e.target.value);
        const newVal = parsedVal && parsedVal >= 0 ? parsedVal : 0;
        setInputValue(newVal);
        update(newVal);
      }}
    />
  );
};

const Input = styled.input(() => [
  css`
    max-width: 5rem;
    padding: 0 0.25rem;
  `,
]);

export const Entry = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);

export const Exercises = styled.div(() => [
  css`
    display: flex;
    flex-direction: row;
    gap: 1rem;
  `,
]);

export const IconAndNumber = styled.div(() => [
  css`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    min-width: 2.5rem;
  `,
]);

export const Rounds = styled.div(() => [
  css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  `,
]);

export const SessionItemHead = styled.div(() => [
  css`
    display: flex;
    gap: 1.5rem;
  `,
]);

const ExerciseSummary = styled.div(() => [
  css`
    display: flex;
    gap: 0.5rem;
    align-items: center;
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
