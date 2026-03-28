// 羊毛信息接口

import { get, post, put, del } from './request.js'

// 获取羊毛列表
export const getDealList = (params) => {
	return get('/deals', params)
}

// 获取羊毛详情
export const getDealDetail = (id) => {
	return get(`/deals/${id}`)
}

// 发布羊毛
export const publishDeal = (data) => {
	return post('/deals', data)
}

// 更新羊毛
export const updateDeal = (id, data) => {
	return put(`/deals/${id}`, data)
}

// 删除羊毛
export const deleteDeal = (id) => {
	return del(`/deals/${id}`)
}

// 点赞
export const likeDeal = (id) => {
	return post(`/deals/${id}/like`)
}

// 取消点赞
export const unlikeDeal = (id) => {
	return del(`/deals/${id}/like`)
}

// 收藏
export const favoriteDeal = (id) => {
	return post(`/deals/${id}/favorite`)
}

// 取消收藏
export const unfavoriteDeal = (id) => {
	return del(`/deals/${id}/favorite`)
}

// 获取评论列表
export const getComments = (dealId, params) => {
	return get(`/deals/${dealId}/comments`, params)
}

// 发表评论
export const postComment = (dealId, data) => {
	return post(`/deals/${dealId}/comments`, data)
}

// ========== 分类接口 ==========

// 获取分类列表
export const getCategories = () => {
	return get('/categories')
}

// ========== 搜索接口 ==========

// 搜索羊毛
export const searchDeals = (params) => {
	return get('/deals/search', params)
}

// 创建分类（管理员）
export const createCategory = (data) => {
	return post('/categories', data)
}

// ========== 管理员接口 ==========

// 获取待审核列表
export const getPendingDeals = (params) => {
	return get('/admin/deals/pending', params)
}

// 获取审核列表
export const getAuditDeals = (params) => {
	return get('/admin/deals', params)
}

// 审核通过
export const approveDeal = (id) => {
	return put(`/admin/deals/${id}/approve`)
}

// 审核拒绝
export const rejectDeal = (id) => {
	return put(`/admin/deals/${id}/reject`)
}

// 下架
export const offlineDeal = (id) => {
	return put(`/admin/deals/${id}/offline`)
}
