// 请求封装
//const BASE_URL = 'http://101.126.90.167:8080'
//const BASE_URL = 'http://192.168.31.86:8080'
const BASE_URL = 'https://yeiviicucucv.ap-northeast-1.clawcloudrun.com'
// 请求拦截
const request = (options) => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				'Authorization': token ? `Bearer ${token}` : '',
				...options.header
			},
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data)
				} else if (res.statusCode === 401) {
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.showToast({
						title: '登录已过期',
						icon: 'none'
					})
					reject(res.data)
				} else {
					// 不显示toast，让业务层处理
					reject(res.data)
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export const get = (url, params = {}) => {
	return request({
		url,
		method: 'GET',
		data: params
	})
}

export const post = (url, data = {}) => {
	return request({
		url,
		method: 'POST',
		data
	})
}

export const put = (url, data = {}) => {
	return request({
		url,
		method: 'PUT',
		data
	})
}

export const del = (url, data = {}) => {
	return request({
		url,
		method: 'DELETE',
		data
	})
}

export const postWithQuery = (url, data = {}) => {
	const queryString = Object.entries(data)
		.filter(([_, v]) => v !== undefined && v !== null && v !== '')
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&')
	const fullUrl = queryString ? `${url}?${queryString}` : url
	return request({
		url: fullUrl,
		method: 'POST'
	})
}

export const putWithQuery = (url, data = {}) => {
	const queryString = Object.entries(data)
		.filter(([_, v]) => v !== undefined && v !== null && v !== '')
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
		.join('&')
	const fullUrl = queryString ? `${url}?${queryString}` : url
	return request({
		url: fullUrl,
		method: 'PUT'
	})
}

export default request
