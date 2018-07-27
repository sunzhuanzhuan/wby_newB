import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd';

const FormItem = Form.Item;
export const FormInput = ({ form, name, label, placeholder, className }) => {
	const { getFieldDecorator } = form;
	const divStyle = {
		display: 'inline-block'
	}
	
	return (
		<div style={divStyle}>
			<FormItem
				label={label}
				className={className}
			>
				{getFieldDecorator(name, {
					initialValue: ""
				})(
					<Input
						type="text"
						placeholder={placeholder ? placeholder : `请填写${label}`}
					/>
				)}
			</FormItem>
		</div>
	)
}
FormInput.propTypes = {
	form: PropTypes.object,
	name: PropTypes.string,
	label: PropTypes.string
}
