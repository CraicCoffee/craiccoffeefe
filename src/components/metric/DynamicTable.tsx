import type { Plot } from '@ant-design/charts';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { useUnmount } from 'ahooks';
import { useRef, type FC } from 'react';

type Props = {
  dataSource: any;
  customConfig?: any;
  onPlotReady?: (chart: Plot<any>) => void;
  onPlotDestory?: (chart: Plot<any>) => void;
};

const DynamicTable: FC<Props> = ({
  dataSource,
  customConfig = null,
  onPlotReady,
  onPlotDestory,
}) => {
  const plotRef = useRef<Plot<any>>();

  useUnmount(() => {
    if (!plotRef.current) return;
    onPlotDestory?.(plotRef.current);
  });

  const disableColor = '#CED4D9';
  const colors = ['#5BD8A6', '#5B8FF9', '#EEBC20', '#F46649', '#CED4D9'];

  function getIndex(fieldValue) {
    if (0 <= fieldValue && fieldValue < 0.1) {
      return 0;
    } else if (0.1 <= fieldValue && fieldValue < 0.6) {
      return 1;
    } else if (0.6 <= fieldValue && fieldValue < 0.8) {
      return 2;
    } else if (0.8 <= fieldValue && fieldValue < 1) {
      return 3;
    } else {
      return 4;
    }
  }

  function getDataConfig(rawData) {
    return {
      fields: {
        rows: ['name'],
        columns: ['time'],
        values: ['value'],
      },
      meta: [
        {
          field: 'name',
          name: '名称',
        },
        {
          field: 'time',
          name: '时间',
        },
        {
          field: 'value',
          name: '使用量',
          formatter: percentageFormatter(),
        },
      ],
      data: rawData,
    };
  }

  const percentageFormatter = () => (value) => {
    return `${(value * 100).toFixed(2)}` + '%';
  };

  function getOptions(rawData) {
    return {
      width: 800,
      height: 100,
      style: {
        layoutWidthType: 'compact',
      },
      interaction: {
        selectedCellsSpotlight: true,
        hoverHighlight: true,
      },
      conditions: {
        background: [
          {
            field: 'value',
            mapping(fieldValue) {
              const index = getIndex(fieldValue);
              return {
                fill: fieldValue ? colors[index] : disableColor,
              };
            },
          },
        ],
      },
    };
  }

  const MATRIC_TO_NAME = {
    'system.cpu.utilization': 'CPU利用率',
    'system.memory.utilization': '内存利用率',
    'system.filesystem.utilization': '文件系统利用率',
  };

  const RETENTION_TO_NAME = {
    day: '日',
    week: '周',
    month: '月',
  };

  return (
    <>
      <h3>{MATRIC_TO_NAME[dataSource['metric_name']]}详情</h3>
      <SheetComponent
        dataCfg={getDataConfig(dataSource['data'])}
        options={getOptions(dataSource['data'])}
        themeCfg={{ name: 'gray' }}
        sheetType="gridAnalysis"
      />
    </>
  );
};

export default DynamicTable;
