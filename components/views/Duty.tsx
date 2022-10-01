import { FadeIn } from 'anima-react';
import { css, styled } from 'twin.macro';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { AppDailyDuty } from '../duty/daily/AppDailyDuty';
import { AddTaskList } from '../duty/tasks/AddTaskList';
import { AppTaskList } from '../duty/tasks/AppTaskList';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { SlideButton } from '../button/SlideButton';
import { useState } from 'react';

export type Duty = {
  id: string;
  label: string;
  done: boolean;
};

type DutyProps = {
  page: Page;
};

export const Duty = ({ page }: DutyProps) => {
  const [addList, setAddList] = useState(false);

  return (
    <JustifyBetween>
      <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
        <DutyContainer>
          {page.description !== '' && (
            <SmallTitle>{page.description}</SmallTitle>
          )}
          <AppDailyDuty />
          <AppTaskList />
        </DutyContainer>
      </FadeIn>
      {addList ? (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <AddTaskList cancel={() => setAddList(false)} />
        </FadeIn>
      ) : (
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <SlideButton onClick={() => setAddList(true)}>
            Neue Liste anlegen
          </SlideButton>
        </FadeIn>
      )}
    </JustifyBetween>
  );
};

const DutyContainer = styled.div(() => [
  css`
    overflow-y: auto;
    height: 100%;
    width: 100%;
  `,
]);
