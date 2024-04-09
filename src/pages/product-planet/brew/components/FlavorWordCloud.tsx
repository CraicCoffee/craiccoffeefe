import React from 'react';
import { WordCloud } from '@ant-design/charts';

const WordCloudChart = () => {
  // 示例数据，可以替换为你的风味词数据
  const data = [
    { word: 'Vanilla', value: 10 },
    { word: 'Chocolate', value: 15 },
    { word: 'Strawberry', value: 8 },
    // ...其他风味词
  ];

  // 配置词云图
  const config = {
    data,
    wordField: 'word',
    weightField: 'value',
    colorField: 'word',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [20, 60], // 字体大小范围
      rotation: 0, // 旋转角度
    },
    // 其他可选配置
    interactions: [{ type: 'element-active' }], // 交互效果
    state: {
      active: {
        style: {
          lineWidth: 3,
          shadowBlur: 10,
          shadowColor: '#333333',
        },
      },
    },
  };

  return <WordCloud {...config} />;
};

export default WordCloudChart;
