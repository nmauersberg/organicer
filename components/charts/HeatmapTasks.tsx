import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDexieDb } from '../../dexie/db';

export const HeatmapTasks = () => {
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

  const getDataDailyDutiesDone = (id: string) =>
    Object.keys(dates).map(k => {
      const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

      return {
        x: new Date(k).getTime(),
        y: dde?.duties.some(d => d.done && d.id === id) ? 3 : 1,
      };
    });

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

  const colors = ['#FF934F', '#35A7FF', '#A5CC6B'];

  const options: ApexOptions = {
    colors,
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
    },
  };

  const series = settings.dailyDuty.duties.map(d => ({
    name: d.label,
    data: getDataDailyDutiesDone(d.id),
  }));

  return (
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
