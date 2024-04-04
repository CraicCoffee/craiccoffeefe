import { InfiniteScrollContent } from '@/components/infinite-scroll-content';
import Tags from '@/components/Tags';
import {
  listMetricAggregated,
  listMetrics,
  wildcardSearchMetrics,
  wildcardSearchMetricsAggregated,
} from '@/services/insightMon/metricController';
import { generateUniqueKeyForMetric } from '@/utils/generate-unique-key-for-metric';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Alert, Input, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FC } from 'react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import styled from 'styled-components';
import type { MetricDataType } from '../data';

const { Search } = Input;

const TableContainer = styled.div`
  th.ant-table-selection-column {
    label {
      display: none;
    }
  }
`;

const SelectedTable = styled(Table)`
  .ant-table {
    background-color: unset;
  }
  .ant-table-thead,
  .ant-table-thead th {
    background-color: unset;
  }
`;

const excludeMetrics = ['CanarySuccess', 'CanaryResponseTime'];

export type SearchMetricsTableRef = {
  reset: () => void;
};

type Props = {
  selectedMetrics: MetricDataType[];
  onSelectedMetricsChange: (metrics: MetricDataType[]) => void;
  multiple?: boolean;
  useWindow?: boolean;
  showOverviewBar?: boolean;
  aggregated?: boolean;
} & React.RefAttributes<SearchMetricsTableRef>;

// TODO: 修改所有使用到这个组件的地方
const SearchMetricsTable: FC<Props> = forwardRef((props, ref) => {
  const multiple = props.multiple ?? true;
  const intl = useIntl();

  const columns: ColumnsType<MetricDataType> = [
    {
      title: intl.formatMessage({ id: 'browsingMetric.metricName', defaultMessage: '指标名称' }),
      dataIndex: 'name',
      key: 'name',
      width: 260,
      ellipsis: true,
      render: (text) => (
        <a aria-label={text} onClick={() => console.log(text)}>
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'browsingMetric.tags', defaultMessage: '标签' }),
      dataIndex: 'tags',
      key: 'tags',
      render: (_, item) => <Tags tags={item.tags} />,
    },
    // {
    //   title: intl.formatMessage({ id: 'browsingMetric.operation', defaultMessage: '操作' }),
    //   key: 'action',
    //   width: 150,
    //   render: (_, record) => {
    // const mid = record?.mid;
    // return (
    //   <Space size="middle">
    //     <Button type="link" onClick={() => toggleChartKey(mid)}>
    //       {chartKeys[mid] ? '隐藏' : '显示'}
    //     </Button>
    //   </Space>
    // );
    //   },
    // },
  ];

  const selectedColumns: ColumnsType<MetricDataType> = [
    {
      key: 'delete',
      width: 30,
      render: (_, record) => (
        <CloseCircleOutlined
          onClick={() => {
            props.onSelectedMetricsChange(
              props.selectedMetrics.filter(
                (selectedMetric) =>
                  generateUniqueKeyForMetric(selectedMetric) !== generateUniqueKeyForMetric(record),
              ),
            );
          }}
          style={{ color: 'gray', cursor: 'pointer' }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'browsingMetric.metricName', defaultMessage: '指标名称' }),
      dataIndex: 'name',
      key: 'name',
      width: 260,
      ellipsis: true,
      render: (text) => (
        <a aria-label={text} onClick={() => console.log(text)}>
          {text}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'browsingMetric.tags', defaultMessage: '标签' }),
      dataIndex: 'tags',
      key: 'tags',
      render: (_, item) => {
        return <Tags key={Math.random()} tags={item.tags} />;
      },
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [finalSearchText, setFinalSearchText] = useState('');

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSearchText('');
      setFinalSearchText('');
    },
  }));

  const selectedTable = () => {
    return (
      <>
        <div style={{ marginBottom: '4px' }}>已选择：{props.selectedMetrics.length}个指标</div>
        <SelectedTable
          columns={selectedColumns}
          dataSource={props.selectedMetrics}
          size="small"
          pagination={false}
          style={{
            maxHeight: '170px',
            overflowY: 'auto',
          }}
        />
      </>
    );
  };

  return (
    <>
      {props.showOverviewBar && (
        <Alert
          type={props.selectedMetrics.length > 0 ? 'info' : 'warning'}
          message={props.selectedMetrics.length > 0 ? selectedTable() : '未选择任何指标'}
          style={{
            marginBottom: 16,
          }}
        />
      )}
      <Search
        value={searchText}
        placeholder={intl.formatMessage({
          id: 'browsingMetric.search',
          defaultMessage: '"搜索监控指标"',
        })}
        onSearch={(v) => {
          setSearchText(v);
          setFinalSearchText(v);
        }}
        onInput={(e) => {
          setSearchText((e.target as HTMLInputElement).value);
        }}
        enterButton
        style={{ marginBottom: 16 }}
      />
      <InfiniteScrollContent<MetricDataType>
        key={finalSearchText}
        fetchPage={async (pageToken) => {
          let res = null;
          if (finalSearchText === '') {
            res =
              props.aggregated === true
                ? await listMetricAggregated({ pageToken })
                : await listMetrics({ pageToken });
          } else {
            res =
              props.aggregated === true
                ? await wildcardSearchMetricsAggregated({ query: finalSearchText, pageToken })
                : await wildcardSearchMetrics({ query: finalSearchText, pageToken });
          }
          const nextPageToken = res.data?.pageToken ?? '';
          // 过滤掉拨测的 Metric 数据
          const itemsOfFilter = (res.data?.data ?? []).filter(
            (el) => !excludeMetrics.includes(el.name as string),
          );
          let result: MetricDataType[] = [];
          if (props.aggregated) {
            result = (itemsOfFilter as API.MetricMetadataAggregated[]).map((el) => {
              const tags = [];
              for (const [key, valueArray] of Object.entries(el.tags ?? {})) {
                // Iterate through each value in the valueArray
                for (const value of valueArray) {
                  // Create a new object and push it into the outputArray
                  tags.push({ key: key, value: value });
                }
              }
              return {
                name: el.name,
                metadata: el.metadata,
                tags,
              } as MetricDataType;
            });
          } else {
            result = itemsOfFilter as MetricDataType[];
          }
          return {
            nextPageToken,
            items: result,
          };
        }}
        useWindow={props.useWindow}
      >
        {(metrics) => (
          <TableContainer>
            <Table<MetricDataType>
              rowKey={(metric) => generateUniqueKeyForMetric(metric)}
              rowSelection={{
                type: multiple ? 'checkbox' : 'radio',
                selectedRowKeys: props.selectedMetrics.map(generateUniqueKeyForMetric),
                onSelect: (metric, selected) => {
                  if (multiple) {
                    if (selected) {
                      props.onSelectedMetricsChange([...props.selectedMetrics, metric]);
                    } else {
                      props.onSelectedMetricsChange(
                        props.selectedMetrics.filter(
                          (selectedMetric) =>
                            generateUniqueKeyForMetric(selectedMetric) !==
                            generateUniqueKeyForMetric(metric),
                        ),
                      );
                    }
                  } else {
                    if (selected) {
                      props.onSelectedMetricsChange([metric]);
                    } else {
                      props.onSelectedMetricsChange([]);
                    }
                  }
                },
              }}
              columns={columns}
              dataSource={metrics}
              // style={{ flex: 'auto' }}
              pagination={false}
              size="small"
            />
          </TableContainer>
        )}
      </InfiniteScrollContent>
    </>
  );
});

export default SearchMetricsTable;
