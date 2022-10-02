import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ReactElement, useState } from 'react';
import toast from 'react-hot-toast';
import { BounceLoader } from 'react-spinners';
import tw, { css, styled } from 'twin.macro';
import { TaskList, useDexieDb } from '../../../dexie/db';
import { JustText, SmallTitle } from '../../text';
import { mkRequired } from '../../../dexie/dexie-util';
import { SlideButtonRound } from '../../button/SlideButtonRound';
import { SlideButton } from '../../button/SlideButton';

export const AppTaskList = () => {
  const [db] = useDexieDb();
  const entries_ = useLiveQuery(() => db.taskLists.toArray());
  const entries = entries_ ? entries_.map(mkRequired) : [];

  if (!entries_) {
    return <BounceLoader color="red" />;
  }

  return (
    <div>
      {entries.map(entry => {
        return <Entry key={entry.id} entry={entry} />;
      })}
    </div>
  );
};

type CheckboxProps = {
  checked: boolean;
};

const Checkbox = ({ checked }: CheckboxProps): ReactElement => (
  <div style={{ minWidth: '1.5rem' }}>
    {checked ? (
      <Icon path={mdiCheckCircleOutline} size={1} color={'green'} />
    ) : (
      <Icon path={mdiCheckboxBlankCircleOutline} size={1} />
    )}
  </div>
);

const Entry = ({ entry }: { entry: Required<TaskList> }) => {
  const [db] = useDexieDb();
  const [addEntry, setAddEntry] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');

  const updateTaskList = async (entry: Required<TaskList>) => {
    try {
      await db.taskLists.update(entry.id, entry);
      toast.success('Todo Liste aktualisiert!');
    } catch (error) {
      toast.error('Todo Liste konnte nicht angelegt werden!');
    }
  };

  const saveNewTask = (entry: Required<TaskList>) => {
    const modified = { ...entry };
    modified.tasks.push({
      label: newTaskLabel,
      checked: false,
    });
    updateTaskList(modified);
    setNewTaskLabel('');
  };

  return (
    <Entry_ key={entry.id}>
      <TaskListHead>
        <SmallTitle>{entry.label}</SmallTitle>
        <ButtonContainer>
          <SlideButtonRound onClick={() => setAddEntry(!addEntry)}>
            {addEntry ? '-' : '+'}
          </SlideButtonRound>
        </ButtonContainer>
      </TaskListHead>
      <br />
      {entry.tasks.map((task, index) => {
        return (
          <TaskListItem
            key={entry.id + index}
            onClick={() => {
              const modified = { ...entry };
              modified.tasks[index].checked = !modified.tasks[index].checked;
              updateTaskList(modified);
            }}
          >
            <Checkbox checked={task.checked} />
            <JustText>{task.label}</JustText>
          </TaskListItem>
        );
      })}
      {addEntry && (
        <>
          <Input
            value={newTaskLabel}
            onChange={e => setNewTaskLabel(e.target.value)}
            placeholder={'Neuen Eintrag hinzufügen'}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                saveNewTask(entry);
              }
            }}
          />
        </>
      )}
    </Entry_>
  );
};

export const Entry_ = styled.div(() => [
  css`
    margin: 0.5rem 0.25rem 0.5rem 0;
    white-space: pre-wrap;
  `,
]);

export const TaskListItem = styled.div(() => [
  css`
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  `,
]);

export const TaskListHead = styled.div(() => [
  css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    overflow-x: hiden;
    padding-right: 5rem;
    position: relative;
  `,
]);

export const ButtonContainer = styled.div(() => [
  css`
    position: absolute;
    right: 0;
    top: 0;
  `,
]);

const Input = styled.input(() => [
  css`
    margin-top: 1rem;
  `,
]);
