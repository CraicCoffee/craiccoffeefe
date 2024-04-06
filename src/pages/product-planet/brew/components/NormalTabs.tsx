import {Card, Descriptions} from "antd";
import RatingChartAndTable from "@/pages/product-planet/brew/components/RatingChartAndTable";
import React from "react";
import BrewLogChart from "@/pages/product-planet/brew/components/BrewLogChart";


const fixedLabelStyle = {
    width: '120px', // 或者您希望的任何固定宽度
    maxWidth: '120px', // 确保宽度不会超过固定值
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
};



const BasicInfoTab = ({singleBean, json}) => (
    <div>
        <Card>
            <Descriptions title="咖啡豆信息" bordered column={1}>
                <Descriptions.Item label="名称" labelStyle={fixedLabelStyle}>{singleBean.name}</Descriptions.Item>
                <Descriptions.Item label="选定的豆类"
                                   labelStyle={fixedLabelStyle}>{json.beanTypeSelected}</Descriptions.Item>
                <Descriptions.Item label="重量" labelStyle={fixedLabelStyle}>{singleBean.weight}g</Descriptions.Item>
                <Descriptions.Item label="烘焙日期"
                                   labelStyle={fixedLabelStyle}>{singleBean.bakeDate}</Descriptions.Item>
                <Descriptions.Item label="烘焙度"
                                   labelStyle={fixedLabelStyle}>{singleBean.bakeDegree}</Descriptions.Item>
            </Descriptions>
            {/* Add more Descriptions for mixedBean if necessary */}
        </Card>

        <Card>
            <Descriptions title="器具信息" bordered column={1}>
                <Descriptions.Item label="滤杯模型"
                                   labelStyle={fixedLabelStyle}>{json.filterCupModel}</Descriptions.Item>
                {/*<Descriptions.Item label="杯厂" labelStyle={fixedLabelStyle}>{json.cupFactory}</Descriptions.Item>*/}
                <Descriptions.Item label="杯模型" labelStyle={fixedLabelStyle}>{json.cupModel}</Descriptions.Item>
                <Descriptions.Item label="杯类型" labelStyle={fixedLabelStyle}>{json.cupType}</Descriptions.Item>
                <Descriptions.Item label="滤纸" labelStyle={fixedLabelStyle}>{json.filterPaper}</Descriptions.Item>
                {/* More Descriptions.Items */}
            </Descriptions>
        </Card>

        <Card>
            <Descriptions title="研磨信息" bordered column={1}>
                <Descriptions.Item label="磨豆机" labelStyle={fixedLabelStyle}>{json.beanMoDouJi}</Descriptions.Item>
                <Descriptions.Item label="豆粒度" labelStyle={fixedLabelStyle}>{json.beanKeDu}</Descriptions.Item>
                <Descriptions.Item label="豆粗细" labelStyle={fixedLabelStyle}>{json.beanCuXi}</Descriptions.Item>
            </Descriptions>
        </Card>
    </div>
);

// 豆类信息组件
// const BeanInfoTab = ({ singleBean, json }) => (
//
// );

// 冲煮信息组件
const BrewInfoTab = ({json}) => (
    <Card>
        <Descriptions title="冲煮信息" bordered column={1}>
            <Descriptions.Item label="闷蒸时间" labelStyle={fixedLabelStyle}>{json.beanBoilDuration}</Descriptions.Item>
            <Descriptions.Item label="水质" labelStyle={fixedLabelStyle}>{json.waterQuality}</Descriptions.Item>
            <Descriptions.Item label="总重量" labelStyle={fixedLabelStyle}>{json.totalWeight}g</Descriptions.Item>
            <Descriptions.Item label="水粉比" labelStyle={fixedLabelStyle}>{json.waterPowderRatio}</Descriptions.Item>
            <Descriptions.Item label="比例" labelStyle={fixedLabelStyle}>{json.ratio}</Descriptions.Item>
            <Descriptions.Item label="总时间" labelStyle={fixedLabelStyle}>{json.totalDuration}s</Descriptions.Item>
            <Descriptions.Item label="壶温度" labelStyle={fixedLabelStyle}>{json.jugTemperature}</Descriptions.Item>
            <Descriptions.Item label="总注水量"
                               labelStyle={fixedLabelStyle}>{json.totalWaterInjection}ml</Descriptions.Item>
            <Descriptions.Item label="最佳饮用温度"
                               labelStyle={fixedLabelStyle}>{json.bestDrinkTemperature}°C</Descriptions.Item>
        </Descriptions>
        {/* Add more Descriptions for mixedBean if necessary */}
    </Card>
);

// 冲煮记录组件
const BrewLogTab = ({groupOneData, groupTwoData}) => (
    <div style={{padding: '20px'}}>
        <div style={{marginBottom: '2rem'}}>
            <Card>
                <BrewLogChart data={groupOneData} name="Group One Metrics"/>
            </Card>
        </div>
        <div style={{marginBottom: '2rem'}}>
            <Card>
                <BrewLogChart data={groupTwoData} name="Group Two Metrics"/>
            </Card>
        </div>
    </div>
);

// 感官评分组件
const SensoryRatingTab = ({brewId, ratingData, onRatingSubmit}) => (
    <RatingChartAndTable
        key={Date.now()} // 强制重新渲染组件
        brewId={brewId}
        ratingData={ratingData}
        onRatingSubmit={onRatingSubmit}
    />
);

export {BasicInfoTab, BrewInfoTab, BrewLogTab, SensoryRatingTab};
