import React, { Component } from 'react'
import echarts from 'echarts';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Input, Form, Table, Spin, message } from 'antd';
import qs from "qs";
import * as AccountEnterActions from '../actions/accountEnterActions'
import './AccountEnter.less'
const FormItem = Form.Item;

class AccountEnter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}
	//失焦事件
	onBlur = (e) => {
		this.setState({
			loading: true
		})
		const search = qs.parse(this.props.location.search.substring(1))
		search.num = e.target.value
		this.props.actions.getData(search).then(() => {
			this.setState({
				loading: false
			})
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: this.props.data.column.map(item => {
						return item.title
					})
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: this.props.data.data.map(item => item.date)
				},
				yAxis: {
					type: 'value'
				},
				series: this.props.data.column.map(item => {
					return {
						name: item.title, type: 'line', stack: '总量', data: this.props.data.data.map(it => it[item.key])
					}
				})
			});
		}).catch(() => {
			message.error("数据加载失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	componentWillMount() {
		const search = qs.parse(this.props.location.search.substring(1))
		search.num = 10
		this.props.actions.getData(search).then(() => {
			this.setState({
				loading: false
			})
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: this.props.data.column.map(item => {
						return item.title
					}),
					selected: {
						'粉丝量': false
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: this.props.data.data.map(item => item.date)
				},
				yAxis: {
					type: 'value'
				},
				series: this.props.data.column.map(item => {
					return {
						name: item.title, type: 'line', stack: '总量', data: this.props.data.data.map(it => it[item.key])
					}
				})
			});
		}).catch(() => {
			message.error("数据加载失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	render() {
		const { form, data } = this.props;
		const { column = [] } = data
		const columnAddItem = [
			{
				title: "时间",
				dataIndex: "date",
				key: "date"
			}
		]
		let arr = columnAddItem.concat(column)
		const { getFieldDecorator } = form;
		const formItemLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 3 },
		};
		return (
			<Spin spinning={this.state.loading}>
				<h2>历史报价趋势</h2>
				{/* 基本信息展示 */}
				<Form className="form">
					<FormItem label="平台" {...formItemLayout}>
						<span>{data.weibo_type_enum}</span>
					</FormItem>
					<FormItem label="主账号" {...formItemLayout}>
						<span>{data.identity_name}</span>
					</FormItem>
					<FormItem label="账号" {...formItemLayout}>
						<span>{data.weibo_name}</span>
					</FormItem>
					<FormItem label="accountId" {...formItemLayout}>
						<span>{data.account_id}</span>
					</FormItem>
					<FormItem label="媒介经理" {...formItemLayout}>
						<span>{data.admin_real_name}</span>
					</FormItem>
					<FormItem label="报价最近更新频次" {...formItemLayout} className="inputBox">
						{getFieldDecorator('num', {
							rules: [{
								required: true,
								message: '请输入报价最近更新频次'
							}, {
								pattern: '^[0-9]*$',
								message: '请输入数字'
							}],
							initialValue: 10
						})(
							<Input addonAfter="次" onBlur={this.onBlur} />
						)}
					</FormItem>
				</Form>
				<div id="main" style={{ width: '100%', height: 400 }}></div>
				<Table
					columns={arr}
					dataSource={data.data}
					pagination={false}
					className="table"
				/>
			</Spin>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		data: state.accountEnterReducers.data
	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...AccountEnterActions
	}, dispatch)
})

export default connect(
	mapStateToProps,//redux和react连接起来
	mapDispatchToProps
)(Form.create()(AccountEnter))

