import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Table } from 'antd';

import * as actions from "../actions/index";
import RouteTable from '../../auth/components/authority/RouterTable';
import BoolTable from '../../auth/components/authority/BoolTable';
import CrudTable from '../../auth/components/authority/CrudTable';
import NavTable from '../../auth/components/authority/NavTable';
import OperationTable from "../../auth/components/authority/OperationTable";
// import CommonModal from '../components/CommonModal';
// import { roleAuthorityList } from '../reducers/index'
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
		await this.props.actions.getUserByJobType(search);
		this.setState({ loading: false })
	}

	render() {

		const { jobAuthorityList,
			// role
		} = this.props
		const _getRowClassName = (record) => {
			return record.permissions.length ? '' : 'Hello--hide-expand'
		}
		const navList = jobAuthorityList.filter((item) => {
			if (item.rule != 'navigation') {
				return item
			}

		})
		let arr = []
		jobAuthorityList.filter((item) => {
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
			}

		];
		const columns = [
			{ title: '权限类型', dataIndex: 'name', key: 'name' }

		];
		const routeColumns = [
			{ title: '名称', dataIndex: 'name', key: 'name' },
			{ title: '属性', dataIndex: 'value', key: 'value' },

		];
		// const op = {
		// 	title: 'Action',
		// 	dataIndex: 'operation',
		// 	key: 'operation',
		// 	width: '200px',

		// };
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
		// crudColumns.push(op);
		// boolColumns.push(op);
		// operationColumns.push(op);
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

		return (
			<div className="role_authority_box" >
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

			</div >
		)
	}
}

const mapStateToProps = (state) => ({
	jobAuthorityList: getVisibleRoleAuthority(state.manage.jobAuthorityList1),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...actions
	}, dispatch)
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Authority)
