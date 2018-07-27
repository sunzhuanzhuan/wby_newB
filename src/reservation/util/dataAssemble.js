const appealDataAssemble = ({ order_id, upload_token, appealFormList, values }) => {

	let assembleValues = { ...values }
	appealFormList.map((value, line) => {
		let data = assembleValues.data
		data[line]['platform_id'] = value.platform_id;

		if (value.data_screenshot && value.data_screenshot.record_items) {
			value.data_screenshot.record_items.map((recordItem, index) => {
				data[line]['data_screenshot']['record_items'][index]['item_id'] = recordItem.item_id
			})
		}
	})

	assembleValues.order_id = order_id;
	assembleValues.upload_token = upload_token

	return assembleValues
}

export {
	appealDataAssemble
}