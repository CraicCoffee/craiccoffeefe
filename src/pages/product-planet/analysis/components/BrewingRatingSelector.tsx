import React, { useEffect, useState } from 'react';
import { Table, Checkbox } from 'antd';

const BrewingRatingSelector = ({ brewings, onSelectedBrewingsChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 处理选择变化
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelectedBrewingsChange(newSelectedRowKeys);
  };

  // 去重逻辑
  const uniqueBrewings = brewings.reduce((unique, brewing) => {
    if (!unique.some(item => item.key === brewing.brew)) {
      unique.push({
        key: brewing.brew,
        name: brewing._id,
        // ... 其他你可能需要显示的字段
      });
    }
    return unique;
  }, []);

  // 表格列的配置描述
  const columns = [
    {
      title: 'Brewing Name',
      dataIndex: 'name',
      // render: text => <a>{text}</a>, // 如果需要渲染为链接
    },
    // ... 其他你可能需要的列配置
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (uniqueBrewings.length === 0) {
    return <p>No brewings available.</p>;
  }

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={uniqueBrewings}
      pagination={false} // 如果不需要分页可以设置为false
    />
  );
};

export default BrewingRatingSelector;
