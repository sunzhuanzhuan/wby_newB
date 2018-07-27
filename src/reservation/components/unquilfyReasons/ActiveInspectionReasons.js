import React, { Component } from 'react'
import { Table, Form, Icon, Checkbox, Input } from 'antd';
import './ActiveInspectionReasons.less'
const FormItem = Form.Item;
const { TextArea } = Input;

class ActiveInspectionReasons extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}
	render() {
		const { form, data_execution_results } = this.props;
		const { getFieldDecorator } = form;
		const columns = [{
			title: '平台',
			dataIndex: 'platform_name',
			key: 'platform_name',
			width: 130,
			render: (text, record) => <div>
				<div>{text}</div>
				<div className="retweetUnqulifyReasons" onClick={() => this.props.clearUnqulifyReasons(
					record.platform_id
				)}>
					<Icon type="retweet" />清空不合格原因
				</div>
			</div>
		}, {
			title: '执行链接',
			dataIndex: 'link',
			key: 'link',
			width: 200,
			render: (text, record) => {
				if (record.platform_name == "新浪微博") {
					return <a href={record.execution_result.converted_link} target="_blank">
						{record.execution_result.converted_link}
					</a>
				} else {
					return <a href={record.execution_result.link} target="_blank">
						{record.execution_result.link}
					</a>
				}
			}
		}, {
			title: '执行截图',
			dataIndex: 'execution_result_imgs',
			key: 'execution_result_imgs',
			width: 130,
			render: (text, record) => {
				return <div>
					{/* 执行截图 */}
					<div>
						{
							record.execution_result.imgs && record.execution_result.imgs.map((item, index) => {
								return <a key={index} href={item} target="_blank">
									<img src={item} width="30px" height="30px" />
								</a>
							})
						}
					</div>
					{/* 微任务截图 */}
					{
						record.platform_name === "新浪微博" &&
						this.props.record.wei_execution_img && <div>
							<header className="margin-top">微任务截图：</header>
							<a href={this.props.record.wei_execution_img} target="_blank">
								<img src={this.props.record.wei_execution_img} width="30px" height="30px" />
							</a>
						</div>
					}
				</div>
			}
		}, {
			title: '执行结果不合格原因',
			key: 'execution_result_reasons',
			dataIndex: 'execution_result_reasons',
			width: 260,
			render: (text, record) => {
				let content = record.reasons.execution_result_reasons
					&&
					record.reasons.execution_result_reasons.map(item => {
						return <div key={item.id}><Checkbox
							checked={item.checked == 1 ? true : false}
							onChange={(e) =>
								this.props.checkboxChange(record.platform_id, item.id, "execution_result_reasons", e)}
						>{item.content}</Checkbox></div>
					})
				if (record.reasons.execution_result_reasons.find(item => parseInt(item.id) === 1)
					&&
					record.reasons.execution_result_reasons.find(item => parseInt(item.id) === 1).checked == 1) {
					content.push(
						<FormItem key={0}>
							{getFieldDecorator(`execution_result_reasons${record.platform_id}`, {
								rules: [{
									required: true, message: '请输入其他原因',
								}, {
									validator: this.props.validateAppealReason, message: '其他原因不能超过1000个字'
								}],
								initialValue: record.reasons.execution_result_reasons.find(item => parseInt(item.id) === 1).comment
							})(
								<TextArea
									placeholder="请输入其他原因"
									autosize={{ minRows: 2, maxRows: 6 }}
									onBlur={(e) => this.props.inputOtherReasons(record.platform_id, "execution_result_reasons", e)}
								/>
							)}
						</FormItem>
					)
				}
				return content
			}
		}, {
			title: '数据截图',
			dataIndex: 'data_screenshot_imgs',
			key: 'data_screenshot_imgs',
			width: 130,
			render: (text, record) => {
				return record.data_screenshot && <div>
					{/* 截图 */}
					{
						record.data_screenshot.imgs &&
						record.data_screenshot.imgs.length > 0 &&
						<div>
							<header>截图：</header>
							<div>
								{
									record.data_screenshot.imgs.map((item, index) =>
										<a key={index} href={item} target="_blank">
											<img src={item} width="30px" height="30px" />
										</a>
									)
								}
							</div>
						</div>
					}
					{/* 数据 */}
					{
						record.data_screenshot.records &&
						record.data_screenshot.records.filter(it => it.value !== "").length > 0 &&
						<div>
							<header className="margin-top">数据：</header>
							<ul className="clear-ulStyle">
								{
									record.data_screenshot.records.filter(it => it.value !== "").map(item => {
										return <li className="clear-liStyle" key={item.id}>{item.display}:{item.value}</li>
									})
								}
							</ul>
						</div>
					}
				</div>
			}
		}, {
			title: '数据截图不合格原因',
			key: 'data_screenshot_reasons',
			dataIndex: 'data_screenshot_reasons',
			width: 260,
			render: (text, record) => {
				let content = record.reasons.data_screenshot_reasons
					&&
					record.reasons.data_screenshot_reasons.map(item => {
						return <div key={item.id}><Checkbox
							checked={item.checked == 1 ? true : false}
							onChange={(e) =>
								this.props.checkboxChange(record.platform_id, item.id, "data_screenshot_reasons", e)}
						>{item.content}</Checkbox></div>
					})
				if (record.reasons.data_screenshot_reasons.find(item => parseInt(item.id) === 1)
					&&
					record.reasons.data_screenshot_reasons.find(item => parseInt(item.id) === 1).checked == 1) {
					content.push(
						<FormItem key={0}>
							{getFieldDecorator(`data_screenshot_reasons${record.platform_id}`, {
								rules: [{
									required: true, message: '请输入其他原因'
								}, {
									validator: this.props.validateAppealReason, message: '其他原因不能超过1000个字'
								}],
								initialValue: record.reasons.data_screenshot_reasons.find(item => parseInt(item.id) === 1).comment
							})(
								<TextArea
									placeholder="请输入其他原因"
									autosize={{ minRows: 2, maxRows: 6 }}
									onBlur={(e) => this.props.inputOtherReasons(record.platform_id, "data_screenshot_reasons", e)}
								/>
							)}
						</FormItem>
					)
				}
				return content
			}
		}
		];
		return (
			<FormItem
				label="不合格原因"
				{...this.props.formItemLayout}
			>
				{getFieldDecorator('reasons')(
					<Table
						bordered={true}
						columns={columns}
						dataSource={data_execution_results}
						rowKey="platform_id"
						pagination={false}
					/>
				)}
			</FormItem>
		)
	}
}

export default ActiveInspectionReasons

