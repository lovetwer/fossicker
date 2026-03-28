import { get, post, put, del, postWithQuery } from './request.js'

export const createVersion = (data) => {
	return post('/version/create', data)
}

export const publishVersion = (id) => {
	return post(`/version/publish/${id}`)
}

export const unpublishVersion = (id) => {
	return post(`/version/unpublish/${id}`)
}

export const getVersionList = (params) => {
	return get('/version/list', params)
}

export const getLatestVersion = (params) => {
	return get('/version/latest', params)
}

export const checkVersionUpdate = (params) => {
	return postWithQuery('/version/check', params)
}

export const deleteVersion = (id) => {
	return del(`/version/delete/${id}`)
}