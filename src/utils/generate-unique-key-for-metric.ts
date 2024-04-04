import { MetricDataType } from '@/pages/metric/data';

export function generateUniqueKeyForMetric(metric: MetricDataType) {
  return metric.name + ',' + metric.tags.map((tag) => tag.key + ':' + tag.value).join(',');
}
