import React, {useEffect, useState} from 'react';
import { Select, Button, Card, Row, Col, Form, Space } from 'antd';
import axios from "axios";

const { Option } = Select;

const FlavorProfileForm = ({ flavorProfile, onCancel, onSubmit }) => {
  const [formValues, setFormValues] = useState({
    highTempDescriptors: flavorProfile?.highTempDescriptors || [],
    midTempDescriptors: flavorProfile?.midTempDescriptors || [],
    lowTempDescriptors: flavorProfile?.lowTempDescriptors || []
  });

  const handleChange = (name, value) => {
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSave = () => {
    onSubmit(formValues);
  };

  const [descriptors, setDescriptors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 获取描述词
  useEffect(() => {
    axios.get('/api/flavor-descriptor/descriptors')
      .then(response => {
        setDescriptors(response.data);
      })
      .catch(error => {
        console.error("Error fetching descriptors:", error);
      });
  }, []);

  // 获取大类风味
  useEffect(() => {
    axios.get('/api/flavor-descriptor/flavor-categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching flavor categories:", error);
      });
  }, []);

  // 根据选定的大类获取细分风味及其描述词
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`/api/flavor-descriptor/flavors/${selectedCategory}`)
        .then(response => {
          // 在此处更新您的状态，可能需要根据具体的数据结构进行调整
          // 例如，如果您想设置一个特定的风味描述，可以这样：
          // setFlavorProfile(response.data);
        })
        .catch(error => {
          console.error(`Error fetching flavors for category ${selectedCategory}:`, error);
        });
    }
  }, [selectedCategory]);

  return (
    <Card bordered={false}>
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="高温段:">
          <Select
            mode="multiple"
            value={formValues.highTempDescriptors}
            onChange={(value) => handleChange('highTempDescriptors', value)}
          >
            {descriptors.map(descriptor => (
              <Option key={descriptor} value={descriptor}>{descriptor}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="中温段:">
          <Select
            mode="multiple"
            value={formValues.midTempDescriptors}
            onChange={(value) => handleChange('midTempDescriptors', value)}
          >
            {descriptors.map(descriptor => (
              <Option key={descriptor} value={descriptor}>{descriptor}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="低温段:">
          <Select
            mode="multiple"
            value={formValues.lowTempDescriptors}
            onChange={(value) => handleChange('lowTempDescriptors', value)}
          >
            {descriptors.map(descriptor => (
              <Option key={descriptor} value={descriptor}>{descriptor}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Row justify="end">
            <Space size="middle">
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </Space>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FlavorProfileForm;
