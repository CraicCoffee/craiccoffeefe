import { checkName } from '@/pages/alarm/service';
import { useIntl } from '@umijs/max';
import { Form, Input } from 'antd';
import React from 'react';

const AlarmNameInput: React.FC<{
  oldName?: string;
  initialValue?: string;
}> = ({ oldName, initialValue }) => {
  const intl = useIntl();

  const checkUniqueAlarmName = async (_: any, value: string) => {
    if (oldName && oldName === value) {
      return Promise.resolve();
    }
    return await checkName({ description: value })
      .then(() => {
        return Promise.resolve();
      })
      .catch((err) => {
        const msg = err?.response?.data?.errorMessage || '网络错误';
        return Promise.reject(new Error(msg));
      });
  };

  return (
    <Form.Item
      label={intl.formatMessage({ id: 'alarm.alarmName', defaultMessage: '告警名称' })}
      name="description"
      rules={[
        {
          required: true,
          message: intl.formatMessage({
            id: 'alarm.enterAlarmName',
            defaultMessage: '请输入告警名称',
          }),
        },
        {
          validator: checkUniqueAlarmName,
          validateTrigger: 'onBlur',
        },
      ]}
      initialValue={initialValue}
    >
      <Input
        placeholder={intl.formatMessage({
          id: 'alarm.enterAlarmName',
          defaultMessage: '请输入告警名称',
        })}
      />
    </Form.Item>
  );
};

export default AlarmNameInput;
