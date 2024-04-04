import { AutomaticAvatar } from '@/components/automatic-avatar';
import { useModel } from '@umijs/max';
import { Button, Cascader, Form, Input, message, Select, Skeleton } from 'antd';
import React from 'react';
import options from '../geographic/cascaderAddressOptions';

import styles from './BaseView.less';

const BaseView: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  if (!initialState) return <Skeleton />;

  const { currentUser } = initialState;
  if (!currentUser) return <Skeleton />;

  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <Form layout="horizontal" onFinish={handleFinish}>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入您的邮箱!' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="name"
            label="昵称"
            rules={[{ required: true, message: '请输入您的昵称!' }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="profile"
            label="个人简介"
            rules={[{ required: true, message: '请输入个人简介!' }]}
          >
            <Input.TextArea placeholder="个人简介" />
          </Form.Item>
          <Form.Item
            name="country"
            label="国家/地区"
            rules={[{ required: true, message: '请输入您的国家或地区!' }]}
          >
            <Select options={[{ label: '中国', value: 'China' }]} allowClear />
          </Form.Item>
          <Form.Item
            name="province"
            label="所在省市"
            rules={[{ required: true, message: '请选择!' }]}
          >
            <Cascader options={options} showSearch placeholder="请选择地址" />
          </Form.Item>
          <Form.Item
            name="address"
            label="街道地址"
            rules={[{ required: true, message: '请输入地址！' }]}
          >
            <Input.TextArea placeholder="街道地址" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话！' }]}
          >
            <Input placeholder="联系电话" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.right}>
        <AutomaticAvatar user={currentUser} size={64} />
        <div>{currentUser.name}</div>
      </div>
    </div>
  );
};

export default BaseView;
