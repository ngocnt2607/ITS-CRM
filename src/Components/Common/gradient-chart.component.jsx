import React from 'react';
import { getChartColorsArray } from '../../helpers/chart-color';
import propTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

const Gradient = ({
  dataColors,
  name,
  data,
  xAxisCategories,
  title,
  yAxisConfig,
}) => {
  const gradientChartsColors = getChartColorsArray(dataColors);
  const series = [
    {
      name,
      data,
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 7,
      curve: 'smooth',
    },
    xaxis: {
      type: 'string',
      categories: xAxisCategories,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontWeight: 500,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#0ab39c'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      colors: gradientChartsColors,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      },
    },
    yaxis: yAxisConfig,
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type='line'
        height={350}
        className='apex-charts'
      />
    </React.Fragment>
  );
};

Gradient.propTypes = {
  dataColors: propTypes.string,
  name: propTypes.string,
  title: propTypes.string,
  yAxisConfig: propTypes.object,
  data: propTypes.array,
  xAxisCategories: propTypes.array,
};

export default React.memo(Gradient);
