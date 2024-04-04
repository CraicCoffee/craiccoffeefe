import { AlarmHistoryAIModal } from '@/pages/alarm/components/alarm-history-ai-modal';
import { alarmMap, obtainAlarmState, pivotAlarmHistory, statusBg } from '@/pages/alarm/utils';
import ColumnChartWidget from '@/pages/metric/components/ColumnChartWidget';
import { Datum } from '@ant-design/charts';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment/moment';
import { FC } from 'react';

type Props = {
  historyDetails: any;
};

interface DataType {
  key: string;
  type: string;
  reason: string;
  timestamp: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '状态变化',
    dataIndex: 'data',
    key: 'data',
    width: 128,
    filters: [
      {
        text: 'ALARM',
        value: 'ALARM',
      },
      {
        text: 'OK',
        value: 'OK',
      },
      {
        text: 'NO DATA',
        value: 'NO DATA',
      },
      {
        text: 'Create',
        value: 'Create',
      },
      {
        text: 'Update',
        value: 'Update',
      },
    ],
    // @ts-expect-error
    onFilter: (value, record) => record?.data?.indexOf(value) === 0,
    render: (data) => (
      <Tag color={statusBg[data]} style={{ marginLeft: 16 }}>
        {data}
      </Tag>
    ),
  },
  {
    title: '描述',
    dataIndex: 'summary',
    key: 'summary',
    width: 600,
  },
  {
    title: '时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
    render: (text) => <>{moment(text).format('YYYY-MM-DD HH:mm')}</>,
  },
  {
    title: 'AI分析',
    dataIndex: 'detail',
    key: 'detail',
    render: (detail) => <AlarmHistoryAIModal history={detail}></AlarmHistoryAIModal>,
  },
];

export const AlarmHistory: FC<Props> = (props) => {
  const historyData = props.historyDetails
    ? props.historyDetails.map((h) => ({
        ...h,
        detail: h.data,
        data: obtainAlarmState(h.data),
      }))
    : [];

  console.log(historyData);

  /* 左下柱状图聚合数据，由于数据量小，最多不超过35行，3列数据，可在前端实时聚合*/
  const historyDataStatistic = pivotAlarmHistory(historyData);

  /* 倒序排序数组，便于从最近日期开始遍历。由于最多不超过7个，前端做实时聚合远比后端聚合+网络来回快*/
  const alarmHistoryDataStatistic = historyDataStatistic.filter((item) => item.type == 'ALARM');
  alarmHistoryDataStatistic.sort((a, b) => new Date(b.date) - new Date(a.date));

  /* 日环比判断和计算 */
  const dayDifferentRation =
    alarmHistoryDataStatistic[0] && alarmHistoryDataStatistic[1]
      ? (alarmHistoryDataStatistic[0].count - alarmHistoryDataStatistic[1].count) /
        alarmHistoryDataStatistic[1].count
      : 0;

  /* 周环比判断和计算 */
  const weekDifferentRation =
    alarmHistoryDataStatistic[0] && alarmHistoryDataStatistic[6]
      ? (alarmHistoryDataStatistic[0].count - alarmHistoryDataStatistic[6].count) /
        alarmHistoryDataStatistic[6].count
      : 0;

  /* TODO: ColumnChartWidget component 底层有业务耦合代码，重构后再对这里config做减法*/
  const historyDataStatisticConfig = {
    isGroup: true,
    xField: 'date',
    yField: 'count',
    seriesField: 'type',
    height: 220,
    legend: {
      position: 'left',
    },
    colorField: 'type', // 部分图表使用 seriesField
    color: ({ type }) => {
      if (type === 'OK') {
        return '#41c464';
      }
      if (type === 'ALARM') {
        return '#eb364b';
      }
      if (type === 'NO DATA') {
        return '#828ba4';
      }
      return '#828ba4';
    },
    tooltip: {
      fields: ['type', 'count'],
      formatter: (datum: Datum) => {
        return { name: datum.type, value: datum.count };
      },
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
  };

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={24}>
          <Card>
            <h4>告警记录</h4>
            <Table
              columns={columns}
              dataSource={historyData}
              scroll={{ x: 'calc(700px + 50%)', y: 250 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={16}>
          <Card>
            <h4>历史统计分析</h4>
            <ColumnChartWidget
              dataSource={historyDataStatistic}
              customConfig={historyDataStatisticConfig}
            />
          </Card>
        </Col>
        <Col className="gutter-row" span={8}>
          <Card style={{ marginBottom: 23 }}>
            <h4>告警日环比</h4>
            <Statistic
              title={dayDifferentRation > 0 ? '上升' : '下降'}
              value={dayDifferentRation * 100}
              precision={2}
              valueStyle={dayDifferentRation > 0 ? { color: '#cf1322' } : { color: '#3f8600' }}
              prefix={dayDifferentRation > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
          <Card>
            <h4>告警周环比</h4>
            <Statistic
              title={weekDifferentRation > 0 ? '上升' : '下降'}
              value={weekDifferentRation * 100}
              precision={2}
              valueStyle={weekDifferentRation > 0 ? { color: '#cf1322' } : { color: '#3f8600' }}
              prefix={weekDifferentRation > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};
