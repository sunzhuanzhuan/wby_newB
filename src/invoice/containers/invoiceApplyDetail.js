import React from 'react'
import { connect } from 'react-redux';
import * as actions from "../actions/applyDetail";
//antd
import { Table, Tabs, Modal } from "antd";//Button
//less
import './invoiceApplyDetail.less'
//数据配置
import { handleCompany, handleKeyColumns, typeMap, handleTypeMap } from '../constants/invoiceListConfig'
//verticalTable
import VerticalTable from "../components/VerticalTable";
import { VerticalColumns } from '../constants/VerticalTableConfig'
import qs from "qs";

const TabPane = Tabs.TabPane;

class InvoiceApplyDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			previewVisible: false,
			tipVisible: false,
			imgSrc: '',
			loading: true,
			newRandomKey: ''
		}
	}
	async componentWillMount() {
		//let queryObj = this.props.location.query;
		//修改了获取值的方式
		let queryObj = qs.parse(this.props.location.search.substring(1))
		let id = queryObj.id;
		let { getApplyDetail, getAssociatedOrders, getiInvoiceRelation } = this.props;
		getiInvoiceRelation(id);
		await getApplyDetail(id);
		let { detailInfo: { type } } = this.props;
		if (type && type === 2) {
			await getAssociatedOrders(id, '1');
		} else {
			await getAssociatedOrders(id, '3');
		}
		this.setState({
			loading: false
		});
	}
	handleCancel = () => {
		let newKey = this.handleRandomKey();
		this.setState({
			previewVisible: false,
			newRandomKey: newKey
		})
	}
	handleTipCancel = () => {
		this.setState({
			tipVisible: false
		})
	}
	handleRandomKey = () => {
		return Math.random() * 100 + 1000;
	}
	handleTabsChange = async (key) => {
		//let queryObj = this.props.location.query;
		//修改了获取值的方式
		let queryObj = qs.parse(this.props.location.search.substring(1))
		let id = queryObj.id;
		let { getAssociatedOrders, orderInfo } = this.props;
		if (!orderInfo[key]) {
			this.setState({
				loading: true
			});
			await getAssociatedOrders(id, typeMap[key]);
			this.setState({
				loading: false
			});
		}
	}
	render() {
		let { previewVisible, imgSrc, loading } = this.state;//tipVisible
		let { detailInfo, detailInfo: { type }, invoiceRelation, orderInfo } = this.props;
		//let { role, status } = this.props.location.query;
		//修改了获取值的方式
		let { role, status } = qs.parse(this.props.location.search.substring(1));
		let companyData = handleCompany(detailInfo);
		let orderInfoList = handleKeyColumns(orderInfo);
		let typeTable = type ? type === 2 ? handleTypeMap('2') : handleTypeMap('1') : [];
		const companyColumns = [
			{
				title: '公司ID',
				dataIndex: 'company_id',
				key: 'company_id',
				align: 'center'
			}, {
				title: '公司简称',
				dataIndex: 'company_name',
				key: 'company_name',
				align: 'center'
			}, {
				title: '开票金额（元）',
				dataIndex: 'amount',
				key: 'amount',
				align: 'center'
			}, {
				title: '开票依据',
				dataIndex: 'type_display',
				key: 'type_display',
				align: 'center'
			},
			{
				title: '开票维度',
				dataIndex: 'order_associate_type_display',
				key: 'order_associate_type_display',
				align: 'center'
			},
			{
				title: '合同编号',
				dataIndex: 'contract_num',
				key: 'contract_num',
				align: 'center',
				render: (text, { contract_num }) => {
					return contract_num ? contract_num : "";
				}
			},
			{
				title: '合同扫描件',
				dataIndex: 'contract_scanning_copy',
				key: 'contract_scanning_copy',
				align: 'center',
				render: (text, { contract_scanning_copy }) => {
					return <div>
						{contract_scanning_copy ? contract_scanning_copy.map((item, index) => {
							return <span className='file-link' key={index} onClick={() => {
								window.open(item.url)
							}}>
								{item.name}
							</span>
						}) : null}
					</div >
				}
			},
			{
				title: '邮件审批截图',
				dataIndex: 'email_approval_screenshots',
				key: 'email_approval_screenshots',
				align: 'center',
				render: (text, { email_approval_screenshots }) => {
					return <div>
						{email_approval_screenshots ? email_approval_screenshots.map((item, index) => {
							return <div className='thum-img-box' onClick={() => {
								this.setState({
									previewVisible: true,
									imgSrc: item.url
								})
							}} key={index}>
								<img src={item.url} />
							</div>
						}) : null}
					</div >
				}
			}, {
				title: '销售经理',
				dataIndex: 'company_owner_admin_name',
				key: 'company_owner_admin_name',
				align: 'center'
			}
		];
		let VerticalData = Object.keys(detailInfo).length > 1 ? [
			{
				content1: detailInfo.id,
				content2: detailInfo.created_at + ' ' + detailInfo.creator_name
			},
			{
				content1: detailInfo.invoice_title,
				content2: detailInfo.invoice_type
			},
			{
				content1: detailInfo.invoice_content_type,
				content2: {
					amount: detailInfo.amount,
					real_amount: detailInfo.real_amount,
					payback_amount: detailInfo.payback_amount,
					type: detailInfo.type
				}
			},
			{
				content1: detailInfo.beneficiary_company,
				content2: detailInfo.special_invoice_proof
			},
			{
				content1: [
					{ title: '纳税人识别号', content: detailInfo.tax_num },
					{ title: '开票地址', content: detailInfo.invoice_title_address },
					{ title: '开户银行', content: detailInfo.bank_agency },
					{ title: '银行账号', content: detailInfo.bank_account_number },
					{ title: '座机', content: detailInfo.phone },
					{ title: '发票备注', content: detailInfo.invoice_comment },
				],
				content2: [
					{ title: '收件人姓名', content: detailInfo.addressee },
					{ title: '收件人地址', content: detailInfo.addressee_address },
					{ title: '收件人电话', content: detailInfo.addressee_phone },
					{ title: '邮编', content: detailInfo.postcode },
				]
			},
			{
				content1: { status_display: detailInfo.status_display, express_company: detailInfo.express_company_display, waybill_number: detailInfo.waybill_number },
				content2: detailInfo.invoice_company_relation_proof
			},
			{
				content1: detailInfo.invoice_title_code_proof,
				content2: detailInfo.comment
			},
			{
				content1: '',
				content2: detailInfo.reject_by_accountant_reason
			}

		] : [];
		return <div className='invoice-apply-detail clearfix'>
			<fieldset>
				<legend>发票申请单详情</legend>
				<div className='detail-content'>
					<div className='detail-list clearfix'>
						<VerticalTable verticalColumns={VerticalColumns}
							verticalData={VerticalData}
							role={role} status={status}
							invoiceRelation={invoiceRelation}>
						</VerticalTable>
					</div>
					<div className='detail-company clearfix'>
						<h4>该申请单中包含如下公司简称：</h4>
						<Table columns={companyColumns} dataSource={companyData} pagination={false} />
					</div>
					{detailInfo.type == 1 || detailInfo.type == 5 ? < div className='detail-order clearfix'>
						<h4>本申请单包含的订单/活动如下：</h4>
						<Tabs defaultActiveKey="reservation" type='card' onChange={this.handleTabsChange}>
							{typeTable.map((item) => {
								return <TabPane tab={item.title} key={item.key}>
									<Table columns={item.columns} dataSource={orderInfoList[item.key]} loading={loading} pagination={false} />
								</TabPane>
							})
							}
						</Tabs>
					</div> : null}
					<Modal key={this.state.newRandomKey} visible={previewVisible} footer={null} onCancel={this.handleCancel} width={800} wrapClassName='pic-modal'>
						<img src={imgSrc} className='invoice-modal-pic' />
					</Modal>
					{/* <Modal title='提示' visible={tipVisible} footer={[
							<Button key="submit" type="primary" onClick={this.handleCancel}>确定</Button>,
							<Button key="back" onClick={this.handleOk}>
								取消
							</Button>,
						]} onCancel={this.handleTipCancel}>
					</Modal> */}
				</div>
			</fieldset>
		</div >
	}
}


export default connect(
	state => ({
		detailInfo: state.invoice.getApplyDetail.detailInfo,
		orderInfo: state.invoice.getApplyDetail.orderInfo,
		invoiceRelation: state.invoice.getApplyDetail.invoiceRelation
	}),
	actions
)(InvoiceApplyDetail)
