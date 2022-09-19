import { FadeIn } from 'anima-react';
import { css, styled } from 'twin.macro';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { AppDailyDuty } from '../duty/daily/AppDailyDuty';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';

export type Duty = {
  id: string;
  label: string;
  done: boolean;
};

type DutyProps = {
  page: Page;
};

export const Duty = ({ page }: DutyProps) => {
  return (
    <JustifyBetween>
      <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
        <DutyContainer>
          {page.description !== '' && (
            <SmallTitle>{page.description}</SmallTitle>
          )}
          <AppDailyDuty />
        </DutyContainer>
      </FadeIn>
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