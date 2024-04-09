import { getMetricsFirstPage } from '@/pages/metric/service';
import { getMetricExpression } from '@/services/craicCoffee/metricController';
import { openAIService } from '@/services/open-ai.service';
import { Alert } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { comparatorValue } from '../utils';

type Props = {
  alarmDetail: any;
};

export const AlarmAITip: FC<Props> = (props) => {
  const { alarmDetail } = props;
  const result = useAsyncMemo(
    async () => {
      console.log(alarmDetail);
      const startTime = dayjs(alarmDetail.updatedTimestamp).subtract(7, 'minute').toISOString();
      const endTime = dayjs(alarmDetail.updatedTimestamp).toISOString();
      let metricsResponse = {} as any;
      let metricName = '';

      if (alarmDetail.type === 'NORMAL') {
        metricsResponse = await getMetricsFirstPage({
          metrics: [alarmDetail.metric],
          statistic: 'Average',
          period: alarmDetail?.period || 60,
          startTime,
          endTime,
        });
        metricName = alarmDetail.metric.name;
      } else if (alarmDetail.type === 'EXPRESSION') {
        metricsResponse = await getMetricExpression({
          startTime,
          endTime,
          metricQueries: [...alarmDetail.metricQueries],
        });
        metricName = alarmDetail.metricQueries[0].aggregatedExpression.metricName;
      }

      if (!metricsResponse.success || !metricsResponse.data) {
        return '分析失败，请稍后再试';
      }
      const points = metricsResponse.data.metrics?.[0].dataPoints;
      if (!points) {
        return '分析失败';
      }
      const input =
        `有一份关于 “${metricName}” 的监控数据，它在 ${
          alarmDetail.updatedTimestamp
        } 出现告警，告警预设的条件是 ${comparatorValue[alarmDetail.comparator]} ${
          alarmDetail.threshold
        }，告警理由为“${alarmDetail.reason}”。
        以下是每个时间点下对应的监控原始记录的值：\n` +
        points.map((x) => `${x.timestamp} -> ${x.value}`).join('\n') +
        '\n' +
        '请对异常进行简单的分析，并且给出一些后续系统排查的建议或是可能的应对措施。';
      try {
        const result = JSON.parse(await openAIService.callOpenAI(input)) as {
          id: string;
          object: string;
          created: number;
          model: string;
          usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
          choices: [
            {
              message: {
                role: 'assistant';
                content: string;
              };
              finish_reason: string;
              index: number;
            },
          ];
        };
        return result.choices[0].message.content;
      } catch (e) {
        console.error(e);
        return '分析失败，请稍后再试';
      }
    },
    [],
    '',
  );

  return (
    <Alert
      type="info"
      message={result || '分析中……'}
      style={{ marginBottom: 16, whiteSpace: 'pre-wrap' }}
    />
  );
};
