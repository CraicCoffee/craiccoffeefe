import type { Request, Response } from 'express';
import mockjs from 'mockjs';

const getFakeChartData = () =>
  mockjs.mock({
    'chartData|10': [
      {
        'fromNowOn|+1': 1,
        'now|+1': '@now("yyyy-MM-dd")',
        'timestamp|+1': function () {
          let now = new Date(this['now']);
          now.setTime(now.getTime() - this['fromNowOn'] * 24 * 60 * 60 * 1000);
          let sub = now;
          var year = sub.getFullYear() < 10 ? '0' + sub.getFullYear() : sub.getFullYear();
          var month = sub.getMonth() + 1 < 10 ? '0' + sub.getMonth() : sub.getMonth();
          var day = sub.getDate() < 10 ? '0' + sub.getDate() : sub.getDate();
          return year + '-' + month + '-' + day;
        },
        'value|1-100': 1,
      },
    ],
  });

const getFakeDataSource = () =>
  mockjs.mock({
    'dataSource|10': [{ timestamp: '@datetime', 'key|+1': 1, 'value|1-100': 1 }],
  });

function getFakeAlarm(req: Request, res: Response) {
  return res.json({
    data: {
      comparator: 'lessthan',
      threshold: 11,
      evaluationPeriods: 5,
      ...getFakeChartData(),
      ...getFakeDataSource(),
    },
  });
}

export default {
  'POST  /api/stepForm': (_: Request, res: Response) => {
    res.send({ data: { message: 'Ok' } });
  },
  'GET  /api/v0/alarms/1': getFakeAlarm,
  'GET  /api/v0/alarms/2': getFakeAlarm,
  'GET  /api/v0/alarms/3': getFakeAlarm,
};
