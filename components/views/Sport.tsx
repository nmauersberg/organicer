import { FadeIn } from 'anima-react';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { ScrollableFitContainer } from '../layout/ScrollableFitContainer';
import { AddSportSession } from '../sports/AddSportSession';
import { AppSports } from '../sports/AppSports';

type SportProps = {
  page: Page;
};

export const Sport = ({ page }: SportProps) => {
  return (
    <JustifyBetween>
      <ScrollableFitContainer>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
          <AppSports />
        </FadeIn>
      </ScrollableFitContainer>
      <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
        <AddSportSession />
      </FadeIn>
    </JustifyBetween>
  );
};
