// TODO: 这个组件没用了，等验收完彻底删掉
import { AlarmTopologyDrawer } from '@/components/alarm-topology-drawer';
import { alarmMap, statusBg } from '@/pages/alarm/utils';
import G6, { TreeGraphData } from '@antv/g6';
import { Link } from '@umijs/max';
import { Card, Drawer, Space, Tag } from 'antd';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Tip = styled.div`
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  text-align: center;
`;

// mocked data
const mockData = {
  id: 'g1',
  name: 'APIService Availability SLA',
  duration: 12,
  status: 'Alarm',
  collapsed: false,
  children: [
    {
      id: 'g2',
      name: 'APIService CPU Usage',
      duration: 12,
      status: 'Alarm',
      collapsed: false,
      children: [
        {
          id: 'g31',
          name: 'Beijing Region CPU Usage',
          duration: 12,
          status: 'Alarm',
          collapsed: false,
          children: [],
        },
        {
          id: 'g32',
          name: 'Ningxia Region CPU Usage',
          duration: 0,
          status: 'OK',
          collapsed: false,
          children: [],
        },
      ],
    },
    {
      id: 'g21',
      name: 'APIService Memory usage',
      duration: 8,
      status: 'Alarm',
      collapsed: false,
      children: [
        {
          id: 'g321',
          name: 'Beijing Region Memory Usage',
          duration: 8,
          status: 'Alarm',
          collapsed: false,
          children: [],
        },
        {
          id: 'g322',
          name: 'Ningxia Region Memory Usage',
          duration: 0,
          status: 'OK',
          collapsed: false,
          children: [],
        },
      ],
    },
    {
      id: 'g4',
      name: 'APIService Network Performance Monitoring',
      duration: 0,
      status: 'OK',
      collapsed: false,
      children: [],
    },
  ],
};

const colors = {
  B: '#5B8FF9',
  Alarm: '#F46649',
  Warm: '#EEBC20',
  OK: '#5BD8A6',
  'No Data': '#A7A7A7',
};

type Props = {
  alarmDetail: any; // TODO: add missing type
};

export const AlarmTopology: FC<Props> = (props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const graphContainerRef = useRef<HTMLDivElement>(null);

  const registerFn = () => {
    /**
     * 自定义节点
     */
    G6.registerNode(
      'flow-rect',
      {
        shapeType: 'flow-rect',
        draw(cfg, group) {
          const { name = '', status, duration, collapsed } = cfg;

          const grey = '#CED4D9';
          const rectConfig = {
            width: 202,
            height: 60,
            lineWidth: 1,
            fontSize: 12,
            fill: '#fff',
            radius: 4,
            stroke: grey,
            opacity: 1,
          };

          const nodeOrigin = {
            x: -rectConfig.width / 2,
            y: -rectConfig.height / 2,
          };

          const textConfig = {
            textAlign: 'left',
            textBaseline: 'bottom',
          };

          const rect = group.addShape('rect', {
            attrs: {
              x: nodeOrigin.x,
              y: nodeOrigin.y,
              ...rectConfig,
            },
          });

          const rectBBox = rect.getBBox();

          // label title
          group.addShape('text', {
            attrs: {
              ...textConfig,
              x: 12 + nodeOrigin.x,
              y: 20 + nodeOrigin.y,
              text: name.length > 28 ? name.substr(0, 28) + '...' : name,
              fontSize: 12,
              opacity: 0.85,
              fill: '#000',
              cursor: 'pointer',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'name-shape',
          });

          // status
          const statusText = group.addShape('text', {
            attrs: {
              ...textConfig,
              // x: rectBBox.maxX - 8,
              // y: rectBBox.maxY - 12,
              x: nodeOrigin.x + 42,
              y: rectBBox.maxY - 12,
              text: status,
              fontSize: 12,
              textAlign: 'right',
              fill: statusBg[status],
            },
          });

          // duration
          const durationText = group.addShape('text', {
            attrs: {
              ...textConfig,
              // x: 12 + nodeOrigin.x,
              // y: rectBBox.maxY - 12,
              x: rectBBox.maxX - 48,
              y: rectBBox.maxY - 12,
              text: duration + ' mins',
              fontSize: 12,
              fill: '#000',
              opacity: 0.85,
            },
          });

          // bottom line background
          const bottomBackRect = group.addShape('rect', {
            attrs: {
              x: nodeOrigin.x,
              y: rectBBox.maxY - 4,
              width: rectConfig.width,
              height: 4,
              radius: [0, 0, rectConfig.radius, rectConfig.radius],
              fill: '#E0DFE3',
            },
          });

          // bottom percent
          const bottomRect = group.addShape('rect', {
            attrs: {
              x: nodeOrigin.x,
              y: rectBBox.maxY - 4,
              width: rectConfig.width,
              height: 4,
              radius: [0, 0, 0, rectConfig.radius],
              fill: statusBg[status],
            },
          });

          // collapse rect
          if (cfg.children && cfg.children.length) {
            group.addShape('rect', {
              attrs: {
                x: rectConfig.width / 2 - 8,
                y: -8,
                width: 16,
                height: 16,
                stroke: 'rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                fill: '#fff',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'collapse-back',
              modelId: cfg.id,
            });

            // collpase text
            group.addShape('text', {
              attrs: {
                x: rectConfig.width / 2,
                y: -1,
                textAlign: 'center',
                textBaseline: 'middle',
                text: collapsed ? '+' : '-',
                fontSize: 16,
                cursor: 'pointer',
                fill: 'rgba(0, 0, 0, 0.25)',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'collapse-text',
              modelId: cfg.id,
            });
          }

          this.drawLinkPoints(cfg, group);
          return rect;
        },
        update(cfg, item) {
          const { level, status, name } = cfg;
          const group = item.getContainer();
          let mask = group.find((ele) => ele.get('name') === 'mask-shape');
          let maskLabel = group.find((ele) => ele.get('name') === 'mask-label-shape');
          if (level === 0) {
            group.get('children').forEach((child) => {
              if (child.get('name')?.includes('collapse')) return;
              child.hide();
            });
            if (!mask) {
              mask = group.addShape('rect', {
                attrs: {
                  x: -101,
                  y: -30,
                  width: 202,
                  height: 60,
                  opacity: 0,
                  fill: statusBg[status],
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'mask-shape',
              });
              maskLabel = group.addShape('text', {
                attrs: {
                  fill: '#fff',
                  fontSize: 20,
                  x: 0,
                  y: 10,
                  text: name.length > 28 ? name.substr(0, 16) + '...' : name,
                  textAlign: 'center',
                  opacity: 0,
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'mask-label-shape',
              });
              const collapseRect = group.find((ele) => ele.get('name') === 'collapse-back');
              const collapseText = group.find((ele) => ele.get('name') === 'collapse-text');
              collapseRect?.toFront();
              collapseText?.toFront();
            } else {
              mask.show();
              maskLabel.show();
            }
            mask.animate({ opacity: 1 }, 200);
            maskLabel.animate({ opacity: 1 }, 200);
            return mask;
          } else {
            group.get('children').forEach((child) => {
              if (child.get('name')?.includes('collapse')) return;
              child.show();
            });
            mask?.animate(
              { opacity: 0 },
              {
                duration: 200,
                callback: () => mask.hide(),
              },
            );
            maskLabel?.animate(
              { opacity: 0 },
              {
                duration: 200,
                callback: () => maskLabel.hide(),
              },
            );
          }
          this.updateLinkPoints(cfg, group);
        },
        setState(name, value, item) {
          if (name === 'collapse') {
            const group = item.getContainer();
            const collapseText = group.find((e) => e.get('name') === 'collapse-text');
            if (collapseText) {
              if (!value) {
                collapseText.attr({
                  text: '-',
                });
              } else {
                collapseText.attr({
                  text: '+',
                });
              }
            }
          }
        },
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ];
        },
      },
      'rect',
    );

    G6.registerEdge(
      'flow-cubic',
      {
        getControlPoints(cfg) {
          let controlPoints = cfg.controlPoints; // 指定controlPoints
          if (!controlPoints || !controlPoints.length) {
            const { startPoint, endPoint, sourceNode, targetNode } = cfg;
            const {
              x: startX,
              y: startY,
              coefficientX,
              coefficientY,
            } = sourceNode ? sourceNode.getModel() : startPoint;
            const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
            let curveStart = (endX - startX) * coefficientX;
            let curveEnd = (endY - startY) * coefficientY;
            curveStart = curveStart > 40 ? 40 : curveStart;
            curveEnd = curveEnd < -30 ? curveEnd : -30;
            controlPoints = [
              { x: startPoint.x + curveStart, y: startPoint.y },
              { x: endPoint.x + curveEnd, y: endPoint.y },
            ];
          }
          return controlPoints;
        },
        getPath(points) {
          const path = [];
          path.push(['M', points[0].x, points[0].y]);
          path.push([
            'C',
            points[1].x,
            points[1].y,
            points[2].x,
            points[2].y,
            points[3].x,
            points[3].y,
          ]);
          return path;
        },
      },
      'single-line',
    );
  };

  registerFn();

  useLayoutEffect(() => {
    const container = graphContainerRef.current;
    if (!container) return;
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.TreeGraph({
      container,
      width,
      height,
      modes: {
        default: [
          // {
          //   type: 'collapse-expand',
          //   onChange: function onChange(item, collapsed) {
          //     if (!item) return false;
          //     const data = item.get('model');
          //     data.collapsed = collapsed;
          //     return true;
          //   },
          // },
          'drag-canvas',
          // 'zoom-canvas',
        ],
      },
      groupByTypes: false,
      fitView: true,
      animate: true,
      defaultNode: {
        type: 'flow-rect',
      },
      defaultEdge: {
        type: 'cubic-horizontal',
        style: {
          stroke: '#CED4D9',
        },
      },
      layout: {
        type: 'indented',
        direction: 'H',
        dropCap: false,
        indent: 300,
        getHeight: () => {
          return 60;
        },
      },
    });
    graph.node(function (node) {
      return {
        // label: node.id,
        labelCfg: {
          position: !node.side ? 'bottom' : node.side === 'right' ? 'right' : 'left',
          offset: 5,
          style: {
            fontWeight: node.side ? undefined : 'bold',
          },
        },
        style: !node.side
          ? undefined
          : node.side === 'right'
          ? {
              fill: '#ff5656',
              stroke: '#ff5656',
              fillOpacity: 0.5,
              cursor: 'pointer',
            }
          : {
              fill: '#ffbd5a',
              stroke: '#ffbd5a',
              fillOpacity: 0.5,
              cursor: 'pointer',
            },
        size: node.side ? undefined : 36,
      };
    });

    const handleCollapse = (e) => {
      const target = e.target;
      const id = target.get('modelId');
      const item = graph.findById(id);
      const nodeModel = item.getModel();
      nodeModel.collapsed = !nodeModel.collapsed;
      graph.layout();
      graph.setItemState(item, 'collapse', nodeModel.collapsed);
    };
    graph.on('collapse-text:click', (e) => {
      handleCollapse(e);
    });
    graph.on('collapse-back:click', (e) => {
      handleCollapse(e);
    });

    graph.data(
      //   {
      //   id: props.alarmDetail.description,
      //   children: [mockData],
      // }
      mockData,
    );
    graph.render();
    graph.fitView();
    graph.on('node:click', (e) => {
      console.log(e.item?._cfg?.id);
      setSelectedId(e.item?._cfg?.id ?? null);
    });

    // if (typeof window !== 'undefined') {
    //   window.onresize = () => {
    //     if (!graph || graph.get('destroyed')) return;
    //     if (!container || !container.scrollWidth || !container.scrollHeight) return;
    //     graph.changeSize(container.scrollWidth, container.scrollHeight);
    //   };
    // }

    return () => {
      graph.destroy();
    };
  }, []);

  return (
    <>
      <Card>
        <div ref={graphContainerRef} />
        <Tip>点击节点可以查看上下游节点的详细信息</Tip>
        <Drawer
          open={!!selectedId}
          placement="right"
          onClose={() => {
            setSelectedId(null);
          }}
          width={512}
          destroyOnClose
          title={props.alarmDetail.description}
          bodyStyle={{
            paddingBottom: 80,
          }}
          extra={
            <Space>
              <Tag color={statusBg[alarmMap[props.alarmDetail.status]]} style={{ marginLeft: 8 }}>
                {/*{detailData.status === 'INSUFFICIENT_DATA' ? 'NO DATA' : detailData.status}*/}
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {alarmMap[props.alarmDetail.status]}
                </span>
              </Tag>

              <Link to={`/alarm/detail/${props.alarmDetail.uuid}`}>查看详情</Link>
            </Space>
          }
        >
          <div>
            <AlarmTopologyDrawer alarmDetail={props.alarmDetail} />
          </div>
        </Drawer>
      </Card>
    </>
  );
};

const downstreams: TreeGraphData[] = [
  {
    id: '下游1',
    side: 'right',
  },
  {
    id: '下游2',
    side: 'right',
  },
  {
    id: '下游3',
    side: 'right',
  },
  {
    id: '下游4',
    side: 'right',
  },
];

const upstreams: TreeGraphData[] = [
  {
    id: 'Methods',
    side: 'left',
    children: [
      {
        id: 'Classifier selection',
        side: 'left',
      },
      {
        id: 'Classifier fusion',
        side: 'left',
      },
    ],
  },
  {
    id: 'Multiple linear regression',
    side: 'left',
  },
  {
    id: 'Partial least squares',
    side: 'left',
  },
  {
    id: 'Multi-layer feedforward neural network',
    side: 'left',
  },
  {
    id: 'General regression neural network',
    side: 'left',
  },
  {
    id: 'Support vector regression',
    side: 'left',
  },
  {
    id: 'Common',
    side: 'left',
    children: [
      {
        id: 'Bagging',
        side: 'left',
      },
      {
        id: 'Boosting',
        side: 'left',
      },
      {
        id: 'AdaBoost',
        side: 'left',
      },
    ],
  },
];
