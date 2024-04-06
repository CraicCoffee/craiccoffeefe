// RatingChartAndTable.js
import React, {useEffect, useState} from 'react';
import {Card, Table} from 'antd';
import { Line } from '@ant-design/charts';
import axios from "axios";

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

const RatingChartAndTableAnalysis = ({ brewIds }) => {
  console.log("brewIds", brewIds)
  // 新状态，用于存储所有评分数据
  const [allRatingData, setAllRatingData] = useState([]);

  useEffect(() => {
    // 假设我们有一个函数fetchRatingData用来从后端获取评分数据
    const fetchRatingData = async (id) => {
      try {
        const response = await axios.get(`/api/brew-ratings/${id}`); // 用实际的API路径替换

        return response.data;
      } catch (error) {
        console.error('Error fetching rating data:', error);
        return null;
      }
    };

    // 使用Promise.all同时获取所有评分数据
    Promise.all(brewIds.map(id => fetchRatingData(id))).then(dataArray => {
      const combinedData = dataArray.reduce((acc, data) => {
        // 由于data已经是一个对象，不需要展开，直接推入数组
        if (data) acc.push(data);
        return acc;
      }, []);
      setAllRatingData(combinedData);
    });
  }, [brewIds]);

  const createChartData = (allRatingData) => {
    // 创建一个对象，用于存储每个brewId对应的属性变化序列
    const attributeChanges = {};

    // 创建一个数组，用于存储最终的图表数据
    let chartData = [];

    // 遍历每个评分数据对象
    allRatingData.forEach((rating, index) => {
      // 过滤出我们不需要的属性
      const filteredRating = Object.keys(rating).reduce((acc, key) => {
        if (!['_id', 'brew', 'createdAt', 'updatedAt', '__v'].includes(key)) {
          acc[key] = rating[key];
        }
        return acc;
      }, {});

      // 对于每个评分数据，遍历其属性
      Object.keys(filteredRating).forEach(key => {
        // 初始化或更新属性变化序列
        if (!attributeChanges[key]) {
          attributeChanges[key] = [];
        }
        attributeChanges[key].push(filteredRating[key]);

        // 添加或更新图表数据
        const brewId = rating.brew;
        const chartDataPoint = chartData.find((p) => p.attributeName === key && p.brew === brewId);
        if (chartDataPoint) {
          chartDataPoint[`value${index + 1}`] = filteredRating[key];
        } else {
          chartData.push({
            attributeName: key,
            brew: brewId,
            [`value${index + 1}`]: filteredRating[key]
          });
        }
      });
    });

    // 转换attributeChanges为表格所需的格式（属性名称 -> 变化序列）
    const tableData = Object.keys(attributeChanges).map((attributeName) => {
      const changes = attributeChanges[attributeName].join(' -> ');
      return {
        attributeName: attributeName,
        changes: changes
      };
    });

    console.log('chartData:', chartData);
    console.log('tableData:', tableData);
    return { chartData, tableData };
  };

// 使用createChartData函数来生成图表和表格数据
  const { chartData, tableData } = createChartData(allRatingData);

// 动态创建“Changes”列，并为每个变化添加渲染规则
  const createChangesColumns = (tableData) => {
    // 找出变化次数的最大值
    const maxChanges = Math.max(...tableData.map(item => item.changes.split(' -> ').length));

    // 基于最大变化次数创建列配置
    return Array.from({ length: maxChanges }, (_, index) => ({
      title: `Change ${index + 1}`,
      dataIndex: `change${index + 1}`,
      key: `change${index + 1}`,
      // 添加自定义渲染
      render: (value, record, rowIndex) => {
        // 获取前一个变化的值，如果是第一个变化则和自身比较
        const prevValue = index === 0 ? value : record[`change${index}`];
        // 判断当前值和前一个值的关系
        let bgColor = '';
        if (parseFloat(value) > parseFloat(prevValue)) {
          bgColor = '#d9574a';
        } else if (parseFloat(value) < parseFloat(prevValue)) {
          bgColor = '#b4bf5f';
        }
        // 设置单元格样式
        return {
          props: {
            style: { backgroundColor: bgColor }
          },
          children: <div>{value}</div>
        };
      },
    }));
  };
// 将changes字段转换为多个字段
  const transformedTableData = tableData.map(item => {
    const changes = item.changes.split(' -> ');
    // 创建一个新对象存放拆分后的changes
    const changesObj = changes.reduce((acc, change, index) => {
      acc[`change${index + 1}`] = change;
      return acc;
    }, {});

    return {
      ...item, // 保留原始属性
      ...changesObj, // 添加变化的新字段
    };
  });

// 通过函数创建额外的“Changes”列
  const changesColumns = createChangesColumns(tableData);

// 最终的列配置包括原始列和变化列
  const columns = [
    {
      title: 'Attribute',
      dataIndex: 'attributeName',
      key: 'attributeName',
      render: (text) => fieldTranslations[text] || text, // 假设存在翻译映射
    },
    ...changesColumns, // 展开变化列
  ];

  const transformChartData = (chartData) => {
    const transformedData = [];

    // 遍历每个数据项
    chartData.forEach(item => {
      // 遍历每个对象的键
      Object.keys(item).forEach(key => {
        // 如果键以'value'开头，我们假设其代表一个需要显示的数据点
        if (key.startsWith('value')) {
          // 创建一个新的数据点并添加到结果数组中
          transformedData.push({
            attributeName: item.attributeName,
            brew: item.brew,
            value: item[key],
            scoreTable: `评分表${item.brew}`, // 根据实际情况定制标签
          });
        }
      });
    });

    return transformedData;
  };

  // Chart configuration
  const lineConfig = {
    data: transformChartData(chartData),
    xField: 'attributeName',
    yField: 'value',
    seriesField: 'scoreTable',  // 用于区分不同评分表的数据系列
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
          <Table dataSource={transformedTableData} columns={columns} pagination={false} />
        </Card>
      </div>
    </div>
  );
};

export default RatingChartAndTableAnalysis;
