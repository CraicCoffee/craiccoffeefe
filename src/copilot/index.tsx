import { AlarmAnalysisCard } from '@/copilot/components/alarm-analysis-card';
import { AlertMessage } from '@/copilot/components/alert-message';
import { alarmAnalysis } from '@/pages/alarm/detail/service';
import { Button, Divider, Drawer } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const DrawerDragHandle = styled.div`
  position: absolute;
  top: 0;
  left: -1px;
  width: 2px;
  height: 100%;
  background-color: transparent;
  cursor: ew-resize;
  z-index: 1;

  &:hover,
  &.dragging {
    background-color: rgb(255, 169, 64, 0.5);
  }
`;

type Props = {
  anomaly: any;
  drawerWidth: number;
  setDrawerWidth: (width: number) => void;
};

export const Copilot: FC<Props> = (props) => {
  const { drawerWidth, setDrawerWidth, anomaly } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [analysisResultVisable, setAnalysisResultVisable] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [dragging, setDragging] = useState(false);

  const fetchAnalysisResult = async () => {
    setLoading(true);
    setClicked(true);
    setAnalysisResultVisable(true);
    try {
      const response = await alarmAnalysis(anomaly);
      setAnalysisResult(response);
      setLoading(false);
      setClicked(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
      setClicked(false);
    }
  };

  const showDrawer = () => {
    setDrawerWidth(400);
    setOpen(true);
  };
  const onClose = () => {
    setDrawerWidth(0);
    setOpen(false);
  };

  // 拖拽抽屉
  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const startX = e.clientX;
    const startWidth = drawerWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth - (e.clientX - startX);
      setDrawerWidth(newWidth);
    };

    const onMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
      <Button style={{ backgroundColor: '#ffa940' }} onClick={showDrawer}>
        <strong>洞悉Copilot</strong>
      </Button>
      <Drawer
        title="InsightMon Copilot 智能分析助手"
        placement="right"
        onClose={onClose}
        open={open}
        closable={true}
        width={drawerWidth}
        forceRender={true}
        mask={false}
        push={{ distance: '180' }}
      >
        <DrawerDragHandle className={dragging ? 'dragging' : ''} onMouseDown={onMouseDown} />
        <Button style={{ borderColor: '#ffa940' }} onClick={fetchAnalysisResult} disabled={clicked}>
          <strong>智能分析</strong>
        </Button>

        <Divider />
        {analysisResult && !analysisResult.success && (
          <AlertMessage analysisResult={analysisResult.content} />
        )}
        {analysisResultVisable && (
          <AlarmAnalysisCard analysisResult={analysisResult.content} loading={loading} />
        )}
      </Drawer>
    </>
  );
};
export default Copilot;
