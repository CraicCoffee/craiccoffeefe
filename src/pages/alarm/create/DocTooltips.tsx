import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

const title = {
  evaluationPeriods:
    '评估期是指在触发警报之前，连续检查指标的次数。例如，如果评估期设置为 3，那么在触发警报之前，指标需要连续三次满足警报条件。',
  dataPointsToAlarm:
    '此参数确定了在评估周期内，有多少数据点需要满足警报条件才会触发警报。假设评估期为 3，触发告警数据点为 2，那么在一个评估周期内，只要有两个数据点满足警报条件，就会触发警报。触发告警数据点的值不能大于评估期',
  period:
    '指标数据的精度，以秒为单位。例如，如果设置精度为 5 分钟，那么 InsightMon 会在 5 分钟的时间范围内收集指标数据，并根据统计方法计算这段时间内的平均值、最大值等统计信息。',
};

export const DocTooltips: React.FC<any> = ({ label }) => {
  return (
    <Tooltip title={title[label]}>
      <QuestionCircleOutlined style={{ marginLeft: 5 }} />{' '}
    </Tooltip>
  );
};
