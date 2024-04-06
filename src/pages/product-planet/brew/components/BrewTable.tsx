import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {message, Popconfirm, Spin, Table} from 'antd';
import axios from "axios";
import {DeleteOutlined} from '@ant-design/icons';

const BrewTable = ({brews, setBrews}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deleteBrew = async (id, event) => {
    // Stop propagation to prevent row click
    event.stopPropagation();

    setLoading(true);
    try {
      const response = await axios.delete(`/api/brew/${id}`);
      if (response.status === 200) {
        setBrews(prevBrews => prevBrews.filter(brew => brew._id !== id));
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除失败: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    {
      title: '冲煮记录名称',
      dataIndex: ['json', 'cupFactory'],
      key: 'cupFactory',
      width: '20%',
    },
    {
      title: '日期',
      dataIndex: 'id',
      key: 'date',
      render: (id) => {
        const date = new Date(id);
        return date.toLocaleDateString("en-US");
      },
      sorter: (a, b) => new Date(a.id) - new Date(b.id),
      width: '20%',
    },
    {
      title: '豆种',
      dataIndex: ['json', 'singleBean', 'name'],
      key: 'beanName',
      width: '20%',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="确定删除这条记录吗？"
          onConfirm={(e) => deleteBrew(record._id, e)}
          onCancel={(e) => {
            // Prevent click from propagating and triggering row click
            e.stopPropagation();
          }}
        >
          <a
            onClick={(e) => {
              // Prevent default link behavior and stop propagation
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DeleteOutlined />
          </a>
        </Popconfirm>
      ),
      width: '10%',
    },
    // ...其他数据列定义
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={brews}
        onRow={(record) => ({
          onClick: () => {
            if (!loading) { // 当不在加载状态时才允许跳转
              navigate(`/product-planet/brew/${record._id}`);
            }
          },
        })}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </Spin>
  );
};

export default BrewTable;
