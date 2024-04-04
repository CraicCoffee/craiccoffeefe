import { AlarmAnalysisCard } from '@/copilot/components/alarm-analysis-card';
import { AlertMessage } from '@/copilot/components/alert-message';
import { alarmHistoryAnalysis } from '@/pages/alarm/detail/service';
import { Modal } from 'antd';
import { FC, useState } from 'react';

type Props = {
  history: any;
};

export const AlarmHistoryAIModal: FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { history } = props;
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [analysisResultVisable, setAnalysisResultVisable] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const showModal = () => {
    setIsModalOpen(true);
    fetchAnalysisResult();
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchAnalysisResult = async () => {
    setLoading(true);
    setClicked(true);
    setAnalysisResultVisable(true);
    try {
      const response = await alarmHistoryAnalysis(history);
      setAnalysisResult(response);
      setLoading(false);
      setClicked(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
      setClicked(false);
    }
  };

  return (
    <>
      <a type="primary" onClick={showModal}>
        AI分析
      </a>

      <Modal
        title="异常历史智能分析"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {analysisResult && !analysisResult.success && (
          <AlertMessage analysisResult={analysisResult.content} />
        )}
        {analysisResultVisable && (
          <AlarmAnalysisCard analysisResult={analysisResult.content} loading={loading} />
        )}
      </Modal>
    </>
  );
};
