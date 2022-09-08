import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { ApexOptions } from 'apexcharts';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { useLiveQuery } from 'dexie-react-hooks';
import { useDexieDb } from '../../dexie/db';

export const DashboardChart = () => {
  const [db] = useDexieDb();
  const { width } = useWindowDimensions();
  const entries = useLiveQuery(() => db.journal.toArray());

  if (!entries || entries.length === 0) return <></>;

  const dates = getDates(entries.map(entry => new Date(entry.date)));

  entries.forEach(e => {
    const entryCount = dates[new Date(e.date).toDateString()];
    dates[new Date(e.date).toDateString()] =
      typeof entryCount === 'number' ? entryCount + 1 : 1;
  });

  const data = Object.keys(dates).map(k => ({
    x: new Date(k).getTime(),
    y: dates[k],
  }));

  const max = Math.max(...data.map(o => o.y));

  const options: ApexOptions = {
    chart: {
      id: 'line',
    },
    colors: ['#db5461'],
    xaxis: {
      type: 'category',
      labels: {
        formatter: val =>
          new Date(val).toLocaleString('de-DE', { weekday: 'long' }),
        // format: 'dddd',
        // datetimeFormatter: {
        //   year: 'yyyy',
        //   month: "MMM 'yy",
        //   day: 'dd MMM',
        //   hour: 'HH:mm',
        // },
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
    },
  };

  const series = [
    {
      name: 'Tagebuch Einträge',
      data: data,
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
