import React from 'react'
import { Table, Form } from 'antd';
import './ActiveInspectionReasons.less'
const FormItem = Form.Item;

export const ComplainCheckReasons = (data) => {
	const { reasons } = data
	const { getFieldDecorator } = data.form;
	const columns = [{
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
		width: 130
	}, {
		title: '执行链接',
		dataIndex: 'link',
		key: 'link',
		width: 200,
		render: (text, record) => {
			if (record.platform_name == "新浪微博") {
				return record.execution_result && record.execution_result.converted_link &&
					<a href={record.execution_result.converted_link} target="_blank">
						{record.execution_result.converted_link}
					</a>
			} else {
				return record.execution_result && record.execution_result.link &&
					<a href={record.execution_result.link} target="_blank">
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
						record.execution_result && record.execution_result.imgs && record.execution_result.imgs.map((item, index) => {
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
		title: '执行结果不合格原因',
		key: 'execution_result_reasons',
		dataIndex: 'execution_result_reasons',
		width: 260,
		render: (text, record) => {
			return record.reasons.execution_result_reasons && <ul className="clear-ulStyle ul-padding">
				{
					record.reasons.execution_result_reasons.filter(it => it.checked == 1).map(item => {
						if (item.id == 1) {
							return <li key={item.id}>{item.comment}</li>
						} else {
							return <li key={item.id}>{item.content}</li>
						}
					})
				}
			</ul>
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
			return record.reasons.data_screenshot_reasons && <ul className="clear-ulStyle ul-padding">
				{
					record.reasons.data_screenshot_reasons.filter(it => it.checked == 1).map(item => {
						if (item.id == 1) {
							return <li key={item.id}>{item.comment}</li>
						} else {
							return <li key={item.id}>{item.content}</li>
						}
					})
				}
			</ul>
		}
	}
	];
	return (
		<FormItem
			label="不合格原因"
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

