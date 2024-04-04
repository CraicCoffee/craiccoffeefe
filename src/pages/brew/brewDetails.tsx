import React, {useContext, useEffect, useState} from 'react';
import {Card, Descriptions, Badge, Tabs, Collapse, message} from 'antd';
import {DualAxes, Line} from '@ant-design/charts';
import {useParams} from "@umijs/max";
import {PageTabsContext} from "@/components/PageContainerContext";
import RatingChartAndTable from "@/pages/brew/components/RatingChartAndTable";
import axios from "axios"; // 引入折线图组件

const {TabPane} = Tabs;

// 创建一个映射字典
const keyToDisplayName = {
  adc1: '累计咖啡液重',
  total: '累计注水量',
  ratio: '粉液比',
  beanRatioArray: '粉水比',
  size: '注水速率',
  bsize: '萃取速率'
};

const BrewLogChart = ({data, name}) => {
  const config = {
    data,
    xField: 'second',
    yField: 'value',
    seriesField: 'type', // 使用seriesField来区分数据系列
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    appendPadding: 10,
    autoFit: true,
    smooth: true,
    title: {
      visible: true,
      text: name,
    },
    legend: {position: 'top-left'}, // 自定义图例位置
    // 其他配置...
  };

  return <Line {...config} />;
};

const generateChartData = (dataSeries, key) => {
  return dataSeries.map((value, index) => ({
    second: index, // 假设数组索引就是秒数
    value,
    type: keyToDisplayName[key] // 使用映射字典更新type字段
  }));
};

const BrewDetails = () => {
  const {id} = useParams();
  const [brew, setBrew] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabElements, setTabElements] = useState([]); // 新增状态来存储 tab 元素
  const [ratingData, setRatingData] = useState(null);
  const {setTabs} = useContext(PageTabsContext);

  useEffect(() => {
    let isMounted = true;  // 确保组件卸载后不执行setState

    const fetchData = async () => {
      setLoading(true);
      try {
        // 首先获取评分数据
        const ratingResponse = await axios.get(`/api/brew-ratings/${id}`);
        const ratingData = ratingResponse.data;
        console.log('Rating dataasdasdf:', ratingResponse)
        // 紧接着获取酿造数据
        const brewResponse = await fetch(`/api/brew/${id}`);
        if (!brewResponse.ok) {
          throw new Error('Brew not found.');
        }
        const brewData = await brewResponse.json();

        if (isMounted) {
          // 在这里，确保同时拥有酿造数据和评分数据
          setBrew(brewData);
          setRatingData(ratingData);

          // 构建tab元素
          const tabElements = buildTabElements(brewData, ratingData);
          setTabs(tabElements);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      setTabs([]);
    };
  }, [id, setTabs]);

  const handleRatingSubmit = async (ratingValues) => {
    try {
      // Post the rating data to the backend API
      const response = await axios.post(`/api/brew-ratings`, ratingValues);

      // Assuming the response contains the new rating data
      const newRatingData = response.data;

      // Update the state with the new rating data
      setRatingData(newRatingData);

      message.success('Rating submitted successfully.');
      // Other actions after successful submission, if needed
    } catch (error) {
      message.error(`Failed to submit rating: ${error.message}`);
    }
  };

  function buildTabElements(brew, ratingData) {
    const {json} = brew;
    const {singleBean, brewingLog} = json;

    // 定义两个分组
    const groupOneKeys = ['adc1', 'total', 'ratio', 'beanRatioArray'];
    const groupTwoKeys = ['bsize', 'size'];

    // 创建第一个图表的数据
    const groupOneData = groupOneKeys.flatMap((key) => {
      const dataSeries = brewingLog[key];
      if (!Array.isArray(dataSeries)) {
        console.error(`Expected an array for key ${key}, but received:`, dataSeries);
        return [];
      }
      return generateChartData(dataSeries, key);
    });

    // 创建第二个图表的数据
    const groupTwoData = groupTwoKeys.flatMap((key) => {
      const dataSeries = brewingLog[key];
      if (!Array.isArray(dataSeries)) {
        console.error(`Expected an array for key ${key}, but received:`, dataSeries);
        return [];
      }
      return generateChartData(dataSeries, key);
    });

    return [
      {
        key: '1',
        label: '基础信息',
        element: (
          // ...TabPane 内容
          <Card>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="滤杯模型">{json.filterCupModel}</Descriptions.Item>
              <Descriptions.Item label="杯厂">{json.cupFactory}</Descriptions.Item>
              <Descriptions.Item label="杯模型">{json.cupModel}</Descriptions.Item>
              <Descriptions.Item label="杯类型">{json.cupType}</Descriptions.Item>
              <Descriptions.Item label="滤纸">{json.filterPaper}</Descriptions.Item>
              {/* More Descriptions.Items */}
            </Descriptions>
          </Card>
        ),
      },
      {
        key: '2',
        label: '豆类信息',
        element: (
          // ...TabPane 内容
          <Card>
            <Descriptions title="单品豆" bordered column={1}>
              <Descriptions.Item label="名称">{singleBean.name}</Descriptions.Item>
              <Descriptions.Item label="选定的豆类">{json.beanTypeSelected}</Descriptions.Item>
              <Descriptions.Item label="重量">{singleBean.weight}g</Descriptions.Item>
              <Descriptions.Item label="烘焙日期">{singleBean.bakeDate}</Descriptions.Item>
              <Descriptions.Item label="烘焙度">{singleBean.bakeDegree}</Descriptions.Item>
            </Descriptions>
            {/* Add more Descriptions for mixedBean if necessary */}
          </Card>
        ),
      },
      {
        key: '3',
        label: '冲煮信息',
        element: (
          // ...TabPane 内容
          <Card>
            <Descriptions title="研磨信息" bordered column={1}>
              <Descriptions.Item label="磨豆机">{json.beanMoDouJi}</Descriptions.Item>
              <Descriptions.Item label="豆粒度">{json.beanKeDu}</Descriptions.Item>
              <Descriptions.Item label="豆粗细">{json.beanCuXi}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="冲煮信息" bordered column={1}>
              <Descriptions.Item label="煮沸时间">{json.beanBoilDuration}</Descriptions.Item>
              <Descriptions.Item label="水质">{json.waterQuality}</Descriptions.Item>
              <Descriptions.Item label="总重量">{json.totalWeight}g</Descriptions.Item>
              <Descriptions.Item label="水粉比">{json.waterPowderRatio}</Descriptions.Item>
              <Descriptions.Item label="比例">{json.ratio}</Descriptions.Item>
              <Descriptions.Item label="总时间">{json.totalDuration}s</Descriptions.Item>
              <Descriptions.Item label="壶温度">{json.jugTemperature}</Descriptions.Item>
              <Descriptions.Item label="总注水量">{json.totalWaterInjection}ml</Descriptions.Item>
              <Descriptions.Item label="最佳饮用温度">{json.bestDrinkTemperature}°C</Descriptions.Item>
            </Descriptions>
            {/* Add more Descriptions for mixedBean if necessary */}
          </Card>
        ),
      },
      {
        key: '4',
        label: '冲煮记录',
        element: (
          // ...TabPane 内容
          <Card>
            <div style={{padding: '20px'}}>
              <div style={{marginBottom: '2rem'}}>
                {/*<DualAxesChart data={groupOneData}/>*/}
                <BrewLogChart data={groupOneData} name="Group Two Metrics"/>

              </div>
              <div style={{marginBottom: '2rem'}}>
                <BrewLogChart data={groupTwoData} name="Group Two Metrics"/>
              </div>
            </div>
          </Card>
        ),
      },
      {
        key: '5',
        label: '感官评分',
        element: (
          // ...TabPane 内容
          <Card>
            <RatingChartAndTable
              key={Date.now()} // 强制重新渲染组件
              brewId={id}
              ratingData={ratingData}
              onRatingSubmit={handleRatingSubmit}
            />
          </Card>
        ),
      },
      // ... 其他tabs
    ];
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!brew) return <div>No brew data available.</div>;

  return (
    <></>
  );
};

export default BrewDetails;
