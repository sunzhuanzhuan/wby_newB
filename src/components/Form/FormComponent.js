import React from 'react'
// import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd';
import { Checkbox } from 'antd';
const FormItem = Form.Item;


const FormItemSelect = ({ getFieldDecorator, item }) => {
	const { formItemOptions, id, fields, attr, childrenOptions = {} } = item;
	const Option = Select.Option;
	const { selectOptions = [] } = childrenOptions;
	return <FormItem {...formItemOptions}>
		{getFieldDecorator(id, fields)(
			<Select {...attr}>
				{selectOptions.map((item, i) => <Option key={i.toString(36)} value={item.value}>{item.name}</Option>)}
			</Select>
		)}
	</FormItem>
}
const FormItemInput = ({ getFieldDecorator, item }) => {
	const { formItemOptions, id, fields, attr } = item;
	return <FormItem {...formItemOptions}>
		{getFieldDecorator(id, fields)(
			<Input {...attr} />
		)}
	</FormItem>
}
const FormItemCheckbox = ({ getFieldDecorator, item }) => {
	const { formItemOptions, id, fields, attr, childrenOptions } = item;
	// const { selectOptions = [] } = childrenOptions;
	return <FormItem {...formItemOptions}>
		{getFieldDecorator(id, fields)(
			<Checkbox {...attr}>{childrenOptions.label}</Checkbox>
		)}
	</FormItem>
}

export const FormComponent = ({ form, item }) => {
	const { getFieldDecorator } = form;
	const { type } = item;
	if (type == 'input') {
		return <FormItemInput getFieldDecorator={getFieldDecorator} item={item} />
	} else if (type == 'select') {
		return <FormItemSelect getFieldDecorator={getFieldDecorator} item={item} />
	} else if (type == 'checkbox') {
		return <FormItemCheckbox getFieldDecorator={getFieldDecorator} item={item} />
	}
	return null;
}

// FormComponent.propTypes = {
// 	form: PropTypes.object.isRequired,
// 	name: PropTypes.string.isRequired,
// 	label: PropTypes.string.isRequired,
// 	placeholder: PropTypes.string.isRequired,
// 	className: PropTypes.string
// }
