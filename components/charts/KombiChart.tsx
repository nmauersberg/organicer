import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDexieDb } from '../../dexie/db';

export const KombiChart = () => {
  const [db] = useDexieDb();
  const { width } = useWindowDimensions();
  const journalEntries = useLiveQuery(() => db.journal.toArray()) || [];
  const dailyDutyEntries = useLiveQuery(() => db.dailyDuty.toArray()) || [];
  const settings = useLiveQuery(() => db.userSettings.get(1));

  if (!settings) {
    return <></>;
  }

  const journalDates = mapDates(journalEntries);
  const dailyDutyDates = mapDates(dailyDutyEntries);

  const dates = getDates([...journalDates, ...dailyDutyDates, new Date()]);

  journalEntries.forEach(e => {
    const entryCount = dates[new Date(e.date).toDateString()];
    dates[new Date(e.date).toDateString()] =
      typeof entryCount === 'number' ? entryCount + 1 : 1;
  });

  const dataJournal = Object.keys(dates).map(k => ({
    x: new Date(k).getTime(),
    y: dates[k],
  }));

  const max = Math.max(...dataJournal.map(o => o.y));

  const options: ApexOptions = {
    colors: ['#db5461', '#53a2be', '#26c485'],
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const html = `
        <div style="padding: 0.5rem;">
          <span>
            <b>
              ${new Date(w.globals.labels[dataPointIndex]).toLocaleString(
                'de-DE',
                {
                  weekday: 'long',
                },
              )}
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
          new Date(val)
            .toLocaleString('de-DE', { weekday: 'long' })
            .substring(0, 2),
      },
      labels: {
        formatter: val => {
          const weekday = new Date(val)
            .toLocaleString('de-DE', { weekday: 'long' })
            .substring(0, 2);
          return weekday === 'Mo' ? weekday : '';
        },
      },
    },
    grid: {
      padding: {
        left: -15,
        right: 0,
      },
    },
    yaxis: {
      min: 0,
      max: max + 1,
      labels: {
        show: false,
        // formatter: val => Math.round(val).toString(),
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
    <Chart
      options={options}
      series={series}
      type="line"
      width={
        width > 850
          ? '800'
          : width > 500
          ? (width - 50).toString()
          : (width - 20).toString()
      }
    />
  );
};

const compareDates = (date1: string | Date, date2: string | Date): boolean => {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

const mapDates = (el: { date: string }[]) =>
  el.map(entry => new Date(entry.date));

const getDates = (dates: Date[]) => {
  const min = dates.reduce((a, b) => (a < b ? a : b));
  const max = dates.reduce((a, b) => (a > b ? a : b));

  return getDatesInRange(removeTime(min), removeTime(max));
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const dates: { [key: string]: number } = {};

  while (startDate <= endDate) {
    dates[new Date(startDate).toDateString()] = 0;
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
};

function removeTime(date = new Date()) {
  return new Date(date.toDateString());
}
