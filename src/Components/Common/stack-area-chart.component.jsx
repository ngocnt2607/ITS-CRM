import React, { useMemo } from 'react';
import { getChartColorsArray } from '../../helpers/chart-color';
import ReactEcharts from 'echarts-for-react';

const StackAreaChart = ({ dataColors, legendData, xAxisData, data = [] }) => {
  const chartAreaStackedColors = getChartColorsArray(dataColors);

  const convertData = () => {
    return data.map((item) => ({
      name: item.name,
      type: 'line',
      stack: 'Total',
      label: {
        // show: true,
        position: 'top',
      },
      areaStyle: {},
      emphasis: {
        focus: 'series',
      },
      data: item.value,
    }));
  };

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: legendData,
      textStyle: {
        //The style of the legend text
        color: '#858d98',
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#858d98',
          },
        },
      },
    ],
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#858d98',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(133, 141, 152, 0.1)',
        },
      },
    },
    textStyle: {
      fontFamily: 'Poppins, sans-serif',
    },
    color: chartAreaStackedColors,
    series: convertData(),
  };

  return (
    <React.Fragment>
      <ReactEcharts style={{ height: '350px' }} option={option} />
    </React.Fragment>
  );
};

export default React.memo(StackAreaChart);
