import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Breadcrumb, Icon } from 'antd';
import { getList, getTempList, getOptions } from '../../actions/order'
import FilterForm from '../../components/order/FilterForm'

import api from '../../../api/index'
import './Order.less'

const filterConfig = [
	{
		label: '时间类型',
		type: 'dateSelect',
		name: 'time_type',
		initialValue: '1'
	},
	{
		label: '账号名称',
		type: 'input',
		name: 'weibo_name',
		placeholder: '请输入账号名称，多个请以空格隔开',
		className: 'multiple-form-input'
	},
	{
		label: '公司简称',
		type: 'input',
		name: 'company_name',
		placeholder: '请输入公司简称，多个请以空格隔开',
		className: 'multiple-form-input'
	},
	{
		label: '需求ID',
		type: 'input',
		name: 'requirement_id',
		placeholder: '请输入需求ID，多个请以空格隔开',
		className: 'multiple-form-input'
	},
	{
		label: '客户等级',
		type: 'select',
		name: 'level_id'
	},
	{
		label: '行业分类',
		type: 'select',
		name: 'industrial_type'
	},
	{
		label: '违约方',
		type: 'select',
		name: 'renege'
	},
	{
		label: '策划',
		type: 'select',
		name: 'plan_manager_id'
	},
	{
		label: '资源媒介',
		type: 'select',
		name: 'owner_admin_id'
	},
	{
		label: '项目媒介',
		type: 'select',
		name: 'vol_admin_id'
	},
	{
		label: '订单预约状态',
		type: 'select',
		name: 'reservation_status'
	},
	{
		label: '需求描述审核状态',
		type: 'select',
		name: 'order_first_review_status'
	},
	{
		label: '上传数据截图状态',
		type: 'select',
		name: 'execution_status_sub'
	},
	{
		label: '客户订单确认状态',
		type: 'select',
		name: 'customer_confirmation_status'
	},
	{
		label: '执行内容审核状态',
		type: 'select',
		name: 'order_execution_review_status'
	},
	{
		label: '执行监测结果',
		type: 'select',
		name: 'monitor_status'
	},
	{
		label: '销售是否评价',
		type: 'select',
		name: 'is_reviewed_by_sale'
	},
	{
		label: '是否显示废弃重约订单',
		type: 'defaultSelect',
		name: 'show_rescheduled',
		initialValue: '2'
	},
	{
		label: 'PO单号',
		type: 'batch_search',
		name: 'execution_evidence_code',
		placeholder: '请输入PO单号',
		className: 'multiple-form-input'
	},
	{
		label: '执行状态',
		type: 'select',
		multiple: true,
		name: 'execution_status'
	},
	{
		label: '平台',
		type: 'select',
		multiple: true,
		name: 'weibo_type',
		supportSearch: true
	},
	{
		label: '销售经理',
		type: 'select',
		multiple: true,
		name: 'sale_manager_id',
		supportSearch: true
	},
	{
		label: '所属品牌',
		type: 'select',
		multiple: true,
		name: 'brand_id',
		supportSearch: true
	},
	{
		label: '所属项目',
		type: 'select',
		multiple: true,
		name: 'project_id',
		supportSearch: true
	}
]


class FilterExport extends Component {
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
		this.props.actions.getOptions();
	}

	showModal(modalType) {
		this.setState({
			modalType
		})
	}
	closeModal() {
		this.showModal('')
	}

	orderExport() {
		this.props.actions.getTempList();
		this.showModal('OrderExportModal');
	}
	onCreate(values) {
		api.post('/toolbox/order/search', {
			...values
		}).then(() => {
			this.closeModal();
			this.props.actions.getList();
		})
	}
	handleTableChange(pagination) {
		const { current: page } = pagination;
		this.setState({ loading: true });
		this.props.actions.getList({ page }).then(() => this.setState({ loading: false }));
	}

	render() {
		const { options } = this.props;
		// const { total, current_page } = orderList;
		// const { pagination } = this.state;
		// const pagination = { ...this.state.pagination, total, current: current_page }

		const customField = filterConfig.map(item => {

			switch (item.type) {
				case 'select':
					const optionsList = options[item.name] || [];
					if (item.multiple) {
						return { ...item, options: options[item.name] }
					} else {
						return { ...item, options: [{ id: "0", name: "请选择" }, ...optionsList] }
					}
				case 'defaultSelect':
					return { ...item, options: options[item.name] }
				case 'dateSelect':
					return { ...item, options: options[item.name] }
				default:
					return item;
			}
		})
		return (
			<div>
				<h3>下载列表</h3>
				<Breadcrumb>
					<a href="orderList"><Icon type="left-circle-o" /></a>
					<Breadcrumb.Item>下载列表</Breadcrumb.Item>
					<Breadcrumb.Item>按查询结果下载</Breadcrumb.Item>
				</Breadcrumb>

				<div className="panel">
					<FilterForm customField={customField}></FilterForm>
				</div>
			</div>
		)
	}
}

FilterExport.propTypes = {
	actions: PropTypes.shape({
		getList: PropTypes.func.isRequired,
		getTempList: PropTypes.func.isRequired,
		getOptions: PropTypes.func
	}),
	orderList: PropTypes.object.isRequired,
	tempList: PropTypes.array.isRequired,
	options: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	orderList: state.orderReducers.orderList,
	tempList: state.orderReducers.tempList,
	options: state.orderReducers.options
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getList, getTempList, getOptions
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FilterExport)


