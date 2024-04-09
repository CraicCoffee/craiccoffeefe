// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
export type ResponseType<T> = T | API.ErrorResponse;

// 创建风味描述 POST /api/flavor-profiles
export async function createFlavorProfile(
  body: API.FlavorProfileCreateRequest,
  options?: { [key: string]: any },
) {
  console.log('createFlavorProfile', body.brewId)
  return request<ResponseType<API.FlavorProfile>>('/api/flavor-profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body), // 确保 body 被字符串化为 JSON
    ...(options || {}),
  });
}

// 获取风味描述 GET /api/flavor-profiles/:id
export async function getFlavorProfile(
  id: string,
  options?: { [key: string]: any },
) {
  return request<ResponseType<API.FlavorProfile>>(`/api/flavor-profiles/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 更新风味描述 PATCH /api/flavor-profiles/:id
export async function updateFlavorProfile(
  id: string,
  body: API.FlavorProfileUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<ResponseType<API.FlavorProfile>>(`/api/flavor-profiles/${id}`, {
    method: 'PATCH',
    data: body,
    ...(options || {}),
  });
}

// 删除风味描述 DELETE /api/flavor-profiles/:id
export async function deleteFlavorProfile(
  id: string,
  options?: { [key: string]: any },
) {
  return request<ResponseType<API.FlavorProfile>>(`/api/flavor-profiles/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
