// 用户接口

import { get, post, put, del, postWithQuery } from './request.js'

// 登录
export const login = (data) => {
	return post('/auth/login', data)
}

// 注册
export const register = (data) => {
	return post('/auth/register', data)
}

// 获取用户信息
export const getUserInfo = () => {
	return get('/user/info')
}

// 更新用户信息
export const updateUserInfo = (data) => {
	return put('/user/info', data)
}

// 获取我的发布
export const getMyDeals = (params) => {
	return get('/user/deals', params)
}

// 获取我的收藏
export const getMyFavorites = (params) => {
	return get('/user/favorites', params)
}

// 获取消息通知
export const getNotifications = (params) => {
	return get('/user/notifications', params)
}

// 获取未读通知列表
export const getUnreadNotifications = () => {
	return get('/user/notifications/unread')
}

// 获取未读数量
export const getUnreadCount = () => {
	return get('/user/notifications/count')
}

// 标记单条消息已读
export const markNotificationRead = (id) => {
	return put(`/user/notifications/${id}/read`)
}

// 标记全部已读
export const markAllNotificationsRead = () => {
	return put('/user/notifications/read-all')
}

// 删除通知
export const deleteNotification = (id) => {
	return del(`/user/notifications/${id}`)
}

// 发送通知（管理员）
export const sendNotification = (data) => {
	return postWithQuery('/admin/notifications', data)
}

// 模糊查询用户（管理员）
export const searchUsers = (keyword, params) => {
	return get('/admin/users/search', { keyword, ...params })
}

// 获取所有通知（管理员）
export const getAllNotifications = (params) => {
	return get('/admin/notifications', params)
}

// 删除通知（管理员）
export const deleteNotificationById = (id) => {
	return del(`/admin/notifications/${id}`)
}

// 获取浏览历史
export const getHistory = (params) => {
	return get('/user/history', params)
}

// 删除单条浏览记录
export const deleteHistory = (dealId) => {
	return del(`/user/history/${dealId}`)
}

// 清空浏览历史
export const clearHistory = () => {
	return del('/user/history/clear')
}
