import React from 'react'
import { Table, Form } from 'antd';
import './ActiveInspectionReasons.less'
const FormItem = Form.Item;

export const ManagerReasonsAppealShorter = (data) => {
	const { reasons } = data
	const { getFieldDecorator } = data.form;
	const columns = [{
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
		width: 130
	}, {
		title: '执行链接（申诉）',
		dataIndex: 'link',
		key: 'link',
		width: 200,
		render: (text, record) => {
			if (record.platform_name == "新浪微博") {
				return record.converted_result_link &&
					<a href={record.converted_result_link} target="_blank">
						{record.converted_result_link}
					</a>
			} else {
				return record.execution_result_link &&
					<a href={record.execution_result_link} target="_blank">
						{record.execution_result_link}
					</a>
			}
		}
	}, {
		title: '执行截图（申诉）',
		dataIndex: 'execution_result_imgs',
		key: 'execution_result_imgs',
		width: 130,
		render: (text, record) => {
			return <div>
				{/* 执行截图 */}
				<div>
					{
						record.execution_result_img && record.execution_result_img.map((item, index) => {
							return <a key={index} href={item} target="_blank">
								<img src={item} width="30px" height="30px" />
							</a>
						})
					}
				</div>
				{/* 微任务截图 */}
				{
					record.platform_name === "新浪微博" &&
					data.record.wei_execution_img && <div>
						<header className="margin-top">微任务截图：</header>
						<a href={data.record.wei_execution_img} target="_blank">
							<img src={data.record.wei_execution_img} width="30px" height="30px" />
						</a>
					</div>
				}
			</div>
		}
	}, {
		title: '数据截图（申诉）',
		dataIndex: 'data_screenshot_imgs',
		key: 'data_screenshot_imgs',
		width: 130,
		render: (text, record) => {
			return <div>
				{/* 截图 */}
				{
					record.data_screenshot_path.length !== 0 ?
						<div>
							<header>截图：</header>
							<div>
								{
									record.data_screenshot_path.map((item, index) =>
										<a key={index} href={item} target="_blank">
											<img src={item} width="30px" height="30px" />
										</a>
									)
								}
							</div>
						</div> : null
				}
				{/* 数据 */}
				{
					record.record_for_media.filter(it => it.value !== "").length !== 0 ?
						<div>
							<header className="margin-top">数据：</header>
							<ul className="clear-ulStyle">
								{
									record.record_for_media.filter(it => it.value !== "").map(item => {
										return <li className="clear-liStyle" key={item.id}>{item.display}:{item.value}</li>
									})
								}
							</ul>
						</div> : null
				}
			</div>
		}
	}
	];
	return (
		<FormItem
			label="已更正内容"
			{...data.formItemLayout}
		>
			{getFieldDecorator('reasons')(
				<Table
					bordered={true}
					columns={columns}
					dataSource={reasons}
					rowKey="platform_id"
					pagination={false}
				/>
			)}
		</FormItem>
	)
}

