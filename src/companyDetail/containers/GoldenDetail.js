import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import api from '../../api/index'
import { Row, Col, Table, Select, DatePicker, Button, Popover, Modal } from 'antd';
// import { Link } from 'react-router'
import * as goldenDetailAction from '../actions/golden_account'
import './detail.less'
import UpdateCase from './UpdateCost'


const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';
// const monthFormat = 'YYYY/MM';
const Option = Select.Option;
let page_size = '';
let pageCurrent = '';
let is_revoke_type = '';
let create_time_start = '';
let create_time_end = '';
let YE_create_time_start = '';
let YE_create_time_end = '';
let YE_page_size = '';
let YE_page = '';

class GoldenDetail extends Component {
	constructor(props) {
		super(props)
		//修改了获取值的方式
		const search = props.match.params
		this.state = ({
			//id: props.routeParams.company_id,
			id: search.company_id,
			alertModel: '',
			visible: false,
			anotherModel: false,
			money: '',
			//页面加载中
			loading: true,
			currentED: 1,
			current: 1,
			isShow: false
		})
	}
	getList = async () => {
		await this.props.actions.goldenFlow(this.state.id, is_revoke_type, 20, 1, create_time_start, create_time_end);
		await this.props.actions.getCostBilling(this.state.id, YE_create_time_start, YE_create_time_end, 1, 20);
		this.setState({ loading: false })
	}
	componentDidMount() {
		this.getList()
		api.get('/rbac/getAuthorizations').then((response) => {
			if (response.data[0].permissions['reparation.completeReparation']) {
				this.setState({
					isShow: response.data[0].permissions['reparation.completeReparation']
				})
			}
		})

	}

	//是否可撤销
	handleChangeSelect(value) {
		is_revoke_type = value
	}
	//选择页码（流水的页码）
	handlePage(page) {
		page_size = page.pageSize;
		pageCurrent = page.current;
		this.setState({ current: page.current })
		this.props.actions.goldenFlow(this.state.id, is_revoke_type, page_size, pageCurrent, create_time_start, create_time_end);
	}
	//选择时间范围(流水)
	handleDateFlowSucc(value, dateString) {
		create_time_start = dateString[0];
		create_time_end = dateString[1];
		// console.log(dateString)
	}
	//流水的查询
	handleQueryFlowSucc = async () => {
		this.setState({ loading: true })
		const company_id = this.state.id;
		await this.props.actions.goldenFlow(company_id, is_revoke_type, 20, 1, create_time_start, create_time_end)
		this.setState({ loading: false, current: 1 })
	}
	//选择时间范围(额度)
	handleDateEDSucc(value, dateString) {
		YE_create_time_start = dateString[0]
		YE_create_time_end = dateString[1]
	}
	//选择页码(额度)
	handlePageED(page) {
		YE_page = page.current;
		YE_page_size = page.pageSize;
		this.setState({ currentED: page.current })
		this.props.actions.getCostBilling(this.state.id, YE_create_time_start, YE_create_time_end, YE_page, YE_page_size);
	}
	//额度查询成功
	handleQueryEDSucc = async () => {
		this.setState({ loading: true })
		await this.props.actions.getCostBilling(this.state.id, YE_create_time_start, YE_create_time_end, 1, 20);
		this.setState({ loading: false, currentED: 1 })
	}
	handleGetDetail(value) {
		let text = value;
		if (text.type_id == 1) {
			let content = '<div>备注:' + text.remarks + '</div>'
			this.setState({
				alertModel: <div dangerouslySetInnerHTML={{ __html: content }}></div>
			})
		} else if (text.type_id == 2) {
			const that = this;
			this.props.actions.getRparationInfo(text.order_id).then(() => {
				let content = '<div>订单ID：  <a target=_blank href=' + text.order_link + '>' + text.order_id + '</a><div>备注:' + text.remarks + '</div></div>'
				that.setState({
					alertModel: <div dangerouslySetInnerHTML={{ __html: content }}></div>
				})
			})
		} else if (text.type_id == 3) {
			let content = '<div>订单ID：  <a target=_blank href=' + text.order_link + '>' + text.order_id + '</a></div>'
			this.setState({
				alertModel: <div dangerouslySetInnerHTML={{ __html: content }}></div>
			})
		} else if (text.type_id == 4 || text.type_id == 9 || text.type_id == 8 || text.type_id == 5 || text.type_id == 7) {
			let content = '<div>订单ID： <a target=_blank href=' + text.order_link + '>' + text.order_id + '</a></div>'
			this.setState({
				alertModel: <div dangerouslySetInnerHTML={{ __html: content }}></div>
			})
		} else if (text.type_id == 6) {
			let content = '<div>订单ID：  <a target=_blank href=' + text.order_link + '>' + text.order_id + '</a></div>'
			this.setState({
				alertModel: <div dangerouslySetInnerHTML={{ __html: content }}></div>
			})
		}
	}

	handleChangeED() {
		this.setState({
			visible: true
		})
	}
	handlePush() {

		// this.setState({
		// 	visible:false
		// })
	}
	handleNoPush() {
		this.setState({
			visible: false
		})
	}
	//修改后的额度
	handleChange(e) {
		this.setState({
			money: e.target.value
		})
	}
	render() {
		const { goldenFlow = {}, goldenCostList = {} } = this.props;
		const flowColumns = [{
			title: '流水号',
			dataIndex: 'billing_id',
			key: 'billing_id',
			align: 'center',
		}, {
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
			align: 'center',
		}, {
			title: '流水明细（元）',
			dataIndex: 'change_amount',
			key: 'change_amount',
			align: 'center',
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			align: 'center',
		}, {
			title: '余额',
			dataIndex: 'after_amount',
			key: 'after_amount',
			align: 'center',
		}, {
			title: '操作人',
			align: 'center',
			render: (text, record) => {
				//console.log(record)
				return <span>{record.operate_admin_info ? record.operate_admin_info.real_name : null}</span>

			}
		}, {
			title: '操作',
			render: (text, record) => (
				<Popover
					content={this.state.alertModel}
					trigger="click">
					<Button type="primary" onClick={() => { this.handleGetDetail(record) }} >查看详情</Button>
				</Popover>
			),
		}];
		const goldenColumns = [{
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
			align: 'center',
		}, {
			title: '变更明细（元）',
			dataIndex: 'change_cost',
			key: 'change_cost',
			align: 'center',
		}, {
			title: '类型',
			align: 'center',
			render: () => {
				return '调整额度'
			}
		}, {
			title: '调整后额度',
			dataIndex: 'after_cost',
			key: 'after_cost',
			align: 'center',
		}, {
			title: '操作人',
			align: 'center',
			render: (text, record) => {
				//console.log(record)
				return <span>{record.operate_admin_info ? record.operate_admin_info.real_name : null}</span>

			}
		}, {
			title: '备注信息',
			align: 'center',
			dataIndex: 'description',
			key: 'description'
		}];
		//小金库额度的翻页
		const paginationED = {
			current: this.state.currentED,
			pageSize: 20,
			total: goldenCostList.count
		}
		//小金库的流水的翻页
		const paginationFlow = {
			current: this.state.current,
			pageSize: 20,
			total: goldenFlow.count
		}
		// console.log(goldenFlow)
		return (
			<div className='sourceRules-box' >
				<Row type="flex" justify="start" gutter={16} >
					<Col><h4>公司简称：{goldenFlow && goldenFlow.company ? goldenFlow.company.name : ""}</h4></Col>
					<Col><h4>销售：{goldenFlow && goldenFlow.company ? goldenFlow.company.owner_admin_real_name : ""}</h4></Col>
				</Row>
				<fieldset>
					<Row type="flex" justify="start" gutter={16} className='account-detail' style={{ marginBottom: '10px' }}>
						<Col>总计： {goldenFlow.total}元</Col>
						<Col>可撤销金额： {goldenFlow.can_revoke_total}元</Col>
					</Row>
					<Row className='account_box' style={{ marginBottom: '20px' }}>
						<Col span={6}>
							是否可撤销：<Select
								showSearch
								style={{ width: 150 }}
								optionFilterProp="children" onChange={this.handleChangeSelect.bind(this)} placeholder='全部'>
								<Option value={1}>是</Option>
								<Option value={2}>否</Option>
								<Option value={''}>全部</Option>
							</Select>
						</Col>
						<Col span={14}>
							选择时间： <RangePicker onChange={this.handleDateFlowSucc.bind(this)} format={dateFormat} />
							<Button type="primary" onClick={this.handleQueryFlowSucc.bind(this)} style={{ marginLeft: '10px' }}>查询</Button>
						</Col>
					</Row>
					<legend>小金库流水</legend>
					<Table loading={this.state.loading}
						columns={flowColumns} dataSource={goldenFlow.list} pagination={paginationFlow} onChange={this.handlePage.bind(this)} />

				</fieldset>
				<fieldset>
					<Row className='account_box' style={{ marginBottom: '20px' }}>
						<Col span={14}>
							选择时间： <RangePicker onChange={this.handleDateEDSucc.bind(this)} format={dateFormat} />
							<Button type="primary" onClick={this.handleQueryEDSucc.bind(this)} style={{ marginLeft: '10px', marginRight: '10px' }}>查询</Button>

							{this.state.isShow ? <Button type="primary" onClick={this.handleChangeED.bind(this)}>调整额度</Button> : null}						</Col>
					</Row>
					<legend>小金库额度变更</legend>
					<Table loading={this.state.loading}
						columns={goldenColumns} dataSource={goldenCostList.list} pagination={paginationED} onChange={this.handlePageED.bind(this)} />

					<Modal
						title="调整额度"
						visible={this.state.visible}
						footer={null}
						destroyOnClose={true}
						closable={false}
					>
						<UpdateCase handleNoPush={this.handleNoPush.bind(this)}
							getList={this.getList.bind(this)}
							handlePush={this.handlePush.bind(this)} company_id={this.state.id} />
					</Modal>
				</fieldset>
			</div>
		)
	}
}


GoldenDetail.propTypes = {
	actions: PropTypes.shape({

	}),
	// companyDetail: PropTypes.object.isRequired,
	// gift: PropTypes.object.isRequired,
	// credit: PropTypes.object.isRequired,
	// cash: PropTypes.object.isRequired
}


const mapStateToProps = (state) => ({
	// cash: state.companyDetail.accountDetail.cash,
	// credit: state.companyDetail.accountDetail.credit,
	// gift: state.companyDetail.accountDetail.gift,
	goldenFlow: state.companyDetail.goldenFlow.goldenList,
	goldenCostList: state.companyDetail.getCostBilling.goldenCostList,
	reparation: state.companyDetail.getReparation,
	accountDetail: state.companyDetail.accountDetail
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...goldenDetailAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GoldenDetail)

