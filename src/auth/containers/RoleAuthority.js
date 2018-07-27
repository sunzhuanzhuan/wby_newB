import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Table, Button, Popconfirm } from 'antd';
import './auth.less'
import api from '../../api/index'

import * as roleAuthority from '../actions/roleAuthority'
import RouteTable from '../components/authority/RouterTable';
import BoolTable from '../components/authority/BoolTable';
import CrudTable from '../components/authority/CrudTable';
import NavTable from '../components/authority/NavTable';
import OperationTable from "../components/authority/OperationTable";
import CommonModal from '../components/CommonModal';
import AuthorityForm from "../components/authority/AuthorityForm";
import { getVisibleRoleAuthority } from '../reducers/roleAuthority'
import qs from "qs";
class Authority extends Component {
	constructor(props) {
		super(props)
		//修改了获取值的方式
		const search = qs.parse(props.location.search.substring(1))
		this.state = {
			// role_id: props.location.state.id,
			// app_id: props.location.state.app_id,
			role_id: search.id,
			app_id: search.app_id,
			detail: {},
			//persimise
			permission_box: [],
			isRoute: '',
			loading: false
		}
	}
	async componentWillMount() {
		this.setState({ loading: true })
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		//await this.props.actions.getRoleAuthorityList(this.props.location.state);
		await this.props.actions.getRoleAuthorityList(search);
		this.setState({ loading: false })
	}
	addRoleAuthority(record) {
		if (record.type_id) {
			api.get('/rbac/getResourcesByType?type_id=' + record.type_id).then((response) => {
				this.setState({
					type: 'add',
					title: '添加权限',
					okText: '提交',
					detail: record,
					resourceList: response.data,
					checkedFields: {},
					permissionFields: []
				});
				if (record.rule == 'equal') {
					this.setState({ isRoute: true })
				}
				this.showModal('CommonModal')
			});
		} else {
			api.get('/rbac/getResourceTypeList').then((response) => {

				this.setState({
					type: 'add',
					title: '添加权限',
					okText: '提交',
					detail: {},
					resourceList: [],
					checkedFields: {},
					permissionFields: [],
					typeList: response.data.rows
				});
				this.showModal('CommonModal')
			});
		}

	}
	updateRoleAuthority(record) {
		api.get('/rbac/getResourcesForm?id=' + record.resource_id).then((response) => {
			const resData = response.data;
			let checkedFields = {};

			resData.map((item) => {
				let ids = [];
				switch (item.type) {
					case 'checkbox':
						item.options.map((v) => {
							if (record.permission_id.indexOf(v.permission_id) != -1) {
								ids.push(v.permission_id);
							}
						});
						checkedFields[item.group_name] = ids;
						break;
					case 'radio':
						item.options.map((v) => {
							if (v.permission_id == record.permission_id) {
								checkedFields[item.group_name] = v.permission_id;
							}
						});
						break;
					default:
						break;
				}

			})
			this.setState({
				type: 'update',
				title: '修改权限',
				okText: '确认修改',
				detail: record,
				resourceList: [],
				checkedFields: checkedFields,
				permissionFields: response.data
			});
			this.showModal('CommonModal');
		});
	}
	showModal(modalType) {
		this.setState({ modalType });
	}
	handleCancel() {
		this.closeModal();
	}
	closeModal() {
		this.setState({ modalType: '' });
	}
	handleAddBatch() {
		let params = {
			role_id: this.state.role_id
		}
		if (this.state.isRoute) {
			let array = []
			for (const val of this.state.permission_box) {
				array.push(val.form[0].options[0].permission_id)
			}
			params.permission_id = [...array];
			this.props.actions.addRoleAuthorityAction(params);
			this.closeModal();
		} else {
			this.form.validateFields((err, values) => {
				if (!err) {
					if (this.props.permissionId.type === "option" || this.props.permissionId.type === "hidden") {
						params.permission_id = [...this.props.permissionId.permissionId];
						this.props.actions.addRoleAuthorityAction(params);
						this.closeModal();
					} else {
						let arr = values.functions.concat(values.scopes);
						params.permission_id = [...arr]
						this.props.actions.addRoleAuthorityAction(params);
						this.closeModal();
					}

				}
			});
		}

	}
	handleUpdateBatch() {
		let params = {
			role_id: this.state.role_id
		}
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			params.permission_id = this.handleData(values);
			this.props.actions.addRoleAuthorityAction(params);
			this.closeModal();
		});
	}

	handleDelete(record) {
		let params = {
			role_id: this.state.role_id,
			resources_id: record.resource_id,
			app_id: this.state.app_id
		}
		this.props.actions.deleteRoleAuthorityAction(params);
	}
	handleData(data) {
		let ids = [];
		for (var key in data) {
			if (key != 'id' && key != 'type_id') {
				switch (typeof (data[key])) {
					case 'string':
					case 'number':
						ids.push(data[key]);
						break;
					case 'object':
						ids.push(...data[key])
						break;
					default:
						break;
				}
			}
		}
		return ids
	}
	//得到promise
	handlePermise(value) {
		this.setState({ permission_box: value })
	}
	//判断是不是路由点击过来的
	handleFlag(flag) {
		this.setState({ isRoute: flag })
	}
	//删除导航
	deleteNav(record) {
		let params = {
			role_id: this.state.role_id,
			resources_id: record.id,
			app_id: this.state.app_id
		}
		this.props.actions.deleteRoleAuthorityAction(params);
	}
	render() {
		const { roleAuthorityList, role } = this.props
		//console.log(roleAuthorityList)
		const _getRowClassName = (record) => {
			return record.permissions.length ? '' : 'Hello--hide-expand'
		}
		const navList = roleAuthorityList.filter((item) => {
			if (item.rule != 'navigation') {
				return item
			}

		})
		let arr = []
		roleAuthorityList.filter((item) => {
			if (item.rule == 'navigation') {
				arr = item.permissions
				return item
			}
		})
		const columnsNav = [
			{ title: '权限类型', dataIndex: 'name', key: 'name' },
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				width: '200px',
				render: (text, record) => {
					return <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteNav.bind(this, record)}>
						<Button type="primary" >删除导航</Button>
					</Popconfirm>
				}
			}

		];
		const columns = [
			{ title: '权限类型', dataIndex: 'name', key: 'name' },
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				width: '200px',
				render: (text, record) => {
					switch (record.rule) {
						case 'navigation':
							return < span className="table-operation" >
								{/* <Button type="primary" onClick={this.deleteNav.bind(this, record)}>删除导航</Button> */}
							</span >
						default:
							return < span className="table-operation" >
								<Button type="primary" onClick={this.addRoleAuthority.bind(this, record)}>添加权限</Button>
							</span >
					}
				}
			},
		];
		const routeColumns = [
			{ title: '名称', dataIndex: 'name', key: 'name' },
			{ title: '属性', dataIndex: 'value', key: 'value' },
			{
				title: 'Action',
				dataIndex: 'operation',
				key: 'operation',
				width: '200px',
				render: (text, record) => (
					<span className="table-operation">
						<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.handleDelete.bind(this, record)}>
							<Button className="NavGroup_delete" type="primary">删除</Button>
						</Popconfirm>
					</span>
				),
			},
		];
		const op = {
			title: 'Action',
			dataIndex: 'operation',
			key: 'operation',
			width: '200px',
			render: (text, record) => (
				<span className="table-operation">
					<Button type="primary" onClick={this.updateRoleAuthority.bind(this, record)}>修改</Button>
					<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.handleDelete.bind(this, record)}>
						<Button className="NavGroup_delete" type="primary">删除</Button>
					</Popconfirm>
				</span>
			),
		};
		let boolColumns = [
			{ title: '名称', dataIndex: 'name', key: 'name' },
			{ title: '属性', dataIndex: 'value', key: 'value' },
		];
		let crudColumns = [
			{ title: '名称', dataIndex: 'name', width: '450px', key: 'name' },
			{ title: '方法', dataIndex: 'functions', key: 'functions' },
			{ title: '范围', dataIndex: 'scopes', key: 'scopes' },
		];
		const navColumns = [
			{ title: '应用', dataIndex: 'app_id', key: 'app_id' },
			{ title: '导航标识', dataIndex: 'name', key: 'name' },
			{ title: '唯一标识', dataIndex: 'unique_name', key: 'unique_name' },
			{ title: '链接', dataIndex: 'url', key: 'url' },
			{ title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
		];
		const operationColumns = [
			{ title: '名称', dataIndex: 'name', width: '450px', key: 'name' },
			{ title: '范围', dataIndex: 'value_zh', key: 'value_zh', width: 200 },
		]
		crudColumns.push(op);
		boolColumns.push(op);
		operationColumns.push(op);
		const getRows = (record) => {
			switch (record.rule) {
				case 'equal':
					return <RouteTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={routeColumns}
					/>
				case 'bool':
					return <BoolTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={boolColumns}
					/>
				case 'crud':
					return <CrudTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={crudColumns}
					/>

				case 'operation_scope':
					return <OperationTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={operationColumns}
					/>

				case 'navigation':
					return arr.map((item, index) => {
						if (record.name == item.resource.name) {
							return <NavTable
								key={index}
								data={item.tree}
								columns={navColumns} />

						}

					})
				default:
					return arr.map((item, index) => {
						if (record.name == item.resource.name) {
							return <NavTable
								key={index}
								data={item.tree}
								columns={navColumns} />

						}

					})
			}
		}
		// const formatNavData = (data) => {
		// 	data.map((item) => {
		// 		item.columns = columns;
		// 	})
		// 	let arr = []
		// 	for (let i = 0; i < data.length; i++) {
		// 		if (data[i]['tree']) {
		// 			arr.push(...data[i]['tree'])
		// 		}
		// 	}
		// 	return arr
		// }

		return (
			<div className="role_authority_box" >
				<h3>当前角色名称:{role.zh_name}</h3>
				<Button type="primary" className="add_role_authority" onClick={this.addRoleAuthority.bind(this)}>新增</Button>
				{navList.length > 0 ? <Table
					rowKey={record => record.type_id}
					className="components-table-demo-nested"
					columns={columns}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					dataSource={navList}
					pagination={false}
					loading={this.state.loading}
				/> : null}
				{arr.map((item, index) => {
					return <Table
						showHeader={!navList.length}
						key={index}
						className="components-table-demo-nested"
						columns={columnsNav}
						rowClassName={_getRowClassName}
						expandedRowRender={getRows}
						dataSource={[item.resource]}
						pagination={false}
						loading={this.state.loading}
					/>



				})}
				{
					this.state.modalType === 'CommonModal' ?
						<CommonModal
							visible={true}
							onCancel={this.handleCancel.bind(this)}
							onNew={this.handleAddBatch.bind(this)}
							onEdit={this.handleUpdateBatch.bind(this)}
							type={this.state.type}
							title={this.state.title}
							okText={this.state.okText}
						>
							<AuthorityForm
								ref={form => this.form = form}
								type={this.state.type}
								detail={this.state.detail}
								resourceList={this.state.resourceList}
								checkedFields={this.state.checkedFields}
								permissionFields={this.state.permissionFields}
								typeList={this.state.typeList}
								app_id={this.state.app_id}
								handlePermise={this.handlePermise.bind(this)}
								handleFlag={this.handleFlag.bind(this)}
							>
							</AuthorityForm>
						</CommonModal> : null
				}
			</div >
		)
	}
}
// Authority.propTypes = {
// 	actions: PropTypes.shape({
// 		getRoleAuthorityList: PropTypes.func.isRequired,
// 	}),
// 	roleAuthorityList: PropTypes.array.isRequired
// }
const mapStateToProps = (state) => ({
	roleAuthorityList: getVisibleRoleAuthority(state.auth.roleAuthorityList),
	permissionId: state.auth.permissionId,
	role: state.auth.role
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...roleAuthority
	}, dispatch)
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Authority)
