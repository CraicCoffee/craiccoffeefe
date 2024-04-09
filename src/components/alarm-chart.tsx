import TimeSelect from '@/components/TimeSelect';
import { getAnnotations } from '@/pages/alarm/utils';
import LineChartWidget from '@/pages/metric/components/LineChartWidget';
import { getMetricsFirstPage } from '@/pages/metric/service';
import { convertMetricsDataToChartData, getParamasFromReq } from '@/pages/metric/utils';
import { getMetricExpression } from '@/services/craicCoffee/metricController';
import { useRequest } from 'ahooks';
import { useEffect, useState, type FC } from 'react';
import styled from 'styled-components';

type Props = {
  alarmDetail: any;
};

const TimeSelectWrapper = styled.div`
  margin: 10px;
`;

export const AlarmChart: FC<Props> = (props) => {
  const { alarmDetail } = props;
  const alarmPeriod = alarmDetail?.period || 60;
  const initSelectTime = alarmDetail?.period > 3600 ? '1d' : '3h';

  const [chartData, setChartData] = useState<any[]>([]);
  const [lastDataPoint, setLastDataPoint] = useState([]);
  const [timeObj, setTimeObj] = useState({ startTime: '', endTime: '', selectTime: '3h' });

  const { run } = useRequest(getMetricsFirstPage, {
    manual: true,
    onSuccess: (result: any, req) => {
      const rawData = result?.data?.metrics || ([] as API.GetMetricResponse[]);
      const dataPoints = rawData[0]?.dataPoints;
      const lastDP = dataPoints[dataPoints?.length - 1];
      const { startTime, endTime, period } = getParamasFromReq(req);
      const data = convertMetricsDataToChartData(rawData, period, startTime, endTime);
      setChartData(data);
      setLastDataPoint(lastDP);
    },
  });

  const { run: runExpression } = useRequest(getMetricExpression, {
    manual: true,
    onSuccess: (result: any, req) => {
      const rawData = result?.data || ([] as API.GetMetricResponse[]);
      console.log('rawData', rawData);
      const dataPoints = rawData[0]?.dataPoints;
      const lastDP = dataPoints[dataPoints?.length - 1];
      const { startTime, endTime } = getParamasFromReq(req);

      const data = convertMetricsDataToChartData(rawData, alarmPeriod, startTime, endTime);
      setChartData(data);
      setLastDataPoint(lastDP);
    },
  });

  useEffect(() => {
    const { startTime, endTime } = timeObj;
    if (!startTime || !endTime) return;
    if (alarmDetail.metricQueries) {
      runExpression({
        startTime,
        endTime,
        metricQueries: alarmDetail.metricQueries,
      });
    } else {
      run({
        metrics: [alarmDetail.metric],
        statistic: alarmDetail.statistic,
        period: alarmPeriod,
        startTime,
        endTime,
      });
    }
  }, [
    alarmDetail.metric,
    alarmDetail.metricQueries,
    alarmDetail.type,
    alarmPeriod,
    run,
    runExpression,
    timeObj,
  ]);

  return (
    <>
      <TimeSelectWrapper>
        <TimeSelect onChange={setTimeObj} initSelectTime={initSelectTime} />
      </TimeSelectWrapper>
      <LineChartWidget
        dataSource={chartData}
        threshold={alarmDetail?.threshold}
        customConfig={{
          annotations: getAnnotations(
            alarmDetail?.comparator,
            alarmDetail?.threshold,
            alarmDetail?.evaluationPeriods,
            lastDataPoint,
          ),
          height: 250,
        }}
      />
    </>
  );
};
