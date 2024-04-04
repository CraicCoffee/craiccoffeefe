import Tags from '@/components/Tags';
import { comparatorValue, getPeriodLabelByValue } from '@/pages/alarm/utils';
import type { GetAlarmDetail } from '@/types/alarm';
import { useIntl } from '@umijs/max';
import { List, Typography } from 'antd';
import moment from 'moment';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const { Text } = Typography;

type Props = {
  alarmDetail: GetAlarmDetail;
};

const TextStrong = styled(Text)`
  word-break: keep-all;
  text-align: left;
`;

const InfoList = styled(List).attrs({
  split: false,
})`
  .ant-list-item {
    padding: 8px 0 !important;
  }

  margin-bottom: 8px;
`;

const FlexText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0;
`;

type KeyValue = {
  key: string;
  value: string;
};

export const AlarmBaseInfo: FC<Props> = (props) => {
  const { alarmDetail } = props;
  const [statistic, setStatistic] = useState<string>('');
  const [metricNames, setMetricNames] = useState<string[]>([]);
  const [metricTagMap, setMetricTagMap] = useState<Record<string, KeyValue[]>>({});
  const intl = useIntl();

  /**
   * 根据不同的 alarm 设置需要展示的信息
   */
  function setDiffAlarm(alarm: GetAlarmDetail) {
    if (!alarm) return;
    // expression alarm
    if ('metricQueries' in alarm) {
      // alarm is API.GetAlarmExpressionResponse
      const firstMetricQuery = alarm?.metricQueries?.[0];
      if (firstMetricQuery?.aggregatedExpression) {
        const aggregatedExpression = firstMetricQuery?.aggregatedExpression;
        const tags: KeyValue[] = [];
        tags.push({
          key: '聚合方法',
          value: aggregatedExpression.function,
        });
        aggregatedExpression?.where?.forEach((item) => {
          tags.push({
            key: '筛选',
            value: `${item.key}:${item.value}`,
          });
        });
        const metricName = aggregatedExpression?.metricName + ' - 聚合';
        setMetricTagMap({
          [metricName]: tags,
        });
        setMetricNames([metricName]);
        setStatistic(aggregatedExpression.function);
      } else {
        const metricArr =
          alarm.metricQueries
            ?.filter((item) => item.metricStat)
            .map((item) => {
              return {
                metricName: `${item.id}: ${item.metricStat?.metadata?.name}`,
                tags: item?.metricStat?.metadata.tags || [],
              };
            }) || [];
        const expressionTagsMap = metricArr.reduce((prev, cur) => {
          return {
            ...prev,
            [cur.metricName]: cur.tags,
          };
        }, {});
        setMetricTagMap(expressionTagsMap);
        setMetricNames(metricArr.map((el) => el.metricName));
        setStatistic(firstMetricQuery?.metricStat?.statistic || '');
      }
    } else {
      // alarm is API.GetAlarmResponse
      const normalAlarm = alarm as API.GetAlarmResponse;
      const metricName = normalAlarm.metric?.name || '';
      setMetricNames([metricName]);
      setMetricTagMap({
        [metricName]: normalAlarm.metric?.tags as KeyValue[],
      });
      setStatistic(normalAlarm?.statistic || '');
    }
  }

  useEffect(() => {
    setDiffAlarm(alarmDetail);
  }, [alarmDetail]);

  return (
    <>
      <InfoList>
        <List.Item>
          <TextStrong strong>触发时间</TextStrong>
          <Text>{moment(alarmDetail.updatedTimestamp).format('YYYY-MM-DD HH:mm')}</Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.monitoringIndicators',
              defaultMessage: '监控指标',
            })}
          </TextStrong>
          <Text>
            {metricNames.map((item) => (
              <FlexText key={item}>
                {item} {metricTagMap[item] && <Tags tags={metricTagMap[item]} hideLeft />}
              </FlexText>
            ))}
          </Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.告警条件',
              defaultMessage: '告警条件',
            })}
          </TextStrong>
          <Text>{`${comparatorValue[alarmDetail?.comparator || '']} ${
            alarmDetail?.threshold
          }`}</Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.statisticalMethod',
              defaultMessage: '统计方法',
            })}
          </TextStrong>
          <Text>{statistic}</Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.evaluationRange',
              defaultMessage: '评估期',
            })}
          </TextStrong>
          <Text>{alarmDetail?.evaluationPeriods}</Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.indexResolution',
              defaultMessage: '精度',
            })}
          </TextStrong>
          <Text>{getPeriodLabelByValue(alarmDetail?.period || 0)}</Text>
        </List.Item>

        <List.Item>
          <TextStrong strong>
            {intl.formatMessage({
              id: 'alarm.dataPointsToAlarm',
              defaultMessage: '触发告警数据点',
            })}
          </TextStrong>
          <Text>{alarmDetail?.dataPointsToAlarm}</Text>
        </List.Item>
      </InfoList>
    </>
  );
};
