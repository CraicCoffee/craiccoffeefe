// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/v0/auth/current */
export async function currentUser(options?: { [key: string]: any }) {
  // 假设您已经有了从某处获得的token，比如登录后保存在localStorage
  const token = localStorage.getItem('token');

  // 确保在调用此函数之前用户已经登录，并且token是有效的
  if (!token) {
    console.error('No token found! User must be logged in to call this function.');
    return;
  }

  // 设置Authorization头部
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options?.headers, // 保持传入的options中的其他headers不变
  };

  return request<API.ResponseCurrentUserBody>('/api/v0/auth/current', {
    method: 'GET',
    headers: headers, // 使用新的headers对象
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/auth/login */
export async function login(body: API.LoginForm, options?: { [key: string]: any }) {
  try {
    const response = await request<API.ResponseLoginBody>('/api/v0/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });

    // 登录成功后，将token保存到localStorage中
    if (response.success) {
      localStorage.setItem('token', response.token);
      console.log('Login successful', response.message);
      // 这里还可以进行其他操作，比如跳转到主页或者显示登录成功信息
    } else {
      console.error('Login failed', response.message);
      // 这里可以处理登录失败情况，比如显示错误信息
    }

    return response; // 返回响应数据，以便调用函数可以进一步处理
  } catch (error) {
    console.error('An error occurred during login:', error);
    throw error; // 抛出错误，以便调用函数可以捕获并处理
  }
}

/** 此处后端没有提供注释 POST /api/v0/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');

  // 确保在调用此函数之前用户已经登录，并且token是有效的
  if (!token) {
    console.error('No token found! User must be logged in to call this function.');
    return;
  }

  // 设置Authorization头部
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options?.headers, // 保持传入的options中的其他headers不变
  };

  return request<API.EmptyResponse>('/api/v0/auth/logout', {
    method: 'POST',
    headers: headers, // 使用新的headers对象
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/v0/auth/register */
export async function register(body: API.RegisterForm, options?: { [key: string]: any }) {
  try {
    const response = await request<API.ResponseRegisterResponse>('/api/v0/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });

    // 注册成功后，将token保存到localStorage中
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      console.log('Registration successful');
      // 这里还可以进行其他操作，比如跳转到登录后的主页
    } else {
      console.error('Registration failed');
      // 这里可以处理注册失败情况，比如显示错误信息
    }

    return response; // 返回响应数据，以便调用函数可以进一步处理
  } catch (error) {
    console.error('An error occurred during registration:', error);
    throw error; // 抛出错误，以便调用函数可以捕获并处理
  }
}
