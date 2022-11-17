import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDexieDb } from '../../dexie/db';
import {
  CustomLegend,
  LegendElement,
  LegendMarker,
  LegendText,
} from './CustomLegend';
import { useState } from 'react';
import { compareDates, getChartWidth, getDates, mapDates } from './util';
import { ChartRange } from '../views/Dashboard';
import { theme } from '../../styles/theme';
import { mkFadeInCss } from 'anima-react';

type HeatmapTasksProps = {
  limit?: ChartRange;
};

export const HeatmapTasks = ({ limit }: HeatmapTasksProps) => {
  const [db] = useDexieDb();
  const { width } = useWindowDimensions();
  const dailyDutyEntries = useLiveQuery(() => db.dailyDuty.toArray()) || [];
  const settings = useLiveQuery(() => db.userSettings.get(1));
  const [showLegend, setShowLegend] = useState(false);

  if (!settings) {
    return <></>;
  }

  const dailyDutyDates = mapDates(dailyDutyEntries);

  const dates = getDates([...dailyDutyDates, new Date()], limit);

  const getDutyHeatmapData = (id: string) =>
    Object.keys(dates).map(k => {
      const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

      return {
        x: new Date(k).getTime(),
        y: dde?.duties.some(d => d.done && d.id === id) ? 3 : 1,
      };
    });

  // -----------------------------------------------------------------------------
  // Apex Options
  // -----------------------------------------------------------------------------

  const chartColors = [
    theme.colors.orange,
    theme.colors.petrol,
    theme.colors.lime,
  ];

  const options: ApexOptions = {
    colors: chartColors,
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => `
        <div style="padding: 0.5rem;">
          <span>
            <b>
              ${w.globals.seriesNames[seriesIndex]}
            </b>
          </span>
          <br/>
        </div>
      `,
    },
    chart: {
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      events: {
        animationEnd: () => {
          setTimeout(() => {
            setShowLegend(true);
          }, 0);
        },
      },
    },
    plotOptions: {
      heatmap: {
        distributed: true,
      },
    },
  };

  // -----------------------------------------------------------------------------
  // Apex Series
  // -----------------------------------------------------------------------------

  const series = settings.dailyDuty.duties.map(d => ({
    name: d.label,
    data: getDutyHeatmapData(d.id),
  }));

  return (
    <>
      <Chart
        options={options}
        series={series}
        type="heatmap"
        height={`${series.length * 15}px`}
        width={getChartWidth(width)}
      />
      <br />
      <CustomLegend style={{ visibility: showLegend ? 'visible' : 'hidden' }}>
        {series.map((s, i) => (
          <LegendElement
            key={i}
            extraCss={
              showLegend
                ? mkFadeInCss({
                    orientation: 'up',
                    duration: 0.5,
                    distance: 5,
                    delay: 0.15 * i,
                  })
                : undefined
            }
          >
            <LegendMarker color={chartColors[i]} />
            <LegendText>{s.name}</LegendText>
          </LegendElement>
        ))}
      </CustomLegend>
    </>
  );
};
