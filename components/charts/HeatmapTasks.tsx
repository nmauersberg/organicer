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
import { compareDates, getDates, mapDates } from './util';
import { colors } from '../../styles/colors';

type HeatmapTasksProps = {
  limit?: number;
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

  const getDataDailyDutiesDone = (id: string) =>
    Object.keys(dates).map(k => {
      const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

      return {
        x: new Date(k).getTime(),
        y: dde?.duties.some(d => d.done && d.id === id) ? 3 : 1,
      };
    });

  const chartColors = [colors.orange, colors.petrol, colors.lime];

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
        mounted: () => {
          setTimeout(() => {
            setShowLegend(true);
          }, 500);
        },
      },
    },
  };

  const series = settings.dailyDuty.duties.map(d => ({
    name: d.label,
    data: getDataDailyDutiesDone(d.id),
  }));

  return (
    <>
      <Chart
        options={options}
        series={series}
        type="heatmap"
        height={`${series.length * 15}px`}
        width={
          width > 850
            ? '800'
            : width > 500
            ? (width - 50).toString()
            : (width - 20).toString()
        }
      />
      <br />
      <CustomLegend style={{ visibility: showLegend ? 'visible' : 'hidden' }}>
        {series.map((s, i) => (
          <LegendElement key={i}>
            <LegendMarker color={chartColors[i]} />
            <LegendText>{s.name}</LegendText>
          </LegendElement>
        ))}
      </CustomLegend>
    </>
  );
};
