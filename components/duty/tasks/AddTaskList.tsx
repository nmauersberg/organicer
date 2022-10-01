import { FadeIn } from 'anima-react';
import { SlideButton } from '../../button/SlideButton';
import { TaskListType, useDexieDb } from '../../../dexie/db';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SmallTitle } from '../../text';
import { useLiveQuery } from 'dexie-react-hooks';
import Select, { MultiValue, OnChangeValue } from 'react-select';
import { css, styled } from 'twin.macro';

type SelectedTaskListType = {
  label: string;
  value: TaskListType;
};

const options: Array<SelectedTaskListType> = [
  {
    label: 'Checklist',
    value: 'checkable',
  },
  {
    label: 'Nummeriert',
    value: 'ordered',
  },
  {
    label: 'Spiegelstrich',
    value: 'unordered',
  },
];

type AddTaskListProps = {
  cancel: () => void;
};

export const AddTaskList = ({ cancel }: AddTaskListProps) => {
  const [db] = useDexieDb();

  const [label, setLabel] = useState<string>('');
  const [type, setType] = useState<SelectedTaskListType>(options[0]);

  const taskLists =
    useLiveQuery(() =>
      db.taskLists.toArray().then(entries => entries.reverse()),
    ) || [];

  const addTaskList = async () => {
    try {
      await db.taskLists.add({
        date: new Date().toISOString(),
        label,
        tasks: [],
        sort: taskLists.length + 1,
        type: type.value,
      });
      toast.success('Todo Liste angelegt!');
      setLabel('');
      setType(options[0]);
      if (cancel) {
        cancel();
      }
    } catch (error) {
      toast.error('Todo Liste konnte nicht angelegt werden!');
    }
  };

  return (
    <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
      <SmallTitle>Eine Todoliste anlegen:</SmallTitle>
      <Select
        isMulti={false}
        defaultValue={options[0]}
        onChange={e => {
          if (!e) {
            setType(options[0]);
          } else {
            setType(e);
          }
        }}
        options={options}
        placeholder={'Kategorie auswählen...'}
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
      <Input
        value={label}
        onChange={e => setLabel(e.target.value)}
        placeholder="Bezeichnung der Liste"
        onKeyPress={e => {
          if (e.key === 'Enter') {
            addTaskList();
          }
        }}
      />
      <ButtonRow>
        <SlideButton disabled={!label} onClick={() => addTaskList()}>
          Speichern
        </SlideButton>
        {cancel && (
          <SlideButton onClick={() => cancel()}>Abbrechen</SlideButton>
        )}
      </ButtonRow>
    </FadeIn>
  );
};

const Input = styled.input(() => [
  css`
    margin-top: 1rem;
  `,
]);

const ButtonRow = styled.div(() => [
  css`
    margin-top: 0.5rem;
    display: flex;
    gap: 1rem;
  `,
]);
