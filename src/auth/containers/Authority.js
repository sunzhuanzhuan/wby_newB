import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'

import { Table } from 'antd';
import './auth.less'


// import * as authority from '../actions/authority'
import { getAuthorityList } from '../actions/authority'
import { getUserByJobType } from '../../manage/actions/index'

import RouteTable from '../components/authority/RouterTable';
import BoolTable from '../components/authority/BoolTable';
import CrudTable from '../components/authority/CrudTable';
import NavTable from '../components/authority/NavTable';
import OperationTable from "../components/authority/OperationTable";
import qs from "qs";
const routeColumns = [
	{ title: '名称', dataIndex: 'name', key: 'name' },
	{ title: '属性', dataIndex: 'value', key: 'value' },
];

const boolColumns = [
	{ title: '名称', dataIndex: 'name', key: 'name' },
	{ title: '属性', dataIndex: 'value', key: 'value' },
	// {
	// 	title: 'Action',
	// 	dataIndex: 'operation',
	// 	key: 'operation',
	// 	width: '200px',
	// 	render: () => (
	// 		<span className="table-operation">
	// 			<Button type="primary">修改</Button>
	// 			<Button type="primary" className="NavGroup_delete">删除</Button>
	// 		</span>
	// 	),
	// },
];

const crudColumns = [
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

const getRows = (record) => {
	switch (record.rule) {
		case 'equal':
			return <RouteTable
				data={record.permissions}
				columns={routeColumns}
			/>
		case 'bool':
			return <BoolTable
				data={record.permissions}
				columns={boolColumns}
			/>
		case 'crud':
			return <CrudTable
				data={record.permissions}
				columns={crudColumns}
			/>
		case 'navigation':

			return <NavTable
				data={formatNavData(record.permissions)}
				columns={navColumns}
				rowClassName={_getRowClassName}
			/>
		case 'operation_scope':
			return <OperationTable
				rowKey={record => record.equal}
				data={record.permissions}
				columns={operationColumns}
			/>
		default:
			break;
	}
}
const formatNavData = (data) => {
	data.map((item) => {
		item.columns = navColumns;
	})
	let arr = []
	for (let i = 0; i < data.length; i++) {
		if (data[i]['tree']) {
			arr.push(...data[i]['tree'])
		}
	}
	return arr
}
const _getRowClassName = (record) => {
	return record.permissions.length ? '' : 'Hello--hide-expand'
}


class Authority extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userAuthorityList: [],
			loading: false
		}
	}

	componentWillMount() {
		const search = qs.parse(this.props.location.search.substring(1))
		//修改了获取值的方式
		if (search.app_id) {
			//this.setState({ loading: true })
			this.props.actions.getAuthorityList(search);
			//this.setState({ loading: false })
		} else {
			//this.setState({ loading: true })
			this.props.actions.getUserByJobType(search)
			//this.setState({ loading: false })
		}
		//this.props.actions.getAuthorityList(this.props.location.state);

	}


	_getRowClassName(record) {

		return record.subs ? '' : 'Hello--hide-expand'
	}


	render() {
		const { userAuthorityList, userByJobTypeList } = this.props
		const columns = [
			{ title: '权限类型', dataIndex: 'name', key: 'name' }
		];
		console.log(this.props.location.app_id)

		return (
			<div className="sourceRules_box">
				{/* <div>1111{this.props.location}</div> */}
				{/* <Button className="sourceRules_new" type="primary">添加权限</Button> */}
				{qs.parse(this.props.location.search.substring(1)).app_id ? <Table
					loading={this.state.loading}
					rowKey={record => record.rule}
					className="components-table-demo-nested"
					columns={columns}
					expandedRowRender={getRows}
					dataSource={userAuthorityList}
				/> : <Table
						loading={this.state.loading}
						rowKey={record => record.id}
						className="components-table-demo-nested"
						columns={columns}
						expandedRowRender={getRows}
						dataSource={userByJobTypeList.assignments}
					/>}

			</div>
		)
	}


}

// Authority.propTypes = {
// 	actions: PropTypes.shape({
// 		getAuthorityList: PropTypes.func.isRequired,
// 	}),
// 	userAuthorityList: PropTypes.array.isRequired
// }

const mapStateToProps = (state) => ({
	userAuthorityList: state.auth.userAuthorityList || [],
	userByJobTypeList: state.manage.userByJobTypeList || []
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getAuthorityList: getAuthorityList,
		getUserByJobType: getUserByJobType
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Authority)

