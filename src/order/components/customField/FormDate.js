import React from 'react'
import PropTypes from 'prop-types'
import FormDefaultSelect from './FormDefaultSelect'
import { Form, DatePicker } from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
/**
 *
 * @param form
 * @param options: options 给默认值 防止undefined时出现默认选项 '1'。
 * @returns {XML}
 * @constructor
 */
export const FormDate = ({ form, options = [{id: '1', name: ''}] }) => {
	const { getFieldDecorator } = form;
	const rangeConfig = {
		rules: [{ type: 'array' }],
	};
	const divStyle = {
		display: 'inline-block'
	}
	return (
		<div style={divStyle} >
			<FormDefaultSelect form={form} name='time_type' options={options}></FormDefaultSelect>
			<FormItem
			>
				{getFieldDecorator('range-picker', rangeConfig)(

					<RangePicker placeholder={["开始时间", "结束时间"]} />
				)}
			</FormItem>
		</div>
	)
}
FormDate.propTypes = {
	form: PropTypes.object,
	options: PropTypes.array
}
