import { request } from '@umijs/max';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface UserRegisterParams {
  email: string;
  password: string;
  confirm: string;
  phone: string;
  // captcha: string;
  // prefix: string;
}

export async function registerv1(body: API.RegisterForm, options?: { [key: string]: any }) {
  try {
    const response = await request<API.ResponseRegisterResponse>('/api/v0/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });

    console.log('API response', response); // 调试信息：打印响应数据

    // 检查响应中是否有token字段
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      console.log('Registration successful');
      return { success: true, response }; // 返回包含success字段的对象
    } else {
      console.error('Registration failed with response', response); // 打印响应数据以供调试
      return { success: false, response }; // 返回包含success字段的对象
    }
  } catch (error) {
    console.error('An error occurred during registration:', error);
    throw error; // 抛出错误，以便调用函数可以捕获并处理
  }
}
