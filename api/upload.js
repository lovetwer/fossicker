// 文件上传接口

//const BASE_URL = 'http://101.126.90.167:8080'
//const BASE_URL = 'http://192.168.31.86:8080'
const BASE_URL = 'https://yeiviicucucv.ap-northeast-1.clawcloudrun.com'

// 上传图片
export const uploadImage = (filePath) => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token')
		
		uni.uploadFile({
			url: BASE_URL + '/upload/image',
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
