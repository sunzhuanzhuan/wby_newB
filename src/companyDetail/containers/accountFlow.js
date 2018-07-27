import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import {
	Row, Col, Table, Select, DatePicker, Button,
	Popover
} from 'antd';
// import { Link } from 'react-router'

import * as accountFlowAction from '../actions/account_flow'
import './detail.less'
// import moment from 'moment'
const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
let accountType = '';
let flowType = '';
let time = [];
let page_size = '';
let pageCurrent = ''
class AccountFlow extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			company_id: props.id,
			loading: true,
			current: 1,
			content: ''
		})

	}
	getList = async () => {
		const company_id = this.state.company_id
		await this.props.actions.getGoldenList(company_id, '', '', '', '', 1, 20);
		this.setState({ loading: false })
	}
	componentDidMount() {
		this.getList()
		//console.log(this.state.company_id)
		//this.props.actions.getGoldenList(company_id);
	}

	handleGetDetail(/*value*/) {
		// const numberDetail = value.billing_type;
		// if (numberDetail == 1) {}
	}
	//查询成功
	handleQuerySucc = async () => {
		this.setState({ loading: true })
		let company_id = this.state.company_id;
		await this.props.actions.getGoldenList(company_id, flowType, accountType, time[0], time[1], 1, 20)
		this.setState({ loading: false, current: 1 })
	}
	//获取流水类型
	handleFlowType(value) {
		flowType = value;
	}
	//获取账户类型
	handleAccountType(value) {
		accountType = value
	}
	//获取时间段
	handleDataSucc(value, dateString) {
		time = dateString
	}
	//页码翻页
	handlePageFlow(page) {
		pageCurrent = page.current;
		page_size = page.pageSize;
		this.setState({ current: page.current })
		this.props.actions.getGoldenList(this.state.company_id, flowType, accountType, time[0], time[1], pageCurrent, page_size);
	}
	async handleQueryDetail(row) {
		const { billingType } = this.props;
		let type = "";
		for (let j = 0; j < billingType.length; j++) {
			if (row.billing_type_display == billingType[j].display) {
				type = billingType[j].id
			}
		}
		this.setState({ content: '' })
		await this.props.actions.getDetail({ type: type, order_id: row.billing_order_id, product_line: row.product_line }).then((response) => {
			if (response.code == 1000) {
				this.setState({
					content: response.data.map((item, index) => {
						if (item.link) {
							return <p style={{ width: '200px' }} key={index}><span>{item.key} : </span><a target='_blank' href={item.link} key={index}> {item.value}</a></p>
						} else {
							return <p style={{ width: '200px' }} key={index}><span>{item.key}</span> : <span>{item.value}</span></p>
						}

					})
				})
			}
		})
	}
	render() {
		const Option = Select.Option;
		const { flowList = [], billingType = [], accountType = [], dataFlow = {} } = this.props;
		// console.log(123)
		// console.log(billDetail)
		const flowColumns = [{
			title: '流水号',
			dataIndex: 'billing_id',
			key: 'billing_id',
		}, {
			title: '时间',
			aligin: 'center',
			width: 200,
			dataIndex: 'created_at',
			key: 'created_at',
		}, {
			title: '账户',
			aligin: 'center',
			dataIndex: 'account_type_name',
			key: 'account_type_name',
		}, {
			title: '流水明细',
			aligin: 'center',
			dataIndex: 'change_amount',
			key: 'change_amount',
		}, {
			title: '流水类型',
			aligin: 'center',
			dataIndex: 'billing_type_display',
			key: 'billing_type_display',
		}, {
			title: '操作',
			aligin: 'center',
			render: (text, row) => {

				// return (
				// 	< Popover
				// 		content={content}
				// 		trigger="click">
				// 		<span type="primary" style={{ color: '#1DA57A' }}>{row.billing_type == ("A端充值" || "厂商退款") ? "-" : "查看详情"}</span>
				// 	</Popover >
				// );
				if ((row.billing_type == 2) || (row.billing_type_display == '其他')) {
					return <span type="primary" style={{ color: '#1DA57A' }}>-</span>
				} else {
					return < Popover content={this.state.content}
						trigger="click">
						<span style={{ color: '#1DA57A' }} onClick={this.handleQueryDetail.bind(this, row)}>查看详情</span>
					</Popover >
				}
			},
		}];
		const account_type = [];
		const billing_type = [];
		//流水的页码配置
		const paginationAccountFlow = {
			current: this.state.current,
			pageSize: 20,
			total: dataFlow.total
		}
		for (let i = 0; i < accountType.length; i++) {
			account_type.push(<Option key={i.toString(36) + i} value={accountType[i].id}>{accountType[i].display}</Option>);

		}
		for (let j = 0; j < billingType.length; j++) {
			billing_type.push(<Option key={j} value={billingType[j].id}>{billingType[j].display}</Option>);
		}
		for (let n = 0; n < flowList.length; n++) {
			for (let m = 0; m < accountType.length; m++) {
				if (flowList[n].account_type == accountType[m].id) {
					flowList[n].account_type_name = accountType[m].display
				}
			}
		}
		return (
			<div className='sourceRules-box'>
				<fieldset>
					<legend>账户流水</legend>
					<Row className='account-detail'>
						<Col span={20}>总计：<span style={{ color: 'red' }}>{dataFlow.total_amount}元</span></Col>
					</Row>
					<Row className='account_box' style={{ marginBottom: '20px', marginTop: '20px' }}>
						<Col span={5}>
							选择账户：<Select
								showSearch
								style={{ width: 150 }}
								optionFilterProp="children" onChange={this.handleAccountType.bind(this)} placeholder='全部'>
								<Option key={123} value={''}>全部</Option>
								{account_type}
							</Select>
						</Col>
						<Col span={5}>
							流水类型：<Select
								showSearch
								style={{ width: 150 }}
								optionFilterProp="children" onChange={this.handleFlowType.bind(this)} placeholder='全部'>
								<Option key={124} value={''}>全部</Option>
								{billing_type}
							</Select>
						</Col>
						<Col span={14}>
							选择时间： <RangePicker onChange={this.handleDataSucc.bind(this)} format={dateFormat} />
							<Button type="primary" onClick={this.handleQuerySucc.bind(this)} style={{ marginLeft: '10px' }}>查询</Button>
						</Col>
					</Row>
					<Row>
						<Table dataSource={flowList}
							rowKey={record => record.id}
							columns={flowColumns} pagination={paginationAccountFlow}
							onChange={this.handlePageFlow.bind(this)} />
					</Row>
				</fieldset>
			</div>
		)
	}
}




const mapStateToProps = (state) => ({
	gift: state.gift,
	credit: state.credit,
	cash: state.cash,
	flowList: state.companyDetail.accountFlow.billings,
	accountType: state.companyDetail.accountFlow.account_type,
	billingType: state.companyDetail.accountFlow.billing_type,
	dataFlow: state.companyDetail.accountFlow,
	// billDetail: state.companyDetail.billDetail,

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...accountFlowAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AccountFlow)

