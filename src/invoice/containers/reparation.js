import React, { Component } from 'react'
import { Select, DatePicker, Input, Button, Col, Row, Table, Popconfirm, message, Popover, Modal } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import tableConfig from '../constants/reparationColum'
import * as actionsRepartion from '../actions/repartion';
import api from '../../api/index'
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD'

class Filter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			time_start: '',
			time_end: '',
			order_id: '',
			reparation_id: '',
			sale_id: '',
			status: '',
			time_type: '',
			page: 1,
			page_size: 20,
			loading: true,
			visible: false,
			data: {},
			current: 1,
			isShow: false

		}
	}
	getList = async () => {
		let obj = {}
		obj.page = 1;
		obj.page_size = 20
		await this.props.actions.getRepartionList({ ...obj });
		this.setState({ loading: false })
	}
	handlePage(page) {
		this.setState({
			page: page.current,
			page_size: page.pageSize,
			current: page.current
		}, () => {
			let obj = {}
			obj.page = this.state.page
			obj.page_size = this.state.page_size
			this.props.actions.getRepartionList({ ...obj })
		})

	}
	componentDidMount() {
		this.getList();
		this.props.actions.getSaleList();
		this.props.actions.getRepartionStatus();
		api.get('/rbac/getAuthorizations').then((response) => {
			if (response.data[0].permissions['reparation.completeReparation']) {
				this.setState({
					isShow: response.data[0].permissions['reparation.completeReparation']
				})
			}
		})
	}
	componentWillRecieveProps() {

	}
	//获取时间范围
	handleChangeTime(dates, dateStrings) {
		this.setState({
			time_start: dateStrings[0],
			time_end: dateStrings[1],
		})
	}
	//获取选择的时间
	handleChangeSelectTime(value) {
		this.setState({
			time_type: value
		})
	}
	//选择赔偿状态
	handleChangeSelectRepartion(value) {
		this.setState({
			status: value
		})
	}
	//选择销售人员
	handleChangeSelectSale(value) {
		this.setState({
			sale_id: value
		})
	}
	//获取订单ID
	handleOrder(e) {
		this.setState({
			order_id: e.target.value
		})
	}
	//获取赔偿ID
	handleRepartion(e) {
		this.setState({
			reparation_id: e.target.value
		})
	}
	async handleQuerySucc() {
		this.setState({ loading: true })
		let obj = {}
		obj.page = 1;
		obj.page_size = 20
		await this.props.actions.getRepartionList({ ...this.state });
		this.setState({ loading: false, current: 1 })
	}
	handleRefuse(id) {
		let obj = {}
		obj.id = id
		api.post('/finance/reparation/refuse', obj).then(() => {
			message.success('操作成功');
			this.setState({ loading: true })
			this.getList();
		})
	}
	showModal(record) {
		this.setState({
			visible: true,
		});
		let obj = {}
		obj.reparation_id = record.reparation_id
		this.props.actions.getRepartionDetail(obj).then((response) => {
			if (response.code == 1000) {
				this.setState({ data: response.data.list[0] })
			}
		})
	}
	handleOk() {
		let value = document.getElementById('remarks').value;
		let obj = {}
		obj.remarks = value
		obj.id = this.state.data.reparation_id;
		api.post('/finance/reparation/complete', { ...obj }).then((response) => {
			if (response.code == 1000) {
				message.success('操作成功');
				this.setState({ loading: true })
				this.getList();
			} else {
				message.success('操作失败');
			}

		})
		this.setState({
			visible: false,
		});

	}
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	}
	render() {
		let repar = this.props.repartion;
		let columns = [
			{
				title: '操作',
				key: 13,
				align: 'center',
				width: 100,
				render: (text, record) => {

					return (<div>
						{this.state.isShow ? (record.status_note == "赔偿拒绝") || (record.status_note == "赔偿通过") ? null : <div>
							<Button type="primary" onClick={this.showModal.bind(this, record)}>通过</Button>
							<Popconfirm title="确定要拒绝?" okText="确定" cancelText="取消" onConfirm={() => { this.handleRefuse(record.reparation_id) }}>

								<Button type="primary" style={{ marginTop: '20px' }}>拒绝</Button>
							</Popconfirm>
						</div> : ""}
					</div>)
				}
			}, {
				title: '订单ID',
				dataIndex: 'order_id',
				key: 1,
				width: 130,
				align: 'center',
				render: (text, record) => {
					return (<div >
						订单ID:<a target='_blank' href={record.order_link}>{record.order_id}</a><br />
						{
							record.evidence == undefined ? null : record.evidence.map((item, index) => {
								return (
									<p key={index}><span>PO：</span><a target='_blank' href={record.evidence_link + item.execution_evidence_id}>{item.execution_evidence_code} </a></p>

								)
							})
						}
					</div >)
				}
			}, {
				title: '需求名称',
				dataIndex: 'order_name',
				key: 3,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.order_name}
						</div>
					)
				}
			}, {
				title: '赔偿ID',
				dataIndex: 'reparation_id',
				key: 4,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.reparation_id}
						</div>
					)
				}
			}, {
				title: '赔偿金额',
				dataIndex: 'reparation_amount',
				key: 5,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.reparation_amount}
						</div>
					)
				}
			}, {
				title: '结算金额',
				dataIndex: 'complete_price',
				key: 55,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.complete_price}
						</div>
					)
				}
			}, {
				title: '赔偿原因',
				dataIndex: 'execution_price',
				key: 6,
				align: 'center',
				render: (text, record) => {
					const content = (
						<div style={{ width: '200px' }}>
							<p style={{ width: '200px' }}>赔偿原因:{record.reparation_reason}</p>
							{this.state.isShow ? <p style={{ width: '200px' }}>备注:{record.remarks}</p> : ""}

						</div>
					);
					return (<div>
						<Popover content={content} title="详情">
							<span style={{ color: '#1DA57A' }}>查看详情</span>
						</Popover>

					</div>);
				}
			}, {
				title: '所属销售',
				dataIndex: 'sale_manager',
				key: 7,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.sale_info ? record.sale_info.real_name : ''}
						</div>
					)
				}
			}, {
				title: '申请人',
				dataIndex: 'username',
				key: 8,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.operate_admin_info.real_name}
						</div>
					)
				}
			}, {
				title: '赔偿状态',
				dataIndex: 'status_note',
				key: 9,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.status_note}
						</div>
					)
				}
			}, {
				title: '时间',
				dataIndex: 'spend_detail',
				key: 10,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							<p>申请时间{record.created_at}</p>
							<p>通过/拒绝时间{record.status_note == '赔偿申请中' ? '-' : record.updated_at}</p>
						</div>
					)
				}
			}, {
				title: '公司简称',
				dataIndex: 'company_name',
				key: 11,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.company_name}
						</div>
					)
				}
			}, {
				title: 'A端登录名',
				dataIndex: 'own_user_name',
				key: 12,
				align: 'center',
				render: (text, record) => {
					return (
						<div>
							{record.own_user_name}
						</div>
					)
				}
			}
		];
		let pagination = {
			//current: this.state.current,
			pageSize: 20,
			total: repar.count
		}
		if (this.props.repartion.length > 0) {
			this.setState({ loading: false })
		}
		const { sale = [], status = [] } = this.props;
		return (
			<fieldset>
				<legend>订单赔偿处理</legend>

				<div>
					<Row>
						<Col span={10}>
							<Select defaultValue="请选择时间" style={{ width: 130, marginRight: '10px' }} onChange={this.handleChangeSelectTime.bind(this)}>
								<Option value="created_at">申请时间</Option>
								<Option value="updated_at">最后操作时间</Option>
								<Option key={125} value={''}>全部</Option>
							</Select>
							<RangePicker format={dateFormat} onChange={this.handleChangeTime.bind(this)} />
						</Col>
						<Col span={12}>
							<span style={{ width: 140, marginRight: '10px' }}>赔偿ID</span>
							<Input onBlur={this.handleRepartion.bind(this)} style={{ width: 150, marginRight: '20px' }} />
							<span style={{ width: 140, marginRight: '10px' }}>订单ID</span>
							<Input onBlur={this.handleOrder.bind(this)} style={{ width: 150 }} />
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<span style={{ width: 140, marginRight: '10px' }}>所属销售</span>
						<Select defaultValue="请选择销售" style={{ width: 140, marginRight: '10px' }} onChange={this.handleChangeSelectSale.bind(this)} placeholder='全部'>
							<Option key={126} value={''}>全部</Option>
							{
								sale.map((item, index) => {
									return <Option value={item.user_id} key={index}>{item.real_name}</Option>
								})
							}
						</Select>
						<span style={{ lineHeight: '1', marginRight: '10px' }}>赔偿状态</span>
						<Select defaultValue="请选择赔偿状态" style={{ width: 140, marginRight: '10px' }} onChange={this.handleChangeSelectRepartion.bind(this)} placeholder='全部'>
							<Option key={127} value={''}>全部</Option>
							{
								status.map((item, index) => {
									return <Option value={item.id} key={index}>{item.display}</Option>
								})
							}
						</Select>
						<Button onClick={this.handleQuerySucc.bind(this)} type="primary">查询</Button>
					</Row>
					<Table
						loading={this.state.loading}
						columns={columns} dataSource={repar.list} bordered={true}
						pagination={pagination} onChange={this.handlePage.bind(this)} style={{ marginTop: '20px' }}>
					</Table>
					<Modal
						title="确认通过订单赔偿申请"
						visible={this.state.visible}
						onOk={this.handleOk.bind(this)}
						onCancel={this.handleCancel}
					>
						<div>
							<p>需求名称：{this.state.data.order_name}</p>
							<p>赔偿金额：{this.state.data.reparation_amount}</p>
							<p>赔偿原因：{this.state.data.reparation_reason}</p>
							<div>
								<div><span>备注（财务）：</span>
									< TextArea id='remarks' style={{ height: '100px' }} /></div>

							</div>
							<div style={{ color: 'red', fontSize: '12px' }}>请填写备注信息，不超过500字</div>
						</div>
					</Modal>
				</div>
			</fieldset >
		)
	}
}
const mapStateToProps = (state) => ({
	sale: state.invoice.saleData,
	status: state.invoice.repartionStatus,
	repartion: state.invoice.getRepartionData

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...actionsRepartion
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Filter)
