import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class RoleForm extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const { form, detail, applist } = this.props;
		const { getFieldDecorator } = form;
		const disabled = detail.app_id ? true : false
		return (
			<Form layout='horizontal'>
				<FormItem label="应用">
					{getFieldDecorator('app_id', {
						rules: [{
							required: true,
							message: '请选择应用',
						}],
						initialValue: detail.app_id
					})(
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder="请选择应用"
							disabled={disabled}
						>
							{applist.map(d => <Option value={d.app_id} key={d.app_id}>{d.app_name}</Option>)}
						</Select>
					)}
				</FormItem>
				<FormItem label="名称标识">
					{getFieldDecorator('identity_name', {
						rules: [{
							required: true,
							message: '请输入名称标识',
						}],
						initialValue: detail.identity_name
					})(
						<Input placeholder="请输入名称标识" />
					)}
				</FormItem>
				<FormItem label="中文标识">
					{getFieldDecorator('zh_name', {
						rules: [{
							required: true,
							message: '请输入中文标识',
						}],
						initialValue: detail.zh_name
					})(
						<Input placeholder="请输入中文标识" />
					)}
				</FormItem>
				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{
							message: '请输入描述',
						}],
						initialValue: detail.description
					})(
						<TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 4 }} />
					)}
				</FormItem>
			</Form>
		)
	}
}

export default Form.create()(RoleForm);
