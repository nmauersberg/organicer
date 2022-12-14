import { FadeIn } from 'anima-react';
import { css, styled } from 'twin.macro';
import { JustifyBetween } from '../../pages/[[...slug]]';
import { Page } from '../menu/MainMenu';
import { AddJournalEntry } from '../journal/AddEntry';
import { EntryList } from '../journal/EntryList';
import { SmallTitle } from '../text';
import { ScrollableFitContainer } from '../layout/ScrollableFitContainer';

type JournalProps = {
  page: Page;
};

export const Journal = ({ page }: JournalProps) => {
  return (
    <JustifyBetween>
      <ScrollableFitContainer>
        <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
          <>
            {page.description !== '' && (
              <SmallTitle>{page.description}</SmallTitle>
            )}
          </>
          <EntryList />
        </FadeIn>
      </ScrollableFitContainer>
      <FadeIn orientation="up" duration={0.5} delay={0.25} distance={30}>
        <AddJournalEntry />
      </FadeIn>
    </JustifyBetween>
  );
};
