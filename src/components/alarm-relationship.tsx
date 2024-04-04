import { alarmTypeToVerboseName } from '@/pages/alarm';
import { statusBg } from '@/pages/alarm/utils';
import { useIntl } from '@umijs/max';
import { Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { FC } from 'react';
import { useState } from 'react';

type Props = {
  alarmDetail: API.GetAlarmCompositeResponse;
  showColumns?: string[];
  row?: number;
};

const tabList = [
  {
    key: 'childrenAlarm',
    tab: '子告警',
  },
  {
    key: 'parentAlarm',
    tab: '父告警',
  },
];

const locale = {
  emptyText: (
    <div
      style={{
        textAlign: 'center',
        fontSize: '16px',
      }}
    >
      无关联告警
    </div>
  ),
};

export const AlarmRelationship: FC<Props> = ({ alarmDetail, showColumns, ...props }) => {
  const childrenAlarm = alarmDetail.childrenAlarm;
  const [activeTabKey, setActiveTabKey] = useState<string>(tabList[0].key);

  const intl = useIntl();

  const childrenColumns: ColumnsType<API.ChildrenAlarm> = [
    {
      title: intl.formatMessage({ id: 'alarm.name', defaultMessage: '名称' }),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: intl.formatMessage({ id: 'alarm.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tag color={statusBg[text]}>{text === 'INSUFFICIENT_DATA' ? 'NO DATA' : text}</Tag>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'alarm.childrenAlarm.updatedTimestamp',
        defaultMessage: '日期时间',
      }),
      dataIndex: 'updatedTimestamp',
      key: 'updatedTimestamp',
      ellipsis: true,
      render: (text: string) => <span>{moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (text: string) => alarmTypeToVerboseName[text],
    },
  ].filter((column) => showColumns?.includes(column.key) ?? true);

  return (
    <Card
      style={{ width: '100%' }}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={(key: string) => {
        setActiveTabKey(key);
      }}
    >
      {activeTabKey === 'childrenAlarm' && (
        <Table
          columns={childrenColumns}
          locale={locale}
          dataSource={childrenAlarm}
          pagination={false}
          scroll={{
            y: props?.row ? props.row * 54 : '',
          }}
        />
      )}
      {activeTabKey === 'parentAlarm' && (
        <Table columns={childrenColumns} locale={locale} dataSource={[]} pagination={false} />
      )}
    </Card>
  );
};
