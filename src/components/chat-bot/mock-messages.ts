import { ChatMessage } from './types';

export const mockBotMessages: ChatMessage[] = [
  // 刚刚被paged了，请问发生了什么问题？
  {
    role: 'bot',
    content: `在过去5分钟里，发生了3起告警事件：
1. (sev2) DataMonitorService avaiablity SLA < 99.9%, 发生时间 2023-06-08 16:53, 正在持续发生异常，尚未解决
2. (sev4) Landing Page RequestDemo component 4xx 异常，发生时间 2023-06-08 16:51, 持续发生1分钟，已经恢复
3. (sev3) HK region - AZ2 CPU usage > 60%, 发生时间 2023-06-08 16:54, 持续时间30秒，已经恢复 `,
  },
  // 请帮我分析一下第一条告警，为什么出现异常？
  {
    role: 'bot',
    content:
      '“(sev2) DataMonitorService avaiablity SLA < 99.9%” 这条告警主要是因为香港地区的集群，由于突然的网络抖动，导致该地区的服务突然不可用，消息队列出现IO阻塞，有约0.1%的请求返回超时，导致DataMonitorService可用性下降到 99.89%',
    extra: [
      {
        type: 'metric-chart',
        data: [
          {
            timestamp: '06-08 16:49',
            value: 0.9999,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:50',
            value: 0.9999,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:51',
            value: 0.9999,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:52',
            value: 0.9999,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:53',
            value: 0.9997,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:54',
            value: 0.9989,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:55',
            value: 0.9989,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:56',
            value: 0.9991,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:57',
            value: 0.9989,
            name: 'DataMonitorService',
            unit: '',
            mid: 'DataMonitorService:test-e39d3035-0113-11ee-8909-064024d03384',
          },
        ],
        customConfig: {
          meta: {
            value: {
              min: 0.9987,
              max: 1,
            },
          },
        },
      },
      {
        type: 'metric-chart',
        data: [
          {
            timestamp: '06-08 16:49',
            value: 308,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:50',
            value: 299,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:51',
            value: 297,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:52',
            value: 301,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:53',
            value: 493,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:54',
            value: 865,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:55',
            value: 912,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:56',
            value: 976,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
          {
            timestamp: '06-08 16:57',
            value: 982,
            name: 'GatewayLatencyP99',
            unit: '',
            mid: 'GatewayLatencyP99:test-e39d3035-0113-11ee-8909-064024d03384',
          },
        ],
        customConfig: {
          meta: {
            value: {
              min: 250,
              max: 1000,
            },
          },
        },
      },
    ],
    //  Metric 1: DataMonitorService avaiablity SLA过去15分钟的时序图Widget，2023-06-08 16:53之前都是99.99%, 在2023-06-08 16:53的时候开始慢慢下降到99.89%, 并且一直持续
    // Metric 2: Gateway 请求Latency SLA。2023-06-08 16:53之前 p99都是300 ms 左右, 在2023-06-08 16:53的时候开始慢慢上到1s, 并且一直持续
  },
  // 我应该如何解决？
  {
    role: 'bot',
    content: `你可以在runbook: DataMonitorService线上事故总结中，“如何解决消息队列出现消息阻塞”的部分，执行相关的自动化脚本。这个脚本主要做了3件事情：
1. 扩容2倍 ConsumerService 的节点数
2. Rebelance 并且更新所有Consumer的offset
3. 对账并且检查数据一致性

请您确认是否要执行脚本？`,
    extra: [
      {
        type: 'quick-reply',
        options: ['确定', '取消'],
      },
    ],
  },
  // 确定
  {
    role: 'bot',
    content: `好的，正在执行脚本，系统正在恢复，请持续监控以下指标：
DataMonitorService Ingress v.s. Egress
ConsumerSerivice Avabality
DataMonitorService avaiablity SLA
Gateway 请求Latency SLA`,
    // Metric 1:
    // DataMonitorService Ingress v.s. Egress ，2023-06-08 16:53之前都是 Ingress = Egress, 在2023-06-08 16:53的时候开始, Egress慢慢下降到原先的80%, 2分钟后恢复至 Ingress = Egress
    // Metric 2:
    // ConsumerSerivice Avabality ，2023-06-08 16:53之前都是 99.99%, 在2023-06-08 16:53的时候开始, Avabality慢慢下降到99.75%, 2分钟后恢复至 99.99%
    // Metric 3:
    // DataMonitorService avaiablity SLA过去15分钟的时序图Widget，2023-06-08 16:53之前都是99.99%, 在2023-06-08 16:53的时候开始慢慢下降到99.89%, 2分钟后恢复至 99.99%
    // Metric 4:
    // Gateway 请求Latency SLA。2023-06-08 16:53之前 p99都是300 ms 左右, 在2023-06-08 16:53的时候开始慢慢上到1s, 2分钟后恢复至 300 ms
  },
];
