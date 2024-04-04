export enum IntervalMinutes {
  MINUTES_1 = 'MINUTES_1',
  MINUTES_5 = 'MINUTES_5',
  MINUTES_30 = 'MINUTES_30',
  MINUTES_60 = 'MINUTES_60',
  MINUTES_360 = 'MINUTES_360',
  MINUTES_720 = 'MINUTES_720',
}

// GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}

export type Canary = {
  uuid: string;
  name: string;
  intervalMinutes: IntervalMinutes;
  status: string;
  mode: string;
  target: string;
  httpUrl: string;
  httpMethod: RequestMethod;
  httpHeader: string;
  httpBody: string;
  enabled: boolean;
  alarmUuid: string;
  dataPointsToAlarm: number;
  receivers: AlarmReceiver[];
};

export type CanaryDetail = Omit<Canary, 'status'> & {
  metric: API.MetricMetadata;
};

export type AlarmReceiver = {
  receiver: string;
  type: 'Email' | 'Sms' | 'Web' | 'Webhook';
};
