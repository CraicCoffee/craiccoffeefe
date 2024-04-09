import React from 'react';
import {Radar, RadialBar} from '@ant-design/charts';

const RadialBarChartComponent = ({data}) => {
  // 在数据预处理阶段添加颜色属性
  const processData = (data) => {
    return data.map(item => {
      return {
        ...item,
        color: getColor(item.value), // 添加颜色属性
      };
    });
  };

  const getColor = (value) => {
    if (value >= 0 && value < 2) {
      return '#90ee90'; // 浅绿色
    } else if (value >= 2 && value < 3) {
      return '#4169e1'; // 蓝色
    } else if (value >= 3 && value < 4) {
      return '#ffa500'; // 橙色
    } else if (value >= 4 && value <= 5) {
      return '#ff4500'; // 红色
    }
    return '#ccc'; // 默认颜色
  };

  console.log('process data: ', processData(data))
  const config = {
    data: processData(data), // 使用处理后的数据
    xField: 'attributeName',
    yField: 'value',
    // startAngle: Math.PI * 0.5, // 起始角度
    // maxAngle: 270, //最大旋转角度,
    // scale: {
    //   x: {
    //     padding: 0.5,
    //     align: 0,
    //   },
    //   y: {
    //     min: 0, // 最小值
    //     max: 5, // 最大值，确保与数据的最大值相匹配
    //     nice: false,
    //   },
    // },
    meta: {
      value: {
        min: 0,
        max: 5,
        nice: true,
      },
    },
    // axis: {
    //   x: {
    //     title: false,
    //     grid: true,
    //   },
    //   y: {
    //     gridAreaFill: 'rgba(0, 0, 0, 0.04)',
    //     label: false,
    //     title: false,
    //   },
    // },
    area: {
      style: {
        fillOpacity: 0.2,
      },
    },
    tooltip: {
      items: ['value'],
    },
    // sizeField: 5,
    colorField: 'color', // 使用数据中的颜色字段

    // 设置 tooltip 的格式化方式
    // tooltip: {
    //     formatter: (datum) => {
    //         return { name: datum.name, value: datum.value };
    //     },
    // },
  };

  return <Radar {...config} />;
};

export default RadialBarChartComponent;
