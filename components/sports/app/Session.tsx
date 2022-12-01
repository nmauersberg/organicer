import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import { css, styled } from 'twin.macro';
import { SlideButton } from '../../button/SlideButton';
import { JustText, SmallTitle } from '../../text';
import Select from 'react-select';
import { Spacer } from '../../helper';
import {
  mdiArrowRightDropCircleOutline,
  mdiDotsHorizontalCircleOutline,
  mdiRotateRight,
  mdiSigma,
} from '@mdi/js';
import {
  ExerciseRound,
  ExerciseType,
  Round,
  SportSession,
  useDexieDb,
  UserSettings,
} from '../../../dexie/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { theme } from '../../../styles/theme';
import { BounceLoader } from 'react-spinners';
import { NoStyleButton } from '../../button/NoStyleButton';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';

export type Option = {
  label: string;
  value: string;
};

type SessionProps = {
  session: SportSession;
  settings: UserSettings;
};

export const Session = ({ session, settings }: SessionProps) => {
  const [db] = useDexieDb();

  const [showAddRound, setShowAddRound] = useState<boolean>(false);
  const [showEditRound, setShowEditRound] = useState<boolean>(false);
  const [newRoundExercises, setNewRoundExercises] = useState<Option[]>([]);
  const [editExercises, setEditExercises] = useState<Option[]>([]);

  const { width } = useWindowDimensions();
  const narrowView = width < 500 ? true : false;

  useEffect(() => {
    setNewRoundExercises([]);
  }, [showAddRound]);

  if (!settings || !session) {
    return (
      <Center>
        <BounceLoader color={theme.colors.blue} />
      </Center>
    );
  }

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

  const printExercise = (exerciseId: string, count: number) =>
    `${printExerciseLabel(exerciseId)}: ${count}`;

  const printExerciseLabel = (exerciseId: string) =>
    settings.sports.exercises.find(e => e.id === exerciseId)?.label || 'Übung';

  const options = settings.sports.exercises.map(e => ({
    label: e.label,
    value: e.id,
  }));
  return (
    <SessionItem>
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

      {session.rounds.length > 0 && (
        <SessionItemBody>
          <ExercisesSummary>
            {sumExercises(session.rounds).map(sum => (
              <h2 key={sum.exerciseId}>
                <ExerciseSummary>
                  <Icon path={mdiSigma} size={1} />
                  {printExercise(sum.exerciseId, sum.sum)}
                </ExerciseSummary>
              </h2>
            ))}
          </ExercisesSummary>
        </SessionItemBody>
      )}

      {showAddRound && (
        <SessionItemEdit>
          {session.rounds.length > 0 && (
            <SessionItemBody>
              <SmallTitle>Deine Runden:</SmallTitle>
              <Rounds>
                {session.rounds.map((entry, rIndex) => (
                  <>
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

                      <ExercisesContainer narrowView={narrowView}>
                        {entry.exercises.map((exercise, eIndex) => (
                          <h2 key={exercise.exerciseId}>
                            <ExerciseSummary narrowView={narrowView}>
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
                      </ExercisesContainer>

                      <Spacer />

                      <NoStyleButton
                        onClick={() => {
                          setShowEditRound(!showEditRound);
                        }}
                      >
                        <Icon
                          path={mdiDotsHorizontalCircleOutline}
                          size={1}
                          color={theme.colors.blue}
                        />
                      </NoStyleButton>
                    </Exercises>
                    {showEditRound && (
                      <>
                        <SmallTitle>Runde bearbeiten:</SmallTitle>
                        <Select
                          isMulti
                          closeMenuOnSelect={
                            editExercises.length === 1 ? true : false
                          }
                          onChange={e => {
                            if (!e) {
                              setEditExercises([]);
                            } else {
                              setEditExercises(e as Option[]);
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
                          disabled={editExercises.length === 0}
                          onClick={() => {
                            // const modSession = { ...session };
                            // modSession.rounds.push({
                            //   id: nanoid(),
                            //   exercises: editExercises.map(e =>
                            //     mkRound(e.value, 0, 'count'),
                            //   ),
                            // });
                            // if (modSession.id) {
                            //   updateSession(modSession);
                            //   // setShowAddRound(false);
                            // }
                          }}
                        >
                          Speichern
                        </SlideButton>
                      </>
                    )}
                  </>
                ))}
              </Rounds>
            </SessionItemBody>
          )}

          <SmallTitle>Eine neue Runde anlegen:</SmallTitle>
          <Select
            isMulti
            closeMenuOnSelect={newRoundExercises.length === 1 ? true : false}
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
                // setShowAddRound(false);
              }
            }}
          >
            Let&apos;s go!
          </SlideButton>
        </SessionItemEdit>
      )}
    </SessionItem>
  );
};

// Fns

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

// UI

type LabledIconProps = {
  iconPath: string;
  label: string;
};

const LabledIcon = ({ iconPath, label }: LabledIconProps) => {
  const { width } = useWindowDimensions();
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      <Icon size={width > 600 ? 1.5 : 1.25} path={iconPath} />
      <JustText bottomMargin={0} size={width > 600 ? 1.5 : 1.25}>
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
    max-width: 4rem;
    padding: 0 0.25rem;
  `,
]);

const SessionItemHead = styled.div(() => [
  css`
    display: flex;
    gap: 1.5rem;
  `,
]);
const SessionItemBody = styled.div(() => [css``]);
const SessionItemEdit = styled.div(() => [css``]);

const SessionItem = styled.div(() => [
  css`
    border: 1px solid lightgray;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  `,
]);

export const Center = styled.div(() => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
]);

const Exercises = styled.div(() => [
  css`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: nowrap;
  `,
]);

const ExercisesSummary = styled.div(() => [
  css`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  `,
]);

type ExercisesContainerProps = {
  narrowView?: boolean;
};

const ExercisesContainer = styled.div<ExercisesContainerProps>(
  ({ narrowView }) => [
    css`
      display: flex;
      flex-direction: ${narrowView ? 'column' : 'row'};
      gap: 0.3rem 1.5rem;
      flex-wrap: wrap;
      ${narrowView ? `justify-content: space-between; width: 100%;` : ''}
    `,
  ],
);

const IconAndNumber = styled.div(() => [
  css`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    min-width: 2.5rem;
  `,
]);

const Rounds = styled.div(() => [
  css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
  `,
]);

type ExerciseSummaryProps = {
  narrowView?: boolean;
};

const ExerciseSummary = styled.div<ExerciseSummaryProps>(({ narrowView }) => [
  css`
    display: flex;
    gap: 0.5rem 0.5rem;
    align-items: center;
    flex-wrap: nowrap;
    ${narrowView ? `justify-content: space-between;` : ''}
  `,
]);
