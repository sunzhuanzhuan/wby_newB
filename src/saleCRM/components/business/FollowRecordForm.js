import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Button } from "antd";
import moment from 'moment';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
class FollowRecordForm extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	onSave = () => {
		const { form, addFollowUp, businessId, company_id } = this.props
		form.validateFields((err, values) => {
			if (!err) {
				//添加的方法
				values.record_at = values.record_at.format("YYYY-MM-DD HH:mm:ss")
				addFollowUp({ ...values, item_type: 2, item_id: businessId, company_id: company_id })
				//成功后（清空数据）
				this.props.form.resetFields()
			}
		})
	}
	valiLength = (rule, value, callback) => {

		if (value.length > 100) {
			callback('跟进备注不能超过100个字');
		} else {
			callback();
		}
	}
	disabledEndDate = (current) => {
		const startDate = new Date;
		if (!current || !startDate) {
			return false;
		}
		return current.valueOf() > startDate.valueOf();
	}
	onCancel = () => {
		this.props.onCancel()
		this.props.form.resetFields()
	}
	render() {
		/**
		 * isModal:是否是弹窗
		 * onCancel:是弹窗的时候，关闭弹窗的方法
		 * onAdd:添加的方法
		 // constructor(props) {
		 // 	super(props)
	     // 	this.state = {
	     // 		businessStage: '开始跟进',
	     // 	}
         // 	this.onAdd.bind(this)
		 // }
		 // onAdd = (value) => {
		 // 	console.log('添加记录', value)
		 // }
		 //调用<FollowRecordForm onAdd={this.addFollow} />
		 * typeList:跟进类型
		 */
		const { isModal, selectList, } = this.props
		const { followup_type } = selectList
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: isModal ? 4 : 5 },
			wrapperCol: { span: isModal ? 20 : 19 },
		}
		return (
			<Form style={{ paddingTop: 20 }}>
				<FormItem
					{...formItemLayout}
					label="跟进时间"
				>
					{getFieldDecorator('record_at', {
						initialValue: moment(new Date, 'YYYY-MM-DD  HH:mm:ss'),
						rules: [{
							required: true, message: '请选择跟进时间',
						}],
					})(
						<DatePicker placeholder='请选择跟进时间'
							showTime
							format="YYYY-MM-DD HH:mm:ss"
							style={{ width: '100%' }}
							disabledDate={this.disabledEndDate} />
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="跟进类型"
				>
					{getFieldDecorator('record_type', {
						rules: [{
							required: true, message: '请选择跟进类型',
						}],
					})(
						<Select placeholder='请选择' allowClear>
							{
								followup_type && followup_type.map(one => <Option key={one.id} value={one.id}>{one.name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="跟进备注"
				>
					{getFieldDecorator('comment', {
						validateFirst: true,
						rules: [{
							required: true, message: '跟进备注不能为空',
						}, {
							validator: this.valiLength,
						}],
						validateTrigger: 'onBlur'
					})(
						<TextArea placeholder='请输入跟进备注' />
					)}
				</FormItem>
				{
					isModal ? <FormItem style={{ textAlign: 'center' }}>
						<Button type="primary" onClick={this.onSave}>确定</Button>
						<Button onClick={this.onCancel} style={{ marginLeft: 46 }}>取消</Button>
					</FormItem> : <FormItem>
							<Button type='primary' onClick={this.onSave} style={{ float: 'right' }} >添加记录</Button>
						</FormItem>


				}
			</Form>
		);
	}
}
const FollowRecordFormCreate = Form.create()(FollowRecordForm);
export default FollowRecordFormCreate;
