import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class NavTypeForm extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const { form, detail = {}, applist } = this.props;
		const { getFieldDecorator } = form;
		const disabled = detail.app_id ? true : false
		return (
			<Form layout='horizontal'>
				<FormItem label="导航分类名称">
					{getFieldDecorator('name', {
						rules: [{
							pattern: /^.{2,50}$/, message: '请输入2-50个字符'
						}, {
							required: true,
							message: '请输入导航分类名称',
						}],
						initialValue: detail.name
					})(
						<Input placeholder="请输入导航分类名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="唯一名称">
					{getFieldDecorator('unique_name', {
						rules: [{
							pattern: /^[0-9a-zA-Z._]{2,50}$/, message: '唯一名称输入不符合规定'
						}, {
							required: true,
							message: '请输入唯一名称',
						}],
						initialValue: detail.unique_name
					})(
						<Input placeholder="请输入唯一名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{
							pattern: /^.{1,100}$/, message: '请输入1-100个字符'
						}, {
							message: '请输入描述',
						}],
						initialValue: detail.description
					})(
						<TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 4 }} maxLength="100" />
					)}
				</FormItem>
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
			</Form>
		)
	}
}

export default Form.create()(NavTypeForm);
