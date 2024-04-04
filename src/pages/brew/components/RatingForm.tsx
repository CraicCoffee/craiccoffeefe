// RatingForm.js
import React from 'react';
import { Form, InputNumber, Button } from 'antd';

const RatingForm = ({ brewId, onRatingSubmit }) => {
  // 表单项布局
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const formTailLayout = {
    wrapperCol: { span: 16, offset: 8 },
  };

  return (
    <Form {...formItemLayout} onFinish={onRatingSubmit}>
      {/* 隐藏的 brew 字段 */}
      <Form.Item
        name="brewId"
        initialValue={brewId} // 假设你已经有了 brewId
      >
        {/*<input type="hidden" />*/}
      </Form.Item>
      {brewId}
      {/* 酸质量 */}
      <Form.Item
        label="Acidity Quality"
        name="acidityQuality"
        rules={[{ required: true, message: 'Please input acidity quality!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 甜度质量 */}
      <Form.Item
        label="Sweetness Quality"
        name="sweetnessQuality"
        rules={[{ required: true, message: 'Please input sweetness quality!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 风味质量 */}
      <Form.Item
        label="Flavor Quality"
        name="flavorQuality"
        rules={[{ required: true, message: 'Please input flavor quality!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 酸度强度 */}
      <Form.Item
        label="Acidity Intensity"
        name="acidityIntensity"
        rules={[{ required: true, message: 'Please input acidity intensity!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 甜度强度 */}
      <Form.Item
        label="Sweetness Intensity"
        name="sweetnessIntensity"
        rules={[{ required: true, message: 'Please input sweetness intensity!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 苦味强度 */}
      <Form.Item
        label="Bitterness Intensity"
        name="bitternessIntensity"
        rules={[{ required: true, message: 'Please input bitterness intensity!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 风味强度 */}
      <Form.Item
        label="Flavor Intensity"
        name="flavorIntensity"
        rules={[{ required: true, message: 'Please input flavor intensity!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 口感 */}
      <Form.Item
        label="Mouthfeel"
        name="mouthfeel"
        rules={[{ required: true, message: 'Please input mouthfeel!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 余味 */}
      <Form.Item
        label="Aftertaste"
        name="aftertaste"
        rules={[{ required: true, message: 'Please input aftertaste!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 丰富度 */}
      <Form.Item
        label="Richness"
        name="richness"
        rules={[{ required: true, message: 'Please input richness!' }]}
      >
        <InputNumber min={1} max={5} />
      </Form.Item>

      {/* 提交按钮 */}
      <Form.Item {...formTailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RatingForm;
