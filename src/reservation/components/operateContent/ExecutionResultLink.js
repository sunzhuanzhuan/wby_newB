import React from 'react'
import { Form, Input } from 'antd'
const FormItem = Form.Item;

function ExecutionResultLink(props) {
	const { form, field, required, linkPrefix, validator, width } = props;
	const { getFieldDecorator } = form;

	return (
		<FormItem>
			{getFieldDecorator(field, {
				rules: [{
					required: required,
					message: '请输入执行链接',
				}, {
					message: '请输入正确的执行链接',
					linkPrefix: linkPrefix,
					validator: validator,
				}],
			})(
				<Input type='text' style={{ maxWidth: width }} />,
			)}
		</FormItem>
	)
}

export default ExecutionResultLink