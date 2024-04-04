// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增 webhook POST /api/v0/webhook/add */
export async function addWebhook(body: API.AddWebhookRequest, options?: { [key: string]: any }) {
  return request<API.ResponseIDResponse>('/api/v0/webhook/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除 webhook POST /api/v0/webhook/delete/${param0} */
export async function deleteWebhook(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteWebhookParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.EmptyResponse>(`/api/v0/webhook/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询 webhook POST /api/v0/webhook/describe/${param0} */
export async function describeWebhook(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.describeWebhookParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ResponseDescribeWebhookResponse>(`/api/v0/webhook/describe/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询当前用户所有的 Webhook GET /api/v0/webhook/list */
export async function listWebhook(options?: { [key: string]: any }) {
  return request<API.ResponseListDescribeWebhookResponse>('/api/v0/webhook/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改 webhook POST /api/v0/webhook/update */
export async function updateWebhook(
  body: API.UpdateWebhookRequest,
  options?: { [key: string]: any },
) {
  return request<API.EmptyResponse>('/api/v0/webhook/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
