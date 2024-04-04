// RatingChartAndTable.js
import React from 'react';
import {Card, Table} from 'antd';
import { Line } from '@ant-design/charts';
import RatingForm from "@/pages/brew/components/RatingForm";

const fieldTranslations = {
  acidityQuality: '酸(质量)',
  sweetnessQuality: '甜(质量)',
  flavorQuality: '风味(质量)',
  acidityIntensity: '酸(强度)',
  sweetnessIntensity: '甜(强度)',
  bitternessIntensity: '苦(强度)',
  flavorIntensity: '风味(强度)',
  mouthfeel: '触感',
  aftertaste: '余韵',
  richness: '醇厚度'
};

const RatingChartAndTable = ({ brewId, ratingData, onRatingSubmit }) => {
  const isDataEmpty = !ratingData || (Object.keys(ratingData).length === 0 && ratingData.constructor === Object);

  // 如果ratingData为空、null或者是一个空对象，将显示RatingForm以允许用户提交新的评分
  if (isDataEmpty) {
    return <RatingForm brewId={brewId} onRatingSubmit={onRatingSubmit} />;
  }

  // Map the rating data to the format required by the chart and table
  const chartData = Object.keys(ratingData).map(key => ({
    attributeName: key,
    value: ratingData[key],
  })).filter(data => !['_id', 'brew', 'createdAt', 'updatedAt', '__v'].includes(data.attributeName));

  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attributeName',
      key: 'attributeName',
      render: (text) => fieldTranslations[text] || text, // 假设你已经有了翻译映射
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  // Chart configuration
  const lineConfig = {
    data: chartData,
    xField: 'attributeName',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    scale: {
      value: {
        min: 0, // 强制Y轴的最小值为0
        max: 5, // 强制Y轴的最大值为5
      },
    },
    xAxis: {
      label: {
        formatter: (text) => fieldTranslations[text] || text, // 使用映射转换文本
        // 旋转角度
        rotate: 75, // 角度可以根据需要调整
        // 文本对齐方式
        textAlign: 'end',
        // 文本基线对齐方式
        textBaseline: 'middle',
      },
    },
    yAxis: {
      // 确保Y轴不会因为数据只有1而只显示0到1的范围
      minLimit: 0,
      maxLimit: 5,
    },
    annotations: [
      {
        type: 'line',
        start: ['min', 2.5],
        end: ['max', 2.5],
        style: {
          stroke: '#F4664A', // 虚线的颜色
          lineDash: [4, 4], // 虚线的线型
        },
        text: {
          position: 'start',
          style: {
            fill: '#F4664A', // 文本颜色
            fontSize: 12, // 文本大小
          },
          content: '平均线', // 标注文本内容
          offsetY: -5, // Y方向的偏移量
        },
      },
    ],
    // ... other configurations
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '50%' }}>
        <Card title="Rating Chart">
          <Line {...lineConfig} />
        </Card>
      </div>
      <div style={{ width: '45%' }}>
        <Card title="Rating Table">
          <Table dataSource={chartData} columns={columns} pagination={false} />
        </Card>
      </div>
    </div>
  );
};

export default RatingChartAndTable;
