import React, { Component } from 'react';
import { Button, Input, Form, Select, DatePicker } from 'antd';
import "./business.less";
const FormItem = Form.Item;
const Option = Select.Option;
class BusinessSearch extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	handleSubmit(e) {
		this.props.changeLoading()
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const dateComponents = ["start_created_at", "end_created_at", "start_record_at", "end_record_at"]
				dateComponents.forEach(item => {
					if (values[item]) {
						values[item] = values[item].format("YYYY-MM-DD HH:mm:ss")
					}
				})
				this.props.onSearch(values).then(() => {
					this.props.changeLoading()
				})
			}
		});
	}

	//日期可选性比较
	disabledDateJudgeStart = (endData, data) => {
		const endValue = this.props.form.getFieldValue(endData)
		if (!endValue || !data) {
			return false;
		}
		return data.valueOf() >= endValue && endValue.valueOf()
	}
	//结束时间
	disabledDateJudgeEnd = (startData, data) => {
		const startValue = this.props.form.getFieldValue(startData)
		if (!startValue || !data) {
			return false;
		}
		return startValue && startValue.valueOf() >= data.valueOf()
	}

	render() {
		const { form, selectList, company_name } = this.props;
		const { estimate_price, bo_stage, saleManagerList } = selectList
		const { getFieldDecorator } = form;
		return (
			<Form layout="inline">
				<FormItem label="商机名称">
					{getFieldDecorator('name')(
						<Input placeholder='请输入商机名称' />
					)}
				</FormItem>
				<FormItem label="所属公司">
					{getFieldDecorator('company_name', {
						initialValue: company_name,
					})(

						<Input placeholder='请输入所属公司' />
					)}
				</FormItem>
				<FormItem label="商机阶段">
					{getFieldDecorator('status', {
					})(
						<Select allowClear placeholder='请选择' style={{ width: 150 }}>
							{
								bo_stage && bo_stage.map(one =>
									<Option key={one.id} value={one.id}>{one.name}</Option>
								)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label="是否暂停">
					{getFieldDecorator('is_pause', {
					})(
						<Select allowClear placeholder='请选择' style={{ width: 150 }}>
							<Option value={2}>是</Option>
							<Option value={1}>否</Option>
						</Select>
					)}
				</FormItem>
				<FormItem label="销售经理">
					{getFieldDecorator('owner_admin_id', {
					})(
						<Select allowClear placeholder='请选择' style={{ width: 150 }}>
							{
								saleManagerList && saleManagerList.map(item => {
									return <Option
										value={item.owner_admin_id}
										key={item.owner_admin_id}
									>{item.real_name}</Option>
								})
							}
						</Select>
					)}
				</FormItem>
				<FormItem label="预估投放金额">
					{getFieldDecorator('estimate_sales_amount', {
					})(
						<Select allowClear placeholder='请选择' style={{ width: 150 }}>
							{
								estimate_price && estimate_price.map(one =>
									<Option key={one.id} value={one.id}>{one.name}</Option>
								)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label="创建时间">
					<FormItem>
						{getFieldDecorator('start_created_at')(
							<DatePicker
								disabledDate={this.disabledDateJudgeStart.bind(null, 'end_created_at')}
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请输入开始时间"
								showTime
								onChange={this.onStartChange}
							/>
						)}
					</FormItem>
					<span className="marginRight">~</span>
					<FormItem>
						{getFieldDecorator('end_created_at')(
							<DatePicker
								disabledDate={this.disabledDateJudgeEnd.bind(null, 'start_created_at')}
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请输入结束时间"
								onChange={this.onEndChange}
							/>
						)}
					</FormItem>
				</FormItem>
				<FormItem label="最后跟进时间">
					<FormItem>
						{getFieldDecorator('start_record_at')(
							<DatePicker
								disabledDate={this.disabledDateJudgeStart.bind(null, 'end_record_at')}
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请输入开始时间"
								showTime
								onChange={this.onStartChange1}
							/>
						)}
					</FormItem>
					<span className="marginRight">~</span>
					<FormItem>
						{getFieldDecorator('end_record_at')(
							<DatePicker
								disabledDate={this.disabledDateJudgeEnd.bind(null, 'start_record_at')}
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请输入结束时间"
								onChange={this.onEndChange1}
							/>
						)}
					</FormItem>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						onClick={this.handleSubmit.bind(this)}
					>搜索</Button>
				</FormItem>
			</Form>
		)
	}
}

export default Form.create()(BusinessSearch)
