import { AlarmBaseInfo } from '@/components/alarm-baseinfo';
import { AlarmChart } from '@/components/alarm-chart';
import { AlarmRelationship } from '@/components/alarm-relationship';
import AlarmRuleComponent, { convertToAlarmRules } from '@/components/alarm-rule';
import s from '@/pages/metric/list/style.less';
import { useIntl } from '@umijs/max';
import { Collapse, List, Typography } from 'antd';
import moment from 'moment/moment';
import { type FC } from 'react';
import styled from 'styled-components';

const TextStrong = styled(Typography.Text)`
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

type Props = {
  alarmDetail:
    | API.GetAlarmResponse
    | API.GetAlarmExpressionResponse
    | API.GetAlarmCompositeResponse;
};

export const AlarmTopologyDrawer: FC<Props> = (props) => {
  const { alarmDetail } = props;
  const intl = useIntl();
  const type = alarmDetail?.type;

  return (
    <>
      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel
          header={intl.formatMessage({ id: 'alarm.alarmInfo', defaultMessage: '告警信息' })}
          key="1"
        >
          {type === 'COMPOSITE' ? (
            <InfoList>
              <List.Item>
                <TextStrong strong>触发时间</TextStrong>
                <Typography.Text>
                  {moment(alarmDetail.updatedTimestamp).format('YYYY-MM-DD HH:mm')}
                </Typography.Text>
              </List.Item>
            </InfoList>
          ) : (
            <AlarmBaseInfo alarmDetail={alarmDetail} />
          )}
        </Collapse.Panel>
      </Collapse>

      <div style={{ height: '20px' }} />

      {type === 'COMPOSITE' ? (
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel
            header={intl.formatMessage({ id: 'alarm.alarmRules', defaultMessage: '告警表达式' })}
            key="1"
          >
            <div className={s.drawercenter}>
              <AlarmRuleComponent
                alarmRules={convertToAlarmRules(
                  (alarmDetail as API.GetAlarmCompositeResponse).alarmRules || [],
                )}
                readonly
              />
            </div>
          </Collapse.Panel>
        </Collapse>
      ) : (
        <Collapse defaultActiveKey={['1']}>
          <Collapse.Panel
            header={intl.formatMessage({ id: 'alarm.alarmChart', defaultMessage: '告警指标' })}
            key="1"
          >
            <div className={s.drawercenter}>
              <AlarmChart alarmDetail={alarmDetail} />
            </div>
          </Collapse.Panel>
        </Collapse>
      )}

      <div style={{ height: '20px' }} />

      <Collapse defaultActiveKey={['1']}>
        <Collapse.Panel
          header={intl.formatMessage({ id: 'alarm.topologyAlarm', defaultMessage: '关联告警' })}
          key="1"
        >
          <AlarmRelationship
            alarmDetail={alarmDetail}
            showColumns={['description', 'type']}
            row={5}
          />
        </Collapse.Panel>
      </Collapse>
    </>
  );
};
