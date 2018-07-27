import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Table } from 'antd';
//改为引用router-dom的link
import { Link } from 'react-router-dom'

import * as accountDetailAction from '../actions/index'
import './detail.less'

// const { MonthPicker, RangePicker } = DatePicker;

// const dateFormat = 'YYYY/MM/DD';
// const monthFormat = 'YYYY/MM';

class AccountDetail extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			id: props.id
		})
	}

	componentDidMount() {
		const company_id = this.state.id
		this.props.actions.getAccountDetail(company_id);
		this.props.actions.getCoffersList(company_id);
	}
	handleGetDetail() {

	}
	getCreditHistoryDetail(value) {
		const changeTitle = [{
			key: 'change_amount',
			dataIndex: 'change_amount',
			title: '变更金额',
			render: (text) => text + '元'
		}, {
			key: 'created_at',
			dataIndex: 'created_at',
			title: '变更时间'
		}];
		Modal.info({
			content: (
				<Table dataSource={value} columns={changeTitle} pagination={false} />
			),
			iconType: 'none',
			onOk() { }
		});
	}
	render() {
		const { accountDetail = {}, cash = {}, credit = {}, gift = {}, general = {}, coffersList = {} } = this.props;
		const formatCredit = [];
		const formatCash = [];
		const formatCoffersList = [];

		formatCredit.push(credit);
		formatCash.push(cash);
		formatCoffersList.push(coffersList);
		const creditTitle = [{
			key: 'credit_line',
			dataIndex: 'credit_line',
			title: '额度（元）',
			render: (text, row) => {
				return <span>{row.credit_line ? row.credit_line.toFixed(2) : '0.00'}</span>
			}
		}, {
			key: 'credit_amount',
			dataIndex: 'credit_amount',
			title: '余额（元）',
			render: (text, row) => {
				return <span>{row.credit_amount ? row.credit_amount.toFixed(2) : '0.00'}</span>
			}
		}, {
			key: 'credit_amount_available',
			dataIndex: 'credit_amount_available',
			title: '可用余额（元）',
			render: (text, row) => {
				return <span>{row.credit_amount_available ? row.credit_amount_available.toFixed(2) : '0.00'}</span>
			}
		}
			// , {
			// 	key: 'credit_change_history',
			// 	dataIndex: 'credit_change_history',
			// 	title: '信用变更历史',
			// 	render: (value) => <Button type="primary" onClick={this.getCreditHistoryDetail.bind(this, value)} >查看变更历史</Button>
			// }, {
			// 	key: 'overdue_count',
			// 	dataIndex: 'overdue_count',
			// 	title: '过期未还款次数',
			// }
		];
		const cashTitle = [{
			key: 'cash_amount',
			dataIndex: 'cash_amount',
			title: '余额（元）',
			render: (text, row) => {
				return <span>{row.cash_amount ? row.cash_amount.toFixed(2) : '0.00'}</span>
			}
		}
			// , {
			// 	key: 'can_withdraw',
			// 	dataIndex: 'can_withdraw',
			// 	title: '可提现余额（元）',
			// 	render: (text, row) => {
			// 		return <span>{row.can_withdraw ? row.can_withdraw.toFixed(2) : '0.00'}</span>
			// 	}
			//}
		];
		const coffersListTitle = [{
			key: 'coffers_amount',
			dataIndex: 'coffers_amount',
			title: '额度（元）'
		}, {
			key: 'balance',
			dataIndex: 'balance',
			title: '余额（元）'
		}, {
			key: 'available_amount',
			dataIndex: 'available_amount',
			title: '可用余额（元）'
		}, {
			key: '小金库明细',
			dataIndex: '小金库明细',
			title: '小金库明细',
			render: () => <Link to={'/golden/detail/' + this.props.id}>查看详情</Link>
		}]
		return (
			<div className='sourceRules-box' >
				<Row type="flex" justify="start" gutter={16} >
					<Col><h3>公司简称：{accountDetail.name}</h3></Col>
					<Col><h3>销售：{accountDetail.sale_real_name}</h3></Col>
				</Row>
				<fieldset>
					<legend>账户详情</legend>
					<Row type="flex" justify="start" gutter={16} className='account-detail'>
						<Col>账户余额：<span style={{ color: 'red' }}>{general.total_amount ? general.total_amount.toFixed(2) : '0.00'}元</span> </Col><Col>|</Col>
						<Col>账户可用余额：<span style={{ color: 'red' }}>{general.available_amount ? general.available_amount.toFixed(2) : '0.00'}元</span> </Col><Col>|</Col>
						<Col>账户冻结金额： <span style={{ color: 'red' }}>{general.freeze_amount ? general.freeze_amount.toFixed(2) : '0.00'}元</span></Col>
						<Col><Link to={"/freeze/detail/" + this.props.id}>查看详情</Link></Col>
					</Row>
					<div orientation="left" style={{ marginBottom: '20px', marginTop: '20px' }}><span style={{ fontSize: '18px', color: '#1DA57A' }}>信用账户</span></div>
					<Table dataSource={formatCredit} columns={creditTitle} pagination={false} />
					<div orientation="left" style={{ marginBottom: '20px', marginTop: '20px' }}><span style={{ fontSize: '18px', color: '#1DA57A' }}>现金账户</span></div>
					<Table dataSource={formatCash} columns={cashTitle} pagination={false} />
					<div orientation="left" style={{ marginBottom: '20px', marginTop: '20px' }}><span style={{ fontSize: '18px', color: '#1DA57A' }}>赠送、赔偿账户</span></div>
					<Row>
						<Col>余额：{gift.gift_amount ? gift.gift_amount.toFixed(2) : '0.00'}元</Col>
					</Row>
					<div orientation="left" style={{ marginBottom: '20px', marginTop: '20px' }}><span style={{ fontSize: '18px', color: '#1DA57A' }}>小金库账户</span></div>
					<Row>
						<Table dataSource={formatCoffersList} columns={coffersListTitle} pagination={false}></Table>
					</Row>
				</fieldset>
			</div>
		)
	}
}


AccountDetail.propTypes = {
	actions: PropTypes.shape({

	}),
	// companyDetail: PropTypes.object.isRequired,
	// gift: PropTypes.object.isRequired,
	// credit: PropTypes.object.isRequired,
	// cash: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
	coffersList: state.companyDetail.coffersList,
	accountDetail: state.companyDetail.accountDetail,
	cash: state.companyDetail.accountDetail.cash,
	credit: state.companyDetail.accountDetail.credit,
	gift: state.companyDetail.accountDetail.gift,
	general: state.companyDetail.accountDetail.general
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...accountDetailAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AccountDetail)

