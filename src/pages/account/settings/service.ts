import { request } from '@umijs/max';
import type { CurrentUser, GeographicItemType, ThirdPartyKey, Webhook } from './data';

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request('/api/accountSettingCurrentUser');
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

export function verifyGiftCard(code: string) {
  return request<{
    data: {
      verified: boolean;
      days: number;
    };
  }>('/api/v0/giftCard/verify', {
    method: 'POST',
    data: {
      code,
    },
  });
}

export function getAllThirdPartyKeys() {
  return request<{
    data: ThirdPartyKey[];
  }>('/api/v0/thirdPartyKey/all');
}

export function addThirdPartyKey(data: { platformName: string; value: string }) {
  return request(`/api/v0/thirdPartyKey/add`, {
    method: 'POST',
    data,
  });
}

export function updateThirdPartyKey(id: number, data: { value: string }) {
  return request(`/api/v0/thirdPartyKey/${id}/update`, {
    method: 'POST',
    data,
  });
}

export function deleteThirdPartyKey(id: number) {
  return request(`/api/v0/thirdPartyKey/${id}/delete`, {
    method: 'POST',
  });
}

export async function getAllWebhooks() {
  const res = await request<{
    data: Webhook[];
  }>('/api/v0/webhook/list');
  return res.data;
}

export async function addWebhook(data: Omit<Webhook, 'id'>) {
  const res = await request(`/api/v0/webhook/add`, {
    method: 'POST',
    data,
  });
  return res.data as void;
}

export async function updateWebhook(data: Webhook) {
  const res = await request(`/api/v0/webhook/update`, {
    method: 'POST',
    data,
  });
  return res.data as void;
}

export async function deleteWebhook(id: number) {
  const res = await request(`/api/v0/webhook/delete/${id}`, {
    method: 'POST',
  });
  return res.data as void;
}
