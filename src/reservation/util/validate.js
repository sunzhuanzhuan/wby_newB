export function validateLink(rule, value, cb) {
	if (value === '' || value == undefined) {
		return cb()
	}

	let validateError = true;
	rule.linkPrefix.map((link) => {
		if (value.substr(0, link.length) === link) {
			validateError = false
		}
	})

	validateError ? cb(rule.message) : cb()
}

export function validateRecordItem(rule, value, cb) {
	if (rule.required === false && (value === undefined || value === '')) {
		return cb()
	}

	if (value && rule.type === 'int') {
		let reg = /^[1-9]\d*$/
		if (!reg.test(value)) {
			return cb([new Error('请输入正整数')]);
		} else {
			return cb()
		}
	}

	return cb()
}

export function validateAppealReason(rule, value, cb) {
	if (value == undefined) {
		cb()
	} else {
		let len = value.replace(/(^\s+)|(\s+$)/g, '').length;
		if (len > 1000) {
			cb([new Error(rule.message)])
		} else {
			cb()
		}
	}
}

export function validateScreenShot(rule, value, cb, uploading) {
	if (uploading === true) {
		return cb()
	} else {

		if (value === undefined || Array.isArray(value) && value.length === 0) {
			return cb([rule.message])
		} else {
			return cb()
		}

	}
}