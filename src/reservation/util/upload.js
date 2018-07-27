import { message, notification } from 'antd'

export const uploadProps = {
	listType: 'picture-card',
	accept: 'image/png, image/gif, image/jpeg, image/jpg',
	action: '/upload/upload',
	name: 'qqfile',
	multiple: true,
	onPreview: handlePreview,
}

/**
 *
 * @param file 判断文件大小
 * @returns {Promise}
 */
export function beforeUpload(file) {
	const isLt5M = maxSize(file, 5);
	let limit = this.limit;
	let reg = convertToRegExp(uploadProps.accept);

	return new Promise((resolve, reject) => {

		if (isLt5M || !reg.test(file.type)) {
			message.error(`仅支持jpg、jpeg、png、gif格式的图片上传，单附件大小<=5MB，最多${limit}张`);
			reject();
		} else {
			resolve(file)
		}
	})
}

/**
 *
 * @param file 上传文件
 * @param size 大小
 * @returns {boolean}
 */
export function maxSize(file, size) {
	return file.size / 1024 / 1024 > size
}

export function handlePreview(file) {
	window.open(file.response.data.url)
}

/**
 * @desc获取文件的filepath
 * @param fileList
 */
export function getFilePath(fileList) {
	return fileList.map((item) => {
		if (item.status === 'done' && item.response.code === 1000) {
			return item.response.data.filepath
		}
	})
}

/**
 *
 * @param fileList 文件列表
 * @param limit 上传个数限制
 */
export function filterFileList(fileList, limit) {
	return fileList.filter((item) => {
		if (item.response) {

			if (item.response.code !== 1000) {
				notification.error({
					message: item.response.msg || item.response.message || '请求出错了'
				});
			}

			if (item.response.code === 1000) {
				return item
			}

		}
	}).splice(0, limit)
}

/**
 * 把accept转换成正则
 * @param accept
 */

function convertToRegExp(accept) {
	let acceptAry = accept.split(',');
	let processed = acceptAry
		.map(item => `(${item.replace(/(^\s*)|(\s*$)/g, '')})`)
		.join('|');

	return new RegExp(processed)
}