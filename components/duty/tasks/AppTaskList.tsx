import {
  mdiCheckboxBlankCircleOutline,
  mdiCheckCircleOutline,
  mdiDotsHorizontalCircleOutline,
} from '@mdi/js';
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
import { nanoid } from 'nanoid';

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
      id: nanoid(),
    });
    updateTaskList(modified);
    setNewTaskLabel('');
  };

  const done = entry.tasks.filter(e => e.checked);
  const todo = entry.tasks.filter(e => !e.checked);

  return (
    <Entry_ key={entry.id}>
      <TaskListHead>
        <SmallTitle>{entry.label}</SmallTitle>
        {/* <ButtonContainer>
          <SlideButtonRound onClick={() => setAddEntry(!addEntry)}>
            {addEntry ? '-' : '+'}
          </SlideButtonRound>
        </ButtonContainer> */}
        <NoStyleButton onClick={() => setAddEntry(!addEntry)}>
          <Icon
            path={mdiDotsHorizontalCircleOutline}
            size={1.5}
            color={'#53a2be'}
          />
        </NoStyleButton>
      </TaskListHead>
      <br />
      {todo.map(task => {
        return (
          <TaskListItem
            key={task.id}
            onClick={() => {
              const modified = { ...entry };
              const index = modified.tasks.findIndex(t => t.id === task.id);
              modified.tasks[index].checked = !modified.tasks[index].checked;
              updateTaskList(modified);
            }}
          >
            <Checkbox checked={task.checked} />
            <JustText>{task.label}</JustText>
          </TaskListItem>
        );
      })}
      {done.map(task => {
        return (
          <TaskListItem
            key={task.id}
            onClick={() => {
              const modified = { ...entry };
              const index = modified.tasks.findIndex(t => t.id === task.id);
              modified.tasks[index].checked = !modified.tasks[index].checked;
              updateTaskList(modified);
            }}
          >
            <Checkbox checked={task.checked} />
            <JustText textDecoration={['line-through']}>{task.label}</JustText>
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
    padding-right: 1rem;
    position: relative;
  `,
]);

export const NoStyleButton = styled.button(() => [
  css`
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    cursor: pointer;
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
