import { AlarmTopologyDrawer } from '@/components/alarm-topology-drawer';
import {
  getAlarm as getAlarmNormal,
  getAlarmComposite,
  getAlarmExpression,
  getEdgesForGraphContaining,
} from '@/pages/alarm/service';
import { alarmMap, openDetail, statusBg } from '@/pages/alarm/utils';
import type { IGraph } from '@ant-design/charts';
import { FlowAnalysisGraph } from '@ant-design/graphs';
import { useAsyncEffect } from 'ahooks';
import { Card, Drawer, Space, Tag } from 'antd';
import moment from 'moment/moment';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Tip = styled.div`
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  text-align: center;
`;

type Props = {
  alarmDetail:
    | API.GetAlarmResponse
    | API.GetAlarmExpressionResponse
    | API.GetAlarmCompositeResponse;
};

function transformData(apiData: API.ResponseGetAlarmEdgeResponse) {
  const edges = apiData.data?.edges ?? [];
  const nodes = apiData.data?.nodes ?? [];
  const transformedNodes = nodes.map((node) => {
    console.log(node);
    const status = node.status === 'INSUFFICIENT_DATA' ? 'NO DATA' : node.status;
    return {
      id: node.uuid,
      value: {
        ...node,
        title: node.description,
        status: status,
        items: [
          {
            text: status,
            value: moment(node.updatedTimestamp).format('MM-DD HH:mm'),
          },
        ],
      },
    };
  });
  const transformedEdges = edges.map((edge) => ({
    source: edge.parentUuid,
    target: edge.childUuid,
    value: '', // 边信息
  }));

  return {
    nodes: transformedNodes,
    edges: transformedEdges,
  };
}

const getAlarm = async (uuid: string, type: string) => {
  let data;
  switch (type) {
    case 'EXPRESSION':
      data = await getAlarmExpression({ uuid });
      break;
    case 'COMPOSITE':
      data = await getAlarmComposite({ uuid });
      break;
    default:
      data = await getAlarmNormal({ uuid });
      break;
  }
  if (!data.success) {
    return Promise.reject(data);
  }
  return data.data;
};

const AlarmTopologyLatest: FC<Props> = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [selectedAlarmInfo, setSelectedAlarmInfo] = useState<
    typeof props.alarmDetail | null | undefined
  >(null);

  useEffect(() => {
    async function fetchData() {
      const params = { uuid: props.alarmDetail.uuid as string };
      const options = {};

      try {
        const apiData = await getEdgesForGraphContaining(params, options);
        const transformedData = transformData(apiData);
        setGraphData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useAsyncEffect(async () => {
    if (!selectedNode) return;
    getAlarm(selectedNode.uuid, selectedNode.type).then((res) => {
      setSelectedAlarmInfo(res);
      setDrawerOpen(true);
    });
  }, [selectedNode]);

  if (!graphData) {
    return <div>Loading...</div>;
  }

  const data = graphData;
  const config = {
    data,
    nodeCfg: {
      size: [220, 25],
      badge: {
        style: (cfg) => ({
          fill: statusBg[cfg?.value?.status || 'OK'],
          radius: [2, 0, 0, 2],
        }),
      },
      items: {
        padding: 6,
        containerStyle: {
          fill: '#fff',
        },
        style: (cfg, group, type) => {
          const styles = {
            icon: {
              width: 12,
              height: 12,
            },
            value: {
              fill: '#000',
              fontSize: 10,
            },
            text: {
              fill: statusBg[cfg?.value?.status || 'OK'],
              fontSize: 12,
            },
          };
          return styles[type];
        },
      },
      nodeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
        style: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      },
      title: {
        containerStyle: {
          fill: 'transparent',
        },
        style: {
          fill: '#000',
          fontSize: 12,
        },
      },
      style: (cfg) => {
        return {
          fill: '#E6EAF1',
          stroke: props.alarmDetail.uuid === cfg.id ? '#1890ff' : '#B2BED5',
          radius: [2, 2, 2, 2],
        };
      },
    },
    edgeCfg: {
      label: {
        style: {
          fill: '#aaa',
          fontSize: 12,
          fillOpacity: 1,
        },
      },
      style: (edge) => {
        const stroke = edge.target === '0' ? '#c86bdd' : '#5ae859';
        return {
          stroke,
          lineWidth: 1,
          strokeOpacity: 0.5,
        };
      },
      edgeStateStyles: {
        hover: {
          lineWidth: 2,
          strokeOpacity: 1,
        },
      },
    },
    markerCfg: (cfg) => {
      const { edges } = data;
      return {
        position: 'right',
        show: edges.find((item) => item.source === cfg.id),
      };
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    onReady: (graph: IGraph) => {
      graph.on('node:click', (e) => {
        setSelectedNode(e.item?._cfg?.model?.value ?? null);
      });
    },
  } as any;

  return (
    <>
      <FlowAnalysisGraph {...config} />
      <Card>
        <Tip>点击节点可以查看上下游节点的详细信息</Tip>
        <Drawer
          open={drawerOpen}
          placement="right"
          onClose={() => {
            setDrawerOpen(false);
            setSelectedNode(null);
          }}
          width={512}
          destroyOnClose
          title={selectedNode?.title}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Tag color={statusBg[alarmMap[selectedNode?.status]]} style={{ marginLeft: 8 }}>
                <span style={{ fontWeight: 'bold', fontSize: 12 }}>
                  {alarmMap[selectedNode?.status]}
                </span>
              </Tag>
              <a
                onClick={() => {
                  openDetail(selectedNode?.uuid, selectedNode?.type);
                  setDrawerOpen(false);
                  setSelectedNode(null);
                }}
              >
                查看详情
              </a>
            </Space>
          }
        >
          <div>{selectedAlarmInfo && <AlarmTopologyDrawer alarmDetail={selectedAlarmInfo} />}</div>
        </Drawer>
      </Card>
    </>
  );
};

export { AlarmTopologyLatest };
