import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getChartColorsArray } from '../../helpers/chart-color';
import propTypes from 'prop-types';

const BarChart = ({ dataColors, title, labels, columnData }) => {
  var barChartColor = getChartColorsArray(dataColors);
  const data = {
    labels,
    datasets: [
      {
        label: title,
        backgroundColor: barChartColor[0],
        borderColor: barChartColor[0],
        borderWidth: 1,
        hoverBackgroundColor: barChartColor[1],
        hoverBorderColor: barChartColor[1],
        data: columnData,
      },
    ],
  };
  const option = {
    x: {
      ticks: {
        font: {
          family: 'Poppins',
        },
      },
    },
    y: {
      ticks: {
        font: {
          family: 'Poppins',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'Poppins',
          },
        },
      },
    },
  };
  return (
    <React.Fragment>
      <Bar width={723} height={320} data={data} options={option} />
    </React.Fragment>
  );
};

BarChart.propTypes = {
  dataColors: propTypes.string,
  title: propTypes.string,
  labels: propTypes.array,
  columnData: propTypes.array,
};

export default React.memo(BarChart);
