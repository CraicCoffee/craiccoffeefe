import type { Plot } from '@ant-design/charts';
import { Area } from '@ant-design/charts';
import { useUnmount } from 'ahooks';
import { useRef, type FC } from 'react';
import type { WidgetPropsType } from './common';
import { createAxis, isSameUnit, tooltip, xAxis } from './common';

type Props = WidgetPropsType;

const AreaChartWidget: FC<Props> = ({
  dataSource,
  customConfig = null,
  hideUnit = false,
  onPlotReady,
  onPlotDestroy,
}) => {
  const defaultConfig = {
    data: dataSource,
    autoFit: true,
    xField: 'timestamp',
    yField: 'value',
    xAxis,
    seriesField: 'mid',
    smooth: false,
    interactions: [
      {
        type: 'brush-x',
        cfg: {
          showEnable: [
            { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
            { trigger: 'plot:mouseleave', action: 'cursor:default' },
            { trigger: 'reset-button:mouseenter', action: 'cursor:pointer' },
            { trigger: 'reset-button:mouseleave', action: 'cursor:crosshair' },
          ],
          start: [
            {
              trigger: 'plot:mousedown',
              action: ['brush-x:start', 'x-rect-mask:start', 'x-rect-mask:show'],
            },
          ],
          processing: [
            {
              trigger: 'plot:mousemove',
              action: ['x-rect-mask:resize'],
            },
          ],
          end: [
            {
              trigger: 'plot:mouseup',
              action: [
                'brush-x:filter',
                'brush-x:end',
                'x-rect-mask:end',
                'x-rect-mask:hide',
                'reset-button:show',
              ],
            },
          ],
          rollback: [
            {
              trigger: 'reset-button:click',
              action: ['brush-x:reset', 'reset-button:hide', 'cursor:crosshair'],
            },
          ],
        },
      },
    ],
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    tooltip,
  };

  // todo 抽离为公共方法
  let unit = '';
  if (hideUnit) {
    dataSource.forEach((item) => {
      item.unit = '';
    });
  } else {
    // 获取 dataSource 中的单位, dataSource 中的单位不一致时，不显示单位
    unit = isSameUnit(dataSource.map((item) => item.unit)) ? dataSource[0]?.unit : '';
  }
  const config = {
    ...defaultConfig,
    ...customConfig,
    yAxis: {
      ...createAxis({
        unit,
      }),
      ...customConfig?.yAxis,
    },
  };

  const plotRef = useRef<Plot<any>>();

  useUnmount(() => {
    if (!plotRef.current) return;
    onPlotDestroy?.(plotRef.current);
  });

  return (
    <Area
      {...config}
      onReady={(plot) => {
        plotRef.current = plot;
        onPlotReady?.(plot);
        plot.container.addEventListener('mouseleave', () => {
          plot.chart.hideTooltip();
        });
      }}
    />
  );
};

export default AreaChartWidget;
