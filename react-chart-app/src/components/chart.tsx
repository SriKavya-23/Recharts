import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios, { AxiosResponse } from 'axios';

interface ChartData {
  timestamp: string;
  value: number;
}

const Chart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<string>('daily');

  useEffect(() => {
    axios.get<ChartData[]>('/data.json').then((response: AxiosResponse<ChartData[]>) => {
      setChartData(response.data);
    });
  }, []);

  const handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(event.target.value);
  };

  const series = [{
    name: "Values",
    data: chartData.map(data => ({ x: new Date(data.timestamp), y: data.value }))
  }];

  const options = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true
      },
      events: {
        click: (event: any, chartContext: any, config: any) => {
          const dataPointIndex = config.dataPointIndex;
          const data = chartData[dataPointIndex];
          alert(`Timestamp: ${data.timestamp}\nValue: ${data.value}`);
        }
      }
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Value'
      }
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="timeframe">Timeframe:</label>
        <select id="timeframe" onChange={handleTimeframeChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default Chart;
