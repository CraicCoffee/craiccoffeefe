import { request } from '@umijs/max';

/** 获取未读通知 GET /api/v0/notices */
export async function getUnreadNotifications(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUnreadNotificationsParams,
  options?: Record<string, any>,
) {
  return request<API.ResponseDataWithPageNotice>('/api/v0/notices', {
    method: 'GET',
    params: {
      // currentPage has a default value: 1
      currentPage: '1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取所有通知 GET /api/v0/notices/all */
export async function noticesAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getNotificationsParams,
  options?: Record<string, any>,
) {
  return request<API.ResponseDataWithPageNotice>('/api/v0/notices/all', {
    method: 'GET',
    params: {
      // currentPage has a default value: 1
      currentPage: '1',
      ...params,
    },
    ...(options || {}),
  });
}

/** 已读 GET /api/v0/notices/read/ */
export async function noticesRead(params: object, options?: Record<string, any>) {
  return request('/api/v0/notices/read/', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
