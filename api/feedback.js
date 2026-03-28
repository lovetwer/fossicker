import { get, post, putWithQuery } from './request.js'

// 提交反馈
export const submitFeedback = (data) => {
	return post('/feedback', data)
}

// 查看我的反馈
export const getMyFeedback = (params) => {
	return get('/feedback/my', params)
}

// 管理员查看反馈列表
export const getFeedbackList = (params) => {
	return get('/admin/feedback', params)
}

// 管理员回复反馈
export const replyFeedback = (id, reply) => {
	return putWithQuery(`/admin/feedback/${id}/reply`, { reply })
}
