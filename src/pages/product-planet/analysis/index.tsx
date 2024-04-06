import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BrewingRatingSelector from "@/pages/product-planet/analysis/components/BrewingRatingSelector";
import RatingChartAndTableAnalysis from "@/pages/product-planet/analysis/components/RatingChartAndTableAnalysis";

const BrewAnalysisPage = () => {
  const [brewData, setBrewData] = useState([]); // 用于存储从API获取的所有brew数据
  const [selectedBrewIds, setSelectedBrewIds] = useState([]); // 更新为数组，因为用户可能选择多个
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取所有的评分数据
  useEffect(() => {
    const getRatingDataForBrew = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/brew-ratings');
        setBrewData(response.data);
        setError(null);
      } catch (error) {
        console.error('There has been a problem with your axios operation:', error);
        setError('Failed to fetch rating data');
      } finally {
        setIsLoading(false);
      }
    };

    getRatingDataForBrew();
  }, []);

  // 处理酿造选择器变化的函数
  const handleBrewingSelectionChange = (selectedBrewIds) => {
    setSelectedBrewIds(selectedBrewIds);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <BrewingRatingSelector
          brewings={brewData}
          onSelectedBrewingsChange={handleBrewingSelectionChange}
        />
      </div>
      <div style={{ flex: 4 }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <RatingChartAndTableAnalysis brewIds={selectedBrewIds} />
        )}
      </div>
    </div>
  );
};

export default BrewAnalysisPage;
