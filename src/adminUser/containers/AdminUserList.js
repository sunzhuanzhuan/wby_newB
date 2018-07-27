import React, { Component } from 'react'
import { Table, Popconfirm, Tooltip } from 'antd';
//import qs from "qs";
import { withRouter } from "react-router-dom";
import AddAdminUser from "./AddAdminUser";
import UpdatePwd from "./UpdatePwd";
import { Link } from "react-router-dom";
class AdminUserList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			pagination: {
				total: 220,
				current: 1
			},
			query: {},
		}
	}

	changePage = (page) => {
		this.props.changeSpin()
		//查询参数
		let params = {
			...this.props.searchValue,
			page: page.current,
			size: page.pageSize,
		}
		//拼接地址路径
		// this.props.history.push({
		// 	pathname: '/manage/user',
		// 	search: '?' + qs.stringify(params)
		// })
		//查询数据
		this.props.getAdminUserList({
			...params
		}).then(() => {
			this.props.changeSpin()
		})
	}
	render() {
		const { adminUserList, deleteAdminUserList, byId, changeSpin } = this.props;
		const that = this
		const columns = [
			{
				title: '用户ID',
				dataIndex: 'user_id',
				key: 'user_id',
				width: 80
			},
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
				width: 110
			}, {
				title: '岗位名称',
				dataIndex: 'jobs_name',
				key: 'jobs_name',
				width: 120,
				render: (ary) => {
					return ary[0] ? <Tooltip placement="top" title={
						ary.map((one, index) => {
							if (index === ary.length - 1) {
								return one
							}
							return `${one}，`
						})}>
						{ary[0]}{ary[1] ? "..." : null}
					</Tooltip> : ''

				}
			},
			{
				title: '岗位类型',
				dataIndex: 'job_type_name',
				key: 'job_type_name',
				width: 120,
				render: (ary) => {
					return ary[0] ? <Tooltip placement="top" title={
						ary.map((one, index) => {
							if (index === ary.length - 1) {
								return one
							}
							return `${one}，`
						})}>
						{ary[0]}{ary[1] ? "..." : null}
					</Tooltip> : ''

				}
			},
			{
				title: '真实姓名',
				dataIndex: 'real_name',
				key: 'real_name',
				width: 100
			},
			// {
			// 	title: '用户组',
			// 	dataIndex: 'user_group_name_desc',
			// 	key: 'user_group_name_desc',
			// 	width: 100
			// },
			{
				title: '手机',
				dataIndex: 'cell_phone',
				key: 'cell_phone',
				width: 150
			},
			{
				title: '绑定微信',
				dataIndex: 'wechat',
				key: 'wechat',
				width: 150
			},
			{
				title: '电话',
				dataIndex: 'phone',
				key: 'phone',
				width: 150
			},
			{
				title: 'qq',
				dataIndex: 'qq',
				key: 'qq',
				width: 150
			},
			{
				title: 'email',
				dataIndex: 'email',
				key: 'email',
				width: 150
			},
			{
				title: '创建时间',
				dataIndex: 'created_time',
				key: 'created_time',
				width: 150
			},
			{
				title: '上次登录时间',
				dataIndex: 'last_login_time',
				key: 'last_login_time',
				width: 120
			},
			// {
			// 	title: '销售组上级',
			// 	dataIndex: 'parent_real_name',
			// 	key: 'parent_real_name',
			// 	width: 150
			// },
			{
				title: '操作',
				key: 'action',
				width: 100,
				render: (record) => (<span>
					{/* app_id=1& */}
					<Link to={`/manage/lookPermission?app_id=1&id=${record.user_id}`}>查看权限</Link>
					<br />
					<AddAdminUser isEditAciton={true} adminUserOne={record} changeSpin={changeSpin} />
					<br />
					<UpdatePwd adminUserOne={record} changeSpin={changeSpin} />
					<br />
					<Popconfirm
						title="确定要删除吗？"
						onConfirm={() => {
							that.setState({
								loading: true
							})
							deleteAdminUserList({ user_id: record && record.user_id }).then(() => {
								that.setState({
									loading: false
								})
							})
						}}
					>
						<a>删除</a>
					</Popconfirm>
				</span>
				)
			}
		]
		return (
			<div>

				<Table
					rowKey={record => record.user_id}
					columns={columns}
					dataSource={adminUserList}
					style={{ marginTop: 20 }}
					pagination={{
						current: parseInt(byId && byId.current_page),
						pageSize: parseInt(byId && byId.perPage),
						total: parseInt(byId && byId.total)
					}}
					onChange={this.changePage}
				/>

			</div>
		)
	}
}
export default withRouter(AdminUserList);
