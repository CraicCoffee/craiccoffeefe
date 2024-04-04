import Flex from '@/components/shared-components/Flex';
import { openDetail, statusBg } from '@/pages/alarm/utils';
import { history, useIntl } from '@umijs/max';
import { Badge, Button, Card, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { FC } from 'react';

type Props = {
  allActiveAlarms?: API.ListAlarmResponse[];
  alarmsCount?: number;
};

const AlarmTable: FC<Props> = ({ allActiveAlarms = [], alarmsCount = 0 }) => {
  const intl = useIntl();

  const columns: ColumnsType<API.ListAlarmResponse> = [
    {
      title: intl.formatMessage({ id: 'alarm.name', defaultMessage: '名称' }),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            openDetail(record.uuid, record.type);
            localStorage.setItem('UUID', record.uuid);
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'alarm.updatedTimestamp', defaultMessage: '最新更新时间' }),
      dataIndex: 'updatedTimestamp',
      key: 'updatedTimestamp',
      ellipsis: true,
      render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: intl.formatMessage({ id: 'alarm.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      ellipsis: true,
      render: (text) => (
        <Tag color={statusBg[text]}>{text === 'INSUFFICIENT_DATA' ? 'NO DATA' : text}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'alarm.notice', defaultMessage: '通知' }),
      dataIndex: 'receivers',
      key: 'receivers',
      width: 100,
      render: (text) => {
        return (
          text?.length > 0 && (
            <Tooltip
              placement="left"
              title={text.map((item, index) => (
                <div key={index}>{`${item.receiver}-${item.type}`}</div>
              ))}
            >
              <Badge
                count={text?.length}
                style={{ backgroundColor: '#561d8c87', cursor: 'pointer' }}
              />
            </Tooltip>
          )
        );
      },
    },
  ];

  return (
    <Card>
      <Flex className="h-100" flexDirection="column" justifyContent="between">
        <div>
          <h3 className="mb-0">异常统计</h3>
        </div>
        <div className="mb-4">
          {/*<h1 className="font-weight-bold">27,188.00/天</h1>*/}
          {/*<p className="text-success">*/}
          {/*  <span>比昨天增长</span>*/}
          {/*  <span>*/}
          {/*        <span> 17% </span>*/}
          {/*        <ArrowUpOutlined/>*/}
          {/*      </span>*/}
          {/*</p>*/}
          <p>
            在{alarmsCount}个监控中，有{allActiveAlarms?.length}个异常正在发生
          </p>
        </div>
      </Flex>
      <Table columns={columns} dataSource={allActiveAlarms} />
    </Card>
  );
};

export default AlarmTable;
