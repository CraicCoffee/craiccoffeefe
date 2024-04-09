import {
  getMetricsTagPairs,
  listMetricAggregated,
  listMetrics,
  wildcardSearchMetrics,
  wildcardSearchMetricsAggregated,
} from '@/services/craicCoffee/metricController';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { Button, Col, message, Row, Select, Space } from 'antd';
import { uniq } from 'lodash';
import { customAlphabet } from 'nanoid';
import { numbers } from 'nanoid-dictionary';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAsyncMemo } from 'use-async-memo';

const randomRuleId = customAlphabet(numbers, 10);

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
`;

const Inner = styled.div`
  min-width: 800px;
  box-sizing: border-box;
  overflow: hidden;
`;

export type AggregateRule = {
  key: string;
  metricName: string;
  where: {
    key: string;
    value: string;
  }[];
  groupBy: string[];
  aggFn: string;
  metadata: API.KeyValue[];
};

type Metric = {
  name: string;
  metadata: API.KeyValue[];
};

const EditableRuleRow: FC<{
  rule: AggregateRule;
  defaultEditing: boolean;
  onSave: (rule: AggregateRule) => void;
  onDelete: () => void;
}> = (props) => {
  const [rule, setRule] = useState(props.rule);
  const [editing, setEditing] = useState(props.defaultEditing);

  const [allMetrics, setAllMetric] = useState<Metric[]>([]);

  const { run: handleMetricNameSearch } = useDebounceFn(
    async function (v: string) {
      const res = v
        ? await wildcardSearchMetricsAggregated({
            query: v,
          })
        : await listMetricAggregated({
            pageToken: '',
          });
      if (!res.success || !res.data) return;
      const metrics = uniq(
        (res.data.data ?? []).map((metric) => {
          // todo 临时处理，后端 须在上报的时候加上 unit
          if (metric.name === 'CanaryResponseTime') {
            metric.metadata = [{ key: 'unit', value: 'ms' }, ...(metric.metadata ?? [])];
          }
          return {
            name: metric.name || '',
            // 获取当前 metric 的单位
            metadata: metric?.metadata || [],
          };
        }),
      );
      setAllMetric(metrics);
    },
    {
      wait: 300,
      leading: false,
      trailing: true,
    },
  );

  const allTagPairs = useAsyncMemo(
    async () => {
      if (!rule.metricName) {
        return [];
      }
      const res = await getMetricsTagPairs({
        metricName: rule.metricName,
      });
      if (!res.success || !res.data) return [];
      return (res.data ?? []) as {
        key: string;
        value: string;
      }[];
    },
    [rule.metricName],
    [],
  );

  const allTagKeys = useMemo(() => {
    return uniq(allTagPairs.map((pair) => pair.key));
  }, [allTagPairs]);

  return (
    <Row
      gutter={16}
      style={{
        marginBottom: 12,
      }}
    >
      <Col span={6}>
        <Select
          showSearch
          disabled={!editing}
          options={allMetrics.map((name) => ({
            label: name.name,
            value: name.name,
          }))}
          value={rule.metricName}
          placeholder="输入指标名称进行搜索"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          notFoundContent={null}
          onSearch={handleMetricNameSearch}
          onFocus={() => {
            handleMetricNameSearch('');
          }}
          onChange={(v) => {
            const metadata = allMetrics.find((el) => el.name === v)?.metadata || [];
            setRule((prev) => ({
              ...prev,
              metricName: v,
              where: [],
              groupBy: [],
              metadata,
            }));
          }}
          style={{
            width: '100%',
          }}
        />
      </Col>
      <Col span={7}>
        <Select
          disabled={!editing}
          options={allTagPairs.map((pair) => ({
            label: `${pair.key}:${pair.value}`,
            value: `${pair.key}:${pair.value}`,
          }))}
          value={rule.where.map((w) => `${w.key}:${w.value}`)}
          onChange={(item: string[]) => {
            setRule((prev) => ({
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
            width: '100%',
          }}
        />
      </Col>
      <Col span={5}>
        <Select
          disabled={!editing}
          options={allTagKeys.map((key) => ({
            label: key,
            value: key,
          }))}
          value={rule.groupBy}
          onChange={(value: string[]) => {
            setRule((prev) => ({
              ...prev,
              groupBy: value,
            }));
          }}
          mode="multiple"
          allowClear
          showArrow={true}
          placeholder={'不分组'}
          style={{
            width: '100%',
          }}
        />
      </Col>
      <Col span={3}>
        <Select
          disabled={!editing}
          options={['AVG', 'COUNT', 'MAX', 'MIN', 'SUM'].map((aggFn) => ({
            label: aggFn,
            value: aggFn,
          }))}
          value={rule.aggFn}
          onChange={(v) => {
            setRule((prev) => ({
              ...prev,
              aggFn: v,
            }));
          }}
          allowClear={false}
          style={{
            width: '100%',
          }}
        />
      </Col>
      {/* <Col>
        <Select
          disabled={!editing}
          options={[]}
          style={{
            width: '100%',
          }}
        />
      </Col> */}
      <Col span={3}>
        <Space size={0}>
          {editing ? (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  if (!rule.metricName) {
                    message.error('请填写指标名称');
                    return;
                  }
                  props.onSave(rule);
                  setEditing(false);
                }}
              />
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  if (props.rule.metricName) {
                    setRule(props.rule);
                    setEditing(false);
                  } else {
                    props.onDelete();
                  }
                }}
              />
            </>
          ) : (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditing(true);
                }}
              />
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  props.onDelete();
                }}
              />
            </>
          )}
        </Space>
      </Col>
    </Row>
  );
};

type Props = {
  aggregateRules: AggregateRule[];
  setAggregateRules: Dispatch<SetStateAction<AggregateRule[]>>;
};
export const MetricAggregateForm: FC<Props> = (props) => {
  const { aggregateRules, setAggregateRules } = props;
  const [hasRendered, setHasRendered] = useState(false);
  useLayoutEffect(() => {
    setHasRendered(true);
    if (aggregateRules.length === 0) {
      addAggregateRule();
    }
  }, [aggregateRules.length]);

  function addAggregateRule() {
    const nextId =
      1 + aggregateRules.reduce((acc, cur) => Math.max(acc, parseInt(cur.key.slice(1))), 0);
    setAggregateRules([
      ...aggregateRules,
      {
        key: 'q' + nextId,
        metricName: '',
        where: [],
        groupBy: [],
        aggFn: 'AVG',
        metadata: [],
      },
    ]);
  }

  return (
    <Container>
      <Inner>
        {aggregateRules.length > 0 && (
          <Row
            gutter={16}
            style={{
              marginBottom: 12,
            }}
          >
            <Col span={6}>指标名称</Col>
            <Col span={7}>筛选条件</Col>
            <Col span={5}>分组依据</Col>
            <Col span={3}>统计方法</Col>
          </Row>
        )}
        {aggregateRules.map((rule) => (
          <EditableRuleRow
            key={rule.key}
            rule={rule}
            defaultEditing={hasRendered}
            onSave={(updatedRule) => {
              setAggregateRules(
                aggregateRules.map((r) => (r.key === updatedRule.key ? updatedRule : r)),
              );
            }}
            onDelete={() => {
              setAggregateRules(aggregateRules.filter((r) => r.key !== rule.key));
            }}
          />
        ))}
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              addAggregateRule();
            }}
          >
            添加聚合指标
          </Button>
          <Button type="link" href="/metric/list" target="_blank">
            查看全部指标
          </Button>
        </Space>
      </Inner>
    </Container>
  );
};
