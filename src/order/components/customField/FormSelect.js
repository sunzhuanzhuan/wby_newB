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


const FormSelect = ({ form, name, label, multiple = false, options = [], supportSearch = false }) => {
	const { getFieldDecorator } = form;
	const mode = multiple ? 'multiple' : '';
	const optionsEl = options.map((item, key) => <Option key={key} value={item.id}>{item.name}</Option>);
	const onSelect = (/*value, option*/) => {
		// console.log(value, option)
	}
	if (multiple === true) {
		return (
			<div style={{ display: 'block' }}>

					<FormItem {...formItemLayout} label={label}>
						{getFieldDecorator(name)(
							<Select
								mode={mode}
								style={{width: 700}}
								onSelect={(value, option) => onSelect(value, option)}
								getPopupContainer={triggerNode => triggerNode.parentNode}
								placeholder={`请选择${label}`}
								optionFilterProp={supportSearch ? 'children' : ''}
							>
								{optionsEl}
							</Select>
						)}
					</FormItem>
			</div>
		)
	} else {
		return (
			<FormItem {...formItemLayout} label={label}>
				{getFieldDecorator(name, {
					initialValue: "0"
				})(
					<Select mode={mode} style={{ width: 120 }}
						onSelect={(value, option) => onSelect(value, option)}
						getPopupContainer={triggerNode => triggerNode.parentNode}
					>
						{optionsEl}
					</Select>
				)}
			</FormItem>
		)
	}

}

FormSelect.propTypes = {
	form: PropTypes.object,
	name: PropTypes.string,
	options: PropTypes.array,
	multiple: PropTypes.bool,
	label: PropTypes.string
}

export default FormSelect

