import React from 'react';
import { Button, Card, Tag, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const FlavorProfileView = ({ flavorProfile, onEdit }) => {
  // 自定义颜色函数，可以根据需要进行调整
  const getBorderColor = (type) => {
    switch (type) {
      case 'highTemp':
        return '#ff4d4f'; // 红色边框颜色
      case 'midTemp':
        return '#faad14'; // 橙色边框颜色
      case 'lowTemp':
        return '#52c41a'; // 绿色边框颜色
      default:
        return '#d9d9d9'; // 默认边框颜色
    }
  };

  return (
    <Card
      actions={[
        <Button onClick={onEdit} type="primary" icon={<EditOutlined />}>
          Edit
        </Button>,
      ]}
    >
      <div>
        <strong>高温段:</strong>
        <Divider />
        {flavorProfile.highTempDescriptors.map(tag => (
          <Tag key={tag} style={{ border: `1px solid ${getBorderColor('highTemp')}` }}>
            {tag}
          </Tag>
        ))}
      </div>
      <Divider dashed />
      <div>
        <strong>中温段:</strong>
        <Divider />
        {flavorProfile.midTempDescriptors.map(tag => (
          <Tag key={tag} style={{ border: `1px solid ${getBorderColor('midTemp')}` }}>
            {tag}
          </Tag>
        ))}
      </div>
      <Divider dashed />
      <div>
        <strong>低温段:</strong>
        <Divider />
        {flavorProfile.lowTempDescriptors.map(tag => (
          <Tag key={tag} style={{ border: `1px solid ${getBorderColor('lowTemp')}` }}>
            {tag}
          </Tag>
        ))}
      </div>
    </Card>
  );
};

export default FlavorProfileView;
