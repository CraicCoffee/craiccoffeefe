import LineChartWidget from '@/components/metric/LineChartWidget';
import Flex from '@/components/shared-components/Flex';
import { TIME } from '@/constants';
import { getMetricDataRequest } from '@/pages/overview/components/TrafficStatistic/controller';
import { useUserStore } from '@/stores/user.store';
import { useIntl } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Card, Col, Row, Select, Tag } from 'antd';
import moment from 'moment';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

const { Option } = Select;

const TrafficStatistic: FC = () => {
  const [chartData, setChartData] = useState<any>([]);
  const [selectTime, setSelectTime] = useState('1w');
  const [averageUsage, setAverageUsage] = useState('0');

  const intl = useIntl();

  const { user } = useUserStore();

  // const { run } = useRequest(getMetricsFirstPage, {
  //   manual: true,
  //   onSuccess: (result, req) => {
  //     const { period, startTime, endTime } = getParamasFromReq(req);
  //     setChartData(
  //       convertMetricsDataToChartData(result?.data?.metrics, period, startTime, endTime),
  //     );
  //   },
  // });
  //
  // const { run: getAverageUsage } = useRequest(getMetricsFirstPage, {
  //   manual: true,
  //   onSuccess: (result: any) => {
  //     const dataPoints = result.data.metrics[0].dataPoints as any[];
  //     const sum = dataPoints.reduce((cur, next) => cur + next.value, 0);
  //     if (dataPoints.length === 0) {
  //       setAverageUsage('0');
  //     } else {
  //       setAverageUsage((sum / dataPoints.length).toFixed(2));
  //     }
  //   },
  // });
  //
  // // 指标参数变化时调用 getMetrics api
  // useEffect(() => {
  //   run(getMetricDataRequest(selectTime, 'Sum'), {});
  //   getAverageUsage(getMetricDataRequest(selectTime, 'Average'), {});
  // }, [selectTime, run, getAverageUsage]);

  const chartCustomConfig = {
    height: 265,
  };

  function handleChange(value: string) {
    setSelectTime(value);
  }

  // @ts-ignore
  return (
    <>
      <Card>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Flex className="h-100" flexDirection="column" justifyContent="between">
              <div>
                <h3 className="mb-0">用量统计</h3>
                <h1 className="font-weight-bold" style={{ marginTop: 15 }}>
                  {averageUsage}/天
                </h1>
              </div>
              <div className="mb-4">
                <p>通过指标统计用量，衡量服务写入的吞吐量</p>
                {user && (
                  <p>
                    {user.alreadyExpired ? (
                      <Tag color="#f02727">账户已过期</Tag>
                    ) : (
                      <>账户有效期至 {moment(user.expiresAt).format('YYYY-MM-DD HH:mm')}</>
                    )}
                  </p>
                )}
              </div>
            </Flex>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16}>
            <Row className="mb-3 text-left" justify="end">
              <Select defaultValue={selectTime} style={{ width: 220 }} onChange={handleChange}>
                {TIME.map((item) => (
                  <Option value={item.value} key={item.label}>
                    <Tag color="#ffa940">{item.value}</Tag>
                    {intl.formatMessage({
                      id: item.label,
                      defaultMessage: item.label,
                    })}
                  </Option>
                ))}
              </Select>
            </Row>
            <LineChartWidget dataSource={chartData} customConfig={chartCustomConfig} />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TrafficStatistic;
