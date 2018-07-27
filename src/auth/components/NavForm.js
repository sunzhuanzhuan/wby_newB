import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import api from '../../api/index'

const FormItem = Form.Item;
const Option = Select.Option;

class NavForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			status: 1,
			selsetData: [],
			statusEdit: 200,
			app_id: ''
		}
	}
	handleChoice = (value) => {
		if (this.props.type == 'new') {
			let num = value - 1
			this.setState({ status: value })
			api.get('/rbac/getNavigationList?level=' + num + '&app_id=' + this.state.app_id).then((response) => {
				if (response.code == 200) {
					this.setState({ selsetData: response.data })
				}
			});

		} else {
			let num = value - 1
			this.setState({ statusEdit: value })
			api.get('/rbac/getNavigationList?level=' + num + '&app_id=' + this.state.app_id).then((response) => {
				if (response.code == 200) {
					this.setState({ selsetData: response.data })
				}
			});
		}
	}
	handleAppId = value => {
		this.setState({ app_id: value })
	}
	handleParent = () => {
		let n = this.state.status - 1
		api.get('/rbac/getNavigationList?level=' + n + '&app_id=' + this.state.app_id).then((response) => {
			if (response.code == 200) {
				this.setState({ selsetData: response.data })
			}
		});
	}
	showModal(modalType) {
		this.setState({ modalType });
	}
	render() {
		const { form, detail = {}, applist, type } = this.props;
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
							onChange={this.handleAppId}
						>
							{applist.map(d => <Option value={d.app_id} key={d.app_id}>{d.app_name}</Option>)}

						</Select>
					)}
				</FormItem>
				<FormItem label="导航名称">
					{getFieldDecorator('name', {
						rules: [{
							pattern: /^.{3,50}$/, message: '请输入3-50个字符'
						}, {
							required: true,
							message: '请输入导航名称',
						}],
						initialValue: detail.name
					})(
						<Input placeholder="请输入导航名称" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="唯一标识">
					{getFieldDecorator('unique_name', {
						rules: [{
							pattern: /^[0-9a-zA-Z-.]{3,50}$/, message: '唯一标识输入不符合规定'
						}, {
							required: true,
							message: '请输入唯一标识',
						}],
						initialValue: detail.unique_name
					})(
						<Input placeholder="请输入唯一标识" maxLength="50" />
					)}
				</FormItem>
				<FormItem label="默认链接">
					{getFieldDecorator('url', {
						rules: [{
							message: '请输入默认链接',
						}],
						initialValue: detail.url
					})(
						<Input placeholder="请输入默认链接" />
					)}
				</FormItem>
				<FormItem label="级别">
					{getFieldDecorator('level', {
						rules: [{
							required: true,
							message: '请选择级别',
						}],
						initialValue: detail.level
					})(
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder="请选择级别"
							onChange={this.handleChoice}
							disabled={type == 'edit' ? true : false}
						>
							<Option value="1">一级</Option>
							<Option value="2">二级</Option>
							<Option value="3">三级</Option>
							<Option value="4">四级</Option>
						</Select>
					)}
				</FormItem>
				{
					type == 'edit' && detail.level == 2 && this.state.statusEdit != 1 ? <FormItem label="请选择父级">
						{getFieldDecorator('parent_id', {
							rules: [{
								required: true,
								message: '请选择级别',
							}],
							initialValue: detail.name
						})(
							<Select
								showSearch
								style={{ width: 200 }}
								placeholder="请选择级别"
								disabled={disabled}
							>{
									this.state.selsetData.map((item, index) => {
										return <Option value={item.id} key={index}>{item.name}</Option>
									})
								}
							</Select>
						)}
					</FormItem> : null
				}
				{type == 'new' && this.state.status != 1 ? <FormItem label="请选择父级">
					{getFieldDecorator('parent_id', {
						rules: [{
							required: true,
							message: '请选择级别',
						}],
						initialValue: detail.name
					})(
						<Select
							showSearch
							style={{ width: 200 }}
							placeholder="请选择级别"
							onFocus={this.handleParent}
						>{
								this.state.selsetData.map((item, index) => {
									return <Option value={item.id} key={index}>{item.name}</Option>
								})
							}
						</Select>
					)}
				</FormItem> : null}

			</Form>
		)
	}
}

export default Form.create()(NavForm);
