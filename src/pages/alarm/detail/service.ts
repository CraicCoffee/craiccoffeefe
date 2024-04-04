// @ts-ignore
/* eslint-disable */
import { comparatorValue } from '@/pages/alarm/utils';
import { getMetricsFirstPage } from '@/pages/metric/service';
import { getMetricExpression } from '@/services/insightMon/metricController';
import { openAIService } from '@/services/open-ai.service';
import dayjs from 'dayjs';

export async function alarmAnalysis(alarmDetail: any) {
  console.log('alarmDetail: ', alarmDetail);
  // const startTime = dayjs(alarmDetail.updatedTimestamp).subtract(7, 'minute').toISOString();
  // const endTime = dayjs(alarmDetail.updatedTimestamp).toISOString();
  // let metricsResponse = {} as any;
  let metricName = '';
  let input = '';
  const copyAlarmDetail = { ...alarmDetail };
  copyAlarmDetail.history = [];
  const alarmDetailJson = JSON.stringify(copyAlarmDetail);

  if (alarmDetail.type === 'NORMAL') {
    metricName = alarmDetail.metricName;
  } else if (alarmDetail.type === 'EXPRESSION') {
    metricName = alarmDetail.description;
  } else if (alarmDetail.type === 'COMPOSITE') {
    metricName = alarmDetail.description;
  }
  const anomalyInfo = {
    status: alarmDetail.status,
    reason: alarmDetail.reason,
    updatedTimestamp: alarmDetail.updatedTimestamp,
  };
  input =
    `以下是关于“${metricName}”的基础信息：\n` +
    ` ${alarmDetailJson} \n` +
    `这个告警是针对指标进行监控的，它最新的监控数据记录如下：\n` +
    `${anomalyInfo}` +
    `请你作为经验丰富的云计算运维专家，结合你过往在行业中的经验以及合理的数据。比如过低的阈值判断为人为设置的失误等。对上述告警进行尽可能详细的分析后分点回答，首先对这个告警当前的状态进行简要总结，然后请判断这个告警当前是否发生异常，
    如果状态为"ALARM"或"INSUFFICIENT_DATA"即代表发生了异常，则需详细描述发生异常的具体情况，并结合相关指标的标签信息尽可能分析并总结异常发生的根本原因，
    以及给出一些后续系统排查的建议或是可行的应对措施。如果没有发生异常，则只需详细描述没有发生异常告警的原因，
    并给出一些当未来触发异常告警时可以进行的排查建议和应对措施。\n`;

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
    return { success: true, content: result.choices[0].message.content };
  } catch (e) {
    console.error(e);
    return { success: false, content: '分析失败，请稍后再试' };
  }
}

export async function alarmHistoryAnalysis(historyDetail: any) {
  console.log('AI', historyDetail);
  const alarmDetailJson = JSON.stringify(historyDetail);

  const input =
    `以下是关于该指标的历史告警信息：\n` +
    ` ${alarmDetailJson} \n` +
    `信息主要描述的是告警状态的变化以及对应触发状态机改变的指标：\n` +
    `请你作为经验丰富的云计算运维专家，结合你过往在行业中的经验以及合理的数据。比如过低的阈值判断为人为设置的失误等。对上述历史告警信息，进行尽可能详细的分析后分点回答，首先对这个告警当前的状态及其状态的变化进行简要总结，然后请判断这个告警当前是否发生异常，
    如果状态为"ALARM"或"INSUFFICIENT_DATA"即代表发生了异常，则需详细描述发生异常的具体情况，并结合相关指标的标签信息尽可能分析并总结异常发生的根本原因。
    如果没有发生异常，则只需详细描述没有发生异常告警的原因。\n`;
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
    console.log(result);

    return { success: true, content: result.choices[0].message.content };
  } catch (e) {
    console.error(e);
    return { success: false, content: '分析失败，请稍后再试' };
  }
}
