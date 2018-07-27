import React from 'react'
import Attachments from './Attachments'
import RecordList from './RecordList'
import { Table } from 'antd'

const CorrectionContent = ({ content, label, weiExecutionImg }) => {
	const columns = [{
		title: '平台',
		dataIndex: 'platform_name',
		width: '150',
		render: text => <div>{text}</div>
	}, {
		title: `执行链接(${label})`,
		width: '200',
		render: (item) => {
			let link;
			if (item.platform_id === '1') {
				link = item.converted_result_link
			} else {
				link = item.execution_result_link
			}
			return <a href={link} target="_blank">{link}</a>
		}
	}, {
		title: `执行截图(${label})`,
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
						records.platform_id === 1
							? <div className="extra-data">
								<div>微任务/WEIQ下单截图:</div>
								<Attachments
									attachments={[weiExecutionImg]}
									width='25px'
									className="screenshot-list"
								/>
							</div>
							: null
					}
				</div>
			)
		}
	}, {
		title: `数据截图(${label})`,
		width: '240',
		render: (item) => {
			let attachments = item.data_screenshot_path;
			let records = item.record_for_media.filter(item => item.value !== '')
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
		}
	}];

	return <Table
		rowKey='platform_name'
		dataSource={content}
		columns={columns}
		pagination={false}
		bordered={true}
	/>
};

export default CorrectionContent