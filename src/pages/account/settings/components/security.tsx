import React, {useState} from 'react';
import {Form, Input, List, message, Modal} from 'antd';
import {changeCurrentUserPassword} from "@/services/insightMon/settingController";

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱 Weak</span>,
};

const SecurityView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
        .validateFields()
        .then(values => {
          // 在这里处理密码更新逻辑
          console.log('Received values of form: ', values);
          const { oldPassword, newPassword } = values;

          // 调用 changeCurrentUserPassword 函数来更新密码
          changeCurrentUserPassword(oldPassword, newPassword)
              .then(() => {
                // 密码更新成功
                setIsModalOpen(false);
                message.success('密码更新成功');
              })
              .catch(error => {
                // 密码更新失败
                console.error('Password update failed:', error);
                message.error('密码更新失败：' + error.message);
              });
        })
        .catch(info => {
          // 表单验证失败
          console.log('Validate Failed:', info);
          message.error('表单验证失败');
        });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const passwordStrength = {
    strong: <span className="strong">强</span>,
    medium: <span className="medium">中</span>,
    weak: <span className="weak">弱</span>,
  };

  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify" onClick={showModal}>修改</a>],
    },
    // {
    //   title: '密保手机',
    //   description: `已绑定手机：138****8293`,
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: '密保问题',
    //   description: '未设置密保问题，密保问题可有效保护账户安全',
    //   actions: [<a key="Set">设置</a>],
    // },
    // {
    //   title: '备用邮箱',
    //   description: `已绑定邮箱：ant***sign.com`,
    //   actions: [<a key="Modify">修改</a>],
    // },
    // {
    //   title: 'MFA 设备',
    //   description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    //   actions: [<a key="bind">绑定</a>],
    // },
  ];

  const data = getData();

  return (
      <>
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <List.Item actions={item.actions}>
                  <List.Item.Meta title={item.title} description={item.description} />
                </List.Item>
            )}
        />
        <Modal
            title="修改密码"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
                name="oldPassword"
                rules={[{ required: true, message: '请输入原密码!' }]}
            >
              <Input.Password placeholder="原密码" />
            </Form.Item>
            <Form.Item
                name="newPassword"
                rules={[{ required: true, message: '请输入新密码!' }]}
            >
              <Input.Password placeholder="新密码" />
            </Form.Item>
            <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: '请确认新密码!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不匹配!'));
                    },
                  }),
                ]}
            >
              <Input.Password placeholder="确认新密码" />
            </Form.Item>
          </Form>
        </Modal>
      </>
  );
};

export default SecurityView;
