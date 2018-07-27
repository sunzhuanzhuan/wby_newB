import React, { Component } from 'react'
import ExecutionResultLink from './ExecutionResultLink'
import UnqualifiedReason from '../readOnlyContent/UnqualifiedReason'
import ScreenShotUpload from './ScreenShotUpload'
import RecordItem from './RecordItem'

import { handlePreview, beforeUpload, filterFileList, getFilePath } from '../../util/upload';
import { validateLink, validateRecordItem, validateScreenShot } from '../../util/validate';

import { Row, Col } from 'antd'
import './ReservationAppealItem.css'

class ReservationAppealItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			executeUploadBtnVisible: true,
			dataUploadBtnVisible: true,
			uploadProps: {
				listType: 'picture-card',
				accept: 'image/png, image/gif, image/jpeg, image/jpg',
				action: '/upload/upload',
				name: 'qqfile',
				multiple: true,
				onPreview: handlePreview,
				data: () => {
					return {
						token: this.props.uploadInfo.upload_token,
					}
				}
			}
		}
	}

	uploadOnChange({ event, limit, name }) {
		let fileList = event.fileList;

		let filteredList = filterFileList(fileList, limit);

		if (filteredList.length >= limit) {
			name === 'execute'
				? this.setState({
					executeUploadBtnVisible: false,
				})
				: this.setState({
					dataUploadBtnVisible: false,
				})
		} else {
			name === 'execute'
				? this.setState({
					executeUploadBtnVisible: true,
				})
				: this.setState({
					dataUploadBtnVisible: true,
				})
		}

		return getFilePath(filteredList)
	}

	render() {
		const {
			form,
			dataSource,
			index,
			showImgExamples,
		} = this.props;

		const { execution_result, data_screenshot } = dataSource

		//是否需要填写执行链接
		let linkRequired = execution_result.link_required === '1'
			? true
			: false;
		//是否需要执行截图
		let executeImgRequired = execution_result.img_required === '1'
			? true
			: false

		//是否需要数据截图
		let dataRequired = data_screenshot.required === '1'
			? true
			: false

		let executeImgExamples = execution_result.img_examples;
		let dataImgExamples = data_screenshot.img_examples;

		return (
			<div>
				<Row className='appeal-items' type="flex" justify="start">
					{/*平台*/}
					<Col span={2}><div value={100}>{dataSource.platform_name}</div></Col>

					{/*执行结果不合格原因*/}
					<Col span={4}>
						{
							<div>
								<UnqualifiedReason
									reasons={dataSource.reasons.execution_result_reasons}
									className='unqualified-reason-item'
								/>
							</div>

						}
					</Col>


					{/*执行链接*/}
					<Col span={3}>
						{
							linkRequired
								? <ExecutionResultLink
									form={form}
									linkPrefix={execution_result.link_prefix}
									required={linkRequired}
									field={`data[${index}][execution_result][link]`}
									validator={validateLink}
									width='100%'
								/>
								: null
						}
					</Col>


					{/*执行截图*/}
					<Col span={3} className="appeal-upload">
						{
							executeImgRequired
								? <div className='appeal-item'>
									<ScreenShotUpload
										form={form}
										field={`data[${index}][execution_result][imgs]`}
										required={executeImgRequired}
										errorMsg='执行截图不能为空'
										uploadProps={this.state.uploadProps}
										beforeUpload={beforeUpload}
										uploadBtnVisible={this.state.executeUploadBtnVisible}
										limit={execution_result.img_limit}
										uploadOnChange={this.uploadOnChange.bind(this)}
										name='execute'
										validator={validateScreenShot}
									/>
									{
										executeImgExamples && executeImgExamples.length > 0
											? <div className="upload_tips">
												<a
													href="javascript:;"
													onClick={() => {
														showImgExamples(executeImgExamples)
													}}>
													图例
											</a>
											</div>
											: null
									}
								</div>
								: null
						}
					</Col>

					{/*数据截图不合格原因*/}
					<Col span={4}>
						{
							dataRequired
								? <div>
									<UnqualifiedReason
										reasons={dataSource.reasons.data_screenshot_reasons}
										className='unqualified-reason-item'
									/>
								</div>
								: null
						}
					</Col>


					{/*数据截图*/}
					<Col span={3} className="appeal-upload">
						{
							dataRequired
								? <div className='appeal-item'>
									<ScreenShotUpload
										form={form}
										field={`data[${index}][data_screenshot][imgs]`}
										required={dataRequired}
										errorMsg='数据截图不能为空'
										uploadProps={this.state.uploadProps}
										beforeUpload={beforeUpload}
										uploadBtnVisible={this.state.dataUploadBtnVisible}
										limit={data_screenshot.limit}
										uploadOnChange={this.uploadOnChange.bind(this)}
										name='data'
										validator={validateScreenShot}
									/>
									{
										dataImgExamples && dataImgExamples.length > 0
											? <div className="upload_tips">
												<a
													href="javascript:;"
													onClick={() => {
														showImgExamples(dataImgExamples)
													}}>
													图例
											</a>
											</div>
											: null
									}
								</div>
								: null
						}
					</Col>


					{/*数据录入*/}
					<Col span={5}>
						{
							data_screenshot.record_items
								? <div className='appeal-item record-item'>
									{
										data_screenshot.record_items.map((item, ItemIndex) =>
											<RecordItem
												line={index}
												item={item}
												form={this.props.form}
												validator={validateRecordItem}
												platformId={dataSource.platform_id}
												itemIndex={ItemIndex}
												key={`${dataSource.platform_id}_${ItemIndex}`}
											/>
										)
									}
								</div>
								: null
						}
					</Col>
				</Row>
			</div>
		)
	}
}

export default ReservationAppealItem