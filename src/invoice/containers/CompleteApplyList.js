import React, { Component } from "react";
// import { bindActionCreator } from 'redux'
import { connect } from "react-redux";
// import PropTypes from 'prop-types'
// import { Link } from 'react-router'
import { message, Row, Col, Button, Divider, Modal, Icon } from "antd";
import * as actions from "../actions/completeApply";
import CompleteTabs from "./CompleteTabs";
import FixedBottom from "../components/FixedBottom";
import "./InvoiceApply.less";
import "./completeApplyList.less";
// import { spawn } from 'child_process';
import qs from "qs";
import Mydialog from "../components/myDialog";
import { invioceBytype, typeConfigMap, handleKeys } from '../constants/ProductConfig';

import { createAssociation } from '../constants/api';

const { clearTimeout } = window
class CompleteApplyList extends Component {
	state = {
		visible: false,
		stepA: false,
		stepBLoading: false,
		tabsShow: false,
		isDisable: false,
		maxApplyVisible: false,
		totalBox: {},
		checkDisable: false,
		visibleChange: false,
		stepB: false
	}
	totalBox = {}
	async componentWillMount() {
		//let { getInvioceApplyDetail, location: { query: { id } } } = this.props;
		//修改了获取值的方式
		let { getInvioceApplyDetail, clearSelected, detail } = this.props;
		const search = qs.parse(this.props.location.search.substring(1))
		if (search.id != detail.id) clearSelected()
		await getInvioceApplyDetail(search.id);
		this.setState({ tabsShow: true })
	}
	changeSelect = key => {
		this.setState({ tabTypeIndex: key });
	};
	hasSelected = () => {
		let { selectedRowKeys } = this.props;
		for (let key in selectedRowKeys) {
			if (selectedRowKeys[key].length > 0) return true;
		}
		return false;
	};

	submitStepA = (show) => () => {
		this.setState({ stepA: show })
	}
	submitStepB = async () => {
		let { detail: { id = 0 } } = this.props;
		this.setState({ stepBLoading: true })
		let data = await createAssociation({
			id,
			orders: this.totalBox.totalItem
		})
		this.setState({ stepBLoading: false })
		if (data.code === 1000) {
			this.success(data)
		} else {
			message.error(data.msg || '操作失败', 2)
		}
		this.submitStepA(false)()
	}
	success = (data) => {
		this.setState({ isDisable: true });
		message.success(data.msg || '操作成功', 2, () => {
			let timer = setTimeout(() => {
				clearTimeout(timer)
				this.props.history.push('/invoice/applyList')
			}, 300);
		});
	}
	async componentWillReceiveProps(nextProps) {
		const search = qs.parse(this.props.location.search.substring(1))
		//let { clearSelected, selectedRowKeys, completeOrderList, detail: { type }, location: { query: { id } } } = nextProps;
		let { clearSelected, selectedRowKeys, completeOrderList, detail: { type } } = nextProps;
		if (search.id != search.id) clearSelected()
		let { max_can_apply } = this.props.detail;
		let totalBox = { totalItem: [], totalValue: 0, totalCount: 0 }
		// console.log(type);
		// if (type == '2') return
		// 计算已选
		if (!type || !invioceBytype) return;
		for (const key in selectedRowKeys) {
			if (!invioceBytype[type].includes(key)) continue;
			const item = selectedRowKeys[key];
			let dataListHashMap = completeOrderList[key]["hashMap"];
			let _handle = handleKeys(key)
			totalBox[key] = {
				count: item.length,
				value: item.reduce((pre, cur) => {
					let _item = _handle(dataListHashMap[cur])
					totalBox.totalItem.push(_item)
					return (pre + parseFloat(_item["invoice_amount"]));
				}, 0) || 0,
			};
			totalBox.totalCount += totalBox[key].count;
			totalBox.totalValue += totalBox[key].value;
		}
		this.totalBox = totalBox
		await this.setState({
			totalBox: this.totalBox
		})
		if (type === 5) {
			if (this.state.totalBox.totalValue > max_can_apply && this.state.visibleChange === false) {
				this.handleMaxApplyModal();
				this.setState({
					checkDisable: true,
					visibleChange: true
				})
			}
			if (this.state.totalBox.totalValue <= max_can_apply) {
				this.setState({
					checkDisable: false,
					visibleChange: false
				})
			}
		}
	}
	handleMaxApplyModal = () => {
		this.setState({
			maxApplyVisible: true
		})
	}
	handleMaxApplyModalCancel = () => {
		this.setState({
			maxApplyVisible: false
		})
	}
	handleStepVisible = () => {
		this.setState({ stepB: false }, this.submitStepA(true))
	}
	handleModalVisible = () => {
		this.setState({ stepB: true })
	}
	handlePreve = () => {
		let { detail: { id, company_id } } = this.props;
		this.props.history.push(`/invoice/apply?company_id=${company_id}&applyType=2&id=${id}`);
	}
	render() {
		let { detail: {
			company_name, type_display,
			order_associate_type_display,
			type,
			order_associate_type,
			execution_evidence_code,
			execution_evidence_link,
			max_can_apply,
			max_can_invoice
		} } = this.props;
		const dialogProps = {
			visible: this.state.visible,
			visibleCall: () => {
				this.setState({ visible: false });
			},
			type: type
		};
		let { visible } = this.state;
		let isSelectedBtn = this.hasSelected();
		this.totalList = [];
		let isConsumption, isRecharge, PO = {};
		if (type == '1') {
			isConsumption = true;
			if (order_associate_type == '2') {
				PO = {
					is: true,
					code: execution_evidence_code,
					link: execution_evidence_link
				}
			}
		} else if (type == '2') {
			isRecharge = true
		} else if (type == '5') {
			isConsumption = true;
			if (order_associate_type == '2') {
				PO = {
					is: true,
					code: execution_evidence_code,
					link: execution_evidence_link
				}
			}
		} else {
			// 其余操作
		}
		let tabList = type ? invioceBytype[type].map(item => typeConfigMap[item]) : []
		let invoiceApplyAmount = this.totalBox.totalValue > max_can_apply ? max_can_apply : this.totalBox.totalValue;
		let isCreateApply = window.localStorage.getItem('createApply')
		const search = qs.parse(this.props.location.search.substring(1))
		return (
			<div>
				<div ref={node => (this.scrollContainer = node)}
					id="box"
					className='complete-apply-list'
					style={{ marginBottom: '62px' }}
				>
					<fieldset>
						<legend>完善申请单信息</legend>
						<Row type="flex" justify="start" gutter={16} style={{ lineHeight: "32px" }} >
							<Col><h4>公司简称：{company_name || '-'}</h4></Col>
							<Col><h4>开票依据：{type_display || '-'}</h4></Col>
							{isConsumption ?
								<Col><h4>开票维度：
							{PO.is ? <span>执行凭证（PO:<a target="_blank" href={PO.link}>{PO.code}</a>）</span>
										: order_associate_type_display}
								</h4></Col> : null}
							<Col><h4>当前已选开票金额</h4></Col>
							<Col><b className="totalNumL">
								{this.totalBox.totalValue ? this.totalBox.totalValue.toFixed(2) : '0.00'}
							</b></Col>
							{!isConsumption ?
								<Col style={{ float: 'right' }}>
									{isSelectedBtn ? (<Button type="primary" onClick={() => {
										this.setState({ visible: true });
									}} >查看已选</Button>) : null}
								</Col> : null}
						</Row>
						{isConsumption ? <Row type="flex" justify="start" gutter={16}
							style={{ lineHeight: "32px", paddingTop: "10px" }}
						>
							<Col><h4>已选</h4></Col>
							{tabList.map((item, index) => {
								let selected = this.totalBox[item.name] || {};
								return (
									<Col key={index}>
										<h4>
											{item.title}：<span style={{ color: 'red' }}>{selected.count}</span>个
											<Divider type="vertical" />
											{selected.value ? selected.value.toFixed(2) : 0}元
										</h4>
									</Col>
								);
							})}
							{isSelectedBtn ? <Col><Button type="primary" onClick={() => {
								this.setState({ visible: true });
							}} >查看已选</Button>
							</Col> : null}
						</Row> : null}
					</fieldset>
					{this.state.tabsShow ? <CompleteTabs id={search.id} init={0} isConsumption={isConsumption}
						isRecharge={isRecharge} tabList={tabList} totalBox={this.state.totalBox}
						checkDisable={this.state.checkDisable} type={type} /> : null}
				</div>
				{visible ? <Mydialog {...dialogProps} /> : null}
				{tabList.length > 0 ?
					<FixedBottom>
						<Button onClick={isCreateApply ? this.handlePreve : this.props.history.goBack}>上一步</Button>
						<Button disabled={!isSelectedBtn || this.state.isDisable} type='primary'
							onClick={type === 5 ? this.handleModalVisible : this.submitStepA(true)
							}>提交审核</Button>
					</FixedBottom> : null
				}
				{this.state.stepA ? <Modal visible={true}
					confirmLoading={this.state.stepBLoading}
					onCancel={this.submitStepA(false)}
					bodyStyle={{ paddingBottom: '5px' }}
					onOk={this.submitStepB}>
					<div className='modal-tip-box'>
						<Icon type="exclamation-circle" />
						<main>
							<h3>&nbsp;请确认发票抬头,税务登记号填写是否正确?</h3>
							<p>【特别提醒】由于国家三证合一政策实施,有可能导致客户开票税号变更,
								请与客户确认税号是否发生变更</p>
						</main>
					</div>
				</Modal> : null}
				{type === 5 ? <Modal
					visible={this.state.stepB}
					onCancel={() => { this.setState({ stepB: false }) }}
					footer={[
						<Button key="back" size="large" onClick={() => {
							this.setState({ stepB: false })
						}}>取消</Button>,
						<Button key="submit" type="primary" size="large" onClick={this.handleStepVisible}>确定</Button>
					]}
					width={640}>
					<div className='modal-tip-box-message'>
						<p>本次创建的发票申请单金额：<span>{invoiceApplyAmount ? invoiceApplyAmount.toFixed(2) : '0.00'}元</span>，其中可开票金额：<span>{invoiceApplyAmount > max_can_invoice ? max_can_invoice ? max_can_invoice.toFixed(2) : '0.00' : invoiceApplyAmount ? invoiceApplyAmount.toFixed(2) : '0.00'}元</span></p>
						<div>是否确认提交？</div>
					</div>
				</Modal> : null}
				{type === 5 ? <Modal
					visible={this.state.maxApplyVisible}
					footer={[
						<Button key="submit" type="primary" size="large" onClick={this.handleMaxApplyModalCancel}>确定</Button>
					]}
					width={640}
					onCancel={this.handleMaxApplyModalCancel}>
					<div className='max-apply-modal-tip'>
						<div className='max-apply-modal-money'>
							<p>你当前勾选的消费金额：<span>{this.totalBox.totalValue ? this.totalBox.totalValue.toFixed(2) : '0.00'}元</span></p>
							<p>但是，提交审核之后，发票申请单有效金额是：<span>{max_can_apply ? max_can_apply.toFixed(2) : '0.00'}元</span></p>
						</div>
						<div className='max-apply-modal-message'>是否确认提交？</div>
					</div>
				</Modal> : null}
			</div >
		);
	}
}
export default connect(
	state => ({
		detail: state.invoice.completeApplyDetail,
		selectedRowKeys: state.invoice.tableSelectedRowKeys,
		completeOrderList: state.invoice.completeOrderList,
	}),
	actions
)(CompleteApplyList);
