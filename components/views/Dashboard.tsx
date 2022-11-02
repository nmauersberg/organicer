import { FadeIn } from 'anima-react';
import { KombiChart } from '../charts/KombiChart';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { HeatmapTasks } from '../charts/HeatmapTasks';

type DashboardProps = {
  page: Page;
};

export const Dashboard = ({ page }: DashboardProps) => {
  return (
    <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
      <>
        {page.description !== '' && <SmallTitle>{page.description}</SmallTitle>}
      </>
      <FadeIn orientation="up" duration={0.5} delay={0} distance={30}>
        <KombiChart />
      </FadeIn>
      <FadeIn orientation="up" duration={0.5} delay={0.75} distance={30}>
        <br />
        <HeatmapTasks />
      </FadeIn>
    </FadeIn>
  );
};
