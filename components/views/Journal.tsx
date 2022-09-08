import { FadeIn } from 'anima-react';
import { css, styled } from 'twin.macro';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { Page } from '../menu/MainMenu';
import { AddJournalEntry } from '../MicroJournal/AddEntry';
import { EntryList } from '../MicroJournal/EntryList';
import { SmallTitle } from '../text';

type JournalProps = {
  page: Page;
};

export const Journal = ({ page }: JournalProps) => {
  return (
    <JustifyBetween>
      <JournalContainer>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
          <EntryList />
        </FadeIn>
      </JournalContainer>
      <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
        <AddJournalEntry />
      </FadeIn>
    </JustifyBetween>
  );
};

const JournalContainer = styled.div(() => [
  css`
    overflow-y: auto;
    height: 100%;
  `,
]);
