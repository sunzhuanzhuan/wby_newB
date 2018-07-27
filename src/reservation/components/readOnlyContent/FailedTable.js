import React, { Component } from 'react'
import { Table } from 'antd';
import "./FailedTable.less";
class FailedTable extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const { failedData, wei_execution_img } = this.props
		const columns = [
			{
				title: '平台',
				dataIndex: 'platform_name',
				key: 'platform_name',
				width: '150',
			}, {
				title: '执行链接',
				dataIndex: 'carriedlink',
				key: 'carriedlink',
				width: '230',
				render: (text, record) => {
					const { execution_result } = record
					if (!execution_result) {
						return null
					}
					const { link } = execution_result
					return <div>
						<a href={link} target="_blank">{link}</a>

					</div>

				},
			}, {
				title: '执行截图',
				dataIndex: 'resultimgs',
				key: 'resultimgs',
				width: '230',
				render: (text, record) => {
					const { execution_result } = record
					if (!execution_result) {
						return null
					}
					const { imgs } = execution_result
					return <div>
						{imgs ? <div>
							{imgs.map((value, index) => {
								return <a href={value} key={index} target="_blank" style={{ marginLeft: 5 }}>
									<img src={value} width='25' alt="" />
								</a>
							})}
						</div> : null}
						{record.platform_name === "新浪微博" ?
							wei_execution_img ? <div style={{ marginTop: '15px' }}>
								微任务截图：
								<a className="executeResultBtn" target="_blank" href={wei_execution_img}>
									<img src={wei_execution_img} width='25' alt="" />
								</a>
							</div> : null
							: null}
					</div>
				},
			}, {
				title: '执行结果不合格原因',
				dataIndex: 'execution_result_reasons',
				key: 'execution_result_reasons',
				render: (text, record) => {
					const { reasons } = record
					if (!reasons) {
						return null
					}
					const { execution_result_reasons } = reasons
					{
						return execution_result_reasons ? <ul>
							{
								execution_result_reasons.map((item) => {
									if (item.checked == "1") {
										if (item.id == 1) {
											return <li>{item.comment}</li>
										} else {
											return <li>{item.content}</li>
										}
									}
								})
							}
						</ul> : null
					}
				},
				width: '300'
			}, {
				title: '数据截图',
				dataIndex: 'data_screenshot',
				key: 'data_screenshot',
				width: '230',
				render: (text, record) => {
					const { data_screenshot } = record
					if (!data_screenshot) {
						return null
					}
					const { imgs, records } = data_screenshot
					let showNumbers = false
					return <div>
						{imgs ? <span><div>截图：</div>
							{imgs.map((value, index) => {
								return <a href={value} key={index} target="_blank" style={{ marginLeft: 5 }}>
									<img src={value} width='25' alt="" />
								</a>
							})}</span> : null}
						{records ? <span>
							{records && records.map((one) => {
								if (one.value > 0) {
									showNumbers = true
								}
							})}
							{showNumbers ? <div style={{ marginTop: '15px' }}>数据：</div> : null}
							{records && records.map((one, index) => {
								return one.value ? <div key={index}>{one.display}：{one.value}</div> : null
							})}</span >
							: ''}
					</div>
				},
			}, {
				title: '数据截图不合格原因',
				dataIndex: 'data_screenshot_reasons',
				key: 'data_screenshot_reasons',
				render: (text, record) => {
					const { reasons } = record
					if (!reasons) {
						return null
					}
					const { data_screenshot_reasons } = reasons
					{
						return data_screenshot_reasons ? <ul>
							{
								data_screenshot_reasons.map((item) => {
									if (item.checked == "1") {
										if (item.id == 1) {
											return <li>{item.comment}</li>
										} else {
											return <li>{item.content}</li>
										}
									}
								})
							}
						</ul> : null
					}
				},
				width: '300'
			}
		];
		return (
			<Table dataSource={failedData} columns={columns} pagination={false} rowKey={(record, index) => index} className='failed-table' />
		)
	}
}

export default FailedTable;
