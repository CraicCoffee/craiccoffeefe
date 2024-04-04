import AlarmNameInput from '@/components/alarm-name-input';
import type { AlarmRule } from '@/components/alarm-rule';
import AlarmRuleComponent, {
  convertAlarmRules,
  convertToAlarmRules,
  convertToRequestAlarmRules,
} from '@/components/alarm-rule';
import InfiniteScrollSelect from '@/components/infinite-scroll-select';
import { PageContainer } from '@/components/page-container';
import { getAllWebhooks } from '@/pages/account/settings/service';
import {
  addAlarmComposite,
  getAlarmComposite,
  listAlarms,
  searchAlarms,
  updateAlarmComposite,
} from '@/pages/alarm/service';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { history, Link, useIntl } from '@umijs/max';
import { useCountDown, useRequest } from 'ahooks';
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
  Result,
  Select,
  Steps,
} from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { editReceiversData } from '../../utils';
import styles from '../style.less';

const { Panel } = Collapse;

const StepsAction = styled.div`
  margin: 10px 0;
`;

const Container = styled.div`
  > div {
    margin: 20px 0;
  }
`;

const FlexContainer = styled.div`
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
    margin: 20px 0;
  }
`;

const AlarmSearchSelect = styled.div`
  display: flex;
  > .ant-select {
    flex-grow: 1;
    min-width: 0px;
    margin-right: 10px;
  }
  > button {
    flex-grow: 0;
  }
`;

const CreateAlarm: React.FC<Record<string, any>> = () => {
  const intl = useIntl();

  const [current, setCurrent] = useState(0);
  const [selectedAlarm, setSelectedAlarm] = useState<DefaultOptionType>();
  const [alarmRules, setAlarmRules] = useState<AlarmRule[]>([]);
  const [alarmRulesStr, setAlarmRulesStr] = useState<string>('');

  const [insideMailCheck, setInsideMailCheck] = useState<boolean>(false);
  const [smsCheck, setSmsCheck] = useState<boolean>(false);
  const [mailBoxCheck, setMailBoxCheck] = useState<boolean>(false);
  const [webhookCheck, setWebhookCheck] = useState<boolean>(false);
  const [addContactShow, setAddContactShow] = useState(false);
  const [count, setCount] = useState<number>();
  const [countDown] = useCountDown({
    targetDate: count,
    onEnd: () => {},
  });
  const [addContactForm] = Form.useForm();
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>('');

  const { run: NewAlarms } = useRequest(addAlarmComposite, {
    manual: true,
    onSuccess: (result: any) => {
      localStorage.setItem('UUID', result.data.uuid);
      setCurrent(4);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.errorMessage;
      message.error(msg || '创建复合告警失败');
    },
  });

  const { run: getEditAlarmData } = useRequest(getAlarmComposite, {
    manual: true,
    onSuccess: (result: any) => {
      if (result.success) {
        const { data } = result;
        const tempAlarmRules = convertToAlarmRules(data.alarmRules);
        let str = '';
        tempAlarmRules.forEach((rule) => {
          const leftParenthesis = rule.parentheses?.startsWith('(');
          const rightParenthesis = rule.parentheses?.startsWith(')');
          str += `${leftParenthesis ? rule.parentheses : ''}${rule.stateValue}("${
            rule.alarmName
          }")${rightParenthesis ? rule.parentheses : ''} ${rule.operator ? rule.operator : ''}\n`;
        });
        str = str.trim();
        setAlarmRulesStr(str);
        setDescription(data.description);
        form.setFieldsValue({
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

  const { run: editAlarm } = useRequest(updateAlarmComposite, {
    manual: true,
    onSuccess: () => {
      setCurrent(4);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.errorMessage;
      message.error(msg || '更新复合告警失败');
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
                if (sessionStorage.getItem('EDITUUID')) {
                  const editUuid = sessionStorage.getItem('EDITUUID');
                  history.push(`/alarm/detail/${editUuid}?type=composite`);
                } else {
                  const uuid = localStorage.getItem('UUID');
                  history.push(`/alarm/detail/${uuid}?type=composite`);
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

  useEffect(() => {
    if (sessionStorage.getItem('EDITUUID')) {
      getEditAlarmData({ uuid: sessionStorage.getItem('EDITUUID')! });
    }
    return () => {
      sessionStorage.removeItem('EDITUUID');
      localStorage.removeItem('UUID');
    };
  }, [getEditAlarmData]);

  /**
   * 下拉搜索 alarms
   */
  const handleSearchAlarms = async (value: string, page = 1) => {
    const { data: dataWithPage } = await searchAlarms({
      query: value,
      currentPage: page,
    });
    const data = dataWithPage?.data || [];
    // console.log(data);
    const options = data?.map((item) => ({
      label: item.description,
      value: item.uuid,
    }));
    return {
      data: options,
      hasNext: data.length !== 0,
    };
  };

  const fetchData = async (page = 1) => {
    const { data } = await listAlarms({
      currentPage: page,
      size: 10,
    });

    const items = data?.data || [];
    const options = items?.map((item: any) => ({
      label: item.description,
      value: item.uuid,
    }));
    return {
      data: options,
      hasNext: items.length !== 0,
    };
  };

  const handleChangeAlarmRule = (newAlarmRules: string) => {
    setAlarmRulesStr(newAlarmRules);
    convertAlarmRules(newAlarmRules).then((rules) => {
      // console.log(rules)
      setAlarmRules(rules);
    });
  };

  // evaluationPeriods 改变时，同步设置 dataPointsToAlarm
  const evaluationPeriods = Form.useWatch('evaluationPeriods', form);
  useEffect(() => {
    if (evaluationPeriods) {
      form?.setFieldsValue({
        dataPointsToAlarm: evaluationPeriods,
      });
    }
  }, [evaluationPeriods, form]);

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

  const sendCode = async () => {
    addContactForm.validateFields(['phoneNumber']).then(() => {
      const phoneList = form.getFieldValue('Sms');
      const modalPhoneInput = addContactForm.getFieldValue('phoneNumber');
      if (phoneList) {
        if (phoneList.some((item: string) => item === modalPhoneInput)) {
          message.error('您已经填写过相同手机号了');
        } else {
          setCount(Date.now() + 60000);
        }
      } else {
        setCount(Date.now() + 60000);
      }
    });
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

    const paramAlarmRules = convertToRequestAlarmRules(alarmRules);

    const params: API.AddAlarmCompositeRequest = {
      description: formData.description,
      alarmRules: paramAlarmRules,
      receivers: receiversArr,
    };

    if (sessionStorage.getItem('EDITUUID')) {
      editAlarm(
        {
          uuid: sessionStorage.getItem('EDITUUID')!,
        },
        params,
      );
    } else {
      NewAlarms(params);
    }
  };

  // TODO: 每个步骤抽成一个组件，暂时先不做
  const steps = [
    {
      title: intl.formatMessage({ id: 'alarmComposite.oneStep', defaultMessage: '设置告警条件' }),
      content: (
        <Container>
          <div>
            请选择至少2个告警，并在右侧编辑器中使用 AND/OR/AND NOT 进行告警条件的规则表达式配置
          </div>
          <AlarmSearchSelect>
            <InfiniteScrollSelect
              value={selectedAlarm}
              fetchData={fetchData}
              searchData={handleSearchAlarms}
              placeholder="请输入告警名称搜索"
              onChange={(_, option) => {
                setSelectedAlarm(option as DefaultOptionType);
              }}
            />
            <Button
              type="primary"
              size="small"
              disabled={!selectedAlarm}
              onClick={() => {
                if (!selectedAlarm) {
                  return;
                }
                const oldDescription = form.getFieldValue('description');
                if (oldDescription && oldDescription === selectedAlarm?.label) {
                  message.error('请勿使用告警自身');
                  return;
                }
                const length = alarmRules.length;
                if (length > 0) {
                  // 检查是否重复
                  for (const rule of alarmRules) {
                    if (rule.alarmName === selectedAlarm?.label) {
                      message.error('请勿使用重复的告警');
                      return;
                    }
                  }
                  if (!alarmRules[length - 1].operator) {
                    alarmRules[length - 1].operator = 'AND';
                  }
                }
                if (alarmRulesStr.trim() === '') {
                  setAlarmRulesStr(`ALARM("${selectedAlarm.label}")`);
                } else {
                  setAlarmRulesStr(alarmRulesStr + ` AND \nALARM("${selectedAlarm.label}")`);
                }
                setSelectedAlarm(undefined);
              }}
            >
              确认添加
            </Button>
          </AlarmSearchSelect>
          <AlarmRuleComponent alarmRules={alarmRulesStr} onChange={handleChangeAlarmRule} />
        </Container>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'alarmComposite.setAlarmInfo',
        defaultMessage: '设置告警信息',
      }),
      content: (
        <FlexContainer>
          <AlarmRuleComponent alarmRules={alarmRules} readonly />
          <div>
            <Collapse defaultActiveKey={['1']} destroyInactivePanel={false}>
              <Panel key="1" header="告警名称设置" forceRender>
                <AlarmNameInput
                  oldName={description}
                  initialValue={`复合告警_${moment(new Date()).format('YYYYMMDD')}`}
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
                      defaultMessage: '',
                    })}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
          </div>
        </FlexContainer>
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
          </Descriptions>
          <AlarmRuleComponent alarmRules={alarmRules} readonly hideTitle />
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
              history.push(`/alarm/create/composite`);
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
          const tempAlarmRules = convertAlarmRules(alarmRulesStr);
          tempAlarmRules
            .then((rules) => {
              console.log(rules);

              if (rules.length < 2) {
                message.warning('请选择至少 2 个告警');
                return;
              }
              if (rules.length > 10) {
                message.warning('告警数不能超过 10 个');
                return;
              }
              setAlarmRules(rules);
              setCurrent(current + 1);
            })
            .catch((err) => {
              message.error(err);
              return;
            });
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
