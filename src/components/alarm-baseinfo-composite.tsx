import AlarmRuleComponent, { convertToAlarmRules } from '@/components/alarm-rule';
import { List, Typography } from 'antd';
import moment from 'moment';
import type { FC } from 'react';
import styled from 'styled-components';

const { Text } = Typography;

type Props = {
  alarmDetail: API.GetAlarmCompositeResponse;
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
const InfoListTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const AlarmBaseInfoComposite: FC<Props> = ({ alarmDetail }) => {
  const alarmRules = convertToAlarmRules(alarmDetail.alarmRules || []);

  return (
    <>
      <InfoList>
        <List.Item>
          <TextStrong strong>触发时间</TextStrong>
          <Text>{moment(alarmDetail.updatedTimestamp).format('YYYY-MM-DD HH:mm')}</Text>
        </List.Item>
      </InfoList>
      <div>
        <InfoListTitle>告警条件规则表达式</InfoListTitle>
        <AlarmRuleComponent alarmRules={alarmRules} readonly hideTitle />
      </div>
    </>
  );
};
