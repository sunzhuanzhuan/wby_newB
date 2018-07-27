import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions/completeApply";
import * as action from '../actions/associateInvoice'
//ant design
import { Modal, Button, Table, /*Divider*/ } from "antd";
//less
import "./myDialog.less";


class Mydialog extends React.Component {
	constructor() {
		super();
		this.state = {
			keyAry: ["reservation", "activity", "business", "weibo", "recharge"],
			tableObj: {}
		}
	}
	componentWillMount() {
		let tableObj = {};
		let { type } = this.props;
		if (type === 1 || 2 || 5) {
			for (let key in this.props.completeOrderList) {
				tableObj[key] = this.props.completeOrderList[key].hashMap;
			}
		}
		if (type === 3) {
			tableObj['invoiceKeys'] = this.props.list.hashMap;
		}
		this.setState({ tableObj })
	}

	handleCancel = () => {
		this.props.visibleCall();
	};
	selectedFilter = (id, keyAry, selectObj, tableObj) => {
		let { setTableSelectedRowkeys, selectedRowKeys, selected, setInvoiceListSelected } = this.props;
		let res = {}, data = [], colums = [];
		keyAry.forEach(item => {
			selectObj[item] = selectObj[item] || [];
			tableObj[item] = tableObj[item] || [];
			res[item] = [];
			selectObj[item].forEach(key => {
				res[item].push(tableObj[item][key]);
			})
		});
		if (id === 1 || id === 5) {
			colums = [
				{ title: "订单/活动ID", dataIndex: "id", key: "id", width: "120px", align: 'center' },
				{ title: "需求/活动名称", dataIndex: "name", key: "name", width: "200px", align: 'center' },
				{ title: "业务类型", dataIndex: "type", key: "type", width: "160px", align: 'center' },
				{ title: "可开票金额", dataIndex: "money", key: "money", width: "160px", align: 'center' },
				{
					title: "操作", key: "action", render: record => (
						<a href="#" onClick={() => {
							let ary = [];
							record.type = record.type === "预约订单" ? "reservation" : record.type === "派单活动" ? "activity" : record.type === "公司拓展业务" ? "business" : "weibo";
							ary = selectedRowKeys[record.type].filter(item => item !== record.id);
							setTableSelectedRowkeys(
								record.type,
								ary
							);
						}}>删除</a>)
				},
			];
			for (let key in res) {
				switch (key) {
					case "reservation":
						res[key].forEach((item, index) => {
							data.push({
								key: `${key}_${index}`,
								id: item.order_id,
								name: item.requirement_name,
								type: "预约订单",
								money: item.remain_invoice_amount.toFixed(2)
							})
						});
						break;
					case "activity":
						res[key].forEach((item, index) => {
							data.push({
								key: `${key}_${index}`,
								id: item.campaign_id,
								name: item.campaign_name,
								type: "派单活动",
								money: item.remain_invoice_amount.toFixed(2)
							})
						});
						break;
					case "business":
						res[key].forEach((item, index) => {
							data.push({
								key: `${key}_${index}`,
								id: item.business_id,
								name: item.business_name,
								type: "公司拓展业务",
								money: item.remain_invoice_amount.toFixed(2)
							})
						});
						break;
					case "weibo":
						res[key].forEach((item, index) => {
							data.push({
								key: `${key}_${index}`,
								id: item.campaign_id,
								name: item.campaign_name,
								type: "微博圈订单",
								money: item.remain_invoice_amount.toFixed(2)
							})
						});
						break;
					default:
						res[key].forEach((item, index) => {
							data.push({
								key: `${key}_${index}`,
								id: item.order_id,
								name: item.campaign_name,
								type: "微博圈订单",
								money: item.remain_invoice_amount
							})
						});
						break;
				}
			}
		}
		if (id === 2) {
			colums = [
				{ title: "充值金额", dataIndex: "rechargeAmount", key: "rechargeAmount", width: "120px", align: 'center' },
				{ title: "充值时间", dataIndex: "rechargeTime", key: "rechargeTime", width: "180px", align: 'center' },
				{ title: "充值方式", dataIndex: "rechargeType", key: "rechargeType", width: "100px", align: 'center' },
				{ title: "收款账户", dataIndex: "accountPayee", key: "accountPayee", width: "120px", align: 'center' },
				{ title: "可开票金额", dataIndex: "invoiceAmount", key: "invoiceAmount", width: "140px", align: 'center' },
				{
					title: "操作", key: "rechargeAction", render: record => (
						<a href="#" onClick={() => {
							let ary = [];
							ary = selectedRowKeys['recharge'].filter(item => item !== record.rechargeId);
							setTableSelectedRowkeys(
								'recharge',
								ary
							);
						}}>删除</a>)
				},
			];
			res['recharge'].forEach((item, index) => {
				data.push({
					key: `recharge2_${index}`,
					rechargeId: item.recharge_id,
					rechargeAmount: item.recharge_amount,
					rechargeTime: item.created_at,
					rechargeType: item.payment_type_display,
					accountPayee: item.account_payee,
					invoiceAmount: item.remain_invoice_amount
				})
			});
		}
		if (id === 3) {
			colums = [
				{ title: "发票号", dataIndex: "invoice_id", key: "invoice_id", width: "100px", align: 'center' },
				{ title: "特殊申请单ID", dataIndex: "invoice_application_id", key: "invoice_application_id", width: "120px", align: 'center' },
				{ title: "发票抬头", dataIndex: "invoice_title", key: "invoice_title", width: "180px", align: 'center' },
				{ title: "可关联金额", dataIndex: "invoice_amount", key: "invoice_amount", width: "120px", align: 'center' },
				{ title: "发票类型", dataIndex: "invoice_type_display", key: "invoice_type_display", width: "140px", align: 'center' },
				{
					title: "操作", key: "invoiceAction", render: record => (
						<a href="#" onClick={() => {
							let ary = [];
							ary = selected.filter(item => item !== record.invoice_id);
							setInvoiceListSelected(ary);
						}}>删除</a>)
				},
			];
			res['invoiceKeys'].forEach((item, index) => {
				data.push({
					key: `invoice_${index}`,
					invoice_id: item.invoice_id,
					invoice_application_id: item.invoice_application_id,
					invoice_title: item.invoice_title,
					invoice_amount: item.invoice_amount.toFixed(2),
					invoice_type_display: item.invoice_type_display,
				})
			});
		}

		return { res, data, colums };
	};


	render() {
		let { keyAry, tableObj } = this.state;
		let { selectedRowKeys, clearSelected, type, selected, clearInvoiceSelected } = this.props;
		const defaultProps = {
			visible: this.props.visible,
			onCancel: this.handleCancel
		};
		let dataObj = {};
		let selectedObj = {};
		if (type === 1) {
			dataObj = this.selectedFilter(type, keyAry, selectedRowKeys, tableObj);
			defaultProps.title = "查看已选订单/活动";
		}
		if (type === 5) {
			dataObj = this.selectedFilter(type, keyAry, selectedRowKeys, tableObj);
			defaultProps.title = "查看已选订单/活动";
		}
		if (type === 2) {
			dataObj = this.selectedFilter(type, keyAry, selectedRowKeys, tableObj);
			defaultProps.title = "查看已选充值";
		}
		if (type === 3) {
			selectedObj['invoiceKeys'] = selected;
			dataObj = this.selectedFilter(type, ['invoiceKeys'], selectedObj, tableObj);
			defaultProps.title = "查看已选发票";
		}

		return (
			<Modal {...defaultProps} wrapClassName='dialog-list' footer="">
				<Button
					type="primary"
					className="clearAll"
					onClick={() => {
						if (type === 1 || 2 || 5) {
							clearSelected();
						}
						if (type === 3) {
							clearInvoiceSelected();
						}
					}}
				>
					清空已选
				</Button>
				<Table
					dataSource={dataObj.data}
					columns={dataObj.colums}
					size="small"
					pagination={false}
					scroll={{ y: 760 }}
				>

				</Table>
			</Modal>
		);
	}
}

export default connect(
	state => ({
		selectedRowKeys: state.invoice.tableSelectedRowKeys,
		completeOrderList: state.invoice.completeOrderList,
		list: state.invoice.invoiceList,
		selected: state.invoice.invoiceListSelected,
	}),
	{ ...actions, ...action }
)(Mydialog);
