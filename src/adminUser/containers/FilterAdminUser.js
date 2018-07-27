import React, { Component } from 'react';
import { Button, Input, Form, Select } from 'antd';
import AddAdminUser from "./AddAdminUser";
//import AdminTree from './AdminTree'
import { withRouter } from "react-router-dom";
import TreeAdminSelect from "./TreeAdminSelect";
const FormItem = Form.Item;
const Option = Select.Option;
class FilterAdminUser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userId: '',
			userGroupId: '',
			username: '',
			visible: false,
			deptvalue: undefined,
			jobvalue: undefined,
		}
	}

	handleValueChange(key, value) {
		this.setState({
			[key]: value
		})
	}

	handleSubmit = () => {
		this.props.changeSpin()
		const { deptvalue } = this.state
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const allValue = {
					...values,
					ownership_id: deptvalue,
				}
				this.props.changeSearchValue(allValue)
				this.props.getAdminUserList(allValue).then(() => {
					this.props.changeSpin()
				})

			}
		})
		//this.props.form.resetFields()
	}

	handleModal(show) {
		this.setState({ visible: show })
	}
	//部门事件
	deptonChange = (value) => {
		this.setState({ deptvalue: value });
		//this.props.getJobList({ ownership_id: value })
	}
	jobChange = (value) => {
		this.setState({ jobvalue: value });
	}
	render() {
		//jobList
		const { form, userGroupOption, changeSpin, departmentList, renderTreeNodes, jobTypeList, resetAuthorizations } = this.props;
		const { deptvalue } = this.state
		//jobvalue
		const deptProps = {

			value: deptvalue,
			onChange: this.deptonChange,
			searchPlaceholder: '请选择部门',
			style: { width: 240 }
		};
		// const jobProps = {
		// 	value: jobvalue,
		// 	onChange: this.jobChange,
		// 	searchPlaceholder: '请选择岗位',
		// 	style: { width: 300 }
		// }
		const { getFieldDecorator } = form;
		return (
			<Form layout="inline">
				{/* <FormItem label="用户ID" style={{ display: 'none' }}>
					{getFieldDecorator('userId')(
						<Input onChange={e => this.handleValueChange('userId', e.target.value)} />
					)}
				</FormItem> */}

				{/* <FormItem label="用户名">
					{getFieldDecorator('username')(
						<Input onChange={e => this.handleValueChange('userId', e.target.value)} />
					)}
				</FormItem> */}

				{/* <FormItem label="所在用户组" class="">
					{getFieldDecorator('userGroupId')(
						<Select
							showSearch
							style={{ width: 250, overflowX: 'auto' }}
						>
							{userGroupOption.map(one => {
								return <Option key={one.user_group_id} value={one.user_group_id}>{`${one.user_group_name}(${one.user_group_name_desc})`}</Option>
							})}
						</Select>
					)}
				</FormItem> */}

				<FormItem label="用户名">
					{getFieldDecorator('user_name')(
						<Input placeholder='请输入用户名' />
					)}
				</FormItem>
				<FormItem label="部门">
					{getFieldDecorator('ownership_id')(
						<TreeAdminSelect treeProps={deptProps} treelist={departmentList} />
					)}
				</FormItem>
				<FormItem label="岗位类型">
					{getFieldDecorator('job_type_id')(
						<Select
							mode="multiple"
							style={{ width: 240 }}
							placeholder="请选择岗位类型"
							onChange={this.jobTypeChange}
						>
							{jobTypeList && jobTypeList.map(one => <Option key={one.id} value={one.id}>{one.zh_name}</Option>)}
						</Select>
					)}
				</FormItem>
				{/* <FormItem label="岗位类型">
					{getFieldDecorator('job_id')(
						<TreeAdminSelect treeProps={jobProps} treelist={jobList} />
					)}
				</FormItem> */}

				<FormItem>
					<Button
						type="primary"
						onClick={this.handleSubmit}
					>查询</Button>
					&nbsp;
					{/* <AdminTree /> */}
					<Button type="primary" onClick={() => resetAuthorizations()}>刷新权限</Button>
					&nbsp;
                  <AddAdminUser userGroupOption={userGroupOption} changeSpin={changeSpin} renderTreeNodes={renderTreeNodes} />
				</FormItem>
			</Form>
		)
	}
}
export default Form.create()(withRouter(FilterAdminUser));
