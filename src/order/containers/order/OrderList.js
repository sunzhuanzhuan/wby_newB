import React, { Component } from 'react'
import { Table, Button, Modal } from 'antd';

import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
//import { browserHistory } from 'react-router'

import { getList, getTempList } from '../../actions/order'
import OrderExportModal from '../../components/order/OrderExportModal'

import api from '../../../api/index'
import './Order.less'
// import { orderList } from '../../reducers/order';

const columns = [
	{
		title: '文件名',
		dataIndex: 'name',
		key: 'name',
		render: text => <a href="#">{text}</a>,
	}, {
		title: '创建用户',
		dataIndex: 'owner_id',
		key: 'owner_id',
	}, {
		title: '创建时间',
		dataIndex: 'create_at',
		key: 'create_at',
	}, {
		title: '当前状态',
		dataIndex: 'queue_state',
		key: 'queue_state'
	}, {
		title: 'Action',
		key: 'action',
		render: (text, record) => (
			<span>
				{
					record.queue_state === '已完成' ?
						<Button type='primary'>
							<a href={`/api/toolbox/order/download?id=${record.id}`}>下载</a>
						</Button> : null
				}
			</span>
		),
	}];
class OrderList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalType: '',
			pagination: {
				total: 0,
				current: 1
			},
			loading: false,

		}
	}

	componentWillMount() {
		this.props.actions.getList();


	}

	showModal(modalType) {
		this.setState({
			modalType
		})
	}
	closeModal() {
		this.showModal('')
		this.form.resetFields()
	}

	orderExport() {
		this.props.actions.getTempList();
		this.showModal('OrderExportModal');
	}
	filterExport() {
		//browserHistory.push('/orderTools/filterExport')
		//修改了push的方式
		this.props.history.push('/orderTools/filterExport')
	}
	onCreate(values) {
		api.post('/toolbox/order/search', {
			...values
		}).then(() => {
			Modal.success({
				title: '下载申请已提交，系统正在导出',
				content: '请10分钟后在"下载列表"页面下载数据',
				okText: '确认',
				onOk: function () {
					this.closeModal();
					this.props.actions.getList();
				}.bind(this)
			});
		})
	}
	handleTableChange(pagination) {
		const { current: page } = pagination;
		this.setState({ loading: true });
		this.props.actions.getList({ page }).then(() => this.setState({ loading: false }));
	}

	render() {
		const { orderList, tempList } = this.props;
		const { total, current_page } = orderList;
		// const { pagination } = this.state;
		const pagination = { ...this.state.pagination, total, current: current_page }

		return (
			<div>
				<h3>下载列表</h3>
				<div className='handle-bar'>
					<Button onClick={this.orderExport.bind(this)}>按订单ID下载</Button>
					<Button onClick={this.filterExport.bind(this)}>按查询结果下载</Button>
				</div>
				<Table
					columns={columns}
					dataSource={orderList.data}
					pagination={pagination}
					loading={this.state.loading}
					onChange={this.handleTableChange.bind(this)}
				/>
				<OrderExportModal
					title='按订单ID下载'
					onCreate={this.onCreate.bind(this)}
					onCancel={this.closeModal.bind(this)}
					tempList={tempList}
					visible={this.state.modalType == 'OrderExportModal'}
					ref={form => this.form = form}
				/>

			</div>
		)
	}
}

OrderList.propTypes = {
	actions: PropTypes.shape({
		getList: PropTypes.func.isRequired,
		getTempList: PropTypes.func.isRequired
	}),
	orderList: PropTypes.object.isRequired,
	tempList: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
	orderList: state.orderReducers.orderList || {},
	tempList: state.orderReducers.tempList
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getList, getTempList
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(OrderList))


