import { PERIOD_TABLE } from '@/constants';
import { history } from '@umijs/max';
import moment from 'moment/moment';

export const comparatorOptions = [
  {
    label: '大于',
    value: 'GreaterThanThreshold',
  },
  {
    label: '大于等于',
    value: 'GreaterThanOrEqualToThreshold',
  },
  {
    label: '小于',
    value: 'LessThanThreshold',
  },
  {
    label: '小于等于',
    value: 'LessThanOrEqualToThreshold',
  },
  // {
  //   label: '小于下限或大于上限阈值',
  //   value: 'LessThanLowerOrGreaterThanUpperThreshold',
  // },
  // {
  //   label: '小于下限阈值',
  //   value: 'LessThanLowerThreshold',
  // },
  // {
  //   label: '最大ThanUpperThreshold',
  //   value: 'GreaterThanUpperThreshold',
  // },
];
export const comparatorValue: Record<string, string> = {
  GreaterThanThreshold: '大于',
  GreaterThanOrEqualToThreshold: '大于等于',
  LessThanThreshold: '小于',
  LessThanOrEqualToThreshold: '小于等于',
  // 'LessThanLowerOrGreaterThanUpperThreshold': '小于下限或大于上限阈值',
  // 'LessThanLowerThreshold': '小于下限阈值',
  // 'GreaterThanUpperThreshold': '最大ThanUpperThreshold',
};

const getRegionFilterEnd = (comparator: string, threshold: string | number) => {
  const obj = {
    GreaterThanThreshold: 'max',
    GreaterThanOrEqualToThreshold: 'max',
    equal: threshold,
    LessThanOrEqualToThreshold: 'min',
    LessThanThreshold: 'min',
  };

  return obj[comparator] || threshold;
};

const getEValuationRange = (evaluationRange: string | number, data: any) => {
  const res = moment(data?.timestamp).subtract(evaluationRange, 'minutes').format('MM-DD HH:mm:ss');
  return res;
};

// 告警阈值在图表上的颜色变化
export const getAnnotations = (
  comparator: string,
  threshold: string | number,
  evaluationRange: string | number,
  data: any,
) => [
  {
    type: 'regionFilter',
    start: ['min', threshold],
    end: ['max', getRegionFilterEnd(comparator, threshold)],
    color: '#F4664A',
  },
  {
    type: 'text',
    position: ['min', threshold],
    content: '告警阈值',
    offsetY: 4,
    style: {
      textBaseline: 'top',
    },
  },
  {
    type: 'line',
    start: ['min', threshold],
    end: ['max', threshold],
    style: {
      stroke: '#F4664A',
      lineDash: [2, 2],
    },
  },
  {
    type: 'region',
    start: [getEValuationRange(evaluationRange, data), 'min'],
    end: ['max', 'max'],
  },
];

export const statusBg: Record<string, string> = {
  OK: 'rgba(38,213,107,0.92)',
  ALARM: '#f15446',
  INSUFFICIENT_DATA: '#828ba4',
  'NO DATA': '#828ba4',
  B: '#5B8FF9',
  Alarm: '#F46649',
  Warm: '#EEBC20',
  'No Data': '#828ba4',
  INITIAL: '#828ba4',
  NO_DATA: '#828ba4',
  SUCCESS: 'rgba(38,213,107,0.92)',
  ERROR: '#f15446',
};

export const alarmMap = {
  ALARM: 'ALARM',
  INSUFFICIENT_DATA: 'NO DATA',
  OK: 'OK',
} as Record<string, string>;

export const oldStateToNewState = (data) => {
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (error) {}

  if (obj?.type === 'Create') {
    return 'Create';
  } else if (obj?.newState && obj?.oldState) {
    const prev = alarmMap[obj?.oldState?.stateValue];
    const curr = alarmMap[obj?.newState?.stateValue];
    return `${prev} -> ${curr}`;
  } else if (obj?.type === 'Update') {
    return 'Update';
  }
};

export const obtainAlarmState = (data) => {
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (error) {}

  if (obj?.type === 'Create') {
    return 'Create';
  } else if (obj?.newState && obj?.oldState) {
    const curr = alarmMap[obj?.newState?.stateValue];
    return `${curr}`;
  } else if (obj?.type === 'Update') {
    return 'Update';
  }
};

/**
 * 后端获取alarm history现只能全量获取，先通过全量数据filter过去7天数据，限定data points的数量
 */
export const pivotAlarmHistory = (data) => {
  // 获取过去一周内的日期
  const currentDate = new Date();
  const pastWeekDates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);
    pastWeekDates.push(date.toISOString().slice(0, 10));
  }

  // 构建初始结果对象
  const initialResult = pastWeekDates.reduce((acc, date) => {
    acc[date] = {};
    return acc;
  }, {});

  // 统计每天每个type出现的次数
  const finalResult = data.reduce((acc, item) => {
    const itemDate = moment(item.timestamp).format('YYYY-MM-DD');
    if (pastWeekDates.includes(itemDate)) {
      if (!acc[itemDate][item.data]) {
        acc[itemDate][item.data] = 1;
      } else {
        acc[itemDate][item.data]++;
      }
    }
    return acc;
  }, initialResult);

  // 补全count为0的${date}-${type}
  pastWeekDates.forEach((date) => {
    ['OK', 'ALARM', 'NO DATA'].forEach((type) => {
      if (!finalResult[date][type]) {
        finalResult[date][type] = 0;
      }
    });
  });

  // 格式化结果为{date: Date, type: String, count: Int}的字典
  const formattedResult = Object.entries(finalResult).reduce((acc, [date, types]) => {
    Object.entries(types).forEach(([type, count]) => {
      acc.push({ date, type, count });
    });
    return acc;
  }, []);

  // 根据日期进行降序排序
  formattedResult.sort((a, b) => new Date(a.date) - new Date(b.date));
  return formattedResult;
};

export const getReason = (data) => {
  let obj;
  try {
    obj = JSON.parse(data);
  } catch (error) {}

  return obj?.newState?.stateReason || 'Created';
};

export const editReceiversData = (receivers: any, type: string) => {
  return receivers.filter((item: any) => item.type === type).map((i: any) => i.receiver);
};

export const getPeriodLabelByValue = (value: number) => {
  const entry = Object.entries(PERIOD_TABLE).find(([key, val]) => val === value);

  return entry ? entry[0] : null;
};

export const openDetail = (
  uuid: string = '',
  type: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE' = 'NORMAL',
) => {
  switch (type) {
    case 'EXPRESSION':
      history.push(`/alarm/detail/${uuid}?type=expression`);
      break;
    case 'COMPOSITE':
      history.push(`/alarm/detail/${uuid}?type=composite`);
      break;
    default:
      history.push(`/alarm/detail/${uuid}`);
      break;
  }
};
