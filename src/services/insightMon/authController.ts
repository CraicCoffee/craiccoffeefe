// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v0/auth/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.ResponseCurrentUserBody>('/api/v0/auth/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/auth/login */
export async function login(body: API.LoginForm, options?: { [key: string]: any }) {
  return request<API.ResponseLoginBody>('/api/v0/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.EmptyResponse>('/api/v0/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/auth/register */
export async function register(body: API.RegisterForm, options?: { [key: string]: any }) {
  return request<API.ResponseRegisterResponse>('/api/v0/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
