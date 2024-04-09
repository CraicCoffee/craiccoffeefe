import React, { useEffect, useState } from 'react';
import { TreeSelect, Button, Card, Form, Spin, Alert } from 'antd';
import axios from 'axios';

const FlavorProfileForm = ({ flavorProfile, onCancel, onSubmit }) => {
  const [treeData, setTreeData] = useState([]);
  const [formValues, setFormValues] = useState({
    highTempDescriptors: [],
    midTempDescriptors: [],
    lowTempDescriptors: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/flavor-descriptor/flavors')
      .then(response => {
        const flavors = response.data;
        // 如果flavors是undefined，或者不是数组，设置一个空数组
        if (!Array.isArray(flavors)) {
          throw new Error('Flavors data is not an array');
        }
        const formattedTreeData = flavors.map(category => {
          // 确保category.subcategories存在且是数组，否则设置为一个空数组
          const subcategories = Array.isArray(category.subcategories) ? category.subcategories : [];
          return {
            title: category.category,
            value: category.category,
            key: category.category,
            // 使用map前对subcategories做检查
            children: subcategories.map(sub => ({
              title: sub.category,
              value: sub.category,
              key: `${category.category}-${sub.category}`,
              // 确保sub.descriptors存在且是数组，否则设置为一个空数组
              children: Array.isArray(sub.descriptors) ? sub.descriptors.map(descriptor => ({
                title: descriptor.name,
                value: descriptor.name,
                key: `${category.category}-${sub.category}-${descriptor.name}`
              })) : []
            }))
          };
        });
        setTreeData(formattedTreeData);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleChange = (field, value) => {
    setFormValues(prevValues => ({ ...prevValues, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formValues);
  };

  return (
    <Card bordered={false}>
      {error && <Alert message="Error" description={error.message || 'Error fetching flavor descriptors'} type="error" showIcon />}
      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={handleSave}>
          <Form.Item label="High Temperature:">
            <TreeSelect
              treeData={treeData}
              value={formValues.highTempDescriptors}
              onChange={value => handleChange('highTempDescriptors', value)}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Please select"
              style={{ width: '100%' }}
              showSearch
            />
          </Form.Item>
          <Form.Item label="Mid Temperature:">
            <TreeSelect
              treeData={treeData}
              value={formValues.midTempDescriptors}
              onChange={value => handleChange('midTempDescriptors', value)}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Please select"
              style={{ width: '100%' }}
              showSearch
            />
          </Form.Item>
          <Form.Item label="Low Temperature:">
            <TreeSelect
              treeData={treeData}
              value={formValues.lowTempDescriptors}
              onChange={value => handleChange('lowTempDescriptors', value)}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Please select"
              style={{ width: '100%' }}
              showSearch
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default FlavorProfileForm;
