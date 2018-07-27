import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import { Link, browserHistory } from 'react-router'
import { Link } from 'react-router-dom'
import qs from 'qs'
import PropTypes from 'prop-types'
import { Table, Row, Col, Button, Divider, Modal, DatePicker, Input, Form, Select, message, Popover, Spin } from 'antd';

import * as applyListAction from '../actions/index'
import './ApplyList.less';

import Scolltable from "../../components/Scolltable";
import AddInvoiceInfo from '../containers/AddInvoiceInfo'
import DeliverContent from '../containers/DeliverContent'
import { calcSum } from "../../util";
import { columnsList } from '../util'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const formatDate = 'YYYY-MM-DD'
const confirm = Modal.confirm;

class ApplyList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			isAssociateBtnVisible: '',
			isCreatNewInvoice: false,
			creatNewInvoiceVisible: false,
			invoiceApplyId: '',
			isOrderIncomplete: false,
			isNeedUploadProof: false,
			totalSpendAmount: '',
			totalRechargeAmount: '',
			totalInvoicedAmount: '',
			applyAmount: '',
			confirmTitle: '',
			confirmContent: '',
			expressCompany: '',
			waybillNumber: '',
			rejectReason: '',
			loading: true,
			page: 1,
			pageSize: 20,
			formData: {},
			current: 1,
			passDisable: false,
			invoiceInfo: '',
			rejectByAccountantReason: '审核未通过原因：无',
			invoiceInfoTitle: [
				{
					title: '发票号',
					dataIndex: 'invoice_number',
					key: 'invoice_number'
				},
				{
					title: '发票金额（元）',
					dataIndex: 'invoice_amount',
					key: 'invoice_amount'
				},
			],
			canInvoice: '',
			type: 1,
			totalSum: 0,
			returnLoading: false
		}
	}


	getList = async () => {
		this.setState({ loading: true })
		let obj = {}
		obj.page = 1;
		obj.page_size = 20;
		await this.props.actions.getApplyList(obj);
		this.setState({ loading: false })
	}
	componentWillMount() {
		window.localStorage.removeItem('createApply');
		this.getList()
		this.props.actions.getApplyListStat();
		this.props.actions.getApplyMetDada();
		this.props.actions.getSaleList();
		this.props.actions.getCreateList();
	}
	//查询
	handleSelsetSubmit(e) {
		this.props.form.validateFields((err, values) => {
			if (e) { e.preventDefault() }
			let createdAtStart;
			let createdAtEnd;
			if (values['range-picker'] && values['range-picker'].length) {
				createdAtStart = values['range-picker'][0].format('YYYY-MM-DD')
				createdAtEnd = values['range-picker'][1].format('YYYY-MM-DD');
			}
			values.page = 1;
			values.page_size = 20
			let formatValues = {
				...values,
				'created_at_start': createdAtStart,
				'created_at_end': createdAtEnd,
			}
			this.setState({ formData: formatValues, loading: true, current: 1 })
			this.props.actions.getApplyList(formatValues).then((response) => {
				if (response.code == 1000) {
					this.props.actions.getApplyListStat(formatValues);
					this.setState({ loading: false })
				}
			});
		});

	}
	//重置
	handleReset = () => {
		this.props.form.resetFields();
	}
	//选择快递公司
	handleSelectExpressCompany = (value) => {
		this.setState({
			expressCompany: value,
			rejectReason: ''
		})
	}
	//获取运单号
	getWaybillNumber = (e) => {
		this.setState({
			waybillNumber: e.target.value,
			rejectReason: ''
		})
	}
	//获取财务拒绝原因
	getAccountantRejectReason = (e) => {
		this.setState({
			rejectReason: e.target.value,
			expressCompany: '',
			waybillNumber: ''
		})
	}

	//申请单列表 操作项
	showConfirm(input_action, id, role, expressCompanyData) {
		if (input_action == 'accountant-approve') {
			this.handleModelContent(id, input_action, role, {
				title: '确认可开？',
				content: '',
				iconType: ''

			})
		} else if (input_action == 'accountant-reject') {
			this.handleModelContent(id, input_action, role, {
				title: '',
				content:
					<div>
						<h3>确认拒开？请填写拒开原因</h3>
						<Input size="large" onBlur={this.getAccountantRejectReason.bind(this)} placeholder="请填写不可开原因" />
					</div>,
				iconType: ''
			})
		} else if (input_action == 'cashier-cancel' || input_action == 'sale-cancel') {
			this.handleModelContent(id, input_action, role, {
				title: '确认取消开申请单？',
				content: '',
				iconType: ''
			})
		} else if (input_action == 'deliver') {
			this.handleModelContent(id, input_action, role, {
				title: '填写运单号',
				content:
					< DeliverContent
						expressCompanyData={expressCompanyData}
						getWaybillNumber={this.getWaybillNumber.bind(this)}
						handleSelectExpressCompany={this.handleSelectExpressCompany.bind(this)}
					/>,
				iconType: ''

			})
		} else if (input_action == 'sale-commit') {
			this.setState({ passDisable: true })
			this.props.actions.getCommitReviewCheck(id).then((data) => {
				this.setState({
					isOrderIncomplete: data.is_order_incomplete,
					isNeedUploadProof: data.is_need_upload_proof
				})
				if (this.state.isOrderIncomplete) {
					this.handleModelContent(id, input_action, role, {
						title: '证明信息尚未完善，是否先前往提交证明信息？',
						content: '',
						iconType: ''
					})
				}
				if (!this.state.isOrderIncomplete && this.state.isNeedUploadProof) {
					this.handleModelContent(id, input_action, role, {
						title: '发票申请单信息尚未完善，是否先前往完善申请单信息？',
						content: '',
						iconType: ''
					})

				}
				if (!this.state.isNeedUploadProof && !this.state.isOrderIncomplete) {
					this.handleModelContent(id, input_action, role, {
						title: '请确认发票抬头，税务登记号填写是否正确？',
						content: <p style={{ color: 'red' }}>【特别提醒】由于国家三证合一政策实施,有可能导致客户开票税号变更,请与客户确认税号是否发生变更</p>,
						iconType: ''

					})
				}
			})
		}
	}
	handleModelContent(id, input_action, role, config) {
		let that = this;

		confirm({
			...config,
			onOk() {
				if (input_action == 'sale-commit') {
					if (that.state.isNeedUploadProof) {
						let Obj = {}
						Obj.is_need_upload_proof = true;
						Obj.id = id;
						// browserHistory.push({ pathname: "/invoice/upload", state: Obj })
						//修改了push的方式
						that.props.history.push({
							pathname: "/invoice/upload",
							search: '?' + qs.stringify(Obj)
						})
					} else if (that.state.isOrderIncomplete && !that.state.isNeedUploadProof) {
						// let pathName = '/invoice/completeApply?id=' + id + '&' + 'role=' + role
						// browserHistory.push(pathName)
						//修改了push的方式
						let Obj = {
							id: id,
							role: role
						}
						that.props.history.push({
							pathname: "/invoice/completeApply",
							search: '?' + qs.stringify(Obj)
						})
					} else if (!that.state.isNeedUploadProof && !that.state.isOrderIncomplete) {
						that.props.actions.postChangeState(id, input_action, that.state.expressCompany, that.state.waybillNumber, that.state.rejectReason).then((response) => {
							response.code === 1000 ? message.success('操作成功', 3, that.handleSelsetSubmit()) : message.warning(response.msg ? response.msg : '操作失败，请重试')
							that.setState({ passDisable: false })
						})
					}
				} else if (input_action === 'accountant-reject') {
					return new Promise((resolve, reject) => {
						that.props.actions.postChangeState(id, input_action, that.state.expressCompany, that.state.waybillNumber, that.state.rejectReason).then((response) => {
							if (response.code === 1000) {
								message.success('操作成功', 3, that.handleSelsetSubmit())
								that.setState({ rejectReason: '' });
								resolve();
							} else {
								message.error('请填写拒开原因！')
								reject();
							}
							that.setState({ passDisable: false })
						})
					})
				} else if (input_action != 'sale-commit' && input_action != 'accountant-reject') {

					that.props.actions.postChangeState(id, input_action, that.state.expressCompany, that.state.waybillNumber, that.state.rejectReason).then((response) => {
						response.code === 1000 ? message.success('操作成功', 3, that.handleSelsetSubmit()) : message.warning(response.msg ? response.msg : '操作失败，请重试')
						that.setState({ passDisable: false })
					})
				}

			},
			onCancel() {
				that.setState({ passDisable: false, rejectReason: '' })
			},
		});
	}
	//申请单列表 操作项-是否关联发票
	isAssociate = (type_display, id, company_id, amount, can_invoice, type) => {
		this.setState({
			isAssociateVisible: true,
			isAssociateBtnVisible: type_display,
			invoiceApplyId: id,
			applyAmount: amount,
			canInvoice: can_invoice,
			type: type
		}, () => {
			this.props.actions.getAvailableInvoiceList(this.state.invoiceApplyId, []);
			this.props.actions.getInvoiceStat(company_id).then((data) => {
				this.setState({
					totalSpendAmount: data.total_spend_amount,
					totalRechargeAmount: data.total_recharge_amount,
					totalInvoicedAmount: data.total_invoiced_amount,

				});
			});
		});

	}
	handleAssociateCancel = () => {
		this.setState({
			isAssociateVisible: false
		});
	}

	//开新发票
	handleCreatNewInvoice = () => {
		this.setState({
			isAssociateBtnVisible: false,
			creatNewInvoiceVisible: true,
			isAssociateVisible: false,

		}, () => {
			this.handleSelectData()
		});


	}
	handleSelectData(value) {
		if (value != undefined) {
			this.props.actions.getAvailableInvoiceList(this.state.invoiceApplyId, value);
		}

	}
	handleCreatNewInvoiceOk = () => {
		this.setState({
			creatNewInvoiceVisible: false,
			totalSum: 0
		});
	}

	//获取开票信息
	handleInvoiceInfo = (id) => {
		this.setState({
			invoiceInfo: <div><Spin /></div>
		})
		this.props.actions.getInvoiceRelation(id).then(({ data }) => {
			this.setState({
				invoiceInfo: <div> <Table bordered size="small" rowKey='id' columns={this.state.invoiceInfoTitle} dataSource={data} pagination={false}></Table></div>
			})
		})
	}

	//获取审核未通过原因

	handleRejectReason = (rejectReason) => {
		this.setState({
			rejectByAccountantReason: <div style={{ maxWidth: '200px', wordBreak: 'break-word', wordWrap: 'break-all' }}>审核未通过原因：{rejectReason}</div>
		})
	}

	//分页事件
	handlePage(p) {
		let obj = {};
		obj = this.state.formData
		obj.page = p.current;
		obj.page_size = p.pageSize
		this.setState({ current: p.current })
		this.props.actions.getApplyList(obj)
	}
	//显示已选开票金额
	handleTotalSum = sum => {
		let total = sum.toFixed(2);
		this.setState({ totalSum: total })
	}
	//部分回款变成可以点击状态
	handlePartMoney = async (id) => {
		this.setState({ returnLoading: true })
		await this.props.actions.getPartMoney(id);
		this.setState({ returnLoading: false })

	}
	render() {
		const {
			applyList = [],
			total,
			role,
			applyMetaData = {},
			applyListStat = {},
			saleList = [],
			createList = [],
			availableInvoiceList = [],
			partMoneyData
		} = this.props;
		const { getFieldDecorator } = this.props.form;
		//role 角色 销售sale 财务accountant 出纳cashier
		const applicationType = applyMetaData.application_type;//开票依据
		const applicationStatus = applyMetaData.application_status;//申请单状态
		const beneficiaryCompany = applyMetaData.beneficiary_company;//开票公司
		const invoiceType = applyMetaData.invoice_type;//发票类型
		const invoiceContentType = applyMetaData.invoice_content_type;//发票内容
		const invoiceTitleCodeUseChange = applyMetaData.invoice_title_code_use_change;//编码有变
		const expressCompanyData = applyMetaData.express_company;//快递公司
		const paybackStatus = applyMetaData.payback_status;//开票回款状态
		const pageTotle = total;
		//翻页
		const pagination = {
			current: this.state.current,
			pageSize: 20,
			total: pageTotle
		}
		const applyListConfig = {
			'id': {
				title: '申请单ID',
				dataIndex: 'id',
				key: 'id',
				minWidth: '200',
				render: (text, record) => {
					let columnsPartMoney = [
						{
							title: '回款金额（元）',
							dataIndex: 'change_amount',
							key: 'change_amount',

						},
						{
							title: '分配时间',
							dataIndex: 'created_time',
							key: 'created_time',

						},
						{
							title: '操作人',
							dataIndex: 'real_name',
							key: 'real_name',

						},
						{
							title: '备注',
							dataIndex: 'comment',
							key: 'comment',
							width: 200

						},
					]
					// let partMoney = '';
					let partMoney = (<div> <Table loading={this.state.returnLoading} bordered size="small"
						rowKey='id' columns={columnsPartMoney}
						dataSource={partMoneyData} pagination={false}></Table></div >)
					if (record.payback_status == 0) {
						return (
							<div>
								<a target='_blank' href={`/invoice/applyDetail?id=${record.id}&role=${role}&status=${record.payback_status}`} >{text}</a>
								<span className="highLight" >待回款</span>
							</div >

						)
					} else if (record.payback_status == 2) {
						return (
							<div>
								<a target='_blank' href={`/invoice/applyDetail?id=${record.id}&role=${role}&status=${record.payback_status}`} >{text}</a>
								<Popover content={partMoney} trigger="click">
									<span className="highLight" onClick={() => { this.handlePartMoney(record.id) }} >已回款</span>
								</Popover>
							</div>
						)
					} else if (record.payback_status == 1) {
						return (
							<div>
								<a target='_blank' href={`/invoice/applyDetail?id=${record.id}&role=${role}&status=${record.payback_status}`} >{text}</a>
								<Popover content={partMoney} trigger="click">
									<span className="highLight" onClick={() => { this.handlePartMoney(record.id) }}>部分回款</span>
								</Popover>
							</div>
						)
					} else {
						return <div>
							<a target='_blank' href={`/invoice/applyDetail?id=${record.id}&role=${role}`} >{text}</a>
						</div>
					}
				}
			},
			'status_display': {
				title: '状态',
				dataIndex: 'status_display',
				key: 'status_display',
				render: (text, record) => {
					if (record.status === 6 || record.status === 7) {
						return (
							<div>
								<Popover content={this.state.invoiceInfo} trigger="click">
									<span onClick={this.handleInvoiceInfo.bind(this, record.id)} style={{ color: '#1DA57A', cursor: 'pointer' }}>{text}</span>
								</Popover>

							</div>
						)
					} else if (record.status === 4) {
						return (
							<div>
								<Popover content={this.state.rejectByAccountantReason} trigger="click">
									<span onClick={this.handleRejectReason.bind(this, record.reject_by_accountant_reason)} style={{ color: '#1DA57A', cursor: 'pointer' }}>{text}</span>
								</Popover>

							</div>
						)
					} else {
						return (
							text
						)
					}
				}
			},
			'company_name': {
				title: '公司简称',
				dataIndex: 'company_name',
				key: 'company_name',
			},
			'amount': {
				title: '金额（元）',
				width: '170px',
				render: (record) => {
					let arrWaitMoney = [record.amount, -record.payback_amount]
					return <p>
						<p>申请单金额:{record.amount}</p>
						<p>已开票金额:{record.real_amount}</p>
						{record.type == 1 || record.type == 5 ? <p><p>已回款金额:{record.payback_amount}</p>
							<p>待回款金额:{calcSum(arrWaitMoney).toFixed(2)}</p></p> : null}
					</p>
				}
			},
			'invoice_type_display': {
				title: '发票类型',
				dataIndex: 'invoice_type_display',
				key: 'invoice_type_display',
				render: (text, record) => {
					return (
						<div>
							{text}
							{record.special_invoice_first_time == 1 && record.invoice_type == 2 ? <span className="highLight" >首次</span> : null}
						</div>
					)
				}
			},
			'invoice_title': {
				title: '发票抬头',
				dataIndex: 'invoice_title',
				key: 'invoice_title',
				width: '270px',
				render: (text, record) => {
					return (
						<div>
							{text}
							{record.invoice_title_code_use_change == 1 ? <span className="highLight" >编码有变</span> : null}
						</div>
					)
				}
			},
			'invoice_content_type_display': {
				title: '发票内容',
				dataIndex: 'invoice_content_type_display',
				key: 'invoice_content_type_display',
			},
			'beneficiary_company_display': {
				title: '开票公司',
				dataIndex: 'beneficiary_company_display',
				key: 'beneficiary_company_display',
			},
			'creator_name': {
				title: '创建人',
				dataIndex: 'creator_name',
				key: 'creator_name',
			},
			'created_at': {
				title: '提交时间',
				dataIndex: 'created_at',
				key: 'created_at',
			},
			'waybill_number': {
				title: '运单号',
				dataIndex: 'waybill_number',
				key: 'waybill_number',
			},
			'invoice_info': {
				title: '发票信息',
				dataIndex: 'invoice_info',
				key: 'invoice_info',
				width: '300px',
				render: (text, record) => {
					return (
						<div>
							<p>纳税人识别号: {record.tax_num}</p>
							<p>开票地址: {record.invoice_title_address}</p>
							<p>开户银行: {record.bank_agency}</p>
							<p>银行账号: {record.bank_account_number}</p>
							<p>座机: {record.phone}</p>
							<p>发票备注: {record.invoice_comment}</p>
						</div>
					)
				}
			},
			'invoice_comment': {
				title: '发票备注',
				dataIndex: 'invoice_info',
				key: 'invoice_info',
				width: '300px',
				render: (text, record) => {
					return record.invoice_comment
				}
			},
			'type_display': {
				title: '开票依据',
				dataIndex: 'type_display',
				key: 'type_display',
			},
			'comment': {
				title: '备注',
				dataIndex: 'comment',
				width: '300px',
				key: 'comment',
			},
			'action': {
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				fixed: 'right',
				width: 100,
				render: (text, record) => {
					return (
						<div>
							{role == 'sale' ?
								<div className='button-margin'>
									<Button size='small' type="primary" href={`/invoice/apply?applyType=3&company_id=${record.company_id}&id=${record.id}`} >复制</Button>
									{record.status_display == '已开' ? <Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'deliver', record.id, role, expressCompanyData)}>已寄出</Button> : ''}
									{record.status_display == '草稿' ?
										<p>
											<Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'sale-commit', record.id, role)} disabled={this.state.passDisable}>提交审核</Button>
											<Button size='small' type="primary" href={`/invoice/apply?applyType=2&company_id=${record.company_id}&id=${record.id}`} >修改</Button>
											{record.status == 0 ? <Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'sale-cancel', record.id)}>取消</Button> : ''}
										</p> : ''}
								</div> : ''
							}
							{role == 'accountant' ?
								<div className='button-margin'>
									{/* <Button size='small' type="primary" href={`/invoice/apply?applyType=3&company_id=${record.company_id}&id=${record.id}`} >复制</Button> */}
									{record.status_display == '待审核' ?
										<p>
											<Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'accountant-approve', record.id)}>可开</Button>
											<Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'accountant-reject', record.id)}>拒开</Button>
										</p>
										: ''}
								</div> : ''
							}
							{role == 'cashier' ? record.type === 1 || record.type === 5 ?
								<div className='button-margin'>									{record.status_display == '已开' ? <Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'deliver', record.id, role, expressCompanyData)}>已寄出</Button> : ''}
									{record.status_display == '待开' ?
										<p>
											<Button size='small' type="primary" onClick={this.isAssociate.bind(this, record.type_display, record.id, record.company_id, record.amount, record.can_invoice, record.type)}>已开</Button>
											{record.payback_status == 0 ? <Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'cashier-cancel', record.id)}>取消</Button> : ''}
										</p> : ''}
								</div> :
								<div className='button-margin'>									{record.status_display == '已开' ? <Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'deliver', record.id, role, expressCompanyData)}>已寄出</Button> : ''}
									{record.status_display == '待开' ?
										<p>
											<Button size='small' type="primary" onClick={this.isAssociate.bind(this, record.type_display, record.id, record.company_id, record.amount, record.can_invoice, record.type)}>已开</Button>
											<Button size='small' type="primary" onClick={this.showConfirm.bind(this, 'cashier-cancel', record.id)}>取消</Button>
										</p> : ''}
								</div> : ''
							}
						</div >
					)

				}
			}
		};
		const applyListTitle = role === 'cashier' ? columnsList(applyListConfig, ['id', 'status_display', 'company_name', 'amount', 'invoice_type_display', 'invoice_title', 'invoice_content_type_display', 'beneficiary_company_display', 'creator_name', 'created_at', 'waybill_number', 'invoice_info', 'type_display', 'comment', 'action']) : columnsList(applyListConfig, ['id', 'status_display', 'company_name', 'amount', 'invoice_type_display', 'invoice_title', 'invoice_content_type_display', 'beneficiary_company_display', 'creator_name', 'created_at', 'waybill_number', 'invoice_comment', 'type_display', 'comment', 'action']);
		let acountAry = [this.state.applyAmount, -this.state.canInvoice];
		return (
			<div className='apply-list-most'>
				<fieldset>
					<legend>发票申请单列表</legend>
					<Modal
						title="是否已开发票"
						visible={this.state.isAssociateVisible}
						onCancel={this.handleAssociateCancel.bind(this)}
						footer={null}
						width='580px'
					>
						<div>
							{
								(this.state.totalInvoicedAmount > this.state.totalSpendAmount) || (this.state.totalInvoicedAmount > this.state.totalRechargeAmount) ? <p style={{ fontSize: '12px' }}><span style={{ color: 'red' }}>预警提示：</span>该公司发票已开超，请谨慎操作</p> : null
							}
							<p style={{ fontSize: '12px' }}>该公司总消费：{this.state.totalSpendAmount}元，总充值：{this.state.totalRechargeAmount}元，已开票金额（含合同、邮件审批）：{this.state.totalInvoicedAmount}元</p>
							<p>请确认该发票申请单之前没有开过发票，以免开重，然后再进行下一步操作</p>
							<Row type="flex" justify="center" gutter={16}>
								{this.state.isAssociateBtnVisible == '消费' || this.state.isAssociateBtnVisible == '充值' ? <Col><Button><Link to={"/invoice/associateInvoice?id=" + this.state.invoiceApplyId + "&role=" + role}>已开票，关联现有发票</Link></Button></Col> : ''}
								<Col><Button onClick={this.handleCreatNewInvoice.bind(this)}>未开票，开具新发票</Button></Col>
							</Row>

						</div>
					</Modal>
					<Modal
						title='填写发票信息'
						visible={this.state.creatNewInvoiceVisible}
						onCancel={this.handleCreatNewInvoiceOk.bind(this)}
						onOk={this.handleCreatNewInvoiceOk.bind(this)}
						okText="提交"
						cancelText="取消"
						width='820px'
						closable={false}
						footer={null}
					>
						<div>
							<p>
								<span key='apply-amount' className='modal-tip-title'>发票申请单金额：{this.state.applyAmount}元</span>
								{this.state.type === 5 ? <span>（已开发票金额:{calcSum(acountAry).toFixed(2)}元）</span> : null}
								{this.state.type === 5 ? <span key='can-invoice-amount' className='modal-tip-title'>可开发票金额：{this.state.canInvoice}元</span> : null}
							</p>
							<p className='modal-tip-title'>已填开票金额：<span className='some-red-span'>{this.state.totalSum}元</span></p>
							<AddInvoiceInfo
								availableInvoiceList={availableInvoiceList}
								handleSelectData={this.handleSelectData.bind(this)}
								id={this.state.invoiceApplyId}
								applyAmount={this.state.applyAmount}
								canInvoice={this.state.canInvoice}
								type={this.state.type}
								handleCreatNewInvoiceOk={this.handleCreatNewInvoiceOk.bind(this)}
								handleSelsetSubmit={this.handleSelsetSubmit.bind(this)}
								handleTotalSum={this.handleTotalSum}
							></AddInvoiceInfo>
						</div>

					</Modal>
					<Row type="flex" justify="start" gutter={16} style={{ marginBottom: '20px' }} >
						<Col><h4>申请单:<span style={{ color: 'red' }}>{applyListStat.invoice_application_count}个</span></h4></Col><Col>|</Col>
						<Col><h4>已开发票:<span style={{ color: 'red' }}>{applyListStat.invoice_amount_sum}元</span></h4></Col>
						{role == 'sale' ? ''
							:
							(
								<Col><span style={{ fontSize: '14px', marginRight: '5px' }}>剩余可开普票张数&nbsp;{applyListStat.available_normal_invoice_count}&nbsp;个</span><span>|</span></Col>

							)
						}
						{role == 'sale' ? ''
							:
							(
								<Col><span style={{ fontSize: '14px' }}>剩余可开专票张数&nbsp;{applyListStat.available_special_invoice_count}&nbsp;个</span></Col>

							)
						}
					</Row>
					<Form onSubmit={this.handleSelsetSubmit.bind(this)} layout="inline">
						<Row type="flex" justify="start" gutter={16} >
							<Col>
								<FormItem label="公司简称：">
									{getFieldDecorator('company_name')(<Input style={{ width: 200 }} />)}
								</FormItem>
							</Col>
							<Col>
								<FormItem label="发票抬头：">
									{getFieldDecorator('invoice_title')(<Input style={{ width: 300 }} />)}
								</FormItem>
							</Col>
							<Col>
								<FormItem label="申请单ID：">
									{getFieldDecorator('id')(<Input style={{ width: 90 }} />)}
								</FormItem>
							</Col>

							<Col>
								<FormItem label="提交时间">
									{getFieldDecorator('range-picker')(
										<RangePicker format={formatDate} />
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem label="运单号：">
									{getFieldDecorator('waybill_number')(<Input style={{ width: 150 }} />)}
								</FormItem>
							</Col>
							<Col>
								<FormItem label="开票金额大于：">
									{getFieldDecorator('amount_greater_than')(<Input style={{ width: 150 }} />)}
								</FormItem>
							</Col>
						</Row>
						<Row type="flex" justify="start" gutter={16} >
							<Col className='brand-select'>
								<FormItem
									label="销售经理："
								>
									{getFieldDecorator('sale', { placeholder: '请选择' })(
										<Select
											style={{ width: 120 }} showSearch placeholder='全部'
											filterOption={(input, option) => (
												option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
											)}
										>
											<Option value={''}>全部</Option>
											{saleList ?
												saleList.map(d => <Option value={d.user_id} key={d.user_id}>{d.real_name}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col className='brand-select'>
								<FormItem
									label="创建人："
								>
									{getFieldDecorator('creator', { placeholder: '请选择' })(
										<Select
											style={{ width: 120 }} showSearch placeholder='全部'
											filterOption={(input, option) => (
												option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
											)}
										>
											<Option value={''}>全部</Option>
											{createList ?
												createList.map(d => <Option value={d.user_id} key={d.user_id}>{d.real_name}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem
									label="发票内容："
								>
									{getFieldDecorator('invoice_content_type', { placeholder: '请选择' })(
										<Select
											style={{ width: 120 }} placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{invoiceContentType ?
												invoiceContentType.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem
									label="申请单状态："
								>
									{getFieldDecorator('status', { placeholder: '请选择' })(
										<Select
											style={{ width: 120 }} placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{applicationStatus ?
												applicationStatus.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem
									label="发票类型："
								>
									{getFieldDecorator('invoice_type', { placeholder: '请选择' })(
										<Select
											style={{ width: 100 }} placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{invoiceType ?
												invoiceType.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem
									label="开票公司："
								>
									{getFieldDecorator('beneficiary_company', { placeholder: '请选择' })(
										<Select
											style={{ width: 100 }} placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{beneficiaryCompany ?
												beneficiaryCompany.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem
									label="开票依据："
								>
									{getFieldDecorator('type', { placeholder: '请选择' })(
										<Select
											style={{ width: 100 }} placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{applicationType ?
												applicationType.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
							{role == 'sale' ? '' :
								<Col>
									<FormItem
										label="编码有变："
									>
										{getFieldDecorator('invoice_title_code_use_change', { placeholder: '请选择' })(
											<Select
												style={{ width: 100 }}
												placeholder='全部'
											>
												<Option value={''}>全部</Option>
												{invoiceTitleCodeUseChange ?
													invoiceTitleCodeUseChange.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
													: ''
												}
											</Select>
										)}
									</FormItem>
								</Col>
							}
							<Col>
								<FormItem
									label="开票回款状态："
								>
									{getFieldDecorator('payback_status', { placeholder: '请选择' })(
										<Select
											style={{ width: 100 }}
											placeholder='全部'
										>
											<Option value={''}>全部</Option>
											{paybackStatus ?
												paybackStatus.map(d => <Option value={d.id} key={d.id}>{d.display}</Option>)
												: ''
											}
										</Select>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row type="flex" justify="center" gutter={16} >
							<Col><Button htmlType="submit" type="primary">查询</Button></Col>
							<Col><Button onClick={this.handleReset}>重置</Button></Col>
						</Row>
					</Form>
					<Divider orientation="left"></Divider>
					<Col><h4>总数：{total}</h4></Col>
					{applyList ?
						<Scolltable scrollClassName='.ant-table-body'>
							<Table
								rowKey="id"
								dataSource={applyList}
								columns={applyListTitle}
								loading={this.state.loading}
								pagination={pagination}
								scroll={{ x: 2000 }}
								onChange={this.handlePage.bind(this)}
								bordered={true} />
						</Scolltable>
						:
						null}
				</fieldset>
			</div >
		)
	}
}
ApplyList.propTypes = {
	actions: PropTypes.shape({

	}),

}
const mapStateToProps = (state) => ({
	applyList: state.invoice.applyList.rows,
	total: state.invoice.applyList.total,
	role: state.invoice.applyList.role,
	applyMetaData: state.invoice.applyMetaData,
	applyListStat: state.invoice.applyListStat,
	saleList: state.invoice.saleList,
	createList: state.invoice.createList,
	availableInvoiceList: state.invoice.availableInvoiceList,
	partMoneyData: state.invoice.partMoney

})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...applyListAction
	}, dispatch)
})
const ApplyListForm = Form.create()(ApplyList);
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApplyListForm)
