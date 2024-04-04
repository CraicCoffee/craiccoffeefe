import { PageContainer } from '@/components/page-container';
import { history, useIntl } from '@umijs/max';
import { Badge, Button, Card, message, Modal, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import s from './index.less';
import { deleteAlarm, listAlarms } from './service';
import { openDetail, statusBg } from './utils';

export const alarmTypeToVerboseName: Record<string, string> = {
  NORMAL: '普通告警',
  EXPRESSION: '表达式告警',
  COMPOSITE: '复合告警',
};

type AlarmDataType = Required<API.ListAlarmResponse>;

const Alarm: React.FC = () => {
  const intl = useIntl();
  const [selectedUuid, setSelectedUuid] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageData, setPageData] = useState<API.DataWithPageListAlarmResponse>({
    data: [],
    currentPage: 1,
    total: 0,
  });

  const columns: ColumnsType<AlarmDataType> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      sorter: (a, b) => {
        if (a === b) return 0;
        return a > b ? 1 : -1;
      },
      render: (text: string) => alarmTypeToVerboseName[text],
    },
    {
      title: intl.formatMessage({ id: 'alarm.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      sorter: (a, b) => a.status.length - b.status.length,
      ellipsis: true,
      render: (text: string) => (
        <Tag color={statusBg[text]}>{text === 'INSUFFICIENT_DATA' ? 'NO DATA' : text}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'alarm.name', defaultMessage: '名称' }),
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.status.length - b.status.length,
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
      title: intl.formatMessage({ id: 'alarm.notice', defaultMessage: '通知' }),
      dataIndex: 'receivers',
      key: 'receivers',
      width: 100,
      render: (text: any[]) => {
        const flag = text?.length > 0;
        return flag ? (
          <Tooltip
            placement="left"
            title={text.map((item, index) => (
              <div
                key={`${item.receiver}${item.type}${index}`}
              >{`${item.receiver}-${item.type}`}</div>
            ))}
          >
            <Badge
              count={text.length}
              style={{ backgroundColor: '#561d8c87', cursor: 'pointer' }}
            />
          </Tooltip>
        ) : (
          '--'
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'alarm.操作', defaultMessage: '操作' }),
      dataIndex: 'operation',
      key: 'operation',
      width: 200,
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                sessionStorage.setItem('EDITUUID', record.uuid ?? '');
                if (record.type === 'COMPOSITE') {
                  history.push('/alarm/edit/composite');
                } else if (record.type === 'EXPRESSION') {
                  history.push(`/alarm/edit?type=expression`);
                } else {
                  history.push('/alarm/edit');
                }
              }}
            >
              {intl.formatMessage({ id: 'alarm.编辑', defaultMessage: '编辑' })}
            </Button>

            <Button
              type="link"
              onClick={() => {
                setDeleteModal(true);
                setSelectedUuid(record.uuid);
              }}
            >
              {intl.formatMessage({ id: 'alarm.删除', defaultMessage: '删除' })}
            </Button>
          </>
        );
      },
    },
  ];

  // const multipleOption = [
  //   { label: 'ALARM', value: 'ALARM' },
  //   // { id: 'Warn', label: 'Warn', value: 'Warn' },
  //   { label: 'NO DATA', value: 'INSUFFICIENT_DATA' },
  //   { label: 'OK', value: 'OK' },
  // ];

  const fetchAlarmList = (page = 1, size = pageSize) => {
    setLoading(true);
    if (size != pageSize) {
      setPageSize(size);
    }
    listAlarms({
      currentPage: page,
      size,
    })
      .then((res) => {
        setPageData(res.data as API.DataWithPageListAlarmResponse);
      })
      .catch(() => {
        setPageData({
          ...pageData,
          data: [],
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAlarmList(1);
  }, []);

  const deleteOk = async () => {
    await deleteAlarm({
      uuid: selectedUuid,
    }).catch((err) => {
      message.error(err?.response?.data?.errorMessage ?? '删除失败');
      return Promise.reject(err);
    });
    message.success('删除成功');
    setDeleteModal(false);
    fetchAlarmList(pageData.currentPage, pageSize);
  };
  const deleteCancel = () => {
    setDeleteModal(false);
  };

  return (
    <PageContainer
      extra={
        <>
          <Button
            key="1"
            type="primary"
            onClick={() => {
              history.push('/alarm/create/composite');
            }}
          >
            {intl.formatMessage({ id: 'alarm.newCompositeAlarm', defaultMessage: '新建复合告警' })}
          </Button>
          <Button
            key="1"
            type="primary"
            onClick={() => {
              history.push('/alarm/create');
            }}
          >
            {intl.formatMessage({ id: 'alarm.newAlarm', defaultMessage: '新建告警' })}
          </Button>
        </>
      }
    >
      <div className={s.page}>
        {/* 未来可能继续用的筛选器 */}
        {/* 监控名称
        <Input
          placeholder={intl.formatMessage({
            id: 'alarm.monitoringName.placeholder',
            defaultMessage: '请输入监控名称',
          })}
        />
        监控状态
        <Select
          mode="multiple"
          allowClear
          showArrow={true}
          placeholder={intl.formatMessage({
            id: 'alarm.select.placeholder',
            defaultMessage: '请选择',
          })}
          options={multipleOption}
          optionFilterProp="label"
        /> */}
        <Card>
          <Table<AlarmDataType>
            dataSource={(pageData?.data ?? []) as AlarmDataType[]}
            columns={columns}
            rowKey="uuid"
            loading={loading}
            pagination={{
              pageSize,
              current: pageData?.currentPage,
              total: pageData?.total,
              showSizeChanger: true,
              onChange: (page, size) => {
                fetchAlarmList(page, size);
              },
            }}
          />
        </Card>
      </div>
      {deleteModal && (
        <Modal
          title={intl.formatMessage({ id: 'alarm.删除', defaultMessage: '删除' })}
          open={deleteModal}
          onOk={deleteOk}
          onCancel={deleteCancel}
          okText={intl.formatMessage({ id: 'alarm.是', defaultMessage: '是' })}
          cancelText={intl.formatMessage({ id: 'alarm.否', defaultMessage: '否' })}
        >
          <p>
            {intl.formatMessage({
              id: 'alarm.modalText',
              defaultMessage: '你是否需要删除此告警， 告警删除后将无法收到信息',
            })}
          </p>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Alarm;
