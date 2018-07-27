import React, { Component } from 'react'
import '../FormContainer.less'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as reservationAction from '../../actions/reservation'
import { Form, Input, Button, InputNumber, DatePicker, Select, Spin, Icon } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;


const dateFormat = 'YYYY-MM-DD';
class SearchForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			detailStatusArr: []
		};
	}
	handleSubmit(e) {
		e.preventDefault();
		this.setState({
			loading: true
		})
		const { PlatformList = [], MediaUsers = [], VolUsers = [] } = this.props;
		const data = [
			{ label: '资源媒介', name: 'owner_admin_id', type: 'mediaResponse', data: MediaUsers, user_id: 'user_id', user_name: 'real_name' },
			{ label: '项目媒介', name: 'vol_admin_id', type: 'volResponse', data: VolUsers, user_id: 'user_id', user_name: 'real_name' },
			{ label: '平台', name: 'platform_id', type: 'platform', data: PlatformList, id: 'platform_id', user_id: 'platform_id', user_name: 'platform_name' }
		];

		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const timeList = ["execution_started_at", "execution_ended_at", "create_started_at", "create_ended_at",
					"execution_completed_started_at", "execution_completed_ended_at", "qc_started_at",
					"qc_ended_at", "qc_complete_started_at", "qc_complete_ended_at"]
				timeList.forEach(item => {
					if (values[item]) {
						values[item] = values[item].format(dateFormat)
					}
				})
				//筛选 请选择的处理
				data.forEach((item) => {
					let preName = item.name;
					if (values[preName] == 0) {
						values[preName] = ""
					}
				});
				//空数据的筛选，如果为空，则发送空对象
				let item = {};
				for (item in values) {
					if (values[item] == undefined) {
						values[item] = ''
					}
				}
				if (!values) {
					values = {}
				}
				delete values.qc_stage_status
				if (values.order_id !== "") {
					values.order_id = values.order_id.replace(/\s/g, '');
				}
				values.page = 1;
				values.page_size = 20;
				this.props.actions.getList(values).then(() => {
					this.setState({
						loading: false
					})
				}).catch(() => {
					this.setState({
						loading: false
					})
				})
			}
		});
	}
	preOption(option) {
		if (option.key == 0) {
			return option.key = ""
		}
	}
	reset() {
		this.props.form.setFieldsValue({
			"order_id": "",
			"qc_stage_status": 0,
			"qc_status": [],
			"weibo_name": "",
			"platform_id": "",
			"user_name": "",
			"owner_admin_id": "",
			"vol_admin_id": "",
			"charge_ratio_lower_limit": "",
			"charge_ratio_upper_limit": "",
			"execution_started_at": "",
			"execution_ended_at": "",
			"create_started_at": "",
			"create_ended_at": "",
			"execution_completed_started_at": "",
			"execution_completed_ended_at": "",
			"qc_started_at": "",
			"qc_ended_at": "",
			"qc_complete_started_at": "",
			"qc_complete_ended_at": ""
		})
		this.setState({
			detailStatusArr: [...this.qc_statesArr]
		})
	}
	//选择质检过程
	chooseStage(value) {
		if (parseInt(value) === 0) {
			let qc_statesAllArr = [...this.props.QcStatusList.qc_stages].reduce((a, b) => {
				if (a.states) {
					return a.states.concat(b.states)
				} else {
					return a.concat(b.states)
				}
			})
			let arr = []
			qc_statesAllArr.forEach(item => {
				arr.push(this.props.QcStatusList.qc_states[item])
			})
			this.setState({
				detailStatusArr: [...arr]
			})
			this.props.form.setFieldsValue({
				"qc_status": []
			})
		} else {
			let qc_stagesItem = this.props.QcStatusList.qc_stages.find(item => item.id == value);
			let arr = [];
			qc_stagesItem.states.forEach(item => {
				arr.push(this.props.QcStatusList.qc_states[item])
			})
			this.setState({
				detailStatusArr: [...arr]
			})
			this.props.form.setFieldsValue({
				"qc_status": [...qc_stagesItem.states]
			})
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { PlatformList = [], MediaUsers = [], VolUsers = [], QcStatusList = {} } = this.props;
		this.qc_stages = QcStatusList.qc_stages;
		this.qc_states = QcStatusList.qc_states;
		this.selectedState = []
		if (this.qc_stages) {
			this.qc_statesAllArr = [...this.qc_stages].reduce((a, b) => {
				if (a.states) {
					return a.states.concat(b.states)
				} else {
					return a.concat(b.states)
				}
			})
			let arr = []
			this.qc_statesAllArr.forEach(item => {
				arr.push(this.qc_states[item])
			})
			this.qc_statesArr = [...arr]
			this.selectedState = this.qc_statesArr.filter(item => item.selected === true).map(item => item.id)
		}
		const data = [
			{ label: '资源媒介', name: 'owner_admin_id', type: 'mediaResponse', data: MediaUsers, user_id: 'user_id', user_name: 'real_name' },
			{ label: '项目媒介', name: 'vol_admin_id', type: 'volResponse', data: VolUsers, user_id: 'user_id', user_name: 'real_name' },
			{ label: '平台', name: 'platform_id', type: 'platform', data: PlatformList, id: 'platform_id', user_id: 'platform_id', user_name: 'platform_name' }
		];
		return (
			<fieldset className="margin-top-md form_container filter-form-box">
				<legend className="searchTitle">搜索</legend>
				{/*input输入框搜索*/}
				{
					[
						{ label: '订单ID', name: 'order_id' },
					].map(item => {
						return <FormItem label={item.label} key={item.name}>
							{getFieldDecorator(item.name, {

							})(
								<Input />
							)}
						</FormItem>
					})
				}
				{
					[
						{ label: '账号名称', name: 'weibo_name', type: 'string' },
						{ label: '主账号名', name: 'user_name', type: 'string' }
					].map(item => {
						return <FormItem label={item.label} key={item.name}>
							{getFieldDecorator(item.name, {

							})(
								<Input />
							)}
						</FormItem>
					})
				}
				<FormItem label="质检状态">
					{getFieldDecorator('qc_stage_status', {
						initialValue: 0
					})(
						<Select
							placeholder="请选择"
							style={{ width: '145px' }}
							onChange={this.chooseStage.bind(this)}
						>
							{
								this.qc_stages ?
									this.qc_stages.map(item => {
										return <Option key={item.id}
											value={item.id}
										>
											{item.display}
										</Option>
									}) : ""
							}
						</Select>
					)}
				</FormItem>
				<FormItem label="详细质检状态">
					{getFieldDecorator('qc_status', {
						initialValue: this.selectedState
					})(
						<Select
							mode="multiple"
							placeholder="请选择"
							className="multipleSelect"
						>
							{
								this.state.detailStatusArr.length === 0 ?
									(this.qc_statesArr ?
										this.qc_statesArr.map(item => {
											return <Option key={item.id}
												value={item.id}
											>
												{item.display}
											</Option>
										}) : "") :
									this.state.detailStatusArr.map(item =>
										<Option key={item.id}
											value={item.id}
										>
											{item.display}
										</Option>
									)
							}
						</Select>
					)}
				</FormItem>
				{/*筛选框搜索*/}
				{
					data.map((item, index) => {
						return <FormItem label={item.label} key={index}>
							{getFieldDecorator(item.name, {
								initialValue: '0'
							})(
								<Select className="select-width" onSelect={this.preOption.bind(this)}>
									<Option key='0'>请选择</Option>
									{
										item.data.map(d => {
											return (
												<Option key={d[item.user_id]} value={d[item.user_id]}>{d[item.user_name]}</Option>
											)
										})
									}
								</Select>
							)}
						</FormItem>
					})
				}
				<FormItem label="扣款比例">
					{getFieldDecorator('charge_ratio_lower_limit', {
					})(
						<InputNumber
							className="input-width"
							min={0}
							max={99}
							formatter={value => `${value}%`}
							parser={value => value.replace('%', '')
							}
						/>
					)}
					~
                        {getFieldDecorator('charge_ratio_upper_limit', {
						// rules: [{ required: true, message: 'Please input website!' }],
					})(
						<InputNumber
							className="input-width"
							min={1}
							max={100}
							formatter={value => `${value}%`}
							parser={value => value.replace('%', '')}
						/>)
					}
				</FormItem>
				<FormItem label="开始执行时间">
					{getFieldDecorator('execution_started_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择开始时间" />
					)}
					~
                        {getFieldDecorator('execution_ended_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择结束时间" />
					)}
				</FormItem>
				<FormItem label="提交时间">
					{getFieldDecorator('create_started_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择开始时间" />
					)}
					~
                        {getFieldDecorator('create_ended_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择结束时间" />
					)}
				</FormItem>
				<FormItem label="执行完成时间">
					{getFieldDecorator('execution_completed_started_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择开始时间" />
					)}
					~
                        {getFieldDecorator('execution_completed_ended_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择结束时间" />
					)}
				</FormItem>
				<FormItem label="进入质检时间">
					{getFieldDecorator('qc_started_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择开始时间" />
					)}
					~
                        {getFieldDecorator('qc_ended_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择结束时间" />
					)}
				</FormItem>
				<FormItem label="结算时间">
					{getFieldDecorator('qc_complete_started_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择开始时间" />
					)}
					~
                        {getFieldDecorator('qc_complete_ended_at', {

					})(
						<DatePicker format={dateFormat} placeholder="请选择结束时间" />
					)}
				</FormItem>
				<div className="filter_tool">
					<FormItem>
						<Spin spinning={this.state.loading}>
							<Button type="primary" onClick={this.handleSubmit.bind(this)}>搜索</Button>
						</Spin>
					</FormItem>
					<FormItem>
						<a onClick={this.reset.bind(this)} className="resetFilter"><Icon type="retweet" /> 重置搜索框</a>
					</FormItem>
				</div>
			</fieldset>
		);
	}
}

const mapStateToProps = () => {
	return {

	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...reservationAction
	}, dispatch)
})

const FilterForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchForm);
export default FilterForm


