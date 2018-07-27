import React from 'react'
import { Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const AppealReason = ({ form, appealLabel, formItemLayout, field, validator }) => {
	const { getFieldDecorator } = form;

	return (
		<FormItem label={appealLabel} {...formItemLayout}>
			{getFieldDecorator(field, {
				rules: [{
					required: true, message: `请输入${appealLabel}`, whitespace: true,
				}, {
					validator: validator, message: `${appealLabel}不能超过1000个字`,
				}],
			})(
				<TextArea
					placeholder={`请输入${appealLabel}(不超过1000个字)`}
					autosize={{ minRows: 4, maxRows: 10 }}
					size={'large'}
				/>,
			)}
		</FormItem>
	)
}

export default AppealReason