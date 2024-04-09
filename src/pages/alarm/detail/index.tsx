import { AlarmTopologyLatest } from '@/components/alarm-topology-latest';
import { ChatBot } from '@/components/chat-bot/chat-bot';
import { PageContainer } from '@/components/page-container';
import Copilot from '@/copilot';
import { AlarmHistory } from '@/pages/alarm/components/alarm-history';
import { AlarmInfo } from '@/pages/alarm/components/alarm-info';
import { alarmMap, statusBg } from '@/pages/alarm/utils';
import { getAlarmExpression } from '@/services/craicCoffee/alarmController';
import type { GetAlarmDetail } from '@/types/alarm';
import { isDevOrTest } from '@/utils/is-dev-or-test';
import { history, useIntl, useParams, useSearchParams } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Modal, Space, Tag } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { deleteAlarm, getAlarm, getAlarmComposite } from '../service';

const StyledPageContainer = styled(PageContainer)`
  width: 60%;
`;

const AlarmDetail: React.FC = () => {
  const intl = useIntl();
  const { uuid } = useParams<{ uuid: string }>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(0);

  const [query] = useSearchParams();

  const isExpressionAlarm = query.get('type') === 'expression';
  const isCompositeAlarm = query.get('type') === 'composite';

  const detailData = useAsyncMemo<GetAlarmDetail | undefined>(async () => {
    if (!uuid) return;
    if (isExpressionAlarm) {
      const { data } = await getAlarmExpression({ uuid });
      return data;
    } else if (isCompositeAlarm) {
      const { data } = await getAlarmComposite({ uuid });
      return data;
    } else {
      const { data } = await getAlarm({ uuid });
      return data;
    }
  }, [uuid]);

  const { run: delAlarm } = useRequest(deleteAlarm, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.success) {
        setDeleteModal(false);
        history.push('/alarm/index');
      }
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.errorMessage ?? '删除失败');
      return Promise.reject(err);
    },
  });

  // const { run: updateStatus } = useRequest(updateAlarm, {
  //   manual: true,
  //   onSuccess: () => {
  //     getAlarmDetail(uuid);
  //   },
  // });

  // const setResolved = () => {
  //   const params = {
  //     uuid,
  //     status: 'OK',
  //     reason: 'By user',
  //   };
  //   // @ts-expect-error
  //   updateStatus(params);
  // };

  const deleteOk = () => {
    if (!uuid) return;
    delAlarm({
      uuid,
    });
  };
  const deleteCancel = () => {
    setDeleteModal(false);
  };

  if (!detailData) return null;

  const infoTabElement = <AlarmInfo alarmDetail={detailData} />;
  return (
    <StyledPageContainer
      width={`calc(100% - ${drawerWidth}px)`}
      title={detailData.description}
      tags={
        <>
          {isExpressionAlarm && (
            <Tag color="#007bc7" style={{ marginLeft: 8 }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                表达式告警
              </span>
            </Tag>
          )}
          {isCompositeAlarm && (
            <Tag color="#007bc7" style={{ marginLeft: 8 }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}
              >
                复合告警
              </span>
            </Tag>
          )}
          <Tag color={statusBg[alarmMap[detailData.status || '']]} style={{ marginLeft: 8 }}>
            {/*{detailData.status === 'INSUFFICIENT_DATA' ? 'NO DATA' : detailData.status}*/}
            <span
              style={{
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              {detailData.status && alarmMap[detailData.status]}
            </span>
          </Tag>
        </>
      }
      extra={
        <Space>
          {/* {status === 'ALARM' && (
            <Button key="2" onClick={setResolved} type="primary">
              {intl.formatMessage({ id: 'alarm.resolved', defaultMessage: '已解决' })}
            </Button>
          )} */}

          <Copilot anomaly={detailData} drawerWidth={drawerWidth} setDrawerWidth={setDrawerWidth} />
          <Button
            onClick={() => {
              sessionStorage.setItem('EDITUUID', uuid ?? '');
              if (isCompositeAlarm) {
                history.push('/alarm/edit/composite');
              } else if (isExpressionAlarm) {
                history.push(`/alarm/edit?type=expression`);
              } else {
                history.push(`/alarm/edit`);
              }
            }}
          >
            编辑
          </Button>
          <Button onClick={() => setDeleteModal(true)}>删除</Button>
        </Space>
      }
      tabs={[
        {
          key: 'info',
          label: intl.formatMessage({ id: 'alarm.alarmAttribute', defaultMessage: '告警属性' }),
          element: infoTabElement,
        },
        {
          key: 'history',
          label: intl.formatMessage({ id: 'alarm.告警记录', defaultMessage: '告警记录' }),
          element: <AlarmHistory historyDetails={detailData.history} />,
        },
        {
          key: 'topology-latest',
          label: '拓扑告警',
          element: <AlarmTopologyLatest alarmDetail={detailData} />,
        },
      ]}
    >
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
      {isDevOrTest && <ChatBot />}
    </StyledPageContainer>
  );
};

export default AlarmDetail;
