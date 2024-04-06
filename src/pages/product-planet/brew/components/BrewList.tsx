// BrewList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from 'antd';
import JsonUpload from './JsonUpload'; // 确保路径正确
import BrewTable from './BrewTable'; // 确保路径正确
import request from 'umi-request';

const BrewList = () => {
  const [brews, setBrews] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await request('/api/brews');
      setBrews(response);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Card>
        <h1>冲煮信息</h1>
        {/* 将 fetchData 函数传递给 JsonUpload 组件 */}
        <JsonUpload onSuccess={fetchData} />
        <BrewTable brews={brews} setBrews={setBrews} />
      </Card>
    </div>
  );
};

export default BrewList;
