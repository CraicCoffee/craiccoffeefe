import { Chart as G2Chart } from '@antv/g2';
import { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { ElementComponent } from '.';
import { EmptyText } from '../editor-types';

export type ChartElement = {
  type: 'chart';
  children: [EmptyText];
};

export function createChartElement(): ChartElement {
  return {
    type: 'chart',
    children: [{ text: '' }],
  };
}

const Container = styled.div`
  border-radius: 4px;
  border: solid 1px var(--color-border);
  padding: 24px;
  margin: 1em 0;
`;

export const Chart: ElementComponent<ChartElement> = (props) => {
  const renderTargetRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const renderTarget = renderTargetRef.current;
    if (!renderTarget) return;
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ];

    // Step 1: 创建 Chart 对象
    const chart = new G2Chart({
      container: renderTarget, // 指定图表容器 ID
      height: 300, // 指定图表高度
      autoFit: true,
    });

    // Step 2: 载入数据源
    chart.data(data);

    // Step 3: 创建图形语法，绘制柱状图
    chart.interval().position('genre*sold');

    // Step 4: 渲染图表
    chart.render();
    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <Container {...props.attributes} contentEditable={false}>
      <div ref={renderTargetRef} />
      <div style={{ height: 0 }}>{props.children}</div>
    </Container>
  );
};
