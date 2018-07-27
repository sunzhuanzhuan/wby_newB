import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input, Form, Select, Modal, Button, AutoComplete, TreeSelect } from 'antd';
import { addAdminUserList, editAdminUserList, getUserGroup, getSelectMemberp, getJobList, getJobTypeList, cleanJobList, cleanSelectMemberp } from '../actions/adminUser'
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
/**
 * 本js是用户管理的新增和修改
 * isEditAciton：true是修改
 * 本js岗位的下拉框是部门和岗位类型的筛选项（部门和岗位是没有关系的哦）
 * 本js的用户组下拉框，选择不同项会返回不同数据，根据数据返回显示上级用户 销售大区什么的 （估计2期要给本js销掉本js就能瘦好多哈哈哈）
 * 本js的修改数据是通过list的record获取过来的
 */

class AddAdminUser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			parentUserData: [],
			serchMemberParams: {},
			result: [],
			isTrue: false,
			deptvalue: undefined,
			jobvalue: undefined,
		}

	}
	//确认按钮提交数据
	handleOk = () => {
		this.props.form.validateFields((err, values) => {
			delete values.dept
			delete values.relpassword
			if (!err) {
				if (this.props.isEditAciton) {
					this.props.actions.editAdminUserList(values).then(response => {
						if (response) {
							this.closeModal()
						}
					})
				} else {
					this.props.actions.addAdminUserList(values).then(response => {
						if (response) {
							this.closeModal()
						}
					})
				}

			}
		})
	}

	//部门change事件
	deptonChange = (value) => {
		this.setState({ deptvalue: value });
		const job_type_id = this.props.form.getFieldValue('job_type_id')
		this.jobSeach(value, job_type_id)
	}
	//部门类型字段
	jobTypeChange = (value) => {
		const { deptvalue } = this.state
		this.setState({
			jobvalue: undefined
		})
		this.jobSeach(deptvalue, value)
	}
	//岗位查询
	jobSeach = (dept, jobType) => {
		const { adminUserOne } = this.props
		this.props.form.setFieldsValue({
			job_id: undefined
		});
		if (dept && jobType) {
			this.props.actions.getJobList({ ownership_id: dept, is_show_department: 1, job_type_id: jobType, unused: adminUserOne && adminUserOne.user_id || 0 })
		}
	}
	//岗位change事件
	jobChange = (value) => {
		this.setState({ jobvalue: value });
	}
	//关闭弹窗
	closeModal = () => {
		this.setState({ visible: false, jobvalue: undefined, deptvalue: undefined })
		//this.props.actions.getJobList({ is_show_department: 1 })
		this.props.form.resetFields()
	}
	//d打开弹窗
	showModal = async () => {

		const { isEditAciton, actions, adminUserOne } = this.props
		this.setState({
			visible: true
		})
		actions.cleanJobList()
		actions.cleanSelectMemberp()
		//查询岗位类型
		//actions.getJobTypeList()
		if (isEditAciton) {
			//修改查询岗位
			const { department_id, job_type_id, jobs_id } = adminUserOne

			if (JSON.stringify(department_id) !== '[]' && JSON.stringify(job_type_id) !== '[]') {
				actions.getJobList({ ownership_id: department_id, is_show_department: 1, job_type_id: job_type_id, unused: adminUserOne && adminUserOne.user_id || 0, }).then(() => {
					this.setState({
						deptvalue: department_id,
						jobvalue: jobs_id,
						serchMemberParams: { user_group_id: adminUserOne.user_group_id }
					})
				})
			}
			const selectData = { user_group_id: adminUserOne.user_group_id }
			await actions.getSelectMemberp(selectData)
			await actions.getSelectMemberp({ ...selectData, region_id: adminUserOne.salesman_region })

			//设置数据
			this.issetFieldsValue("salesmanRegion", adminUserOne.salesman_region)
			this.issetFieldsValue("salesmanTeam", adminUserOne.salesman_team)
			this.issetFieldsValue("parentId", adminUserOne.parent_id)

		}
	}
	//是否设置数据
	issetFieldsValue = (name, value) => {
		if (value) {
			this.props.form.setFieldsValue({
				[name]: value,
			});
		}

	}

	//用户组带的下拉选项
	onselectMember = async (type, value) => {
		const { serchMemberParams } = this.state
		if (type === 'group') {
			this.setState({
				serchMemberParams: { user_group_id: value },
				isTrue: true
			})
			await this.props.actions.getSelectMemberp({ user_group_id: value })
			//重置信息项
			this.props.form.setFieldsValue({
				salesmanRegion: '',
				parentId: '',
				salesmanTeam: '',
			});
		}
		if (type === 'region') {
			await this.props.actions.getSelectMemberp({ ...serchMemberParams, region_id: value })
			//重置信息项
			this.props.form.setFieldsValue({
				salesmanTeam: '',
			});
		}
	}
	//邮箱支持
	handleSearch = (value) => {
		let result;
		if (!value || value.indexOf('@') >= 0) {
			result = [];
		} else {
			result = ['qq.com', 'gmail.com', 'aliyun.com', '163.com', '126.com', 'tom.com', '139.com'].map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
	}
	//构建数据
	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.subs) {
				return (
					<TreeNode
						title={item.zh_name}
						key={item.id}
						value={item.id}
					//dataRef={item}
					>
						{this.renderTreeNodes(item.subs)}
					</TreeNode>
				);
			}
			return <TreeNode
				key={item.id}
				title={item.zh_name}
				value={item.id} />;
		});
	}
	//确认密码判断
	REPassword = (rule, value, callback) => {
		var re = this.props.form.getFieldValue('pwd');
		var relpassword = this.props.form.getFieldValue('relpassword');
		if (re === relpassword) {
			callback();
		} else {
			callback("两次密码输入不符请重新输入");
		}
	}
	//判断是否是中文
	isChinese(str) {
		var lst = /[\u4E00-\u9FA5]/i;
		return lst.test(str);
	}
	//计算字符串个数
	countstrlen(str) {
		var strlength = 0;
		for (var i = 0; i < str.length; i++) {
			if (this.isChinese(str.charAt(i)) == true)
				strlength = strlength + 2;
			else
				strlength = strlength + 1;
		}
		return strlength;
	}
	//汉字验证长度
	validatorLength = (rule, value, callback) => {
		if (value) {
			if (this.countstrlen(value) < 4 || this.countstrlen(value) > 20) {
				callback('字符长度4~20');
			} else {
				callback();
			}
		} else {
			callback();
		}
	}
	//密码验证长度
	passwordVali = (rule, value, callback) => {
		if (value) {
			if (value.length < 6 || value.length > 32) {
				callback('字符长度6~32');
			} else {
				callback();
			}
		} else {
			callback();
		}
	}
	render() {
		//

		const { form, adminUserOne,
			isEditAciton,
			departmentList,
			jobList,
			userGroupOption,
			jobTypeList,
			selectMemberpList } = this.props;
		const { getFieldDecorator } = form;
		//isTrue
		const { result, isTrue, deptvalue, jobvalue } = this.state;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		}
		const { data_for_parent_user = [], data_for_region, data_for_team } = selectMemberpList
		//部门树形图参数
		const deptProps = {
			//value: deptvalue,
			onChange: this.deptonChange,
			searchPlaceholder: '请选择部门',
		};
		//岗位树形图参数
		const jobProps = {
			//value: jobvalue,
			onChange: this.jobChange,
			searchPlaceholder: '请选择岗位',
		}
		return (
			<span>
				{isEditAciton ?
					<a onClick={this.showModal}>编辑</a>
					:
					<Button
						type="primary"
						onClick={this.showModal}
					>添加用户</Button>}
				<Modal
					title={isEditAciton ? '编辑用户信息' : '添加用户信息'}
					visible={this.state.visible}
					onCancel={this.closeModal}
					onOk={this.handleOk}
					maskClosable={false}
					width='700px'
				>
					{isEditAciton ? <FormItem label="用户ID" style={{ display: 'none' }}>
						{getFieldDecorator('user_id', {
							initialValue: adminUserOne && adminUserOne.user_id,
						})(
							<Input />
						)}
					</FormItem> : ''}
					<Form layout='horizontal'>
						<FormItem label="用户名" {...formItemLayout}>

							{getFieldDecorator('username', {
								initialValue: adminUserOne && adminUserOne.username,
								rules: [{
									required: true,
									message: '请输入正确的用户名(4~32字符)',
									pattern: /^\w{4,32}$/
								}],
							})(
								<Input placeholder="请输入用户名" />
							)}
						</FormItem>
						<FormItem label="真实姓名" {...formItemLayout}>
							{getFieldDecorator('realName', {
								initialValue: adminUserOne && adminUserOne.real_name,
								rules: [{ required: true, message: '请输入真实姓名' }, {
									validator: this.validatorLength,
								}],
							})(
								<Input placeholder="请输入真实姓名" />
							)}
						</FormItem>
						<FormItem label="对外展示姓名" {...formItemLayout}>
							{getFieldDecorator('contacts', {
								initialValue: adminUserOne && adminUserOne.contacts,
								rules: [{ required: false }, {
									validator: this.validatorLength,
								}],
							})(
								<Input placeholder="请输入对外展示姓名" />
							)}
						</FormItem>
						{isEditAciton ? '' :
							<FormItem label="密码" {...formItemLayout}>
								{getFieldDecorator('pwd', {
									initialValue: adminUserOne && adminUserOne.password,
									rules: [{
										required: true, message: '请输入密码',
									}, {
										validator: this.passwordVali,
									}],
								})(
									<Input type='password' placeholder="请输入密码" />
								)}
							</FormItem>}
						{isEditAciton ? '' :
							<FormItem label="确认密码" {...formItemLayout}>
								{getFieldDecorator('relpassword', {
									initialValue: adminUserOne && adminUserOne.relpassword,
									rules: [{ required: true, message: '请输入确认密码' }, {
										validator: this.REPassword,
									}],
								})(
									<Input type='password' placeholder="请输入确认密码" />
								)}
							</FormItem>}
						<FormItem label="用户组" {...formItemLayout}>
							{getFieldDecorator('userGroupId', {
								initialValue: adminUserOne && adminUserOne.user_group_id,
								rules: [{ required: true, message: '请选择用户组' }],
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									onChange={this.onselectMember.bind(null, 'group')}
									placeholder='请选择用户组'
								>
									{userGroupOption.map(one => {
										const desc = one.user_group_name_desc
										return <Option key={one.user_group_id} value={one.user_group_id}>{one.user_group_name}{desc == null ? "" : `(${desc})`}</Option>
									})}
								</Select>
							)}
						</FormItem>
						{data_for_region && (isTrue || adminUserOne && adminUserOne.salesman_region) ? <FormItem label="销售所属大区" {...formItemLayout}>
							{getFieldDecorator('salesmanRegion', {
								initialValue: adminUserOne && adminUserOne.salesman_region,
								rules: [{
									required: true,
									message: '请选择销售所属大区',
								}],
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									placeholder="请选择销售所属大区"
									onChange={this.onselectMember.bind(null, 'region')}
								>
									{data_for_region.map(one => {
										return <Option key={one.region_team_id} value={one.region_team_id}>{one.region_team_name}</Option>
									})}
								</Select>
							)}
						</FormItem> : ''}
						{data_for_team && (isTrue || adminUserOne && adminUserOne.salesman_team) ? <FormItem label="销售所属分组" {...formItemLayout}>
							{getFieldDecorator('salesmanTeam', {
								initialValue: adminUserOne && adminUserOne.salesman_team,
								rules: [{
									required: true,
									message: '请选择销售所属分组',
								}],
							})(
								<Select
									showSearch
									style={{ width: '100%' }}
									placeholder="请选择销售所属分组"
								>
									{data_for_team.map(one => {
										return <Option key={one.region_team_id} value={one.region_team_id}>{one.region_team_name}</Option>
									})}
								</Select>
							)}
						</FormItem> : ''}
						<FormItem label="部门" {...formItemLayout}>
							{getFieldDecorator('dept', {
								initialValue: deptvalue,
								rules: [{ required: true, message: '请选择部门' }],
							})(
								<TreeSelect {...deptProps} multiple allowClear className='tree-admin-select'>
									{this.renderTreeNodes(departmentList)}
								</TreeSelect>
							)}
						</FormItem>
						<FormItem label="岗位类型" {...formItemLayout}>
							{getFieldDecorator('job_type_id', {
								initialValue: adminUserOne && adminUserOne.job_type_id,
								rules: [{ required: true, message: '请选择岗位类型' }],
							})(
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="请选择岗位类型"
									onChange={this.jobTypeChange}
									className='tree-admin-select'
									allowClear
								>
									{jobTypeList && jobTypeList.map(one => <Option key={one.id} value={one.id}>{one.zh_name}</Option>)}
								</Select>
							)}
						</FormItem>
						{/* <Select
								mode="multiple"
								style={{ width: '100%' }}
								placeholder="请选择部门"
								onChange={this.deptChange}
							>
								{departmentList && departmentList.map(one => {
										return <Option key={one.id} value={one.id}>{one.zh_name}</Option>
									})} 
							</Select>*/}
						<FormItem label="岗位" {...formItemLayout}>
							{getFieldDecorator('job_id', {
								initialValue: jobvalue,
								rules: [{ required: true, message: '请选择岗位' }],
							})(

								<TreeSelect {...jobProps} multiple className='tree-admin-select'>
									{this.renderTreeNodes(jobList)}
								</TreeSelect>
							)}
						</FormItem>
						<FormItem label="登录用手机号：" {...formItemLayout}>
							{getFieldDecorator('cell_phone', {
								initialValue: adminUserOne && adminUserOne.cell_phone,
								rules: [{
									message: '请输入正确格式的手机号码(如：17000000000)',
									pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
								}],
							})(
								<Input placeholder="请输入登录用手机号：" maxLength="11" />
							)}
						</FormItem>
						<FormItem label="对外展示手机号" {...formItemLayout}>
							{getFieldDecorator('contacts_phone', {
								initialValue: adminUserOne && adminUserOne.contacts_phone,
								rules: [{
									message: '请输入正确格式的手机号码(如：17000000000)',
									pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
								}],
							})(
								<Input placeholder="请输入对外展示手机号" maxLength="11" />
							)}
						</FormItem>
						<FormItem label="电话" {...formItemLayout}>
							{getFieldDecorator('phone', {
								initialValue: adminUserOne && adminUserOne.phone,
								rules: [{
									message: '请输入正确格式的电话(如：010-88888888/01088888888)',
									pattern: /^0\d{2,3}-?\d{7,8}$/
								}],
							})(
								<Input placeholder="请输入电话" />
							)}
						</FormItem>
						<FormItem label="QQ" {...formItemLayout}>
							{getFieldDecorator('qq', {
								initialValue: adminUserOne && adminUserOne.qq && adminUserOne.qq.split(",")[0],
								rules: [{
									message: '请输入正确格式的QQ号(5-12位数字)',
									pattern: /^[1-9]\d{4,12}$/
								}]
							})(
								<Input placeholder="请输入QQ" maxLength={12} />
							)}
						</FormItem>
						<FormItem label="企业QQ端口" {...formItemLayout}>
							{getFieldDecorator('qqPort', {
								initialValue: adminUserOne && adminUserOne.qq && adminUserOne.qq.split(",")[1],
								// rules: [{
								// 	message: '请输入正确格式的端口',
								// 	pattern: /^ ([0 - 9] | [1 - 9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
								// }],
							}
							)(
								<Input placeholder="请输入企业QQ端口" />
							)}
						</FormItem>
						<FormItem label="Email" {...formItemLayout}>
							{getFieldDecorator('email', {
								initialValue: adminUserOne && adminUserOne.email,
								rules: [{
									message: '请输入正确格式的Email(xxx@xxx.xx)',
									pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
								}],
							})(
								<AutoComplete
									style={{ width: '100%' }}
									onSearch={this.handleSearch}
									placeholder="请输入Email"
								>
									{children}
								</AutoComplete>
							)}
						</FormItem>
						<FormItem label="旺旺" {...formItemLayout}>
							{getFieldDecorator('wangwang', {
								initialValue: adminUserOne && adminUserOne.wangwang,
							})(
								<Input placeholder="请输入旺旺" />
							)}
						</FormItem>
						<FormItem label="微信" {...formItemLayout}>
							{getFieldDecorator('wechat_account', {
								initialValue: adminUserOne && adminUserOne.wechat_account,
							})(
								<Input placeholder="请输入微信" />
							)}
						</FormItem>

						{data_for_parent_user && (isTrue || adminUserOne && adminUserOne.parent_id) && (JSON.stringify(data_for_parent_user) !== '[]') ?
							<FormItem label="上级用户" {...formItemLayout}>
								{getFieldDecorator('parentId', {
									initialValue: adminUserOne && adminUserOne.parent_id,
									rules: [{
										required: true,
										message: '请选择上级用户(只适用同组用户)',
									}],
								})(

									<Select
										showSearch
										style={{ width: '100%' }}
									>
										{data_for_parent_user.map(one => {
											return <Option key={one.userId} value={one.userId}>{one.realName}</Option>
										})}
									</Select>

								)}
							</FormItem> : ''}
					</Form>
				</Modal>
			</span>
		)
	}
}
const AddAdminUserFrom = Form.create()(AddAdminUser)
const mapStateToProps = (state) => ({
	// adminUserList: getVisibleAdminUser(state.adminUserList)
	userGroupOption: state.adminUserList.userGroupOption,
	selectMemberpList: state.adminUserList.selectMemberpList,
	jobList: state.adminUserList.jobList,
	departmentList: state.adminUserList.departmentList,
	jobTypeList: state.adminUserList.jobTypeList,
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		addAdminUserList,
		editAdminUserList,
		getUserGroup,
		getSelectMemberp,
		getJobList,
		cleanJobList,
		cleanSelectMemberp,
		getJobTypeList
	}, dispatch)
})
export default (connect(
	mapStateToProps,
	mapDispatchToProps
)(AddAdminUserFrom))
// export default (Form.create()(AddAdminUser))
