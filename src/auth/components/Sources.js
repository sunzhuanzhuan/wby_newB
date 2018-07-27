import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import api from '../../api/index'
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;



class SourcesForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			applist: []
		}
	}
	componentWillMount() {
		api.get('/rbac/getAppInfo').then((response) => {
			this.setState({
				applist: response.data,
			});
		});
	}

	render() {
		const { form, detail = {}, type, sourceTypeList, applist } = this.props;
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
				<FormItem label="资源名称">
					{getFieldDecorator('name', {
						rules: [{
							pattern: /^.{1,50}$/, message: '请输入1-50个字符'
						}, {
							required: true,
							message: '请输入资源名称',
						}],
						initialValue: detail.name
					})(
						<Input placeholder="请输入资源名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="唯一标识">
					{getFieldDecorator('unique_name', {
						rules: [{
							pattern: /^.{1,50}$/, message: '请输入1-50个字符'
						}, {
							required: true,
							message: '请输入唯一标识',
						}],
						initialValue: detail.unique_name
					})(
						<Input placeholder="请输入唯一标识" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="值">
					{getFieldDecorator('value', {
						rules: [
							{
								pattern: /^.{0,500}$/, message: '不能超过500个字符'
							},
							{
								required: true,
								message: '请输入值',
							}],
						initialValue: detail.value
					})(
						<Input placeholder="请输入值" maxLength="500" />
					)}
				</FormItem>
				{
					type === "edit" ?
						<FormItem label="资源类型">
							{getFieldDecorator('type_id', {
								initialValue: detail.resourceType_name
							})(
								<Input disabled />
							)}
						</FormItem> :
						<FormItem label="资源类型">
							{getFieldDecorator('type_id', {
								rules: [{
									required: true,
									message: '请选择资源类型',
								}],
								initialValue: detail.type_id
							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="请选择资源类型"
								>
									{
										sourceTypeList.visibleIds.map(item => {
											return <Option value={item} key={item}>{sourceTypeList.byId[item].name}</Option>
										})
									}
								</Select>
							)}
						</FormItem>
				}

				<FormItem label="描述">
					{getFieldDecorator('description', {
						initialValue: detail.description
					})(
						<TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 4 }} maxLength="300" />
					)}
				</FormItem>
			</Form>
		)
	}
}

export default Form.create()(SourcesForm);
