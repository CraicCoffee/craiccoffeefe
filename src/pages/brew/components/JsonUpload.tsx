import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const JsonUpload = ({ onSuccess }) => { // 接收 onSuccess prop
  const uploadProps = {
    name: 'file',
    action: 'http://localhost:5001/api/upload-json', // 这里应该是您的实际上传处理URL
    headers: {
      // 如果需要，这里应该是您的实际授权头
      'Content-Type': 'multipart/form-data', // 有些后端可能需要在此处设置这个header
      authorization: 'authorization-text',
    },
    beforeUpload: (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          try {
            JSON.parse(e.target.result);
            resolve(file); // 文件内容有效，继续上传
          } catch (error) {
            message.error('The file you selected is not a valid JSON content.');
            reject(); // 文件内容无效，取消上传
          }
        };
        fileReader.readAsText(file);
      });
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      const formData = new FormData();
      formData.append('jsonfile', file);
      try {
        const response = await axios.post(uploadProps.action, formData, {
          headers: uploadProps.headers,
        });
        if (response.status === 200) {
          onSuccess(response.data, file);
          message.success('Upload successful');
        } else {
          onError(new Error(`Upload failed: ${response.status} ${response.statusText}`));
        }
      } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Upload failed due to server error.';
        onError(new Error(errorMessage));
        message.error(errorMessage);
      }
    },
  };

  uploadProps.customRequest = async ({ file, onSuccess: onUploadSuccess, onError }) => {
    const formData = new FormData();
    formData.append('jsonfile', file);
    try {
      const response = await axios.post(uploadProps.action, formData, {
        headers: uploadProps.headers,
      });
      if (response.status === 200) {
        message.success('Upload successful');
        onUploadSuccess(response.data, file);
        if (onSuccess) {
          onSuccess(); // 调用传递进来的 onSuccess 函数刷新数据
        }
      } else {
        onError(new Error(`Upload failed: ${response.status} ${response.statusText}`));
      }
    } catch (error) {
      // ... 错误处理代码
    }
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Select File</Button>
    </Upload>
  );
};

export default JsonUpload;
