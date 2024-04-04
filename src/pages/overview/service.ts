import { APIResponse } from '@/types/apiResponse';
import { request } from '@umijs/max';

export async function getUsageInfo() {
  const res = await request<
    APIResponse<{
      current: number;
      total: number;
      locked: boolean;
    }>
  >('/api/v0/usageInfo', {
    method: 'GET',
  });
  return res.data;
}
