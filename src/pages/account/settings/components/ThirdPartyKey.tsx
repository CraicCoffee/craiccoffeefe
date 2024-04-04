import { EyeInvisibleOutlined, EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
import { FC, PropsWithChildren, useState } from 'react';
import { useAsyncMemo } from 'use-async-memo';
import { ThirdPartyKey } from '../data';
import {
  addThirdPartyKey,
  deleteThirdPartyKey,
  getAllThirdPartyKeys,
  updateThirdPartyKey,
} from '../service';

const SecretContent: FC<PropsWithChildren<{}>> = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <span style={{ marginRight: 12 }}>{visible ? props.children : '********'}</span>
      <a
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      </a>
    </>
  );
};

export default function () {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [value, setValue] = useState('');
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);

  const [flag, setFlag] = useState({});

  const thirdPartyKeys = useAsyncMemo(async () => {
    const response = await getAllThirdPartyKeys();
    return response.data;
  }, [flag]);

  const columns: TableColumnsType<ThirdPartyKey> = [
    {
      title: '平台',
      dataIndex: 'platformName',
      key: 'platformName',
    },
    {
      title: 'Key',
      dataIndex: 'value',
      key: 'value',
      render: (text) => <SecretContent>{text}</SecretContent>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, thirdPartyKey) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setValue(thirdPartyKey.value);
              setCurrentEditingId(thirdPartyKey.id);
            }}
          >
            修改
          </Button>
          <Popconfirm
            title="确认要删除此密钥吗？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={async () => {
              await deleteThirdPartyKey(thirdPartyKey.id);
              setFlag({});
            }}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={thirdPartyKeys}
        loading={!thirdPartyKeys}
        pagination={false}
      />
      <Button
        type="primary"
        onClick={() => {
          setPlatformName('');
          setValue('');
          setIsAddModalOpen(true);
        }}
        style={{
          marginTop: 16,
        }}
      >
        添加新密钥
      </Button>
      <Modal
        open={isAddModalOpen}
        onOk={async () => {
          await addThirdPartyKey({
            platformName,
            value,
          });
          setFlag({});
          setIsAddModalOpen(false);
        }}
        onCancel={() => setIsAddModalOpen(false)}
        okText="添加"
        closable={false}
      >
        <Row align="middle" gutter={[12, 16]}>
          <Col span={6}>平台</Col>
          <Col span={18}>
            <Select
              style={{ width: '100%' }}
              value={platformName}
              onChange={(v) => setPlatformName(v)}
            >
              <Select.Option value="AWS">AWS</Select.Option>
              <Select.Option value="GOOGLE_CLOUD">Google Cloud</Select.Option>
              <Select.Option value="AZURE">Azure</Select.Option>
              <Select.Option value="ALIYUN">阿里云</Select.Option>
              <Select.Option value="TENCENT_CLOUD">腾讯云</Select.Option>
            </Select>
          </Col>
          <Col span={6}>密钥</Col>
          <Col span={18}>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Col>
        </Row>
      </Modal>
      <Modal
        open={currentEditingId != null}
        onOk={async () => {
          if (currentEditingId == null) return;
          await updateThirdPartyKey(currentEditingId, {
            value,
          });
          setFlag({});
          setCurrentEditingId(null);
        }}
        onCancel={() => setCurrentEditingId(null)}
        okText="修改"
        closable={false}
      >
        <Row align="middle" gutter={[12, 16]}>
          <Col span={6}>密钥</Col>
          <Col span={18}>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
}
