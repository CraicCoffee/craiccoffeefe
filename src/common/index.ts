import { GetMetric } from '@/pages/metric/utils';

export const getTag = ({ key, value }: any) => `${key}:${value}`;

export const getTagsList = (tags: Record<string, any>[] = []) => tags.map(getTag);

// 前端根据 name 和所有 tags 拼出一个 metrics id
export const getMidFromMetrics = (metric: GetMetric | API.MetricMetadata) => {
  const { name, tags = [] } = metric;
  return [name, ...getTagsList(tags).sort()].join('_');
};

export const flattenTagsRecord = (record: Record<string, string[]> = {}) => {
  const ret: {
    key: string;
    value: string;
  }[] = [];
  Object.keys(record).forEach((key) => {
    ret.push(
      ...record[key].map((value) => ({
        key,
        value,
      })),
    );
  });
  return ret;
};

export const flattenTagsRecordToStrings = (record: Record<string, string[]> = {}) => {
  return flattenTagsRecord(record).map((kv) => `${kv.key}:${kv.value}`);
};

// 正则匹配图表数据的单位
export const getRegularUnit = (unit: string) => {
  return new RegExp(/[\{\}]/g).test(unit) ? '' : unit;
};

export const unitConverter = (unit: string) => {
  const newUnit = getRegularUnit(unit);
  if (!newUnit || newUnit == '1') return '';
  const unitMap: Record<string, string> = {
    d: 'days',
    h: 'hours',
    min: 'minutes',
    s: 'seconds',
    ms: 'milliseconds',
    Milliseconds: 'milliseconds',
    us: 'microseconds',
    ns: 'nanoseconds',
    By: 'bytes',
    KiBy: 'kibibytes',
    MiBy: 'mebibytes',
    GiBy: 'gibibytes',
    TiBy: 'tebibytes',
    KBy: 'kilobytes',
    MBy: 'megabytes',
    GBy: 'gigabytes',
    TBy: 'terabytes',
    m: 'meters',
    V: 'volts',
    A: 'amperes',
    J: 'joules',
    W: 'watts',
    g: 'grams',
    Cel: 'celsius',
    Hz: 'hertz',
    '%': 'percent',
  };
  return unitMap[newUnit] || unit;
};
