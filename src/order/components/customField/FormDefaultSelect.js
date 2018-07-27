import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from 'antd';

import './formStyle.less'
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 },
};


const FormDefaultSelect = ({ form, name, label, multiple = false, options = [], initialValue = "1" }) => {
	const { getFieldDecorator } = form;
	const mode = multiple ? 'multiple' : '';
	const optionsEl = options.map((item, key) => <Option key={key} value={item.id}>{item.name}</Option>);
	const onSelect = (/*value, option*/) => {
		// console.log(value, option)
	}
	if (initialValue === "1") {
		return (
			< FormItem {...formItemLayout} label={label} >
				{
					getFieldDecorator(name, {
						initialValue: "1"
					})(

						<Select mode={mode} style={{ width: 120 }}
							onSelect={(value, option) => onSelect(value, option)}
							getPopupContainer={triggerNode => triggerNode.parentNode}
						>
							{optionsEl}
						</Select>
					)
				}
			</FormItem >
		)
	} else if (initialValue === "2") {
		return (
			< FormItem {...formItemLayout} label={label} >
				{
					getFieldDecorator(name, {
						initialValue: "2"
					})(

						<Select mode={mode} style={{ width: 120 }}
							onSelect={(value, option) => onSelect(value, option)}
							getPopupContainer={triggerNode => triggerNode.parentNode}
						>
							{optionsEl}
						</Select>
					)
				}
			</FormItem >
		)
	}

}

FormDefaultSelect.propTypes = {
	form: PropTypes.object,
	name: PropTypes.string,
	options: PropTypes.array,
	multiple: PropTypes.bool,
	label: PropTypes.string,
	initialValue: PropTypes.string
}

export default FormDefaultSelect

