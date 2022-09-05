import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { ApexOptions } from 'apexcharts'
import { useWindowDimensions } from '../../hooks/useWindowDimensions'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../dexie/db'

const options: ApexOptions = {
  chart: {
    id: 'line',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm',
      },
    },
  },
  yaxis: {
    min: 0,
    labels: {
      formatter: val => Math.round(val).toString(),
    },
  },
  stroke: {
    curve: 'smooth',
  },
}

export const DashboardChart = () => {
  const { width } = useWindowDimensions()
  const entries = useLiveQuery(() => db.journal.toArray())

  if (!entries) return <></>

  const dates = getDates(entries.map(entry => new Date(entry.date)))

  entries.forEach(e => dates[new Date(e.date).toDateString()]++)

  const data = Object.keys(dates).map(k => ({
    x: new Date(k).getTime(),
    y: dates[k],
  }))

  const series = [
    {
      name: 'Tagebuch Einträge',
      data: data,
    },
  ]

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      width={width > 850 ? '800' : (width - 50).toString()}
    />
  )
}

const getDates = (dates: Date[]) => {
  const min = dates.reduce((a, b) => (a < b ? a : b))
  const max = dates.reduce((a, b) => (a > b ? a : b))
  return getDatesInRange(min, max)
}

const getDatesInRange = (startDate: Date, endDate: Date) => {
  const date = new Date(startDate.getTime())

  const dates: { [key: string]: number } = {}

  while (date <= endDate) {
    dates[new Date(date).toDateString()] = 0
    date.setDate(date.getDate() + 1)
  }

  return dates
}
