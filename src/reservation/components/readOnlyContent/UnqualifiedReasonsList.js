import React, { Component } from 'react'
import Attachments from './Attachments'
import UnqualifiedReason from './UnqualifiedReason'
import RecordList from './RecordList'
import { Table } from 'antd'

class UnqualifiedReasonsList extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { weiExecutionImg } = this.props;

		let columns = [{
			title: '平台',
			dataIndex: 'platform_name',
			width: '150'
		}, {
			title: '执行链接',
			width: '200',
			render: (record) => {
				let link;
				if (record.execution_result) {
					record.platform_id === 1
						? link = record.execution_result.converted_link
						: link = record.execution_result.link;
				}

				return <a href={link} target="_blank">{link}</a>
			}
		}, {
			title: '执行截图',
			dataIndex: 'execution_result["imgs"]',
			width: '240',
			render: (imgs, records) => {
				return (
					imgs
						? <div>
							<Attachments
								attachments={imgs}
								className="screenshot-list"
							/>
							{
								records.platform_id === 1 && weiExecutionImg !== ''
									? <div className='extra-data'>
										<div>微任务/WEIQ下单截图:</div>
										<Attachments
											attachments={[weiExecutionImg]}
											className="screenshot-list"
										/>
									</div>
									: null
							}
						</div>
						: null
				)
			}
		}, {
			title: '执行结果不合格原因',
			dataIndex: 'reasons["execution_result_reasons"]',
			width: '200',
			render: (reasons) => {
				return (
					reasons
						? <UnqualifiedReason
							reasons={reasons}
							className='unqualified-reason-item'
						/>
						: null
				)
			}
		}, {
			title: '数据截图',
			dataIndex: 'data_screenshot',
			width: '240',
			render: (data_screenshot = { records: [], imgs: [] }) => {

				let attachments = data_screenshot.imgs;
				let records = data_screenshot.records.filter(item => item.value !== '');
				return (
					<div>
						{
							attachments.length
								? <div>
									<div>截图:</div>
									<Attachments
										attachments={attachments}
										className='screenshot-list'
									/>
								</div>
								: null
						}

						{
							records.length > 0
								? <div>
									<div className="extra-data">数据:</div>
									<RecordList
										records={records}
									/>
								</div>
								: null
						}
					</div>
				)
			}
		}, {
			title: '数据截图不合格原因',
			dataIndex: 'reasons["data_screenshot_reasons"]',
			width: '200',
			render: (reasons) => {
				return (
					reasons
						? <UnqualifiedReason
							reasons={reasons}
							className='unqualified-reason-item'
						/>
						: null
				)
			}
		}];

		return <Table
			rowKey='platform_name'
			dataSource={this.props.reasons}
			columns={columns}
			pagination={false}
			bordered={true}
		/>
	}
}

export default UnqualifiedReasonsList