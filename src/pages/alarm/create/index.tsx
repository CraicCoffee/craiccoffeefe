import AlarmNameInput from '@/components/alarm-name-input';
import { PageContainer } from '@/components/page-container';

import { getAllWebhooks } from '@/pages/account/settings/service';
import {
  addAlarm,
  getAlarm,
  getAlarmExpression,
  updateAlarm,
  updateAlarmExpression,
} from '@/pages/alarm/service';
import { comparatorOptions, getPeriodLabelByValue } from '@/pages/alarm/utils';
import LineChartWidget from '@/pages/metric/components/LineChartWidget';
import type { MetricDataType } from '@/pages/metric/data.d';
import { getMetricsFirstPage } from '@/pages/metric/service';
import type { GetMetric, MetricChartData } from '@/pages/metric/utils';
import {
  addAlarmStatisticOptions,
  convertMetricsDataToChartData,
  getParamasFromReq,
  getTimeRange,
  periodOptions,
} from '@/pages/metric/utils';
import { addAlarmExpression } from '@/services/insightMon/alarmController';
import { getMetricExpression } from '@/services/insightMon/metricController';
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { history, Link, useIntl, useLocation, useSearchParams } from '@umijs/max';
import { useAsyncEffect, useCountDown, useRequest } from 'ahooks';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Result,
  Select,
  Steps,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { editReceiversData, getAnnotations } from '../utils';
import { DocTooltips } from './DocTooltips';
import type { MetricSelectionData } from './metric-selection';
import { MetricSelection } from './metric-selection';
import styles from './style.less';

const { Panel } = Collapse;

const StepsAction = styled.div`
  margin: 10px 0;
`;

const MetricPreviewContainer = styled.div`
  @media (min-width: 1500px) {
    display: flex;
    flex-direction: row-reverse;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    margin: 20px 0;
    > div {
      flex-basis: 0;
      flex-grow: 1;
      min-width: 0;
      &:last-child {
        margin-right: 20px;
      }
    }
  }
  > div {
    &:first-child {
      padding: 24px 0 16px 24px;
    }
  }
`;

const dataPointsToAlarmValidator =
  (evaluationPeriods = 5) =>
  async (_: any, value: any) => {
    const numberValue = Number(value);

    if (!value || numberValue < 1) {
      return Promise.reject(new Error('请输入大于1的整数'));
    }
    if (numberValue > evaluationPeriods) {
      return Promise.reject(new Error(`不能大于评估期，请输入小于${evaluationPeriods}等于的整数`));
    }
    return Promise.resolve();
  };

const excludeMetric = ['CanarySuccess', 'CanaryResponseTime'];

const CreateAlarm: React.FC<Record<string, any>> = () => {
  const intl = useIntl();
  const location = useLocation();

  const [current, setCurrent] = useState(0);
  const [isCanary, setIsCanary] = useState(false);
  const [comparator, setComparator] = useState('GreaterThanThreshold');
  const [chartData, setChartData] = useState<MetricChartData>([]);
  const [metricSelectionData, setMetricSelectionData] = useState<MetricSelectionData>(() => {
    const metricFromLocation = (
      location.state as {
        metric?: MetricDataType;
      } | null
    )?.metric;
    if (metricFromLocation) {
      return {
        type: 'normal',
        metric: metricFromLocation,
      };
    }
    return {
      type: 'normal',
    };
  });

  const [period, setPeriod] = useState<number>(60);
  const [statistic, setStatistic] = useState<string>('Average');
  const [insideMailCheck, setInsideMailCheck] = useState<boolean>(false);
  const [smsCheck, setSmsCheck] = useState<boolean>(false);
  const [mailBoxCheck, setMailBoxCheck] = useState<boolean>(false);
  const [webhookCheck, setWebhookCheck] = useState<boolean>(false);
  const [addContactShow, setAddContactShow] = useState(false);
  const [selectName, setSelectName] = useState('');
  const [addContactForm] = Form.useForm();
  const [form] = Form.useForm();
  const [editData, setEditData] = useState<any>();
  const [lastDataPoint, setLastDataPoint] = useState<any>([]);

  const [query] = useSearchParams();
  const editExpression = query.get('type') === 'expression';
  const isExpression =
    metricSelectionData.type === 'aggregate' || metricSelectionData.type === 'math';

  const { run } = useRequest(getMetricsFirstPage, {
    manual: true,
    onSuccess: (result, req) => {
      const rawData = result?.data?.metrics;
      const dataPoints = rawData[0]?.dataPoints || [];
      const lastDP = dataPoints[dataPoints?.length - 1];
      const { startTime, endTime, period } = getParamasFromReq(req);
      const data = convertMetricsDataToChartData(rawData, period, startTime, endTime);
      setChartData(data);
      setLastDataPoint(lastDP);
    },
  });

  const { run: NewAlarms } = useRequest(addAlarm, {
    manual: true,
    onSuccess: (result: any) => {
      localStorage.setItem('UUID', result.data.uuid);
      setCurrent(4);
    },
  });

  const { run: getEditAlarmData } = useRequest(editExpression ? getAlarmExpression : getAlarm, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.success) {
        const { data } = result;
        setEditData(data);
        if (data.metricQueries) {
          const metricQueries = data.metricQueries as API.MetricGetQuery[];
          // aggregate
          if (metricQueries.length == 1 && metricQueries[0].aggregatedExpression) {
            const { aggregatedExpression } = metricQueries[0];
            setMetricSelectionData({
              type: 'aggregate',
              metric: {
                name: aggregatedExpression.metricName,
                tags: [],
                metadata: [],
              },
              where: (aggregatedExpression.where ?? []) as {
                key: string;
                value: string;
              }[],
              aggFn: aggregatedExpression.function,
            });
          }
          // math
          else if (metricQueries.length > 1) {
            const metrics = metricQueries.filter((el) => !!el.metricStat);
            const expression = metricQueries.find((el) => !!el.mathExpression)?.mathExpression;

            setMetricSelectionData({
              type: 'math',
              // @ts-ignore next line
              metrics: metrics.map((el) => {
                return {
                  ...el.metricStat?.metadata,
                  key: el.id,
                };
              }),
              expression: expression ?? '',
            });
          }
        }
        // normal
        else {
          setMetricSelectionData({
            type: 'normal',
            metric: data.metric,
          });
          const metricName = data.metric.name;
          if (excludeMetric.includes(metricName)) {
            setCurrent(1);
            setIsCanary(true);
          }
        }
        setComparator(data.comparator);
        setPeriod(data.period);
        form.setFieldsValue({
          threshold: data.threshold,
          evaluationPeriods: data.evaluationPeriods,
          comparator: data.comparator,
          period: data.period,
          statistic: data.statistic,
          dataPointsToAlarm: data.dataPointsToAlarm,
          description: data.description,
          Email: editReceiversData(data.receivers, 'Email').join(';'),
          Web: editReceiversData(data.receivers, 'Web').join(';'),
          Sms: editReceiversData(data.receivers, 'Sms'),
          Webhook: editReceiversData(data.receivers, 'Webhook'),
        });
        if (form.getFieldValue('Web')) setInsideMailCheck(true);
        if (form.getFieldValue('Sms').length) setSmsCheck(true);
        if (form.getFieldValue('Email')) setMailBoxCheck(true);
        if (form.getFieldValue('Webhook').length) setWebhookCheck(true);
      }
    },
  });

  const { run: editAlarm } = useRequest(updateAlarm, {
    manual: true,
    onSuccess: () => {
      setCurrent(4);
    },
  });

  const webhooks = useAsyncMemo(() => getAllWebhooks(), []);

  const StepResult: React.FC<{
    onFinish: () => void;
  }> = (props) => {
    return (
      <Result
        status="success"
        title={intl.formatMessage({ id: 'alarm.operationSucceeded', defaultMessage: '操作成功' })}
        extra={
          <>
            <Button type="primary" onClick={props.onFinish}>
              {intl.formatMessage({
                id: 'alarm.createAnotherAlarm',
                defaultMessage: '再新建一个告警',
              })}
            </Button>
            <Button
              onClick={() => {
                const resUuid = sessionStorage.getItem('EDITUUID') ?? localStorage.getItem('UUID');
                if (isExpression) {
                  history.push(`/alarm/detail/${resUuid}?type=expression`);
                } else {
                  history.push(`/alarm/detail/${resUuid}`);
                }
              }}
            >
              {intl.formatMessage({ id: 'alarm.viewAlarm', defaultMessage: '查看告警' })}
            </Button>
          </>
        }
        className={styles.result}
      >
        {props.children}
      </Result>
    );
  };

  // 指标参数变化时调用获取图表数据的接口
  useAsyncEffect(async () => {
    const { startTime, endTime } = getTimeRange('1h');

    if (metricSelectionData.type === 'normal') {
      const { metric } = metricSelectionData;
      if (metric) {
        setSelectName(metric.name);
        const params = {
          metrics: [
            {
              name: metric.name,
              tags: metric.tags,
              metadata: metric.metadata,
            },
          ],
          statistic: statistic,
          period,
          startTime,
          endTime,
        } as API.GetMetricRequest;
        run(params, {});
      } else {
        setChartData([]);
      }
    } else if (metricSelectionData.type === 'aggregate') {
      if (!metricSelectionData.metric) {
        setChartData([]);
        return;
      }
      if (metricSelectionData.aggFn === 'COUNT') {
        setStatistic('SampleCount');
      }
      const result = await getMetricExpression({
        startTime,
        endTime,
        metricQueries: [
          {
            id: 'q1',
            period,
            aggregatedExpression: {
              metricName: metricSelectionData.metric.name,
              function: metricSelectionData.aggFn as any,
              where: metricSelectionData.where,
              groupBy: [],
            },
          },
        ],
      });
      if (!result.success || !result.data) {
        return;
      }
      const metrics: GetMetric[] = [];
      for (const item of result.data) {
        metrics.push({
          name: `${item.id}: ${metricSelectionData.metric.name} - 聚合`,
          metadata: metricSelectionData.metric.metadata ?? [],
          tags: metricSelectionData.metric.tags ?? [],
          dataPoints: item.dataPoints ?? [],
        });
      }
      setChartData(convertMetricsDataToChartData(metrics, period, startTime, endTime));
    } else if (metricSelectionData.type === 'math') {
      if (metricSelectionData.metrics.length === 0) {
        setChartData([]);
        return;
      }
      const result = await getMetricExpression({
        startTime,
        endTime,
        metricQueries: [
          ...metricSelectionData.metrics.map((m) => ({
            id: m.key,
            period,
            metricStat: {
              statistic: statistic as any,
              metadata: {
                name: m.name,
                metadata: m.metadata,
                tags: m.tags,
              },
            },
          })),
          {
            id: 'e1',
            period,
            mathExpression: metricSelectionData.expression,
          },
        ],
      });
      if (!result.success || !result.data) {
        return;
      }
      const metrics: API.GetMetricResponse[] = [];
      for (const item of result.data) {
        metrics.push({
          ...item,
          name: metricSelectionData.expression,
        });
      }
      setChartData(convertMetricsDataToChartData(metrics, period, startTime, endTime));
    }
  }, [metricSelectionData, run, statistic]);

  useEffect(() => {
    if (sessionStorage.getItem('EDITUUID')) {
      getEditAlarmData({ uuid: sessionStorage.getItem('EDITUUID')! });
    }
    return () => {
      sessionStorage.removeItem('EDITUUID');
      localStorage.removeItem('UUID');
    };
  }, [getEditAlarmData]);

  // evaluationPeriods 改变时，同步设置 dataPointsToAlarm
  const evaluationPeriods = Form.useWatch('evaluationPeriods', form);
  useEffect(() => {
    if (evaluationPeriods) {
      form?.setFieldsValue({
        dataPointsToAlarm: evaluationPeriods,
      });
    }
  }, [evaluationPeriods, form]);

  const threshold = Form.useWatch('threshold', form);
  const configWithAnnotation = useMemo(() => {
    return {
      annotations: getAnnotations(
        comparator,
        threshold ?? form.getFieldValue('threshold'),
        evaluationPeriods ?? form.getFieldValue('evaluationPeriods'),
        lastDataPoint,
      ),
    };
  }, [comparator, threshold, evaluationPeriods, lastDataPoint]);

  const onInsideEmailChange = (key: string | string[]) => {
    if (key[1] === 'Web') {
      setInsideMailCheck(true);
    } else {
      setInsideMailCheck(false);
    }
    if (insideMailCheck === false) form.setFieldValue('Web', undefined);
  };

  const onSmsChange = (key: string | string[]) => {
    if (key[1] === 'Sms') {
      setSmsCheck(true);
    } else {
      setSmsCheck(false);
    }
    if (smsCheck === false) form.setFieldValue('Sms', undefined);
  };

  const onMailboxChange = (key: string | string[]) => {
    if (key[1] === 'Email') {
      setMailBoxCheck(true);
    } else {
      setMailBoxCheck(false);
    }
    if (!mailBoxCheck) form.setFieldValue('Email', undefined);
  };

  const onWebhookChange = (key: string | string[]) => {
    if (key[1] === 'Webhook') {
      setWebhookCheck(true);
    } else {
      setWebhookCheck(false);
    }
    if (!webhookCheck) form.setFieldValue('Webhook', []);
  };

  // const sendCode = async () => {
  //   addContactForm.validateFields(['phoneNumber']).then(() => {
  //     const phoneList = form.getFieldValue('Sms');
  //     const modalPhoneInput = addContactForm.getFieldValue('phoneNumber');
  //     if (phoneList) {
  //       if (phoneList.some((item: string) => item === modalPhoneInput)) {
  //         message.error('您已经填写过相同手机号了');
  //       } else {
  //         setCount(Date.now() + 60000);
  //       }
  //     } else {
  //       setCount(Date.now() + 60000);
  //     }
  //   });
  // };

  /**
   * 验证period和evaluationPeriods
   */
  const checkPeriod = () => {
    // 聚合运算需要 period * evaluationPeriods <= 10800 (3h)
    if (isExpression && period * evaluationPeriods > 10800) {
      return Promise.reject(
        new Error('聚合指标/数学运算告警不能处理超过 3 小时的数据（评估期 * 精度）'),
      );
    } else if (period * evaluationPeriods > 86400) {
      // Metrics cannot be checked across more than a day (EvaluationPeriods * Period must be <= 86400)
      // 包含单一指标和数学运算
      return Promise.reject(new Error('单一指标告警不能处理超过 1 天的数据（评估期 * 精度）'));
    }
    return Promise.resolve();
  };

  // 验证手机号的弹窗确定函数
  const addContactOk = (add: any) => {
    addContactForm.validateFields().then(() => {
      const data = addContactForm.getFieldsValue();
      const phoneList = form.getFieldValue('Sms');
      if (phoneList) {
        if (phoneList.some((item: string) => item === data.phoneNumber)) {
          message.error('您已经填写过相同手机号了');
        } else {
          add(data.phoneNumber); //调用的是Form.list的增加函数
          setAddContactShow(false);
          addContactForm.resetFields();
        }
      } else {
        add(data.phoneNumber); //调用的是Form.list的增加函数
        setAddContactShow(false);
        addContactForm.resetFields();
      }
    });
  };

  // 步骤条的完成事件
  const stepsDone = async () => {
    const formData = form.getFieldsValue(true);
    // const metrics = initData.filter((item) => {
    //   return selectedRowKeys.find((i) => item?.mid === i);
    // });

    const receiversArr: object[] = [];
    formData.Sms?.filter((x: string) => !!x).forEach((item: string) =>
      receiversArr.push({ receiver: item, type: 'Sms' }),
    );
    formData.Web?.replace(/；/g, ';')
      .split(';')
      .filter((x: string) => !!x)
      .forEach((item: string) => {
        if (item) receiversArr.push({ receiver: item, type: 'Web' });
      });
    formData.Email?.replace(/；/g, ';')
      .split(';')
      .filter((x: string) => !!x)
      .forEach((item: string) => {
        if (item) receiversArr.push({ receiver: item, type: 'Email' });
      });
    formData.Webhook?.filter((x: string) => !!x).forEach((item: string) => {
      if (item) receiversArr.push({ receiver: item, type: 'Webhook' });
    });

    const params = {
      threshold: Number(formData.threshold),
      statistic: statistic,
      period,
      dataPointsToAlarm: Number(formData.dataPointsToAlarm) || 1,
      evaluationPeriods: Number(formData.evaluationPeriods),
      comparator: comparator,
      description: formData.description,
    } as API.UpdateAlarmRequest;

    const uuid = sessionStorage.getItem('EDITUUID');
    const edit = !!uuid;

    // expression
    if (isExpression) {
      const reqData: any = {
        ...params,
        receivers: receiversArr,
        metricQueries: [],
      };
      if (metricSelectionData.type === 'aggregate') {
        if (!metricSelectionData.metric) {
          message.error('请选择指标');
          return;
        }
        reqData.metricQueries = [
          {
            id: 'q1',
            period,
            aggregatedExpression: {
              metricName: metricSelectionData.metric.name,
              function: metricSelectionData.aggFn as any,
              where: metricSelectionData.where,
              groupBy: [],
            },
          },
        ];
      }
      if (metricSelectionData.type === 'math') {
        if (!metricSelectionData.expression) {
          message.error('请输入数学表达式');
          return;
        }
        reqData.metricQueries = [
          ...metricSelectionData.metrics.map((m) => ({
            id: m.key,
            period,
            metricStat: {
              statistic: statistic as any,
              metadata: {
                name: m.name,
                metadata: m.metadata,
                tags: m.tags,
              },
            },
          })),
          {
            id: 'e1',
            period,
            mathExpression: metricSelectionData.expression,
          },
        ];
      }
      const result = await (edit
        ? updateAlarmExpression({ uuid }, reqData)
        : addAlarmExpression(reqData));
      if (!result.success) {
        message.error('创建失败');
        return;
      }
      if (!edit) {
        localStorage.setItem('UUID', (result as any).data.uuid);
      }
      setCurrent(4);
      return;
    }

    // normal
    if (!metricSelectionData.metric) {
      message.error('请选择指标');
      return;
    }

    const metricParamData = {
      name: metricSelectionData.metric.name,
      tags: metricSelectionData.metric.tags,
      metadata: metricSelectionData.metric.metadata,
    };
    if (edit) {
      editAlarm(
        {
          uuid: uuid,
        },
        {
          ...params,
          metric: metricParamData,
          receivers: receiversArr,
        },
      );
    } else {
      NewAlarms({
        ...params,
        metric: metricParamData,
        receivers: receiversArr,
      });
    }
  };

  // TODO: 每个步骤抽成一个组件，暂时先不做
  const steps = [
    {
      title: intl.formatMessage({ id: 'alarm.oneStep', defaultMessage: '选择监控指标' }),
      content: (
        <MetricPreviewContainer>
          <div>
            <div style={{ position: 'sticky', zIndex: 1000, top: 100 }}>
              <LineChartWidget
                dataSource={chartData}
                customConfig={{
                  height: window.innerHeight - 360,
                }}
                hideUnit={statistic === 'SampleCount'}
              />
            </div>
          </div>
          <div>
            <MetricSelection
              data={metricSelectionData}
              setData={setMetricSelectionData}
              editMode={!!sessionStorage.getItem('EDITUUID')}
            />
          </div>
        </MetricPreviewContainer>
      ),
    },
    {
      title: intl.formatMessage({ id: 'alarm.setThreshold', defaultMessage: '设置报警阈值' }),
      content: (
        <MetricPreviewContainer>
          <div>
            <LineChartWidget
              dataSource={chartData}
              threshold={threshold}
              customConfig={configWithAnnotation}
            />
          </div>
          <div>
            <Collapse defaultActiveKey={['1', '2']} destroyInactivePanel={false}>
              <Panel key="1" header="基础告警设置" forceRender>
                <Form.Item
                  label={intl.formatMessage({ id: 'alarm.judgment', defaultMessage: '判断条件' })}
                  name="comparator"
                  initialValue={'GreaterThanThreshold'}
                >
                  <Radio.Group
                    options={comparatorOptions}
                    optionType="button"
                    buttonStyle="solid"
                    value={comparator}
                    onChange={({ target: { value } }: any) => {
                      setComparator(value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'alarm.threshold', defaultMessage: '阈值' })}
                  name="threshold"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'alarm.threshold.placeholder',
                        defaultMessage: '请输入阈值',
                      }),
                    },
                  ]}
                >
                  <Input placeholder="5" type="number" />
                </Form.Item>
                <Form.Item
                  label={
                    <>
                      {intl.formatMessage({
                        id: 'alarm.evaluationRange',
                        defaultMessage: '评估期',
                      })}
                      <DocTooltips label="evaluationPeriods" />
                    </>
                  }
                  name="evaluationPeriods"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'alarm.evaluationRange.placeholder',
                        defaultMessage: '请输入评估期',
                      }),
                    },
                    {
                      validator: checkPeriod,
                      // validateTrigger: 'onBlur',
                    },
                  ]}
                  initialValue="5"
                >
                  <Input placeholder="请输入" type="number" />
                </Form.Item>
              </Panel>

              <Panel key="2" header="告警名称设置" forceRender>
                <AlarmNameInput
                  oldName={editData?.description}
                  initialValue={`${selectName}告警_${moment(new Date()).format('YYYYMMDD')}`}
                />
                <Form.Item
                  label={intl.formatMessage({
                    id: 'alarm.alarmRemarks',
                    defaultMessage: '告警备注',
                  })}
                  name="no"
                  rules={[
                    {
                      required: false,
                      message: intl.formatMessage({
                        id: 'alarm.enterRemarks',
                        defaultMessage: '请输入备注',
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'alarm.alarmRemarks.placeholder',
                      defaultMessage: 'CPU使用率过高会导致服务降级',
                    })}
                  />
                </Form.Item>
              </Panel>

              <Panel key="3" header="高级告警设置" forceRender>
                <Form.Item
                  label={
                    <>
                      {intl.formatMessage({
                        id: 'alarm.indexResolution',
                        defaultMessage: '精度',
                      })}
                      <DocTooltips label="period" />
                    </>
                  }
                  name="period"
                  rules={[{ required: true, message: '请选择精度' }, { validator: checkPeriod }]}
                  initialValue={60}
                >
                  <Select style={{ width: 120 }} onChange={setPeriod} options={periodOptions} />
                </Form.Item>
                <Form.Item label="统计方法" name="statistic" initialValue={'Average'}>
                  <Select
                    style={{ width: 120 }}
                    onChange={setStatistic}
                    options={addAlarmStatisticOptions}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <>
                      {intl.formatMessage({
                        id: 'alarm.dataPointsToAlarm',
                        defaultMessage: '触发告警数据点',
                      })}
                      <DocTooltips label="dataPointsToAlarm" />
                    </>
                  }
                  name="dataPointsToAlarm"
                  rules={[
                    {
                      validator: dataPointsToAlarmValidator(evaluationPeriods),
                    },
                  ]}
                  initialValue={1}
                >
                  <Input placeholder="请输入" type="number" />
                </Form.Item>
              </Panel>
            </Collapse>
          </div>
        </MetricPreviewContainer>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'alarm.setNotifications',
        defaultMessage: '设置通知',
      }),
      content: (
        <div style={{ width: '70vw', margin: '20px auto' }}>
          <div className={styles.collapseBox}>
            <div className={styles.title}>
              {intl.formatMessage({
                id: 'alarm.alarmMode',
                defaultMessage: '请选择要触达的告警方式',
              })}
            </div>
            <Collapse activeKey={insideMailCheck ? 'Web' : ''} onChange={onInsideEmailChange}>
              <Panel
                header={<Checkbox checked={insideMailCheck}>站内信</Checkbox>}
                key="Web"
                showArrow={false}
              >
                <Form.Item label="送达人:" name="Web" colon={false}>
                  <Input.TextArea
                    placeholder="请输入送人，每个用户用 ; 隔开，最多支持十个用户"
                    style={{ height: '100px', width: '50%' }}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <div className={styles.emptyBox} />
            <Collapse activeKey={smsCheck ? 'Sms' : ''} onChange={onSmsChange}>
              <Panel
                header={
                  <Checkbox checked={smsCheck}>
                    {intl.formatMessage({ id: 'alarm.SMSPush', defaultMessage: '短信推送' })}
                  </Checkbox>
                }
                key="Sms"
                showArrow={false}
              >
                <Form.List name="Sms">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          label={
                            index === 0 ? (
                              intl.formatMessage({
                                id: 'alarm.notifier',
                                defaultMessage: '送达人',
                              })
                            ) : (
                              <div style={{ width: '42px' }} />
                            )
                          }
                          name="Sms"
                          required={false}
                          key={field.key}
                          colon={false}
                        >
                          <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                            <Input
                              disabled
                              placeholder={intl.formatMessage({
                                id: 'alarm.enterTel',
                                defaultMessage: '请输入手机号',
                              })}
                              style={{ width: '50%' }}
                            />
                          </Form.Item>
                          <MinusCircleOutlined
                            style={{ width: '30px', height: '30px', marginLeft: '30px' }}
                            onClick={() => remove(field.name)}
                          />
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => setAddContactShow(true)}
                          style={{ width: '50%' }}
                          icon={<PlusOutlined />}
                        >
                          {intl.formatMessage({
                            id: 'alarm.newcontact',
                            defaultMessage: '新增联系人',
                          })}
                        </Button>
                        <Form.ErrorList errors={errors} />
                        <Modal
                          open={addContactShow}
                          title={intl.formatMessage({
                            id: 'alarm.mobileAndVerify',
                            defaultMessage: '请填写手机号并验证',
                          })}
                          onOk={() => addContactOk(add)}
                          onCancel={() => {
                            addContactForm.resetFields();
                            setAddContactShow(false);
                          }}
                        >
                          <Form form={addContactForm}>
                            <Form.Item
                              validateTrigger={['onBlur']}
                              label={intl.formatMessage({
                                id: 'alarm.phoneNumber',
                                defaultMessage: '手机号',
                              })}
                              name="phoneNumber"
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({
                                    id: 'alarm.noPoneNull',
                                    defaultMessage: '手机号不得为空！',
                                  }),
                                },
                                {
                                  pattern: /^1[3456789]\d{9}$/,
                                  message: intl.formatMessage({
                                    id: 'alarm.phoneFormatError',
                                    defaultMessage: '手机号格式错误！',
                                  }),
                                },
                              ]}
                            >
                              <Input
                                placeholder={intl.formatMessage({
                                  id: 'alarm.phone.placeholder',
                                  defaultMessage: '请输入手机号',
                                })}
                                maxLength={11}
                              />
                            </Form.Item>
                            {/* TODO: 后端没实现，前端先隐藏 */}
                            {/* <Form.Item
                              label={intl.formatMessage({
                                id: 'alarm.verificationCode',
                                defaultMessage: '验证码',
                              })}
                              name="code"
                              rules={[{ required: true, message: '验证码不得为空！' }]}
                            >
                              <Input
                                className={styles.codeInput}
                                placeholder="请输入验证码"
                                addonAfter={
                                  <Button
                                    type="primary"
                                    disabled={countDown !== 0}
                                    onClick={() => sendCode()}
                                  >
                                    {countDown === 0
                                      ? intl.formatMessage({
                                          id: 'alarm.getVerificationCode',
                                          defaultMessage: '获取验证码',
                                        })
                                      : Math.round(countDown / 1000) +
                                        intl.formatMessage({
                                          id: 'alarm.resendInSeconds',
                                          defaultMessage: '秒后重发',
                                        })}
                                  </Button>
                                }
                              />
                            </Form.Item> */}
                          </Form>
                        </Modal>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Panel>
            </Collapse>
            <div className={styles.emptyBox} />
            <Collapse activeKey={mailBoxCheck ? 'Email' : ''} onChange={onMailboxChange}>
              <Panel
                header={<Checkbox checked={mailBoxCheck}>邮箱</Checkbox>}
                key="Email"
                showArrow={false}
              >
                <Form.Item label="送达人" name="Email" colon={false}>
                  <Input.TextArea
                    placeholder={intl.formatMessage({
                      id: 'alarm.mailBox.placeholder',
                      defaultMessage:
                        '请输入送达邮箱，多个邮箱用英文分号（;）隔开，最多支持十个邮箱',
                    })}
                    style={{ height: '100px', width: '50%' }}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
            <div className={styles.emptyBox} />
            <Collapse activeKey={webhookCheck ? 'Webhook' : ''} onChange={onWebhookChange}>
              <Panel
                header={<Checkbox checked={webhookCheck}>Webhook</Checkbox>}
                key="Webhook"
                showArrow={false}
              >
                <Form.Item label="URL" name="Webhook" colon={false}>
                  <Select
                    mode="multiple"
                    options={webhooks?.map((x) => ({
                      label: x.name,
                      value: x.id.toString(),
                    }))}
                    optionLabelProp="label"
                    placeholder="请选择 Webhook URL，支持选择多个"
                  />
                </Form.Item>
                <Link to="/account/settings?initial-tab=webhook">点此去配置 Webhook</Link>
              </Panel>
            </Collapse>
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'alarm.previewAlarmSettings',
        defaultMessage: '预览告警配置',
      }),
      content: (
        <div style={{ width: '70vw', margin: '20px auto' }}>
          <Descriptions title="告警详情">
            <Descriptions.Item label="告警名称">
              {form.getFieldValue('description')}
            </Descriptions.Item>
            <Descriptions.Item label="告警阈值">
              {` ${form?.getFieldValue('threshold')}`}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'alarm.evaluationRange',
                defaultMessage: '评估期',
              })}
            >
              {form?.getFieldValue('evaluationPeriods')}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'alarm.monitoringIndicators',
                defaultMessage: '监控指标',
              })}
            >
              {selectName}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'alarm.indexResolution',
                defaultMessage: '精度',
              })}
            >
              {getPeriodLabelByValue(period)}
            </Descriptions.Item>
          </Descriptions>

          <LineChartWidget
            dataSource={chartData}
            threshold={form?.getFieldValue('threshold')}
            customConfig={configWithAnnotation}
          />
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'alarm.finish', defaultMessage: '完成' }),
      content: (
        <div style={{ width: '70vw', margin: '80px auto 80px' }}>
          <StepResult
            onFinish={() => {
              sessionStorage.removeItem('EDITUUID');
              localStorage.removeItem('UUID');
              history.push(`/alarm/create`);
              // FIXME: rawdata.some 报错问题不好修复，等以后重构再看吧，先临时强制刷新一下
              window.location.reload();
            }}
          />
        </div>
      ),
    },
  ];

  const next = () => {
    form
      .validateFields()
      .then(() => {
        if (current === 0) {
          if (metricSelectionData.type === 'normal' && !metricSelectionData.metric) {
            message.warning('请选择指标');
            return;
          }
          if (metricSelectionData.type === 'aggregate' && !metricSelectionData.metric) {
            message.warning('请选择指标');
            return;
          }
          if (metricSelectionData.type === 'math' && !metricSelectionData.expression) {
            message.warning('请输入表达式');
            return;
          }
          setCurrent(current + 1);
        } else if (current === 2) {
          if (insideMailCheck) {
            if (!form.getFieldValue('Web')) {
              message.warning('请您填写站内信的送达用户');
            }
          }
          if (smsCheck) {
            if (!form.getFieldValue('Sms')) {
              message.warning('请您填写短信的送达用户');
            }
          }
          if (mailBoxCheck) {
            if (!form.getFieldValue('Email')) {
              message.warning('请您填写邮箱的送达用户');
            }
          }
          if (webhookCheck) {
            if (!form.getFieldValue('Webhook')) {
              message.warning('请您填写Webhook URL');
            }
          }
          setCurrent(current + 1);
        } else {
          setCurrent(current + 1);
        }
      })
      .catch(() => {
        return;
      });
  };

  const prev = () => {
    if (isCanary && current === 1) {
      message.info('拨测告警不支持修改监控指标');
      return;
    }
    setCurrent(current - 1);
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <Steps current={current}>
          {steps.map((item) => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Form form={form}>{steps[current].content}</Form>

        <StepsAction>
          {current > 0 && current !== steps.length - 1 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              {intl.formatMessage({ id: 'alarm.previousStep', defaultMessage: '上一步' })}
            </Button>
          )}
          {current < steps.length - 2 && (
            <Button type="primary" onClick={next}>
              {intl.formatMessage({ id: 'alarm.nextStep', defaultMessage: '下一步' })}
            </Button>
          )}
          {current === steps.length - 2 && (
            <Button type="primary" onClick={stepsDone}>
              {intl.formatMessage({ id: 'alarm.finish', defaultMessage: '完成' })}
            </Button>
          )}
        </StepsAction>
      </Card>
    </PageContainer>
  );
};

export default CreateAlarm;
