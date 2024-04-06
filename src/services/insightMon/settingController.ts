// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/**
 * 更新用户信息
 * @param {Object} updates 要更新的用户信息
 * @param {Object} options 额外的请求配置
 * @returns {Promise}
 */
export async function updateCurrentUser(updates, options = {}) {
    // 假设您已经有了从某处获得的token，比如登录后保存在localStorage
    const token = localStorage.getItem('token');

    // 确保在调用此函数之前用户已经登录，并且token是有效的
    if (!token) {
        console.error('No token found! User must be logged in to call this function.');
        return Promise.reject('No token found! User must be logged in to call this function.');
    }

    // 准备FormData来发送文件（如果有）
    const formData = new FormData();
    Object.keys(updates).forEach(key => {
        if (key === 'avatar') {
            // 如果更新包括头像，它应该是一个文件对象
            formData.append(key, updates[key]);
        } else if (Array.isArray(updates[key])) {
            // 如果字段是数组，将其转换为JSON字符串
            formData.append(key, JSON.stringify(updates[key]));
        } else {
            // 其他情况，直接添加到FormData
            formData.append(key, updates[key]);
        }
    });

    // 设置请求头部
    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    // 删除headers中的Content-Type，以便浏览器自动设置正确的类型（对于FormData）
    if ('Content-Type' in headers) {
        delete headers['Content-Type'];
    }

    // 发送PATCH请求
    return request('/api/v0/user/settings', {
        method: 'PATCH',
        headers: headers,
        data: formData, // 使用FormData作为请求体
        ...(options || {}),
    });
}


/**
 * 修改当前用户的密码
 * @param {string} oldPassword 用户的旧密码
 * @param {string} newPassword 用户的新密码
 * @param {Object} options 额外的请求配置
 * @returns {Promise}
 */
export async function changeCurrentUserPassword(oldPassword, newPassword, options = {}) {
    // 获取存储在localStorage中的token
    const token = localStorage.getItem('token');

    // 确保在调用此函数之前用户已经登录，并且token是有效的
    if (!token) {
        console.error('No token found! User must be logged in to change password.');
        return Promise.reject('No token found! User must be logged in to change password.');
    }

    // 设置请求头部
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 发送POST请求到后端的修改密码接口
    return request('/api/v0/user/change-password', {
        method: 'POST',
        headers: headers,
        data: { // 使用data字段而不是body字段
            oldPassword,
            newPassword,
        },
        ...(options || {}),
    });
}
