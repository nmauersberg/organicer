import { FadeIn } from 'anima-react';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { ScrollableFitContainer } from '../layout/ScrollableFitContainer';
import { AddSportSession } from '../sports/AddSportSession';
import { AppSports } from '../sports/app';

type SportProps = {
  page: Page;
};

export const Sport = ({ page }: SportProps) => {
  return (
    <JustifyBetween>
      <ScrollableFitContainer>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <PageTitle title={page.description} />
          <AppSports />
        </FadeIn>
      </ScrollableFitContainer>

      <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
        <AddSportSession />
      </FadeIn>
    </JustifyBetween>
  );
};

// -----------------------------------------------------------------------------
// Page Title
// -----------------------------------------------------------------------------

type PageTitleProps = {
  title: string;
};

const PageTitle = ({ title }: PageTitleProps) => (
  <>{title !== '' && <SmallTitle>{title}</SmallTitle>}</>
);
