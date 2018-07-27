import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as addListAction from '../actions/index'
import { Row, Button, DatePicker, Input, Form, Select, Icon, message } from 'antd';


import { calcSum } from "../../util";
const FormItem = Form.Item
const Option = Select.Option
let uuid = 0;
const dateFormat = 'YYYY-MM-DD';
class AddInvoiceInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			create_time: [],
			disabled: true
		}
	}
	handleSubmit(e) {
		e.preventDefault();
		// let canInvoice = this.props.canInvoice - 0
		let applyAmount = this.props.applyAmount - 0
		let type = this.props.type;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				values.amount = values.amount.filter(item => !isNaN(item))
				let invoiceMakeOutTime = values.invoice_make_out_time.map(moment => moment.format('YYYY-MM-DD'))
				values.invoice_make_out_time = invoiceMakeOutTime.filter(item => item)
				values.invoice_amount = values.amount;
				values.invoice_id = values.invoice_id.filter(item => !isNaN(item))
				values.id = this.props.id
				let sum = calcSum(values.amount)
				//console.log(sum)
				// for (let i = 0; i < values.amount.length; i++) {
				//     sum += Number(values.amount[i])
				// }
				if (type === 5) {
					// if (sum != canInvoice) {
					// 	message.warning('发票总金额 不等于 可开发票金额', 1)
					// 	return
					// }
					if (sum > applyAmount) {
						message.warning('发票总金额 大于 发票申请单金额', 1)
						return
					} else if (sum == 0) {
						message.warning('发票总金额不能为0', 1)
						return
					} else {
						this.props.actions.postFormVoice(values).then((response) => {
							if (response.code == 1000) {
								message.success('提交成功');
								this.props.form.resetFields()
								this.props.handleCreatNewInvoiceOk()
								this.props.handleSelsetSubmit();
							} else if (response.code == 999) {
								message.warning(response.msg, 1)
							}
						})
					}
				} else {
					if (sum != applyAmount) {
						message.warning('发票总金额 不等于 发票申请单金额', 1)
						return
					} else {
						this.props.actions.postFormVoice(values).then((response) => {
							if (response.code == 1000) {
								message.success('提交成功');
								this.props.form.resetFields()
								this.props.handleCreatNewInvoiceOk()
								this.props.handleSelsetSubmit();
							} else if (response.code == 999) {
								message.warning(response.msg, 1)
							}
						})
					}
				}
			}
		});
	}
	remove = async (k) => {
		const { form } = this.props;
		const keys = form.getFieldValue('keys');
		await form.setFieldsValue({
			keys: keys.filter(key => key !== k),
		});
		this.handleSumChange();
		if (keys.length == 1) {
			this.setState({
				disabled: true
			})
		}
	}
	handleSelect() {

	}
	add = () => {
		const { form } = this.props;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let invoiceId = values.invoice_id;
				if (invoiceId) {
					invoiceId = invoiceId.filter(item => !isNaN(item))
				}
				this.props.handleSelectData(invoiceId)
				// can use data-binding to get
				const keys = form.getFieldValue('keys');
				const nextKeys = keys.concat(uuid);
				uuid++;
				// can use data-binding to set
				// important! notify form to detect changes
				form.setFieldsValue({
					keys: nextKeys,
				});
				this.setState({
					disabled: false
				})
			}
		})
		let timer = setTimeout(() => {
			this.scrollChunk.scrollTop = this.scrollChunk.scrollHeight;
			window.clearTimeout(timer);
		}, 10)
	}

	handleCancel() {
		this.props.form.resetFields();
		this.props.handleCreatNewInvoiceOk();
		this.setState({ disabled: true })
	}
	handleSumChange = () => {
		this.props.form.validateFields((err, values) => {
			values.amount = values.amount.filter(item => !isNaN(item))
			let sum = calcSum(values.amount)
			this.props.handleTotalSum(sum)
		})
	}
	render() {
		const { availableInvoiceList = [] } = this.props;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		getFieldDecorator('keys', { initialValue: [] });
		const keys = getFieldValue('keys');

		const formItems = keys.map((k, index) => {
			return (
				<div key={index}>
					<FormItem label='发票号:' style={{ width: '200px' }}
					>
						{getFieldDecorator(`invoice_id[${k}]`, {
							validateTrigger: ['onChange', 'onBlur'],
							rules: [{
								required: true,
								message: '请选择发票号',
							}],
						})(
							<Select
								style={{ width: 145 }}
								placeholder="请选择"
								onChange={this.handleSelect.bind(this)}
							>
								{
									availableInvoiceList ? availableInvoiceList.map((item, index) => {
										return <Option key={index} value={item.invoice_number}>{item.invoice_number}</Option>
									}) : null
								}
							</Select>
						)}
						{keys.length > 0 ? (
							<Icon
								className="dynamic-delete-button"
								style={{ display: 'none' }}
								type="minus-circle-o"
								onClick={() => this.remove(k)}
							/>
						) : null}
					</FormItem>
					<FormItem label='发票金额（元）：' style={{ width: '200px' }}>

						{getFieldDecorator(`amount[${k}]`, {
							validateTrigger: ['onChange', 'onBlur'],
							rules: [{
								required: true,
								message: '请填写发票金额',
							}],
							onBlur: this.handleSumChange
						})(
							<Input style={{ width: '145px', marginRight: 8 }} />
						)}
						{keys.length > 0 ? (
							<Icon
								className="dynamic-delete-button"
								style={{ display: 'none' }}
								type="minus-circle-o"
								onClick={() => this.remove(k)}
							/>
						) : null}
					</FormItem>
					<FormItem label="开票时间：" style={{ width: '200px' }}>
						{getFieldDecorator(`invoice_make_out_time[${k}]`, {
							rules: [{
								required: true,
								message: '请填选择开票时间',
							}],
						})(
							< DatePicker format={dateFormat} />
						)}
						{keys.length > 0 ? (
							<Icon
								className="dynamic-delete-button"
								type="minus-circle-o"
								onClick={() => this.remove(k)}
							/>
						) : null}
					</FormItem>
				</div >
			);
		});
		return (
			<Form onSubmit={this.handleSubmit.bind(this)} layout="inline" >
				<div className={formItems.length && formItems.length >= 5 ? 'invoice-scroll' : ''} ref={x => {
					this.scrollChunk = x
				}}>{formItems}</div>
				{this.props.canInvoice ? < Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
					<Icon type="plus" /> 添加发票号及金额
                </Button > : null}
				<Row style={{ marginTop: '20px' }}>
					<Button type="primary" onClick={this.handleCancel.bind(this)} style={{ marginLeft: '30%', marginRight: '3%' }}>取消</Button>
					<Button type="primary" htmlType="submit" style={{ marginRight: '30%' }}
						disabled={this.state.disabled}>确认
						{/* disabled={this.props.type === 5&&this.props.canInvoice===0 ? false : this.state.disabled}>确认 */}
					</Button>
				</Row>
			</Form >
		);
	}
}

const mapStateToProps = (state) => ({
	availableInvoiceList: state.invoice.availableInvoiceList

})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...addListAction
	}, dispatch)
})
const formAdd = Form.create()(AddInvoiceInfo);
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(formAdd)
