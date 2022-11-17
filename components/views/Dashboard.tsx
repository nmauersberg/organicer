import { FadeIn, mkFadeInCss } from 'anima-react';
import { KombiChart } from '../charts/KombiChart';
import { Page } from '../menu/MainMenu';
import { SmallTitle } from '../text';
import { HeatmapTasks } from '../charts/HeatmapTasks';
import { SetStateAction, useState } from 'react';
import { ButtonGroup } from '../button/ButtonGroup';
import Icon from '@mdi/react';
import {
  mdiAllInclusiveBoxOutline,
  mdiCalendarMonth,
  mdiCalendarRange,
} from '@mdi/js';
import { css, styled } from 'twin.macro';
import { theme } from '../../styles/theme';
import { getChartWidth } from '../charts/util';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ChartRange = WeekLimit | MonthLimit | undefined;

export type WeekLimit = 6;

export type MonthLimit = 30;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const WEEK_LIMIT: WeekLimit = 6;

export const MONTH_LIMIT: MonthLimit = 30;

// -----------------------------------------------------------------------------
// Dashboard
// -----------------------------------------------------------------------------

type DashboardProps = {
  page: Page;
};

export const Dashboard = ({ page }: DashboardProps) => {
  const [chartRange, setChartRange] = useState<ChartRange>(WEEK_LIMIT);

  return (
    <DashboardFrame>
      <>
        {page.description !== '' && <SmallTitle>{page.description}</SmallTitle>}
      </>
      <FadeIn orientation="up" duration={0.5} delay={0} distance={30}>
        <DashboardHeader
          chartRange={chartRange}
          setChartRange={setChartRange}
        />
      </FadeIn>
      <FadeIn orientation="up" duration={0.5} delay={0} distance={30}>
        <KombiChart limit={chartRange} />
      </FadeIn>
      <FadeIn orientation="up" duration={0.5} delay={0.75} distance={30}>
        <br />
        <SmallTitle>Tagesziele in der Übersicht:</SmallTitle>
        <HeatmapTasks limit={chartRange} />
      </FadeIn>
    </DashboardFrame>
  );
};

// -----------------------------------------------------------------------------
// Dashboard Frame
// -----------------------------------------------------------------------------

const DashboardFrame = styled.div(() => {
  const { width } = useWindowDimensions();
  return [
    css`
      width: ${getChartWidth(width)}px;
      ${mkFadeInCss({
        orientation: 'up',
        duration: 0.5,
        delay: 0.15,
        distance: 30,
      })}
    `,
  ];
});

// -----------------------------------------------------------------------------
// Dashboard Header
// -----------------------------------------------------------------------------

type DashboardHeaderProps = {
  chartRange: ChartRange;
  setChartRange: React.Dispatch<SetStateAction<ChartRange>>;
};

const DashboardHeader = ({
  chartRange,
  setChartRange,
}: DashboardHeaderProps) => {
  return (
    <DashboardHeader_>
      <SmallTitle>Alle Aktivitäten:</SmallTitle>
      <ButtonGroup
        buttons={[
          {
            label: (
              <Icon
                path={mdiCalendarRange}
                size={1}
                color={
                  chartRange === WEEK_LIMIT ? theme.colors.blue : undefined
                }
              />
            ),
            clickHandler: () => setChartRange(WEEK_LIMIT),
          },
          {
            label: (
              <Icon
                path={mdiCalendarMonth}
                size={1}
                color={
                  chartRange === MONTH_LIMIT ? theme.colors.blue : undefined
                }
              />
            ),
            clickHandler: () => setChartRange(MONTH_LIMIT),
          },
          {
            label: (
              <Icon
                path={mdiAllInclusiveBoxOutline}
                size={1}
                color={!chartRange ? theme.colors.blue : undefined}
              />
            ),
            clickHandler: () => setChartRange(undefined),
          },
        ]}
      />
    </DashboardHeader_>
  );
};

const DashboardHeader_ = styled.div(() => [
  css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
]);
