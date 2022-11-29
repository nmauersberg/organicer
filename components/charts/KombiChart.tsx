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
import { useEffect, useState } from 'react';
import {
  removeTime,
  compareDates,
  mapDates,
  getDates,
  addHours,
  getChartWidth,
} from './util';
import { ChartRange, WEEK_LIMIT } from '../views/Dashboard';
import { theme } from '../../styles/theme';
import { mkFadeInCss } from 'anima-react';

type KombiChartProps = {
  limit?: ChartRange;
};

export const KombiChart = ({ limit }: KombiChartProps) => {
  const [db] = useDexieDb();
  const { width } = useWindowDimensions();
  const journalEntries = useLiveQuery(() => db.journal.toArray()) || [];
  const dailyDutyEntries = useLiveQuery(() => db.dailyDuty.toArray()) || [];
  const settings = useLiveQuery(() => db.userSettings.get(1));
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLegend(true);
    }, 1500);
  });

  if (!settings) {
    return <></>;
  }

  const journalDates = mapDates(journalEntries);
  const dailyDutyDates = mapDates(dailyDutyEntries);

  const dates = getDates(
    [...journalDates, ...dailyDutyDates, new Date()],
    limit,
  );

  journalEntries.forEach(e => {
    if (new Date(e.date).toDateString() in dates) {
      const entryCount = dates[new Date(e.date).toDateString()];
      dates[new Date(e.date).toDateString()] =
        typeof entryCount === 'number' ? entryCount + 1 : 1;
    }
  });

  const dataJournal = Object.keys(dates).map(k => ({
    x: new Date(k).getTime(),
    y: dates[k],
  }));

  const maxJournalEntries = Math.max(...dataJournal.map(o => o.y));

  const max =
    maxJournalEntries >= settings.dailyDuty.duties.length
      ? maxJournalEntries
      : settings.dailyDuty.duties.length;

  const chartColors = [theme.colors.red, theme.colors.blue, theme.colors.green];

  const options: ApexOptions = {
    colors: chartColors,
    legend: {
      show: false,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const html = `
        <div style="padding: 0.5rem;">
          <span>
            <b>
              ${addHours(
                new Date(w.globals.labels[dataPointIndex]),
                12,
              ).toLocaleString('de-DE', {
                weekday: 'long',
              })}, ${addHours(
          new Date(w.globals.labels[dataPointIndex]),
          12,
        ).toLocaleDateString('de-DE')}
            </b>
          </span>
          <br/>
          
          <span>
            ${w.globals.seriesNames[0]}${': '} 
            ${w.globals.series[0][dataPointIndex]}
          </span>
          <br/>

          <span>
            ${w.globals.seriesNames[2]}${': '} 
            ${w.globals.series[2][dataPointIndex]}
            ${
              w.globals.series[1]
                ? ` / ${w.globals.series[1][dataPointIndex]}`
                : ''
            }
          </span>
        </div>
        `;

        return html;
      },
    },
    xaxis: {
      type: 'category',
      tooltip: {
        enabled: false,
        formatter: val =>
          addHours(new Date(val), 12)
            .toLocaleString('de-DE', { weekday: 'long' })
            .substring(0, 2),
      },
      labels: {
        formatter: val => {
          const weekday = addHours(new Date(val), 12)
            .toLocaleString('de-DE', { weekday: 'long' })
            .substring(0, 2);
          return weekday === 'Mo'
            ? weekday
            : limit === WEEK_LIMIT
            ? weekday
            : '';
        },
      },
    },
    grid: {
      padding: {
        left: -25,
        right: 0,
        bottom: -10,
        top: -20,
      },
    },
    yaxis: {
      min: 0,
      max: max + 1,
      labels: {
        // show: false,
        formatter: val =>
          !(val % 2) && val > 0 ? Math.round(val).toString() : '',
      },
    },
    stroke: {
      curve: 'smooth',
      width: [6, 1, 1],
    },
    plotOptions: {
      bar: {
        columnWidth: '25%',
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
      events: {
        animationEnd: () =>
          setTimeout(() => {
            setShowLegend(true);
          }, 25),
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
      },
    },
  };

  const dataDailyDutiesGoal = Object.keys(dates).map(k => {
    const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

    if (
      !dailyDutyEntries.some(e => {
        return removeTime(new Date(e.date)) <= removeTime(new Date(k));
      })
    ) {
      return {
        x: new Date(k).getTime(),
        y: 0,
      };
    }

    return {
      x: new Date(k).getTime(),
      y: dde?.duties.length || settings.dailyDuty.duties.length,
    };
  });

  const dataDailyDutiesDone = Object.keys(dates).map(k => {
    const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

    return {
      x: new Date(k).getTime(),
      y: dde?.duties.filter(d => d.done).length || 0,
    };
  });

  const series = [
    {
      name: 'Tagebuch',
      data: dataJournal,
      type: 'line',
    },
    {
      name: 'Ziele',
      type: 'column',
      stacked: false,
      data: dataDailyDutiesGoal,
    },
    {
      name: 'Done',
      type: 'column',
      stacked: false,
      data: dataDailyDutiesDone,
    },
  ];

  return (
    <>
      <Chart
        options={options}
        series={series}
        type="line"
        width={getChartWidth(width)}
      />
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
