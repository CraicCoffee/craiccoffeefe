import type { Plot } from '@ant-design/charts';
import { Column } from '@ant-design/charts';
import { useUnmount } from 'ahooks';
import moment from 'moment';
import { useRef, type FC } from 'react';
import type { WidgetPropsType } from './common';
import { createAxis, createTooltip, isSameUnit, xAxis } from './common';

type Props = WidgetPropsType;

const ColumnChartWidget: FC<Props> = ({
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
    seriesField: 'mid',
    xAxis: {
      label: {
        ...xAxis.label,
        autoRotate: false,
      },
    },
    smooth: false,
    legend: {
      position: 'bottom',
    },
    tooltip: createTooltip({
      showCrosshairs: true,
    }),
    slider: {
      start: 0,
      end: 1,
      formatter: (v) => moment(v).format('MM-DD HH:mm:ss'),
    },
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
    <Column
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

export default ColumnChartWidget;
