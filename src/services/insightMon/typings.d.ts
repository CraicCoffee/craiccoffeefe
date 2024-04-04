declare namespace API {
  type addAlarmCompositeParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddAlarmCompositeRequest = {
    /** 告警名称 */
    description: string;
    /** 告警规则 */
    alarmRules: CompositeAlarmRule[];
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type addAlarmExpressionParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddAlarmExpressionRequest = {
    description?: string;
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    threshold?: number;
    dataPointsToAlarm?: number;
    /** 如果是聚合运算，evaluationPeriods * period 不能超过 10800 秒，即 3 小时 */
    evaluationPeriods?: number;
    /** type 为 expression 时必填，数学运算、聚合运算表达式 */
    metricQueries?: MetricGetQuery[];
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type AddAlarmExpressionResponse = {
    uuid?: string;
  };

  type addAlarmParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddAlarmRequest = {
    metric?: MetricMetadata;
    description?: string;
    statistic?: 'SampleCount' | 'Average' | 'Sum' | 'Minimum' | 'Maximum';
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    threshold?: number;
    period?: number;
    dataPointsToAlarm?: number;
    evaluationPeriods?: number;
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type AddAlarmResponse = {
    uuid?: string;
  };

  type AddCanaryRequest = {
    /** 拨测的名字，需要唯一。暂时没有唯一性校验。 */
    name: string;
    /** 拨测的频率。 */
    intervalMinutes:
      | 'MINUTES_1'
      | 'MINUTES_5'
      | 'MINUTES_30'
      | 'MINUTES_60'
      | 'MINUTES_360'
      | 'MINUTES_720';
    /** 是否启用 */
    enabled?: boolean;
    /** 拨测的 url，需要包含协议头。 */
    httpUrl: string;
    /** 拨测发起 http 的请求方法 */
    httpMethod: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 拨测发起 http 的请求头 */
    httpHeader?: string;
    /** 拨测发起 http 的请求体 */
    httpBody?: string;
    /** 触发报警的数据点个数 */
    dataPointsToAlarm?: number;
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type AddCanaryResponse = {
    uuid?: string;
  };

  type addDashBoardParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddDashBoardResponse = {
    uuid?: string;
  };

  type AddDashBoardsRequest = {
    name: string;
    type: string;
  };

  type addStateChangeEventParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddStatusPageRequest = {
    /** 状态页的名字，需要唯一。暂时没有唯一性校验。 */
    name: string;
    /** 状态页描述。 */
    description?: string;
    /** 状态页是否公开。 */
    visible?: boolean;
  };

  type AddStatusPageServiceRequest = {
    /** 服务的名字，需要唯一。暂时没有唯一性校验。 */
    name: string;
    /** 服务的种类 */
    type: 'Alarm' | 'Canary' | 'Manual';
    /** 如果 type 是 Alarm 填 Alarm 的 ID，如果 type 是 Canary 填 Canary 的 ID，如果是 Manual 留空。 */
    referencedUUID?: string;
    /** 如果 type 是 Manual，这个状态必填。如果是 Alarm 和 Canary，留空。 */
    status?: 'Operational' | 'Degraded' | 'Outage' | 'Maintaining';
    /** 如果 type 是 Manual，这个状态必填。如果是 Alarm 和 Canary，留空。 */
    reason?: string;
    /** 状态页 ID */
    pageUUID: string;
  };

  type addThirdPartyKeyParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddThirdPartyKeyRequest = {
    platformName?: 'AWS' | 'GOOGLE_CLOUD' | 'AZURE' | 'ALIYUN' | 'TENCENT_CLOUD';
    value?: string;
  };

  type addWebhookParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type AddWebhookRequest = {
    name?: string;
    url?: string;
    /** payload 需要包含 {{message}} 字段，{{message}} 字段会被自动替换成告警信息 */
    payload?: string;
  };

  type AlarmHistory = {
    timestamp?: string;
    type?: string;
    summary?: string;
    data?: string;
  };

  type AlarmNode = {
    uuid?: string;
    description?: string;
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    updatedTimestamp?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
  };

  type AlarmReceiver = {
    receiver?: string;
    type?: 'Email' | 'Sms' | 'Web' | 'Webhook';
  };

  type CanaryHistoryData = {
    date?: string;
    status?: 'SUCCESS' | 'ERROR' | 'INITIAL' | 'NO_DATA';
  };

  type checkNameParams = {
    description: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type checkParentsParams = {
    request: CheckParentsRequest;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type CheckParentsRequest = {
    uuids?: string[];
  };

  type ChildrenAlarm = {
    uuid?: string;
    description?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    updatedTimestamp?: string;
  };

  type CompositeAlarmRule = {
    /** 告警名称 */
    alarmName: string;
    /** 告警状态 */
    stateValue: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    /** 运算符，最后一个 rule 不需要填 */
    operator?: 'AND' | 'OR' | 'AND_NOT';
    /** 括号 */
    parentheses?: string;
  };

  type createCanaryParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type createStatusPageParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type createStatusPageServiceParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type CurrentUserBody = {
    name?: string;
    expiresAt?: string;
    alreadyExpired?: boolean;
  };

  type currentUserParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type DataPoint = {
    timestamp?: string;
    value?: number;
  };

  type DataWithPageListAlarmResponse = {
    currentPage?: number;
    total?: number;
    data?: ListAlarmResponse[];
  };

  type DataWithPageListCanaryResponse = {
    currentPage?: number;
    total?: number;
    data?: ListCanaryResponse[];
  };

  type DataWithPageListDashBoardResponse = {
    currentPage?: number;
    total?: number;
    data?: ListDashBoardResponse[];
  };

  type DataWithPageListStatusPageResponse = {
    currentPage?: number;
    total?: number;
    data?: ListStatusPageResponse[];
  };

  type DataWithPageNoticeResponse = {
    currentPage?: number;
    total?: number;
    data?: NoticeResponse[];
  };

  type DataWithPageTokenGetMetricResponse = {
    data?: GetMetricResponse[];
    pageToken?: string;
  };

  type DataWithPageTokenMetricMetadata = {
    data?: MetricMetadata[];
    pageToken?: string;
  };

  type DataWithPageTokenMetricMetadataAggregated = {
    data?: MetricMetadataAggregated[];
    pageToken?: string;
  };

  type deleteAlarmParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type deleteCanaryParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type deleteStatusPageParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type deleteStatusPageServiceParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type DeleteStatusPageServiceRequest = {
    uuid: string;
    type: 'Alarm' | 'Canary' | 'Manual';
  };

  type deleteThirdPartyKeyParams = {
    id: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type deleteWebhookParams = {
    id: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type describeCanaryParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type DescribeCanaryResponse = {
    uuid?: string;
    name?: string;
    intervalMinutes?:
      | 'MINUTES_1'
      | 'MINUTES_5'
      | 'MINUTES_30'
      | 'MINUTES_60'
      | 'MINUTES_360'
      | 'MINUTES_720';
    enabled?: boolean;
    httpUrl?: string;
    httpMethod?: string;
    httpHeader?: string;
    httpBody?: string;
    alarmUuid?: string;
    dataPointsToAlarm?: number;
    receivers?: AlarmReceiver[];
    canaryResponseTime?: MetricMetadata;
    status?: 'SUCCESS' | 'ERROR' | 'INITIAL' | 'NO_DATA';
    canaryHistory?: CanaryHistoryData[];
    canaryUniqueHistory?: CanaryHistoryData[];
  };

  type describeStatusPage1Params = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type describeStatusPageParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type DescribeStatusPageResponse = {
    uuid?: string;
    name?: string;
    description?: string;
    visible?: boolean;
    createTime?: string;
    services?: StatusPageServiceResponse[];
  };

  type describeWebhookParams = {
    id: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type DescribeWebhookResponse = {
    id?: number;
    name?: string;
    url?: string;
    payload?: string;
  };

  type Edge = {
    childUuid?: string;
    parentUuid?: string;
  };

  type EmptyResponse = {
    success?: boolean;
    errorMessage?: string;
    requestId?: string;
  };

  type GetAggregatedMetricRequest = {
    startTime?: string;
    endTime?: string;
    period?: number;
    statistic?: 'SampleCount' | 'Sum' | 'Average' | 'Minimum' | 'Maximum' | 'p99' | 'p95' | 'p90';
    metricName?: string;
    groupBy?: string;
    /** 数据量不大，暂不需要分页。保留pageToken参数，方便以后扩展 */
    pageToken?: string;
  };

  type getAggregatedMetricsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getAlarmChildParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getAlarmCompositeParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetAlarmCompositeResponse = {
    uuid?: string;
    description?: string;
    creator?: string;
    createdTime?: string;
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    reason?: string;
    updatedTimestamp?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
    history?: AlarmHistory[];
    alarmRules?: CompositeAlarmRule[];
    receivers?: AlarmReceiver[];
    childrenAlarm?: ChildrenAlarm[];
  };

  type GetAlarmEdgeResponse = {
    edges?: Edge[];
    nodes?: AlarmNode[];
  };

  type getAlarmExpressionParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetAlarmExpressionResponse = {
    uuid?: string;
    description?: string;
    creator?: string;
    createdTime?: string;
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    period?: number;
    threshold?: number;
    dataPointsToAlarm?: number;
    evaluationPeriods?: number;
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    reason?: string;
    updatedTimestamp?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
    metricQueries?: MetricGetQuery[];
    history?: AlarmHistory[];
    receivers?: AlarmReceiver[];
  };

  type GetAlarmNodeResponse = {
    nodes?: AlarmNode[];
  };

  type getAlarmParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getAlarmParentParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetAlarmResponse = {
    uuid?: string;
    description?: string;
    creator?: string;
    createdTime?: string;
    statistic?: 'SampleCount' | 'Average' | 'Sum' | 'Minimum' | 'Maximum';
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    threshold?: number;
    period?: number;
    dataPointsToAlarm?: number;
    evaluationPeriods?: number;
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    reason?: string;
    updatedTimestamp?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
    history?: AlarmHistory[];
    metric?: MetricMetadata;
    receivers?: AlarmReceiver[];
  };

  type getAllThirdPartyKeyParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getDashBoardParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetDashBoardRequest = {
    uuid?: string;
  };

  type GetDashBoardsResponse = {
    name?: string;
    type?: string;
    config?: string;
    createdTime?: string;
    updatedTime?: string;
  };

  type getEdgesForGraphContainingParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getEdgesForGraphContainingV2Params = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getMetricExpressionParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetMetricExpressionRequest = {
    startTime: string;
    endTime: string;
    metricQueries: MetricGetQuery[];
  };

  type GetMetricExpressionResponse = {
    /** 跟请求发过来的 id 对应。用 id 对应发过来的是哪个指标或者运算。 */
    id?: string;
    name?: string;
    dataPoints?: DataPoint[];
  };

  type GetMetricRequest = {
    startTime?: string;
    endTime?: string;
    period?: number;
    statistic?: 'SampleCount' | 'Sum' | 'Average' | 'Minimum' | 'Maximum' | 'p99' | 'p95' | 'p90';
    metrics?: MetricMetadata[];
    /** 不发送返回第一页，给出上次的返回下一页。 */
    pageToken?: string;
  };

  type GetMetricResponse = {
    name?: string;
    metadata?: KeyValue[];
    tags?: KeyValue[];
    dataPoints?: DataPoint[];
  };

  type getMetricsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getMetricsTagKeysParams = {
    metricName: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getMetricsTagPairsParams = {
    metricName: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getNotificationsParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type getStatusPageHistoryParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GetStatusPageHistoryRequest = {
    /** 状态页的 uuid */
    uuid: string;
    /** 开始日期 */
    startDate: string;
    /** 结束日期 */
    endDate: string;
  };

  type getUnreadNotificationsParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type GiftCardVerifyResult = {
    verified?: boolean;
    days?: number;
  };

  type IDResponse = {
    id?: number;
  };

  type isAlarmAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type isAPIAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type isDashboardAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type isDatabaseAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type isMetricAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type isNotificationAliveParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type JsonNode = true;

  type KeyValue = {
    key?: string;
    value?: string;
  };

  type ListAlarmResponse = {
    uuid?: string;
    description?: string;
    status?: string;
    reason?: string;
    updatedTimestamp?: string;
    type?: 'NORMAL' | 'EXPRESSION' | 'COMPOSITE';
    receivers?: AlarmReceiver[];
  };

  type listAlarmsParams = {
    currentPage: number;
    size?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type listCanariesParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type ListCanaryResponse = {
    uuid?: string;
    name?: string;
    intervalMinutes?:
      | 'MINUTES_1'
      | 'MINUTES_5'
      | 'MINUTES_30'
      | 'MINUTES_60'
      | 'MINUTES_360'
      | 'MINUTES_720';
    enabled?: boolean;
    httpUrl?: string;
    httpMethod?: string;
    httpBody?: string;
    httpHeader?: string;
    alarmUuid?: string;
    status?: 'SUCCESS' | 'ERROR' | 'INITIAL' | 'NO_DATA';
  };

  type ListDashBoardResponse = {
    uuid?: string;
    name?: string;
    createdTime?: string;
    updatedTime?: string;
    type?: string;
  };

  type listDashBoardsParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type listMetricAggregatedParams = {
    /** 不发送返回第一页，给出上次的返回下一页。 */
    pageToken?: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type listMetricsParams = {
    /** 不发送返回第一页，给出上次的返回下一页。 */
    pageToken?: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type listStatusPageParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type ListStatusPageResponse = {
    uuid?: string;
    name?: string;
    description?: string;
    visible?: boolean;
  };

  type listWebhookParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type LoginBody = {
    type?: string;
    currentAuthority?: string;
  };

  type LoginForm = {
    username?: string;
    password?: string;
  };

  type loginParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type logoutParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type MetricDataPoint = {
    timestamp?: string;
    values?: number[];
  };

  type MetricGetAggregated = {
    /** 指标名 */
    metricName: string;
    function: 'AVG' | 'COUNT' | 'MAX' | 'MIN' | 'SUM';
    /** 筛选条件，用在 metric insights query/sql 的 where 部分 */
    where?: KeyValue[];
    /** 分组依据，用在 metric insights query/sql 的 group by 部分。如果用了 group by，会返回多条结果。 */
    groupBy?: string[];
  };

  type MetricGetQuery = {
    id: string;
    /** 数据点的间隔时间 */
    period?: number;
    metricStat?: MetricGetStat;
    /** 数学运算。如果在这里引用 m1，那么就需要添加 id 为 m1 的 metricStat。https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/using-metric-math.html */
    mathExpression?: string;
    aggregatedExpression?: MetricGetAggregated;
  };

  type MetricGetStat = {
    statistic: 'SampleCount' | 'Sum' | 'Average' | 'Minimum' | 'Maximum' | 'p99' | 'p95' | 'p90';
    metadata: MetricMetadata;
  };

  type MetricMetadata = {
    name: string;
    metadata: KeyValue[];
    tags: KeyValue[];
  };

  type MetricMetadataAggregated = {
    name?: string;
    metadata?: KeyValue[];
    tags?: Record<string, any>;
  };

  type NoticeResponse = {
    id?: number;
    read?: boolean;
    starred?: boolean;
    title?: string;
    dateTime?: string;
    description?: string;
  };

  type notifyParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type notifyTestParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type overviewParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type OverviewResponseBody = {
    UniqueMetricNamesCount?: number;
    AlarmsCount?: number;
    AlarmUniqueMetricNamesCount?: number;
    AlarmCoverageRate?: number;
    AllActiveAlarms?: ListAlarmResponse[];
  };

  type proxyToOpenAIParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type putDashBoardParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type PutDashBoardRequest = {
    uuid: string;
    config: string;
  };

  type PutMetric = {
    name?: string;
    tags?: Record<string, any>;
    dataPoints?: MetricDataPoint[];
  };

  type putMetricParams = {
    'Content-Encoding': string;
    'Accept-Encoding': string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type putMetricsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type readNotificationParams = {
    id: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type RegisterForm = {
    username?: string;
    password?: string;
  };

  type registerParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type RegisterResponse = {
    username?: string;
    password?: string;
    uuid?: string;
  };

  type RemoveDashBoardRequest = {
    uuid?: string;
  };

  type removeDashBoardsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type ResponseAddAlarmExpressionResponse = {
    success?: boolean;
    data?: AddAlarmExpressionResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseAddAlarmResponse = {
    success?: boolean;
    data?: AddAlarmResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseAddCanaryResponse = {
    success?: boolean;
    data?: AddCanaryResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseAddDashBoardResponse = {
    success?: boolean;
    data?: AddDashBoardResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseCurrentUserBody = {
    success?: boolean;
    data?: CurrentUserBody;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageListAlarmResponse = {
    success?: boolean;
    data?: DataWithPageListAlarmResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageListCanaryResponse = {
    success?: boolean;
    data?: DataWithPageListCanaryResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageListDashBoardResponse = {
    success?: boolean;
    data?: DataWithPageListDashBoardResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageListStatusPageResponse = {
    success?: boolean;
    data?: DataWithPageListStatusPageResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageNoticeResponse = {
    success?: boolean;
    data?: DataWithPageNoticeResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageTokenGetMetricResponse = {
    success?: boolean;
    data?: DataWithPageTokenGetMetricResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageTokenMetricMetadata = {
    success?: boolean;
    data?: DataWithPageTokenMetricMetadata;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDataWithPageTokenMetricMetadataAggregated = {
    success?: boolean;
    data?: DataWithPageTokenMetricMetadataAggregated;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDescribeCanaryResponse = {
    success?: boolean;
    data?: DescribeCanaryResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDescribeStatusPageResponse = {
    success?: boolean;
    data?: DescribeStatusPageResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseDescribeWebhookResponse = {
    success?: boolean;
    data?: DescribeWebhookResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetAlarmCompositeResponse = {
    success?: boolean;
    data?: GetAlarmCompositeResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetAlarmEdgeResponse = {
    success?: boolean;
    data?: GetAlarmEdgeResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetAlarmExpressionResponse = {
    success?: boolean;
    data?: GetAlarmExpressionResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetAlarmNodeResponse = {
    success?: boolean;
    data?: GetAlarmNodeResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetAlarmResponse = {
    success?: boolean;
    data?: GetAlarmResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGetDashBoardsResponse = {
    success?: boolean;
    data?: GetDashBoardsResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseGiftCardVerifyResult = {
    success?: boolean;
    data?: GiftCardVerifyResult;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseIDResponse = {
    success?: boolean;
    data?: IDResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListDescribeWebhookResponse = {
    success?: boolean;
    data?: DescribeWebhookResponse[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListGetMetricExpressionResponse = {
    success?: boolean;
    data?: GetMetricExpressionResponse[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListGetMetricResponse = {
    success?: boolean;
    data?: GetMetricResponse[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListKeyValue = {
    success?: boolean;
    data?: KeyValue[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListString = {
    success?: boolean;
    data?: string[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseListThirdPartyKey = {
    success?: boolean;
    data?: ThirdPartyKey[];
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseLoginBody = {
    success?: boolean;
    data?: LoginBody;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseMapLocalDateMapStatusPageStatusSetString = {
    success?: boolean;
    data?: Record<string, any>;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseOverviewResponseBody = {
    success?: boolean;
    data?: OverviewResponseBody;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseRegisterResponse = {
    success?: boolean;
    data?: RegisterResponse;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseString = {
    success?: boolean;
    data?: string;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseThirdPartyKey = {
    success?: boolean;
    data?: ThirdPartyKey;
    errorMessage?: string;
    requestId?: string;
  };

  type ResponseUUIDResponseBody = {
    success?: boolean;
    data?: UUIDResponseBody;
    errorMessage?: string;
    requestId?: string;
  };

  type SearchAlarmRequest = {
    /** alarm 名称 */
    query?: string;
    currentPage?: number;
    size?: number;
  };

  type searchAlarmsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type searchCanariesParams = {
    currentPage?: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type SearchCanariesRequest = {
    name?: string;
  };

  type setNotificationStarredParams = {
    id: number;
    starred: boolean;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type StatusPageServiceResponse = {
    /** 该服务的uuid */
    uuid?: string;
    /** 服务的名字，需要唯一。暂时没有唯一性校验。 */
    name?: string;
    /** 服务的种类 */
    type?: 'Alarm' | 'Canary' | 'Manual';
    /** 如果 type 是 Alarm 填 Alarm 的 UUID，如果 type 是 Canary 填 Canary 的 UUID，如果是 Manual 留空。 */
    referencedUUID?: string;
    status?: 'Operational' | 'Degraded' | 'Outage' | 'Maintaining';
    reason?: string;
  };

  type ThirdPartyKey = {
    id?: number;
    platformName?: 'AWS' | 'GOOGLE_CLOUD' | 'AZURE' | 'ALIYUN' | 'TENCENT_CLOUD';
    value?: string;
  };

  type updateAlarmCompositeParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateAlarmCompositeRequest = {
    /** 告警名称 */
    description?: string;
    /** 告警规则 */
    alarmRules?: CompositeAlarmRule[];
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type updateAlarmExpressionParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateAlarmExpressionRequest = {
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    description?: string;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    threshold?: number;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    dataPointsToAlarm?: number;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    evaluationPeriods?: number;
    /** 当 type 为 expression 时，该字段必选，老数据不保留。 */
    metricQueries?: MetricGetQuery[];
    /** 更新该字段可以更新 reason */
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    /** 更新该字段要求 status 字段必选 */
    reason?: string;
    /** 可选，老数据保留。 */
    receivers?: AlarmReceiver[];
  };

  type updateAlarmParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateAlarmRequest = {
    metric?: MetricMetadata;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    description?: string;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    statistic?: 'SampleCount' | 'Average' | 'Sum' | 'Minimum' | 'Maximum';
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    comparator?:
      | 'GreaterThanOrEqualToThreshold'
      | 'GreaterThanThreshold'
      | 'LessThanThreshold'
      | 'LessThanOrEqualToThreshold'
      | 'LessThanLowerOrGreaterThanUpperThreshold'
      | 'LessThanLowerThreshold'
      | 'GreaterThanUpperThreshold';
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    threshold?: number;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    period?: number;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    dataPointsToAlarm?: number;
    /** 如果更新非 status reason receivers 中任何一个，该字段必选，老数据不保留。 */
    evaluationPeriods?: number;
    /** 更新该字段可以更新 reason */
    status?: 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
    /** 更新该字段要求 status 字段必选 */
    reason?: string;
    /** 可选，老数据保留。 */
    receivers?: AlarmReceiver[];
  };

  type updateCanaryLambdaParams = {
    uuid: string;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type updateCanaryParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateCanaryRequest = {
    uuid: string;
    /** 拨测的名字，需要唯一。暂时没有唯一性校验。 */
    name?: string;
    /** 拨测的频率。 */
    intervalMinutes?:
      | 'MINUTES_1'
      | 'MINUTES_5'
      | 'MINUTES_30'
      | 'MINUTES_60'
      | 'MINUTES_360'
      | 'MINUTES_720';
    /** 是否启用 */
    enabled?: boolean;
    /** 拨测的 url，需要包含协议头。 */
    httpUrl: string;
    /** 拨测发起 http 的请求方法 */
    httpMethod: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE';
    /** 拨测发起 http 的请求头 */
    httpHeader?: string;
    /** 拨测发起 http 的请求体 */
    httpBody?: string;
    /** 出发报警的数据点个数 */
    dataPointsToAlarm: number;
    /** type 是 sms，填手机号。web 填 username，email 填邮箱，webhook 填 webhook id。 */
    receivers?: AlarmReceiver[];
  };

  type updateDashboardParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateDashboardRequest = {
    uuid: string;
    name: string;
  };

  type updateStatusPageParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateStatusPageRequest = {
    uuid?: string;
    /** 状态页的名字，需要唯一。暂时没有唯一性校验。 */
    name: string;
    /** 状态页描述。 */
    description?: string;
    /** 状态页是否公开。 */
    visible?: boolean;
  };

  type updateStatusPageServiceParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateStatusPageServiceRequest = {
    uuid?: string;
    /** 服务的名字，需要唯一。暂时没有唯一性校验。 */
    name?: string;
    /** 服务的种类 */
    type: 'Alarm' | 'Canary' | 'Manual';
    /** 如果 type 是 Alarm 填 Alarm 的 UUID，如果 type 是 Canary 填 Canary 的 UUID，如果是 Manual 留空。 */
    referencedUUID?: string;
    /** 如果 type 是 Manual，这个状态必填。如果是 Alarm 和 Canary，留空。 */
    status?: 'Operational' | 'Degraded' | 'Outage' | 'Maintaining';
    /** 如果 type 是 Manual，这个状态必填。如果是 Alarm 和 Canary，留空。 */
    reason?: string;
  };

  type updateThirdPartyKeyParams = {
    id: number;
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateThirdPartyKeyRequest = {
    value?: string;
  };

  type updateWebhookParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type UpdateWebhookRequest = {
    id?: number;
    name?: string;
    url?: string;
    payload?: string;
  };

  type UUIDResponseBody = {
    uuid?: string;
  };

  type verifyGiftCardParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type VerifyGiftCardRequest = {
    code?: string;
  };

  type wildcardSearchMetricsAggregatedParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type wildcardSearchMetricsParams = {
    /** ACCESS-KEY */
    'ACCESS-KEY'?: string;
  };

  type WildcardSearchMetricsRequest = {
    query?: string;
    /** 不发送返回第一页，给出上次的返回下一页。 */
    pageToken?: string;
  };
}
