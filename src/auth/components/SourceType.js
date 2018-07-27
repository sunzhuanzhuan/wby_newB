import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class SourceType extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		const { form, detail = {}, type, sourceRuleList } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Form layout='horizontal'>
				<FormItem label="类型名称">
					{getFieldDecorator('name', {
						rules: [{
							pattern: /^.{3,50}$/, message: '请输入3-50个字符'
						}, {
							required: true,
							message: '请输入类型名称',
						}],
						initialValue: detail.name
					})(
						<Input placeholder="请输入类型名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="唯一标识">
					{getFieldDecorator('unique_name', {
						rules: [{
							pattern: /^[0-9a-zA-Z.-_]{3,50}$/, message: '唯一标识输入不符合规定'
						}, {
							required: true,
							message: '请输入唯一标识',
						}],
						initialValue: detail.unique_name
					})(
						<Input placeholder="请输入唯一标识" maxLength="50" />
					)}
				</FormItem>
				{
					type === "edit" ?
						<FormItem label="规则">
							{getFieldDecorator('rule_id', {
								initialValue: detail.resourceRule_show_name
							})(
								<Input disabled />
							)}
						</FormItem> :
						<FormItem label="规则">
							{getFieldDecorator('rule_id', {
								rules: [{
									required: true,
									message: '请选择规则',
								}],
								initialValue: detail.rule_id
							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="请选择规则"
								>
									{
										sourceRuleList.map(item => {
											return <Option value={item.id} key={item.id}>{item.show_name}</Option>
										})
									}
								</Select>
							)}
						</FormItem>
				}

				{
					type === "edit" ?
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
						</FormItem> :
						<FormItem label="描述">
							{getFieldDecorator('description', {
								rules: [{
									pattern: /^.{1,300}$/, message: '请输入1-300个字符'
								}],
								initialValue: detail.description
							})(
								<TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 4 }} maxLength="300" />
							)}
						</FormItem>
				}
			</Form>
		)
	}
}

export default Form.create()(SourceType);
