import { FadeIn } from 'anima-react';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';

type SportProps = {
  page: Page;
};

export const Sport = ({ page }: SportProps) => {
  return (
    <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
      <>
        {page.description !== '' && <SmallTitle>{page.description}</SmallTitle>}
      </>
    </FadeIn>
  );
};
