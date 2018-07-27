import React, { Component } from 'react'
import { Form, Select, Checkbox, Radio, Table, Input } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import api from '../../../api/index'
import * as AuthorityFormActions from '../../actions/roleAuthority'
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class AuthorityForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			permissionFields: props.permissionFields || [],
			checkedFields: props.checkedFields || {},
			resourceList: props.resourceList || [],
			checkbox: [],
			//是否显示表格
			flag: false,
			selectedRowKeys: [],//显示选中的分页,
		}
	}
	componentDidMount() {
		if (this.props.detail.rule == 'equal') {
			this.setState({ flag: true })
		} else {
			this.setState({ flag: false })
		}
	}
	onChange(checkedValues, type) {
		// let state = this.state
		// state.checkedFields[type] = checkedValues
		// this.setState(state);
		if (type === "option") {
			let arr = [];
			arr.push(checkedValues.target.value);
			this.props.actions.transformPermissionId(arr, type);
		} else {
			this.props.actions.transformPermissionId([], type)
		}
	}
	//多选选中
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.props.handlePermise(selectedRows)
		this.setState({ selectedRowKeys });
	}
	//搜索的方法
	search(value) {
		api.get('/rbac/getResourcesByType?type_id=' + 1 + '&app_id=' + 1 + '&value=' + value).then((response) => {
			this.setState({
				resourceList: response.data,
				permissionFields: [],
				flag: true
			});
			this.props.handleFlag(this.state.flag)
		});
	}
	//搜索
	handleSearch(value) {
		this.search(value)
	}
	//回车事件
	handleSearchEnter(e) {
		this.search(e.target.value)
	}
	render() {
		const columns = [{
			title: '地址',
			dataIndex: 'value',
			sorter: (a, b) => {
				return a.value.localeCompare(b.value, "zh");
			}
		}, {
			title: '资源名称',
			dataIndex: 'name',
			sorter: (a, b) => {
				return a.name.localeCompare(b.name, "zh");
			}
		}, {
			title: '备注',
			dataIndex: 'description'
		},
		];
		const { form, type, detail, typeList = [], app_id } = this.props;
		const { getFieldDecorator } = form;
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 }, }
		const handleChange = (value) => {
			api.get('/rbac/getResourcesForm?id=' + value).then((response) => {
				this.setState({
					permissionFields: response.data
				});
				if (response.data[0].type === "hidden") {
					let arr = [];
					arr.push(response.data[0].options[0].permission_id)
					this.props.actions.transformPermissionId(arr, "hidden")
				}
			});

		}
		//console.log(typeList);
		const handleTypeChange = (value) => {
			if (value == 1) {
				api.get('/rbac/getResourcesByType?type_id=' + value + '&app_id=' + app_id).then((response) => {
					this.setState({
						resourceList: response.data,
						permissionFields: [],
						flag: true,
						type_id: value
					});
					this.props.handleFlag(this.state.flag)
				});
			} else {
				api.get('/rbac/getResourcesByType?type_id=' + value + '&app_id=' + app_id).then((response) => {
					this.setState({
						resourceList: response.data,
						permissionFields: [],
						flag: false,
						type_id: value
					});
					this.props.handleFlag(this.state.flag)
				});
			}
		}
		const data = this.state.permissionFields
		const resourceList = this.state.resourceList;
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (

			<Form layout='horizontal' >
				{
					(type === "add" && detail.type_id) || type === "update" ?
						<FormItem label="资源类型" {...formItemLayout}>
							<span>{type === 'add' ? detail.name : detail.parent_name}</span>
						</FormItem> :
						<FormItem label="资源类型" {...formItemLayout}>
							{getFieldDecorator('type_id', {
								rules: [{
									required: true,
									message: '请选择资源类型',
								}],
							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="请选择资源类型"
									onChange={handleTypeChange}
								>
									{typeList.map(d =>
										<Option value={d.id} key={d.id}>{d.name}</Option>
									)}
								</Select>
							)}
						</FormItem>
				}

				{
					this.state.flag == true ? null : type === 'add' ?
						<FormItem label="选择资源" {...formItemLayout}>
							{getFieldDecorator('id', {
								rules: [{
									required: true,
									message: '请选择资源',
								}]
							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="请选择资源"
									onChange={handleChange}
								>
									{resourceList.map(d =>
										<Option value={d.id} key={d.id}>{d.name}</Option>
									)}
								</Select>
							)}
						</FormItem>
						:
						<FormItem label="选择资源" {...formItemLayout}>
							<span>{detail.name}</span>
						</FormItem>
				}


				{
					this.state.flag == true ? null : data.map((item) => {
						switch (item.type) {
							case 'checkbox':
								return (<FormItem key={item.group} label={item.group} {...formItemLayout}>
									{getFieldDecorator(item.group_name, {
										initialValue: this.state.checkedFields[item.group_name] || [],
										rules: [{ required: true, message: '请勾选要添加的权限' }]
									})(
										<CheckboxGroup onChange={(checkedValues) => this.onChange(checkedValues, item.group_name)}>
											{
												item.options.map(record => {
													return <Checkbox key={record.permission_id} value={record.permission_id}>{record.name}</Checkbox>
												})
											}
										</CheckboxGroup>
									)}
								</FormItem>)
							case 'radio':
								return (<FormItem key={item.group} label={item.group} {...formItemLayout}>
									{getFieldDecorator(item.group_name, {
										initialValue: this.state.checkedFields[item.group_name],
										rules: [{ required: true, message: '请勾选要添加的权限' }]
									})(
										<RadioGroup onChange={(checkedValues) => this.onChange(checkedValues, item.group_name)}>
											{
												item.options.map(record => {
													return <Radio key={record.permission_id} value={record.permission_id}>{record.name}</Radio>
												})
											}
										</RadioGroup>
									)}
								</FormItem>)
							case 'hidden':
								if (this.state.type_id == 4) {
									return (<FormItem key={item.group} label={item.group} {...formItemLayout} style={{ display: 'none' }}>
										{getFieldDecorator('permission_id', {
											initialValue: item.options[0].permission_id
										})(
											<RadioGroup onChange={(checkedValues) => this.onChange(checkedValues, item.group_name)}>
												{
													item.options.map(record => {
														return <Radio key={record.permission_id} value={record.permission_id}>{record.name}</Radio>
													})
												}
											</RadioGroup>
										)}
									</FormItem>)
								} else {
									return ""
								}

							default:
								break;
						}

					})
				}

				{
					this.state.flag == true ? <div style={{ marginTop: '20px' }}>
						<Search
							placeholder="搜索地址"
							onSearch={this.handleSearch.bind(this)}
							onPressEnter={this.handleSearchEnter.bind(this)}
							style={{ width: 200, float: 'right', height: '30px', marginBottom: '10px' }}
							enterButton
						/>

						<Table
							style={{ clear: 'both' }}
							dataSource={resourceList} columns={columns}
							rowKey={record => record.id}
							rowSelection={rowSelection} />
					</div> : null
				}
			</Form>
		)
	}
}

const mapStateToProps = () => {
	return {

	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...AuthorityFormActions
	}, dispatch)
})

const AuthorityForms = connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthorityForm);
export default Form.create()(AuthorityForms)
