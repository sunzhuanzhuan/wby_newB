import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Table } from 'antd';
import TableFilter from '../components/TableFilter';
import * as actions from '../actions/completeApply';
// import { connect } from 'net';

class CompleteApplyTable extends Component {
	state = {
		loading: false,
	}
	// 控制加载显示
	tableLoaing = boolean => {
		this.setState({ loading: boolean })
	}

	// 获取列表数据(传入页数)
	getOrderListByParams = async (page = 1) => {
		let { typeDetail: { name: tabType }, getOrderList, completeOrderList } = this.props;
		let { filters } = completeOrderList[tabType]
		this.setState({ loading: true })
		filters = JSON.parse(JSON.stringify(filters))
		await getOrderList({ tabType, ...filters, page: page, id: this.props.invoice_id })
		this.setState({ loading: false })
	}
	componentWillMount() {
		let { setTablePage, typeDetail: { name } } = this.props;
		setTablePage(name, 1)
		this.getOrderListByParams()
	}
	//处理全选
	handleSelectALL = (selected, selectedRows) => {
		let { typeDetail: { name }, completeOrderList, setTableSelectedRowkeys, totalBox } = this.props;
		let { filters: { pageSize } } = completeOrderList[name]
		let { tableSelectedRowKeys } = this.props;
		//计算已选
		let { max_can_apply } = this.props.completeApplyDetail;
		let totalCount = totalBox.totalValue, index, selectedRowKeys = [...tableSelectedRowKeys[name]];
		if (selected) {
			index = selectedRows.findIndex(item => {
				totalCount += item['remain_invoice_amount'];
				return totalCount > max_can_apply
			})
			index = index === -1 ? pageSize : index;
			let selectedAry = selectedRows.slice(0, index + 1);
			selectedAry.forEach(item => {
				selectedRowKeys.push(item.id);
			})
			setTableSelectedRowkeys(name, selectedRowKeys)
		} else {
			setTableSelectedRowkeys(name, [])
		}
	}
	// 设置选中
	onTableSelectChange = (selectedRowKeys) => {
		let { typeDetail: { name }, setTableSelectedRowkeys } = this.props;
		setTableSelectedRowkeys(name, selectedRowKeys)
	}
	rowKeys = (key) => (record) => record[key] || ''
	render() {
		let { typeDetail: { name, columns, key }, tableSelectedRowKeys, completeOrderList, isConsumption } = this.props;
		let { total, filters: { pageSize }, page, rows } = completeOrderList[name]
		let rowSelection = {
			selectedRowKeys: tableSelectedRowKeys[name] || [],
			onChange: this.onTableSelectChange,
			onSelectAll: this.props.type === 5 ? this.handleSelectALL : null,
			getCheckboxProps: record => {
				let boolean = this.props.tableSelectedRowKeys['reservation'].includes(record.id) || this.props.tableSelectedRowKeys['business'].includes(record.id) || this.props.tableSelectedRowKeys['activity'].includes(record.id) || this.props.tableSelectedRowKeys['weibo'].includes(record.id);
				return { disabled: this.props.checkDisable ? !boolean : false }
			}

		};
		// let pagination = { total: completeOrderList[name]['total'], pageSize: this.state.pageSize }
		let pagination = {
			onChange: (current) => {
				let { setTablePage } = this.props
				setTablePage(name, current)
				this.getOrderListByParams(current)
			},
			total,
			pageSize,
			current: page || 1
		}
		let rechargePagination = {
			onChange: (current) => {
				let { setTablePage } = this.props
				setTablePage(name, current)
				this.getOrderListByParams(current)
			},
			total,
			pageSize: 50,
			current: page || 1
		}
		let data = rows || []
		return (
			<div>
				{isConsumption ? <TableFilter tableLoaing={this.tableLoaing} tabType={name} id={this.props.invoice_id} type={this.props.type} /> : null}
				<Table bordered={true} pagination={this.props.type === 2 ? rechargePagination : pagination}
					rowKey={this.rowKeys(key)} rowSelection={rowSelection}
					columns={columns} dataSource={data}
					loading={this.state.loading}
					size="middle"
				></Table>
			</div >
		)
	}
}
/* const mapStateToProps = (state) => {
	return {
		reservationList: state.reservationReducers.reservationList || {},
		reservationUnqualifyList: state.reservationReducers.reservationUnqualifyList || []
	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...reservationAction
	}, dispatch)
}) */

export default connect(state => ({ ...state.invoice }), actions)(CompleteApplyTable)
