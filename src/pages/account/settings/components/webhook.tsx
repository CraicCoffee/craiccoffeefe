import { QuestionCircleOutlined } from '@ant-design/icons';
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
import { useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';
import { Webhook } from '../data';
import { addWebhook, deleteWebhook, getAllWebhooks, updateWebhook } from '../service';

const Tip = styled.div`
  margin-top: 12px;
  color: #999;
`;

export default function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Omit<Webhook, 'id'>>(defaultEditData);
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);

  const [flag, setFlag] = useState({});

  const webhooks = useAsyncMemo(async () => {
    return await getAllWebhooks();
  }, [flag]);

  const columns: TableColumnsType<Webhook> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, webhook) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => {
              setEditData({
                name: webhook.name,
                url: webhook.url,
                payload: webhook.payload,
              });
              setCurrentEditingId(webhook.id);
              setIsModalOpen(true);
            }}
          >
            修改
          </Button>
          <Popconfirm
            title="确认要删除此密钥吗？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={async () => {
              await deleteWebhook(webhook.id);
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

  const isEditMode = currentEditingId !== null;

  return (
    <>
      <Table columns={columns} dataSource={webhooks} loading={!webhooks} pagination={false} />
      <Button
        type="primary"
        onClick={() => {
          setCurrentEditingId(null);
          setEditData(defaultEditData);
          setIsModalOpen(true);
        }}
        style={{
          marginTop: 16,
        }}
      >
        添加 Webhook
      </Button>
      <Modal
        open={isModalOpen}
        onOk={async () => {
          if (isEditMode) {
            await updateWebhook({
              ...editData,
              id: currentEditingId,
            });
          } else {
            await addWebhook(editData);
          }
          setFlag({});
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        okText={isEditMode ? '修改' : '添加'}
        closable={false}
      >
        <Row align="middle" gutter={[12, 16]}>
          <Col span={6}>名称</Col>
          <Col span={18}>
            <Input
              value={editData.name}
              onChange={(e) => {
                setEditData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
          </Col>
          <Col span={6}>URL</Col>
          <Col span={18}>
            <Input
              value={editData.url}
              onChange={(e) => {
                setEditData((prev) => ({
                  ...prev,
                  url: e.target.value,
                }));
              }}
            />
          </Col>
          <Col span={6}>Payload</Col>
          <Col span={18}>
            <Input.TextArea
              style={{
                fontFamily: 'monospace',
              }}
              rows={7}
              value={editData.payload}
              onChange={(e) => {
                setEditData((prev) => ({
                  ...prev,
                  payload: e.target.value,
                }));
              }}
            />
            <Tip>
              Payload 格式为 json，其中必须包含 <code>{'{{message}}'}</code> 魔法变量
            </Tip>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

const defaultEditData = {
  name: '',
  url: '',
  payload: '{\n  "msg_type": "text",\n  "content": {\n    "text": "{{message}}"\n  }\n}',
};
