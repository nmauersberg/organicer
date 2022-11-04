import { FadeIn } from 'anima-react';
import { KombiChart } from '../charts/KombiChart';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { HeatmapTasks } from '../charts/HeatmapTasks';
import { useState } from 'react';
import { ButtonGroup } from '../button/ButtonGroup';
import Icon from '@mdi/react';
import {
  mdiAllInclusiveBoxOutline,
  mdiCalendarMonth,
  mdiCalendarRange,
} from '@mdi/js';
import { css, styled } from 'twin.macro';

type DashboardProps = {
  page: Page;
};

export const Dashboard = ({ page }: DashboardProps) => {
  const [chartRange, setChartRange] = useState<number | undefined>(7);

  return (
    <FadeIn orientation="up" duration={0.5} delay={0.15} distance={30}>
      <>
        {page.description !== '' && <SmallTitle>{page.description}</SmallTitle>}
      </>
      <FadeIn orientation="up" duration={0.5} delay={0} distance={30}>
        <DashboardHeader>
          <SmallTitle>Alle Aktivitäten:</SmallTitle>
          <ButtonGroup
            buttons={[
              {
                label: <Icon path={mdiCalendarRange} size={1} />,
                clickHandler: () => setChartRange(7),
              },
              {
                label: <Icon path={mdiCalendarMonth} size={1} />,
                clickHandler: () => setChartRange(31),
              },
              {
                label: <Icon path={mdiAllInclusiveBoxOutline} size={1} />,
                clickHandler: () => setChartRange(undefined),
              },
            ]}
          />
        </DashboardHeader>
      </FadeIn>
      <FadeIn orientation="up" duration={0.5} delay={0} distance={30}>
        <KombiChart limit={chartRange} />
      </FadeIn>
      <FadeIn orientation="up" duration={0.5} delay={0.75} distance={30}>
        <br />
        <SmallTitle>Tagesziele in der Übersicht:</SmallTitle>
        <HeatmapTasks limit={chartRange} />
      </FadeIn>
    </FadeIn>
  );
};

const DashboardHeader = styled.div(() => [
  css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
]);
