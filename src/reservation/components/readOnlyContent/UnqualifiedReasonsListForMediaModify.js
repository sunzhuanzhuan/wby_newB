import React, { Component } from 'react'
import Attachments from './Attachments'
import UnqualifiedReason from './UnqualifiedReason'
import RecordList from './RecordList'
import { Table } from 'antd'

class UnqualifiedReasonsListForMediaModify extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		let { weiExecutionImg } = this.props;

		let columns = [{
			title: '平台',
			dataIndex: 'platform_name',
			width: '150',
			render: text => {
				return <div>{text}</div>
			},
		}, {
			title: '执行链接(申述)',
			width: '200',
			render: (record) => {
				let link;
				record.platform_id === '1'
					? link = record.converted_result_link || ''
					: link = record.execution_result_link || '';

				return <a href={link} target="_blank">{link}</a>
			},
		}, {
			title: '执行截图(申述)',
			dataIndex: 'execution_result_img',
			width: '240',
			render: (imgs, records) => {
				return (
					<div>
						<Attachments
							attachments={imgs}
							width='25px'
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
				)
			},
		}, {
			title: '执行结果不合格原因',
			dataIndex: 'execution_result_reasons',
			width: '200',
			render: (reasons) => {
				return (
					<UnqualifiedReason
						reasons={reasons}
					/>
				)
			},
		}, {
			title: '数据截图(申述)',
			width: '240',
			render: (data_screenshot = { data_screenshot_path: [], record_for_media: [] }) => {
				let attachments = data_screenshot.data_screenshot_path;
				let records = data_screenshot.record_for_media.filter(item => item.value !== '');

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
							records.length
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
			},
		}, {
			title: '数据截图不合格原因',
			dataIndex: 'data_screenshot_reasons',
			width: '200',
			render: (reasons) => {
				return (
					<UnqualifiedReason
						reasons={reasons}
					/>
				)
			},
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

export default UnqualifiedReasonsListForMediaModify