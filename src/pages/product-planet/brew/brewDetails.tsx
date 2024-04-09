import React, {useContext, useEffect, useState} from 'react';
import {message} from 'antd';
import {useParams} from "@umijs/max";
import {PageTabsContext} from "@/components/PageContainerContext";
import axios from "axios";
import Summary from "@/pages/product-planet/brew/components/Summary"; // 引入折线图组件
const {BasicInfoTab, BeanInfoTab, BrewInfoTab, BrewLogTab, SensoryRatingTab} = require('@/pages/product-planet/brew/components/NormalTabs');

// 创建一个映射字典
const keyToDisplayName = {
    adc1: '累计咖啡液重',
    total: '累计注水量',
    ratio: '粉液比',
    beanRatioArray: '粉水比',
    size: '注水速率',
    bsize: '萃取速率'
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
        // 首先过滤掉大于50的数据，然后将小于0.2的数据替换为0
        const adjustedDataSeries = dataSeries
          .filter(value => value <= 50) // 移除大于50的数据点
          .map(value => (value < 0.5 ? 0 : value)); // 将小于0.2的数据点值设为0

        return generateChartData(adjustedDataSeries, key);
      });

        return [
            {
                key: '1',
                label: '概要信息',
                element: <Summary brewLogChartData={groupOneData} ratingData={ratingData} brewJson={json}/>,
            },
            {
                key: '2',
                label: '基础信息',
                element: <BasicInfoTab singleBean={singleBean}  json={json}/>,
            },
            {
                key: '3',
                label: '冲煮信息',
                element: <BrewInfoTab json={json}/>,
            },
            {
                key: '4',
                label: '冲煮记录',
                element: <BrewLogTab groupOneData={groupOneData} groupTwoData={groupTwoData}/>,
            },
            {
                key: '5',
                label: '感官评分',
                element: <SensoryRatingTab brewId={id} ratingData={ratingData} onRatingSubmit={handleRatingSubmit}/>,
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
