import React, { Component } from 'react'
import { Form, Input } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

class SourceRule extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	render() {
		const { form, detail = {} } = this.props;
		const { getFieldDecorator } = form;
		const reg = /^.{3,50}$/
		return (
			<Form layout='horizontal'>
				<FormItem label="名称">
					{getFieldDecorator('show_name', {
						rules: [{
							pattern: reg, message: '请输入3-50个字符'
						}, {
							required: true,
							message: '请输入名称',
						}],
						initialValue: detail.show_name
					})(
						<Input placeholder="请输入名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="类名">
					{getFieldDecorator('class_name', {
						rules: [{
							pattern: reg, message: '请输入3-50个字符'
						}, {
							required: true,
							message: '请输入类名',
						}],
						initialValue: detail.class_name
					})(
						<Input placeholder="请输入类名" />
					)}
				</FormItem>
				<FormItem label="描述">
					{getFieldDecorator('description', {
						rules: [{
							pattern: /^.{1,300}$/, message: '请输入1-300个字符'
						}, {
							required: true,
							message: '请输入描述',
						}],
						initialValue: detail.description
					})(
						<TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 4 }} maxLength="300" />
					)}
				</FormItem>
			</Form>
		)
	}
}

export default Form.create()(SourceRule);
