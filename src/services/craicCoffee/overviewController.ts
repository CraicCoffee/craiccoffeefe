// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v0/overview */
export async function overview(options?: { [key: string]: any }) {
  return request<API.ResponseOverviewResponseBody>('/api/v0/overview', {
    method: 'GET',
    ...(options || {}),
  });
}
