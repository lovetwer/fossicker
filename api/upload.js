// 文件上传接口

import { post } from './request.js'

// 上传图片
export const uploadImage = (filePath) => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		
		uni.uploadFile({
			url: 'http://192.168.31.86:8080/upload/image',
			filePath: filePath,
			name: 'file',
			header: {
				'Authorization': token ? `Bearer ${token}` : ''
			},
			success: (res) => {
				if (res.statusCode === 200) {
					const data = JSON.parse(res.data)
					resolve(data)
				} else {
					reject(new Error('上传失败'))
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
