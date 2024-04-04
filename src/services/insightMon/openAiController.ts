// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 转发请求到 OpenAI POST /api/v0/openai/proxyToOpenAI */
export async function proxyToOpenAI(body: Record<string, any>, options?: { [key: string]: any }) {
  return request<API.ResponseString>('/api/v0/openai/proxyToOpenAI', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
