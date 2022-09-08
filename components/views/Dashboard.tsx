import { FadeIn } from 'anima-react';
import { DashboardChart } from '../charts/DashboardChart';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';

type DashboardProps = {
  page: Page;
};

export const Dashboard = ({ page }: DashboardProps) => {
  return (
    <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
      <>
        {page.description !== '' && <SmallTitle>{page.description}</SmallTitle>}
      </>
      <DashboardChart />
    </FadeIn>
  );
};
