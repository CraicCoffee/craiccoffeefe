import { Link } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';
import type { RouteChildrenProps } from 'react-router';

import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        <span>查看邮箱</span>
      </Button>
    </a>
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

export type LocationState = {
    account: string;
};
const RegisterResult: React.FC<RouteChildrenProps> = ({ location }) => {
    // 使用可选链操作符和非空断言操作符来确保访问的安全性
    const email = location?.state?.account ?? 'AntDesign@example.com';
    // todo: 跳转后location数据拿不到
    return (
        <Result
            className={styles.registerResult}
            status="success"
            title={
                <div className={styles.title}>
                    {/*<span>你的账户：{email} 注册成功</span>*/}
                    <span>注册成功</span>
                </div>
            }
            // subTitle="激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。"
            extra={actions}
        />
    );
};

export default RegisterResult;
