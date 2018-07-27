import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Spin } from 'antd'
import {
	getUserRoleAssignments
} from '../actions/adminUser'
import EqualTable from "./table/EqualTable";
import NavTable from "./table/NavTable";
import qs from "qs";
class LookPermission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		};
	}
	componentDidMount() {
		this.setState({
			isLoading: true
		})
		const search = qs.parse(this.props.location.search.substring(1))
		this.props.actions.getUserRoleAssignments({ ...search }).then(() => {
			this.setState({
				isLoading: false
			})
		})
	}
	render() {

		const { userRoleAssignments } = this.props
		const routeColumns = [
			{ title: '名称', dataIndex: 'name', key: 'name' },
			{ title: '属性', dataIndex: 'value', key: 'value' },
		];
		const columnsNav = [
			{ title: '权限类型', dataIndex: 'name', key: 'name' },
		];
		const columns = [
			{ title: '权限类型', dataIndex: 'name', key: 'name', }
		]
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
		let arr = []
		userRoleAssignments.filter((item) => {
			if (item.rule == 'navigation') {
				arr = item.permissions
				return item
			}
		})
		const getRows = (record) => {
			console.log(record, 'record')
			switch (record.rule) {
				case 'equal':
					return <EqualTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={routeColumns}
						pagination={false}
					/>
				case 'bool':
					return <EqualTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={boolColumns}
						pagination={false}
					/>
				case 'crud':
					return <EqualTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={crudColumns}
						pagination={false}
					/>

				case 'operation_scope':
					return <EqualTable
						rowKey={record => record.equal}
						data={record.permissions}
						columns={operationColumns}
						pagination={false}
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
		const _getRowClassName = (record) => {
			return record.permissions.length ? '' : 'Hello--hide-expand'
		}
		const navList = userRoleAssignments.filter((item) => {
			if (item.rule != 'navigation') {
				return item
			}
		})
		return (
			<Spin spinning={this.state.isLoading}>
				<Table rowKey={record => record.type_id}
					className="components-table-demo-nested"
					columns={columns}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					dataSource={navList}
					pagination={false} />
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
			</Spin>
		);
	}
}



const mapStateToProps = (state) => ({
	userRoleAssignments: state.adminUserList.userRoleAssignments,
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getUserRoleAssignments
	}, dispatch)
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LookPermission);

