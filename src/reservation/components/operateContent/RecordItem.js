import React from 'react'
import { Form, InputNumber } from 'antd'
import '../../components/FormContainer.less'
const RecordItem = ({ form, line, item = {}, validator, itemIndex }) => {
	const { getFieldDecorator } = form;
	const FormItem = Form.Item;

	let field = `data[${line}][data_screenshot][record_items][${itemIndex}][value]`
	let intInputEl = <InputNumber maxLength={9} min={0} size={'small'} className="input" />
	let dobuleEl = <InputNumber max={100} min={0} size={'small'} className="input" />
	return (
		<FormItem
			label={item.display}
		>
			{getFieldDecorator(field, {
				rules: [{
					required: item.needed === '1' && item.required === '1',
					message: '请输入' + item.display

				}, {
					required: item.needed === '1' && item.required === '1',
					type: item.type,
					validator: validator,
					message: ''
				}]
			})(
				item.type === 'int' ? intInputEl : dobuleEl
			)}
		</FormItem>
	)
}
export default RecordItem
