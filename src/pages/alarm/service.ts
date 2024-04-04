// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/v0/alarms/add */
export async function addAlarm(body: API.AddAlarmRequest, options?: { [key: string]: any }) {
  return request<API.ResponseAddAlarmResponse>('/api/v0/alarms/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v0/alarms/delete/${param0} */
export async function deleteAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAlarmParams,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.EmptyResponse>(`/api/v0/alarms/delete/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 后端用，前端不用管。接受 event bridge 的通知，用来处理 cloudwatch alarm 的状态变更。 POST /api/v0/alarms/event */
export async function addStateChangeEvent(body: API.JsonNode, options?: { [key: string]: any }) {
  return request<API.EmptyResponse>('/api/v0/alarms/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v0/alarms/get/${param0} */
export async function getAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAlarmParams,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.ResponseGetAlarmResponse>(`/api/v0/alarms/get/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/v0/alarms/list */
export async function listAlarms(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listAlarmsParams,
  options?: { [key: string]: any },
) {
  return request<API.ResponseDataWithPageListAlarmResponse>('/api/v0/alarms/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/alarms/search */
export async function searchAlarms(body: API.SearchAlarmRequest, options?: { [key: string]: any }) {
  return request<API.ResponseDataWithPageListAlarmResponse>('/api/v0/alarms/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/alarms/update/${param0} */
export async function updateAlarm(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAlarmParams,
  body: API.UpdateAlarmRequest,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.EmptyResponse>(`/api/v0/alarms/update/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** alarms List detail*/
export async function alarmsListDetail(uuid: string, options?: any) {
  return request<API.EmptyResponse>(`/api/v0/alarms/get/${uuid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getEdgesForGraphContaining(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAlarmParams,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.ResponseGetAlarmEdgeResponse>(`/api/v0/alarms/get/edges/v2/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 检查 alarm 名字是否重复 GET /api/v0/alarms/checkName */
export async function checkName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.checkNameParams,
  options?: { [key: string]: any },
) {
  return request<API.EmptyResponse>('/api/v0/alarms/checkName', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 拿到复合告警 alarm 详情 GET /api/v0/alarms/get/composite/${param0} */
export async function getAlarmComposite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAlarmCompositeParams,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.ResponseGetAlarmCompositeResponse>(`/api/v0/alarms/get/composite/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 创建复合告警 alarm，不支持更新。 POST /api/v0/alarms/add/composite */
export async function addAlarmComposite(
  body: API.AddAlarmCompositeRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResponseAddAlarmExpressionResponse>('/api/v0/alarms/add/composite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新复合告警 alarm。 POST /api/v0/alarms/update/composite/${param0} */
export async function updateAlarmComposite(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAlarmCompositeParams,
  body: API.UpdateAlarmCompositeRequest,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.EmptyResponse>(`/api/v0/alarms/update/composite/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 拿到支持数学运算的 alarm 详情 GET /api/v0/alarms/get/expression/${param0} */
export async function getAlarmExpression(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAlarmExpressionParams,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.ResponseGetAlarmExpressionResponse>(
    `/api/v0/alarms/get/expression/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新支持数学运算的 alarm，或更新状态。 POST /api/v0/alarms/update/expression/${param0} */
export async function updateAlarmExpression(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateAlarmExpressionParams,
  body: API.UpdateAlarmExpressionRequest,
  options?: { [key: string]: any },
) {
  const { uuid: param0, ...queryParams } = params;
  return request<API.EmptyResponse>(`/api/v0/alarms/update/expression/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
