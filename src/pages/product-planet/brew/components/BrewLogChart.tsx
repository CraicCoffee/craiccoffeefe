import {Line} from "@ant-design/charts";
import React, {useState} from "react";

const BrewLogChart = ({data, name}) => {
    const [filteredData, setFilteredData] = useState(data);

    const config = {
        data: filteredData,
        xField: 'second',
        yField: 'value',
        seriesField: 'type', // 使用seriesField来区分数据系列
        // interactions: [
        //     {
        //         type: 'brush-x',
        //         cfg: {
        //             showEnable: [
        //                 {trigger: 'plot:mouseenter', action: 'cursor:crosshair'},
        //                 {trigger: 'plot:mouseleave', action: 'cursor:default'},
        //                 {trigger: 'reset-button:mouseenter', action: 'cursor:pointer'},
        //                 {trigger: 'reset-button:mouseleave', action: 'cursor:crosshair'},
        //             ],
        //             start: [
        //                 {
        //                     trigger: 'plot:mousedown',
        //                     action: ['brush-x:start', 'x-rect-mask:start', 'x-rect-mask:show'],
        //                 },
        //             ],
        //             processing: [
        //                 {
        //                     trigger: 'plot:mousemove',
        //                     action: ['x-rect-mask:resize'],
        //                 },
        //             ],
        //             end: [
        //                 {
        //                     trigger: 'plot:mouseup',
        //                     action: [
        //                         'brush-x:filter',
        //                         'brush-x:end',
        //                         'x-rect-mask:end',
        //                         'x-rect-mask:hide',
        //                         'reset-button:show',
        //                     ],
        //                 },
        //             ],
        //             rollback: [
        //                 {
        //                     trigger: 'reset-button:click',
        //                     action: ['brush-x:reset', 'reset-button:hide', 'cursor:crosshair'],
        //                 },
        //             ],
        //         },
        //     },
        // ],
        // events: {
        //     onBrushEnd: (e) => {
        //         // 获取框选范围
        //         const { xField } = config;
        //         const start = e.range[0];
        //         const end = e.range[1];
        //
        //         // 过滤数据
        //         const newFilteredData = data.filter((item) => {
        //             const value = item[xField];
        //             return value >= start && value <= end;
        //         });
        //
        //         // 设置新的过滤后的数据
        //         setFilteredData(newFilteredData);
        //     },
        // },
        appendPadding: 10,
        autoFit: false,
        smooth: false,
        title: {
            visible: true,
            text: name,
        },
        legend: {position: 'top-left'}, // 自定义图例位置
        // 其他配置...
    };

    return <Line {...config} />;
};

export default BrewLogChart;
