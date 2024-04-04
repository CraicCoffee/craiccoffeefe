import { SELECTTIME_TO_PERIOD } from '@/constants';
import { alarmsListDetail, listAlarms } from '@/pages/alarm/service';
import { getTimeRange } from '@/pages/metric/utils';

// TODO: getMetricDataRequest() & getQueryCountRequest() needs to be refactored later.
export function getMetricDataRequest(selectTime, statistic) {
  const { startTime, endTime } = getTimeRange(selectTime);
  const period = SELECTTIME_TO_PERIOD[selectTime];
  const metrics = [
    {
      name: 'MetricDataCount',
      metadata: [],
      tags: [
        {
          key: 'API',
          value: 'PutMetrics',
        },
      ],
    },
  ];

  const params = { metrics, startTime, endTime, statistic, period } as API.MetricGetRequest;
  return params;
}

export function getQueryCountRequest(selectTime, statistic) {
  const { startTime, endTime } = getTimeRange(selectTime);
  const period = SELECTTIME_TO_PERIOD[selectTime];

  const metrics = [
    {
      name: 'QueryCount',
      metadata: [],
      tags: [
        {
          key: 'API',
          value: 'PutMetrics',
        },
      ],
    },
  ];

  const params = { metrics, startTime, endTime, statistic, period } as API.MetricGetRequest;
  return params;
}

export function alarmCoverage() {
  const coverageMetrics = new Set<String>();
  listAlarms({ currentPage: 1, size: 10 })
    .then((alarms) => {
      alarms?.data?.data?.forEach((v) => {
        alarmsListDetail(v.uuid).then((detail) => {
          coverageMetrics.add(detail.data.metric.name);
        });
      });
    })
    .catch((error) => {
      // emit log later
      console.log(error);
    });
  coverageMetrics.add('dummy');
  return coverageMetrics;
}
