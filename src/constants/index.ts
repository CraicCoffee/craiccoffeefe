/**
 * <interval, time in mileseconds>
 */
export const INTERVAL_HASH_TABLE = {
  turn_off: 0,
  ten_second: 10000,
  one_minute: 60000,
  two_minute: 120000,
  five_minute: 300000,
  ten_minute: 600000,
};

export const METRIC_DATA_QUERY_STATISTIC = [
  'SampleCount',
  'Sum',
  'Average',
  'Minimum',
  'Maximum',
  'p99',
  'p95',
  'p90',
];
export const ALARM_ADDALARM_STATISTIC = ['SampleCount', 'Average', 'Sum', 'Minimum', 'Maximum'];
export const TIME = [
  { label: '过去5分钟', value: '5m' },
  { label: '过去15分钟', value: '15m' },
  { label: '过去30分钟', value: '30m' },
  { label: '过去1小时', value: '1h' },
  { label: '过去3小时', value: '3h' },
  { label: '过去1天', value: '1d' },
  { label: '过去2天', value: '2d' },
  { label: '过去1周', value: '1w' },
  { label: '过去15天', value: '15d' },
  { label: '过去1个月', value: '1mo' },
  { label: '过去2个月', value: '2mo' },
  { label: '过去6个月', value: '6mo' },
  { label: '过去1年', value: '1y' },
  { label: '过去2年', value: '2y' },
];

// 聚合指标和数学运算只支持最多三个小时
export const TIME_MAX_3H = [
  { label: '过去5分钟', value: '5m' },
  { label: '过去15分钟', value: '15m' },
  { label: '过去30分钟', value: '30m' },
  { label: '过去1小时', value: '1h' },
  { label: '过去3小时', value: '3h' },
];

export const CAPACITY_TIME = [
  { label: '过去2天', value: '2d' },
  { label: '过去1周', value: '1w' },
  { label: '过去1个月', value: '1mo' },
];

// 时间段换算成秒数
export const TIME_TO_SECONDS: Record<string, number> = {
  '5m': 5 * 60,
  '15m': 15 * 60,
  '30m': 30 * 60,
  '1h': 60 * 60,
  '3h': 3 * 60 * 60,
  '1d': 24 * 60 * 60,
  '2d': 48 * 60 * 60,
  '1w': 7 * 24 * 60 * 60,
  '15d': 15 * 24 * 60 * 60,
  '1mo': 30 * 24 * 60 * 60,
  '2mo': 2 * 30 * 24 * 60 * 60,
  '6mo': 6 * 30 * 24 * 60 * 60,
  '1y': 12 * 30 * 24 * 60 * 60,
  '2y': 2 * 12 * 30 * 24 * 60 * 60,
};

// 时间段换算成毫秒
export const timeToMilliseconds = (time: string) => {
  const period = TIME_TO_SECONDS[time] || TIME_TO_SECONDS['1h'];
  return period * 1000;
};

// 固定检索精度：selectTime对应的PERIOD，用来保证请求的数据量不会太大
export const SELECTTIME_TO_PERIOD: Record<string, number> = {
  '5m': 30,
  '15m': 30,
  '30m': 30,
  '1h': 30,
  '3h': 30,
  '1d': 5 * 60,
  '2d': 5 * 60,
  '1w': 60 * 60,
  '15d': 60 * 60,
  '1mo': 60 * 60,
  '2mo': 6 * 60 * 60,
  '6mo': 6 * 60 * 60,
  '1y': 24 * 60 * 60,
  '2y': 24 * 60 * 60,
};

// 中文时间和数字时间的映射
const CHINESE_TO_TIME: Record<string, number> = {
  '30秒': 30,
  '1分钟': 60,
  '5分钟': 300,
  '15分钟': 900,
  '30分钟': 1800,
  '1小时': 3600,
  '3小时': 3600 * 3,
  '6小时': 3600 * 6,
  '12小时': 3600 * 12,
  '1天': 3600 * 24,
  '2天': 3600 * 24 * 2,
  '1周': 3600 * 24 * 7,
  '2周': 3600 * 24 * 14,
  '1个月': 3600 * 24 * 30,
  '2个月': 3600 * 24 * 60,
  '6个月': 3600 * 24 * 180,
  '1年': 3600 * 24 * 365,
  '2年': 3600 * 24 * 365 * 2,
};

// 根据 CHINESE_TO_TIME 自动生成的反向映射
export const TIME_TO_CHINESE: Record<string, string> = {
  '30': '30秒',
  '60': '1分钟',
  '300': '5分钟',
  '900': '15分钟',
  '1800': '30分钟',
  '3600': '1小时',
  '10800': '3小时',
  '21600': '6小时',
  '43200': '12小时',
  '86400': '1天',
  '172800': '2天',
  '604800': '1周',
  '1209600': '2周',
  '2592000': '1个月',
  '5184000': '2个月',
  '15552000': '6个月',
  '31536000': '1年',
  '63072000': '2年',
};

// 可设置的检索精度: 用于精度选择器的 antd Select 组件的 options
export const selectTimeToPeriodOptions = (selectTime = '3h') => {
  // 选择的时间段对应的可选精度
  const optionsMap: Record<string, string[]> = {
    '5m': ['30秒', '1分钟'],
    '15m': ['30秒', '1分钟'],
    '30m': ['30秒', '1分钟'],
    '1h': ['30秒', '1分钟'],
    '3h': ['30秒', '1分钟'],
    '1d': ['1分钟', '5分钟', '1小时', '6小时'],
    '2d': ['1分钟', '5分钟', '1小时', '6小时'],
    '1w': ['5分钟', '1小时', '6小时'],
    '15d': ['5分钟', '1小时', '6小时'],
    '1mo': ['1小时', '6小时', '1天'],
    '2mo': ['1小时', '6小时', '1天'],
    '6mo': ['1小时', '6小时', '1天'],
    '1y': ['6小时', '1天', '1周'],
    '2y': ['6小时', '1天', '1周'],
  };
  if (optionsMap[selectTime]) {
    return optionsMap[selectTime].map((option) => ({
      label: option,
      value: CHINESE_TO_TIME[option],
    }));
  } else {
    return optionsMap['1h'].map((option) => ({
      label: option,
      value: CHINESE_TO_TIME[option],
    }));
  }
};

export const PERIOD_TABLE = {
  '1分钟': 60,
  '5分钟': 300,
  '30分钟': 1800,
  '1小时': 3600,
  '6小时': 3600 * 6,
  '12小时': 3600 * 12,
};
