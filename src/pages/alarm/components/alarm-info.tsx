import { AlarmBaseInfo } from '@/components/alarm-baseinfo';
import { AlarmBaseInfoComposite } from '@/components/alarm-baseinfo-composite';
import { AlarmChart } from '@/components/alarm-chart';
import { AlarmRelationship } from '@/components/alarm-relationship';
import { getAllWebhooks } from '@/pages/account/settings/service';
import type { GetAlarmDetail } from '@/types/alarm';
import { useIntl } from '@umijs/max';
import { Card, Col, List, Row, Typography } from 'antd';
import moment from 'moment/moment';
import type { FC } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';

const { Text } = Typography;

type Props = {
  alarmDetail: GetAlarmDetail;
};

const TextStrong = styled(Text)`
  word-break: keep-all;
  text-align: left;
`;

const InfoListTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const InfoList = styled(List).attrs({
  split: false,
})`
  .ant-list-item {
    padding: 8px 0 !important;
  }

  margin-bottom: 8px;
`;

export const AlarmInfo: FC<Props> = (props) => {
  const detailData = props.alarmDetail;
  const intl = useIntl();
  const contactsTypeText: Record<string, string> = {
    Web: '站内信',
    Email: '邮箱',
    Sms: '手机',
    Webhook: 'Webhook',
  };

  const webhooks = useAsyncMemo(async () => {
    return await getAllWebhooks();
  }, []);

  // 处理接收人的数据
  const getContacts = (data: API.AlarmReceiver[] | undefined) => {
    const arr: Record<string, string> = {};
    data?.map((item) => {
      if (!item.type) return;
      if (!Object.keys(arr).includes(item.type)) {
        arr[item.type] = `${item.receiver}`;
      } else {
        arr[item.type] = arr[item.type] + `; ${item.receiver}`;
      }
    });
    return arr;
  };

  return (
    <>
      <Row justify="center" align="stretch" gutter={16} style={{ marginBottom: 0 }}>
        <Col span={12}>
          <Card style={{ height: '95%' }}>
            <InfoListTitle>告警信息</InfoListTitle>
            {detailData?.type === 'COMPOSITE' ? (
              <AlarmBaseInfoComposite alarmDetail={detailData} />
            ) : (
              <AlarmBaseInfo alarmDetail={detailData} />
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card style={{ height: '95%' }}>
            <InfoListTitle>基础信息</InfoListTitle>
            <InfoList>
              <List.Item>
                <TextStrong strong>ID</TextStrong>
                <Text type="secondary" style={{ paddingLeft: '15px', textAlign: 'right' }}>
                  {detailData?.uuid}
                </Text>
              </List.Item>
              <List.Item>
                <TextStrong strong>
                  {intl.formatMessage({
                    id: 'alarm.创建时间',
                    defaultMessage: '创建时间',
                  })}
                </TextStrong>
                {detailData?.createdTime && (
                  <Text type="secondary" style={{ textAlign: 'right' }}>
                    {moment(detailData.updatedTimestamp).format('YYYY-MM-DD HH:mm')}
                  </Text>
                )}
              </List.Item>
              <List.Item>
                <TextStrong strong>
                  {intl.formatMessage({ id: 'alarm.创建人', defaultMessage: '创建人' })}
                </TextStrong>
                <Text type="secondary" style={{ textAlign: 'right' }}>
                  {detailData?.creator}
                </Text>
              </List.Item>
            </InfoList>
            <InfoListTitle>
              {intl.formatMessage({ id: 'alarm.方式', defaultMessage: '通知方式' })}
            </InfoListTitle>
            <InfoList>
              {Object.keys(getContacts(detailData?.receivers)).map((item) => {
                return (
                  <List.Item key={item}>
                    <TextStrong strong>{contactsTypeText[item]}</TextStrong>
                    <Text>
                      {' '}
                      {item === 'Webhook'
                        ? detailData?.receivers
                            ?.filter((x: any) => x.type === 'Webhook')
                            .map(
                              (x: any) =>
                                webhooks?.find((webhook) => webhook.id.toString() === x.receiver)
                                  ?.name ?? x.receiver,
                            )
                            .join(', ')
                        : getContacts(detailData?.receivers)[item]}{' '}
                    </Text>
                  </List.Item>
                );
              })}
            </InfoList>
          </Card>
        </Col>
      </Row>
      {/* TODO: 后端给不出数据，暂时注释掉 */}
      {/* <Row justify="center">
                <Col span={18}>
                  <List>
                    <List.Item>
                      <TextStrong strong>
                        {intl.formatMessage({ id: 'alarm.label', defaultMessage: '标签' })}
                      </Text>
                      <Tag color="default">EC2</Tag>
                      <Tag color="default">API Service</Tag>
                      <Tag color="default">CPU</Tag>
                    </List.Item>
                  </List>
                </Col>
              </Row> */}

      {/* <Row justify="center">
                <Col span={18}>
                  <List>
                    <List.Item>
                      <TextStrong strong>
                        {intl.formatMessage({ id: 'alarm.priority', defaultMessage: '优先级' })}
                      </Text>
                      <Tag color="red">P0</Tag>
                      <Tag color="orange">P1</Tag>
                      <Tag color="green">P2</Tag>
                      <Tag color="geekblue">P3</Tag>
                    </List.Item>
                  </List>
                </Col>
              </Row> */}

      {detailData?.type === 'COMPOSITE' ? (
        <AlarmRelationship alarmDetail={detailData} />
      ) : (
        <Card>
          <AlarmChart alarmDetail={detailData} />
        </Card>
      )}
    </>
  );
};
