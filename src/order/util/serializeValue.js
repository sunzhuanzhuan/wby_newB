export function serializeValue(values) {
	const serializeKeyBySpace = ['weibo_name', 'company_name', 'requirement_id'];
	const serializeKeyByEnter = ['execution_evidence_code'];
	let submitValues = { ...values };

	/**
	 * @desc: 根据空格分割
	 */
	serializeKeyBySpace.forEach((item) => {
		if (item in submitValues) {
			submitValues[item] = submitValues[item].split(/\s+/)
		}
	})

	/**
	 * @desc: 根据回车符分割
	 */
	serializeKeyByEnter.forEach((item) => {
		if (item in submitValues) {
			submitValues[item] = submitValues[item].split(/,+/).map((item) => item.trim())
		}
	})

	return submitValues
}

export function processValue(value) {
	return value.split(/\n+/)
		.map(item => item.trim())
		.toString()
}