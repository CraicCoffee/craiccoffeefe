import { login } from '@/services/craicCoffee/authController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { FormattedMessage, history, useIntl, useLocation, useModel } from '@umijs/max';
import { Alert, Button, Checkbox, Form, Input, message, Tabs } from 'antd';
import type { AutoCompleteProps } from 'antd/es/auto-complete';
import queryString from 'query-string';
import React, { useState } from 'react';
import './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

export type LoginFormProps = {
  onSearch?: (value?: string) => void;
  onChange?: (value?: string) => void;
  onVisibleChange?: (b: boolean) => void;
  className?: string;
  placeholder?: string;
  options: AutoCompleteProps['options'];
  defaultVisible?: boolean;
  visible?: boolean;
  defaultValue?: string;
  value?: string;
};

const LoginFormV1: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.ResponseLoginBody>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const location = useLocation();

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {

      // 登录
      const msg = await login({ ...values, type });
      if (msg.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const query = queryString.parse(location.search);
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      console.error(error);
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { success, data: { type: loginType } = {} } = userLoginState;

  return (
    <Form
      style={{ width: 300 }}
      onFinish={async (values) => {
        await handleSubmit(values as API.LoginParams);
      }}
    >
      <Form.Item style={{ textAlign: 'center' }}>
        <img alt="logo" width="60%" src="/CraicCoffee.svg" />
      </Form.Item>
      <Tabs activeKey={type} onChange={setType}>
        <Tabs.TabPane
          key="account"
          tab={intl.formatMessage({
            id: 'pages.login.accountLogin.tab',
            defaultMessage: '账户密码登录',
          })}
        />
        <Tabs.TabPane
          disabled
          key="mobile"
          tab={intl.formatMessage({
            id: 'pages.login.phoneLogin.tab',
            defaultMessage: '手机号登录',
          })}
        />
      </Tabs>

      {!success && loginType === 'account' && (
        <LoginMessage
          content={intl.formatMessage({
            id: 'pages.login.accountLogin.errorMessage',
            defaultMessage: '账户或密码错误(admin/ant.design)',
          })}
        />
      )}
      {type === 'account' && (
        <>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.username.required"
                    defaultMessage="请输入用户名!"
                  />
                ),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
              })}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.login.password.required"
                    defaultMessage="请输入密码！"
                  />
                ),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
              })}
            />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Form.Item name="remember" noStyle valuePropName="checked" initialValue={true}>
          <Checkbox name="autoLogin">
            <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
          </Checkbox>
        </Form.Item>
        <a style={{ float: 'right' }}>
          <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
        </a>
      </Form.Item>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginFormV1;
