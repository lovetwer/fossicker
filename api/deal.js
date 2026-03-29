// 羊毛信息接口

import { get, post, put, del } from './request.js'

// 获取羊毛列表
export const getDealList = (params) => {
	return get('/deals', params)
}

// 获取最新发布（按发布时间倒序）
export const getLatestDeals = (params) => {
	return get('/deals/latest', params)
}

// 获取热度最高（按浏览量倒序）
export const getHotDeals = (params) => {
	return get('/deals/hot', params)
}

// 获取即将结束（按过期时间正序）
export const getEndingSoonDeals = (params) => {
	return get('/deals/ending-soon', params)
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

// 增加热度
export const addDealHot = (id, count = 1) => {
	return post(`/deals/${id}/add-hot`, null, { params: { count } })
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
