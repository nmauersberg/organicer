import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDexieDb } from '../../dexie/db';

export const DashboardChart = () => {
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
    xaxis: {
      type: 'category',
      labels: {
        formatter: val =>
          new Date(val)
            .toLocaleString('de-DE', { weekday: 'long' })
            .substring(0, 2),
      },
    },
    yaxis: {
      min: 0,
      max: max + 1,
      labels: {
        formatter: val => Math.round(val).toString(),
      },
    },
    stroke: {
      curve: 'smooth',
      width: [8, 1, 1],
    },
    plotOptions: {
      bar: {
        columnWidth: '25%',
      },
    },
  };

  const dataDailyDutiesGoal = Object.keys(dates).map(k => {
    const dde = dailyDutyEntries?.find(entry => compareDates(k, entry.date));

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
  return getDatesInRange(min, max);
};

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const date = new Date(startDate.getTime());
  const dates: { [key: string]: number } = {};

  while (date <= endDate) {
    dates[new Date(date).toDateString()] = 0;
    date.setDate(date.getDate() + 1);
  }

  return dates;
};
