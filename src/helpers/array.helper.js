import * as moment from 'moment';

export const getListOption = (options = [], label = '', value = '') =>
  options.map((item) => ({ label: item[label], value: item[value] }));

export const generateOption = (label, value) => ({ label, value });

export const convertStringToArray = (stringHotline = '') => {
  if (!stringHotline) return [];

  return stringHotline.split(/[,;]/);
};

export const get30DaysValue = (data = [], label = '', value = '') => {
  let count = 0;
  const chart = {
    labels: [],
    revenues: [],
  };
  const tempValue = {
    label: '',
    revenue: 0,
  };
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!!i && (item[label] !== tempValue.label || i === data.length - 1)) {
      chart.labels.push(tempValue.label);
      chart.revenues.push(tempValue.revenue);
      tempValue.revenue = 0;
      count += 1;
    }

    tempValue.label = item[label];
    tempValue.revenue += item[value];

    if (count === 30) {
      break;
    }
  }
  return chart;
};

export const get30DaysValue1 = (data = [], label = '', value = '') => {
  let count = 0;
  const chart = {
    labels: [],
    voicetimes: [],
  };
  const tempValue = {
    label: '',
    voicetime: 0,
  };
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!!i && (item[label] !== tempValue.label || i === data.length - 1)) {
      chart.labels.push(tempValue.label);
      chart.voicetimes.push(tempValue.voicetime);
      tempValue.voicetime = 0;
      count += 1;
    }

    tempValue.label = item[label];
    tempValue.voicetime += item[value];

    if (count === 30) {
      break;
    }
  }
  return chart;
};

export const get30DaysValue2 = (data = [], label = '', value = '') => {
  let count = 0;
  const chart = {
    labels: [],
    revenues: [],
  };
  const tempValue = {
    label: '',
    revenue: 0,
  };
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!!i && (item[label] !== tempValue.label || i === data.length - 1)) {
      chart.labels.push(tempValue.label);
      chart.revenues.push(tempValue.revenue);
      tempValue.revenue = 0;
      count += 1;
    }

    tempValue.label = item[label];
    tempValue.revenue += item[value];

    if (count === 30) {
      break;
    }
  }
  return chart;
};

export const get30DaysValue3 = (data = [], label = '', value = '') => {
  let count = 0;
  const chart = {
    labels: [],
    revenues: [],
  };
  const tempValue = {
    label: '',
    revenue: 0,
  };
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!!i && (item[label] !== tempValue.label || i === data.length - 1)) {
      chart.labels.push(tempValue.label);
      chart.revenues.push(tempValue.revenue);
      tempValue.revenue = 0;
      count += 1;
    }

    tempValue.label = item[label];
    tempValue.revenue += item[value];

    if (count === 30) {
      break;
    }
  }
  return chart;
};

export const getStackAreaData = (data = []) => {
  const convert = {
    xAxis: [],
    legend: {},
  };

  data.forEach((item) => {
    if (!convert.xAxis.length || convert.xAxis.at(-1) !== item.createdtime) {
      convert.xAxis.push(item.createdtime);
    }
    if (!convert.legend[item.ip]) {
      convert.legend[item.ip] = [item.ccu];
    } else {
      convert.legend[item.ip].push(item.ccu);
    }
  });
  convert.xAxis = convert.xAxis.map((item) => moment(item).format('HH:mm'));
  const arrayData = [];
  for (const property in convert.legend) {
    arrayData.push({
      name: property,
      value: convert.legend[property],
    });
  }
  return {
    xAxis: convert.xAxis,
    legendData: Object.keys(convert.legend),
    data: arrayData,
  };
};

//chart CCU cho từng khách hàng
export const getStackAreaData1 = (data = []) => {
  const convert = {
    xAxis: [],
    legend: {},
  };

  data.forEach((item) => {
    if (!convert.xAxis.length || convert.xAxis.at(-1) !== item.createdtime) {
      convert.xAxis.push(item.createdtime);
    }
    if (!convert.legend[item.nickname]) {
      convert.legend[item.nickname] = [item.ccu];
    } else {
      convert.legend[item.nickname].push(item.ccu);
    }
  });
  convert.xAxis = convert.xAxis.map((item) => moment(item).format('HH:mm'));
  const arrayData = [];
  for (const property in convert.legend) {
    arrayData.push({
      name: property,
      value: convert.legend[property],
    });
  }
  return {
    xAxis: convert.xAxis,
    legendData: Object.keys(convert.legend),
    data: arrayData,
  };
};
