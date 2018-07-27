import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as action from "../action";
//react-router改成了react-router-do引用
import { Link } from "react-router-dom";
//config
import { addKeys, applyDetailConfig, applyDetailAreadyConfig } from "../constans/manageConfig";
//less
import "./contractManage.less";
//antd
import { Table, Button, Input, Row, Col, Form, Modal, message, DatePicker } from "antd";
import { timestampToTime } from "../constans/utils";
//moment
import qs from "qs";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const { TextArea } = Input;
// const RangePicker = DatePicker.RangePicker;


class applyDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			rejectVisible: false,
			successVisible: false,
			readyVisible: false,
			loading: true
		}
	}
	async componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		let today = this.getDate();
		await this.props.actions.getWithdrawApplyDetail({ 'id': id });
		let { getApplyDetail: { order_list, comment, status } } = this.props.withdraw
		this.props.form.setFieldsValue({ 'comment': comment });
		let trade_ids = order_list.map(item => {
			return item.trade_id;
		});
		let values = { 'start_day': today, trade_ids: trade_ids };
		if (status !== 3) {
			this.props.actions.calculateCost(values);
		}
		this.setState({
			loading: false,
			today
		})
	}
	getDate = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		let today = years + "-" + month + "-" + day;
		return today;
	}
	handleSuccessCancel = () => {
		this.setState({
			successVisible: false
		})
	}
	handleReadyCancel = () => {
		this.setState({
			readyVisible: false
		})
	}
	handleRejectCancel = () => {
		let { setFieldsValue } = this.props.form;
		this.setState({
			rejectVisible: false
		});
		setFieldsValue({ 'dialog-comment': '' });
	}
	handleSuccessVisible = () => {
		this.setState({
			successVisible: true
		})
	}
	handleReadyVisible = () => {
		this.setState({
			readyVisible: true
		})
	}
	handleRejectVisible = () => {
		this.setState({
			rejectVisible: true
		})
	}
	handleReject = async (e) => {
		const hide = message.loading('等待中...', 0);
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		let values = { id };
		e.preventDefault();
		let comment = this.props.form.getFieldValue('dialog-comment');
		values = { ...values, comment };
		Object.keys(values).forEach(item => {
			if (!values[item]) {
				delete values[item];
			}
		});
		await this.props.actions.setFail(values, hide);
		hide();
		this.handleRejectCancel();
		this.props.actions.getWithdrawApplyDetail({ 'id': id });
	}
	handleSubmit = async (e) => {
		const hide = message.loading('等待中...', 0);
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		let values = { id };
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			values = { ...values, ...fieldsValue };
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
		});
		await this.props.actions.setPay(values, hide);
		hide();
		this.props.actions.getWithdrawApplyDetail({ 'id': id });
	}
	handlePass = async (e) => {
		const hide = message.loading('等待中...', 0);
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		let values = { id };
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			values = { ...values, ...fieldsValue };
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
		});
		await this.props.actions.setSuccess(values, hide);
		hide();
		this.handleSuccessCancel();
		this.props.actions.getWithdrawApplyDetail({ 'id': id });
	}
	handleRemit = async (e) => {
		const hide = message.loading('等待中...', 0);
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		let values = { id };
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			values = { ...values, ...fieldsValue };
			values = {
				...values,
				'pay_time': fieldsValue['actual_time'] ? fieldsValue['actual_time'].format('YYYY-MM-DD') : this.state.today
			};
			delete values['actual_time'];
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
		});
		await this.props.actions.setPay(values, hide);
		hide();
		this.handleReadyCancel();
		this.props.actions.getWithdrawApplyDetail({ 'id': id });
	}
	handleDateTimeChange = async (data, dataString) => {
		const hide = message.loading('等待中...', 0);
		// let id = this.props.location.query.id;
		let orderList = this.props.withdraw.getApplyDetail.order_list;
		let trade_ids = [];
		orderList.forEach(item => {
			trade_ids.push(item.trade_id);
		});
		let values = dataString ? { 'trade_ids': trade_ids, 'start_day': dataString } : { 'trade_ids': trade_ids, 'start_day': this.state.today };
		await this.props.actions.calculateCost(values);
		hide();
	}
	disabledDate = (current) => {
		let { getApplyDetail: { order_list } } = this.props.withdraw;
		let timeAry = [];
		order_list.forEach(item => {
			let value = item.order_end_time.toString().length === 10 ? item.order_end_time * 1000 : item.order_end_time;
			timeAry.push(value);
		});
		let maxTime = Math.max(...timeAry);

		return current && current.valueOf() < maxTime;
	}
	render() {
		let { getApplyDetail, getApplyDetail: { order_list, status, comment }, calculateCost } = this.props.withdraw;
		let withdrawDetailConfig = status === 3 ? applyDetailAreadyConfig : applyDetailConfig;
		let { rejectVisible, successVisible, today } = this.state;
		if (order_list) {
			addKeys(order_list);
		}
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const commentLayout = {
			labelCol: { span: 1 },
			wrapperCol: { span: 23 },
		};
		const dialogCommentLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 21 },
		};
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};
		const coinLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 10 }
		}
		const commentConfig = {
			rules: [{ required: false }],
			initialValue: comment
		};
		const actualConfig = {
			// rules: [{ required: true, message: '日期为必填项！' }],
			// initialValue: moment(today, 'YYYY-MM-DD')
		}
		return <div className='contractManage'>
			<div className='extractManageList'>
				<Row>
					<Col span={4}>
						提现单号:{getApplyDetail.id}
					</Col>
					<Col span={4}>
						审核状态:{getApplyDetail.status_msg}
					</Col>
				</Row>
				<Row className='topGap'>
					<Col span={4}>
						主账号:{getApplyDetail.user_name}
					</Col>
				</Row>
				<Row className='topGap'>
					<Col span={4}>
						订单总额:{getApplyDetail.order_total_amount}
					</Col>
					<Col span={4}>
						质检总额:{getApplyDetail.qc_write_off}
					</Col>
					<Col span={4}>
						{status === 3 ? '利息总额:' : '预计利息总额:'}{getApplyDetail.service_amount}
					</Col>
					<Col span={4}>
						{status === 3 ? '手续费:' : '预计手续费:'}{getApplyDetail.service_fee}
					</Col>
					<Col span={4}>
						{status === 3 ? '提现总额:' : '预计提现总额:'}{getApplyDetail.payment_amount}
					</Col>
				</Row>
				<Row className='topGap'>
					<Col span={10}>
						{getApplyDetail.cost_description}
					</Col>
				</Row>
				{status === 4 ? <Row className='topGap'>
					<Col span={4}>
						申请时间:{timestampToTime(getApplyDetail.created_time)}
					</Col>
					<Col span={4}>
						驳回时间:{timestampToTime(getApplyDetail.update_time)}
					</Col>
					<Col span={4}>
						操作人:{getApplyDetail.admin_user_name}
					</Col>
				</Row> : status === 3 ? <Row className='topGap'>
					<Col span={4}>
						申请时间:{timestampToTime(getApplyDetail.created_time)}
					</Col>
					<Col span={4}>
						打款时间:{timestampToTime(getApplyDetail.pay_time)}
					</Col>
					<Col span={4}>
						操作人:{getApplyDetail.admin_user_name}
					</Col>
				</Row> : <Row className='topGap'>
							<Col span={4}>
								申请时间:{timestampToTime(getApplyDetail.created_time)}
							</Col>
						</Row>}
			</div>
			<Table className='topGap' columns={withdrawDetailConfig} dataSource={order_list} pagination={false} loading={this.state.loading}></Table>
			<Form className='topGap'>
				<Row>
					<Col span={24}>
						<FormItem label='备注：' {...commentLayout}>
							{getFieldDecorator('comment', commentConfig)(
								<TextArea placeholder="可输入合同备注" rows={4} maxLength={200} />
							)}
						</FormItem>
					</Col>
				</Row>
				{status === 4 ? <Row>
					<Col className='topGap' span={20} style={{ paddingLeft: '20px' }}>
						审核驳回：{getApplyDetail.comment}
					</Col>
				</Row> : null}
				{status === 1 ? <Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Link to='/extractManage'>
							<Button style={{ marginRight: '20px' }} size='large'>取消</Button>
						</Link>
						<Button style={{ marginRight: '20px' }} size='large' onClick={() => {
							this.handleRejectVisible();
						}}>驳回</Button>
						<Button type='primary' size='large' onClick={() => {
							this.handleSuccessVisible();
						}}>通过</Button>
					</Col>
				</Row> : status === 2 ? <Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Link to='/extractManage'>
							<Button style={{ marginRight: '20px' }} size='large'>返回</Button>
						</Link>
						{/* <Button style={{ marginRight: '20px' }} size='large' onClick={this.handleSubmit}>提交</Button> */}
						<Button type='primary' size='large' onClick={() => {
							this.handleReadyVisible();
						}}>已打款</Button>
					</Col>
				</Row> : <Row className='topGap'>
							<Col style={{ textAlign: 'right' }}>
								<Link to='/extractManage'>
									<Button size='large'>返回</Button>
								</Link>
								{/* <Button style={{ marginRight: '20px' }} size='large' onClick={this.handleSubmit}>提交</Button> */}
							</Col>
						</Row>}
			</Form>
			{status === 1 ? <Modal visible={successVisible} onCancel={this.handleSuccessCancel}
				style={{ top: 200 }}
				footer={[
					<Button key="back" onClick={this.handleSuccessCancel}>取消</Button>,
					<Button key="submit" type="primary" onClick={this.handlePass}>确认</Button>
				]}
			>
				<p style={{ textAlign: 'center', fontSize: '20px', paddingTop: '20px' }}> 是否审核通过该提现需求</p>
			</Modal> : null}
			{status === 1 ? <Modal visible={rejectVisible} onCancel={this.handleRejectCancel} width={1000}
				style={{ top: 200 }}
				footer={[
					<Button key="back" onClick={this.handleRejectCancel}>取消</Button>,
					<Button key="submit" type="primary" disabled={!getFieldValue('dialog-comment')} onClick={this.handleReject}>提交</Button>
				]}
			>
				<Form className='topGap'>
					<Row>
						<Col span={22}>
							<FormItem label='驳回原因：' {...dialogCommentLayout}>
								{getFieldDecorator('dialog-comment', commentConfig)(
									<TextArea placeholder="请填写驳回内容" rows={6} maxLength={200} />
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal> : null}

			{status === 2 ? <Modal title='请核对相关信息' visible={this.state.readyVisible} onCancel={this.handleReadyCancel}
				style={{ top: 200 }}
				footer={[
					<Button key="back" onClick={this.handleReadyCancel}>取消</Button>,
					<Button key="submit" type="primary" onClick={this.handleRemit}>确认</Button>
				]}>
				<Form>
					<Row>
						<Col>
							<FormItem {...formItemLayout} label="实际打款时间：">
								{getFieldDecorator('actual_time', actualConfig)(
									<DatePicker format='YYYY-MM-DD' onChange={this.handleDateTimeChange} placeholder={today} disabledDate={this.disabledDate} />
								)}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<Col span={24}>
							<FormItem {...coinLayout} label={`利息总额：`} className='special-one'>
								{calculateCost.total_fee || 0.00}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<Col>
							<FormItem {...coinLayout} label={`手续费总额：`} className='special-one'>
								{calculateCost.total_service_fee || 0.00}
							</FormItem>
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<Col>
							<FormItem {...coinLayout} label={`提现总额：`} className='special-one'>
								{calculateCost.total_withdraw_money || 0.00}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal> : null}
		</div >
	}
}
const ApplyDetail = Form.create()(applyDetail);
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(state => ({ ...state }), mapDispatchToProps)(ApplyDetail)
