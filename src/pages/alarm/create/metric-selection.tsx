import Tags from '@/components/Tags';
import SearchMetricsTable from '@/pages/metric/components/SearchMetricsTable';
import type { MetricDataType } from '@/pages/metric/data';
import { getMetricsTagPairs } from '@/services/craicCoffee/metricController';
import { Col, Divider, Input, message, Row, Select, Space, Table, Tabs } from 'antd';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';

const InputRow = styled.div`
  padding: 12px 0;
`;

type MetricDataTypeWithKey = MetricDataType & {
  key: string;
};

export type MetricSelectionData =
  | {
      type: 'normal';
      metric?: MetricDataType;
    }
  | {
      type: 'aggregate';
      metric?: MetricDataType;
      where: {
        key: string;
        value: string;
      }[];
      aggFn: string;
    }
  | {
      type: 'math';
      metrics: MetricDataTypeWithKey[];
      expression: string;
    };

type Props = {
  data: MetricSelectionData;
  setData: Dispatch<SetStateAction<MetricSelectionData>>;
  editMode: boolean;
};

export const MetricSelection: FC<Props> = (props) => {
  const { data, setData } = props;

  const allTagPairs = useAsyncMemo(
    async () => {
      if (data.type !== 'aggregate') return [];
      if (!data.metric?.name) {
        return [];
      }
      const res = await getMetricsTagPairs({
        metricName: data.metric.name,
      });
      if (!res.success || !res.data) return [];
      return (res.data ?? []) as {
        key: string;
        value: string;
      }[];
    },
    [data.type === 'aggregate' ? data.metric?.name : null],
    [],
  );

  return (
    <div>
      <Tabs
        activeKey={data.type}
        onChange={(key) => {
          setData((prev) => {
            if (prev.type === key) {
              return prev;
            }
            if (props.editMode) {
              message.info('编辑模式下不允许修改类型');
              return prev;
            }
            if (key === 'aggregate') {
              return {
                type: 'aggregate',
                where: [],
                aggFn: 'AVG',
              };
            } else if (key === 'math') {
              return {
                type: 'math',
                metrics: [],
                expression: '',
              };
            } else {
              return {
                type: key as any,
              };
            }
          });
        }}
        items={[
          {
            key: 'normal',
            label: '单一指标',
          },
          {
            key: 'aggregate',
            label: '聚合指标',
          },
          {
            key: 'math',
            label: '数学运算',
          },
        ]}
      />
      {data.type === 'normal' && (
        <SearchMetricsTable
          selectedMetrics={data.metric ? [data.metric] : []}
          onSelectedMetricsChange={(metrics) => {
            setData((prev) => ({
              ...prev,
              metric: metrics[0] ?? null,
            }));
          }}
          useWindow={false}
          multiple={false}
          showOverviewBar
        />
      )}
      {data.type === 'aggregate' && (
        <div>
          <SearchMetricsTable
            selectedMetrics={data.metric ? [data.metric] : []}
            onSelectedMetricsChange={(metrics) => {
              setData((prev) => ({
                ...prev,
                metric: metrics[0] ?? null,
                where: [],
              }));
            }}
            useWindow={false}
            multiple={false}
            showOverviewBar
            aggregated
          />
          <InputRow>
            <Space>
              <span>筛选条件</span>
              <Select
                options={allTagPairs.map((pair) => ({
                  label: `${pair.key}:${pair.value}`,
                  value: `${pair.key}:${pair.value}`,
                }))}
                value={data.where.map((w) => `${w.key}:${w.value}`)}
                onChange={(item: string[]) => {
                  setData((prev) => ({
                    ...prev,
                    where: item.map((v) => {
                      const [key, value] = v.split(':');
                      return {
                        key,
                        value,
                      };
                    }),
                  }));
                }}
                mode="multiple"
                allowClear
                showArrow={true}
                placeholder={'全部'}
                style={{
                  width: '400px',
                }}
              />
            </Space>
          </InputRow>
          <InputRow>
            <Space>
              <span>聚合方法</span>
              <Select
                options={['AVG', 'COUNT', 'MAX', 'MIN', 'SUM'].map((aggFn) => ({
                  label: aggFn,
                  value: aggFn,
                }))}
                value={data.aggFn}
                onChange={(v) => {
                  setData((prev) => ({
                    ...prev,
                    aggFn: v,
                  }));
                }}
                allowClear={false}
                style={{
                  width: '200px',
                }}
              />
            </Space>
          </InputRow>
        </div>
      )}
      {data.type === 'math' && (
        <div>
          <SearchMetricsTable
            selectedMetrics={data.metrics}
            onSelectedMetricsChange={(metrics) => {
              setData((prev) => ({
                ...prev,
                metrics: metrics.map((metric, index) => ({ ...metric, key: `m${index + 1}` })),
              }));
            }}
            useWindow={false}
            multiple={true}
            showOverviewBar
          />
          <div style={{ height: 24 }} />
          <Table<MetricDataTypeWithKey>
            columns={[
              {
                title: 'ID',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                ellipsis: true,
              },
              {
                title: '指标',
                dataIndex: 'name',
                key: 'name',
                width: 250,
                ellipsis: true,
              },
              {
                title: '标签信息',
                dataIndex: 'tags',
                key: 'tags',
                render: (_, metric) => <Tags tags={metric.tags} />,
              },
            ]}
            dataSource={data.metrics}
            pagination={false}
            tableLayout="fixed"
            rowKey={(item) => item.key}
          />
          <div style={{ height: 24 }} />
          <Input
            style={{ width: '100%' }}
            placeholder="请输入表达式"
            value={data.expression}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                expression: e.target.value,
              }));
            }}
          />
          <div style={{ height: 24 }} />
        </div>
      )}
    </div>
  );
};
