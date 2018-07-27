import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as reservationAction from '../../actions/reservation'

import ReservationAppealItem from '../../components/operateContent/ReservationAppealItem'
import ScreenShotUpload from '../../components/operateContent/ScreenShotUpload'
import AppealReason from '../../components/operateContent/AppealReason'
import ShowImgExamples from '../../components/readOnlyContent/ShowImgExamples'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import { beforeUpload, filterFileList, getFilePath, uploadProps } from '../../util/upload';
import { validateAppealReason } from '../../util/validate'
import { appealDataAssemble } from '../../util/dataAssemble'

import { Spin, message, Form, Row, Col, Button, Icon, Divider } from 'antd';
import './modalChildren.less'

const formItemLayout = {
	labelCol: { span: 2 },
	wrapperCol: { span: 22 },
}

class MediaModify extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imgExamples: [],
			imgExamplesVisible: false,
			attachmentUploadBtnVisible: true,
			loading: true,
			flag: true,
			historyLoading: false,
			historyDisplay: false
		}
	}

	componentWillMount() {
		let order_id = this.props.record.order_id
		this.props.actions.getMediaModifyForm({ order_id })
			.then(() => {
				this.setState({
					loading: false,
				})
			}).catch(() => {
				message.error('数据获取失败', () => {
					this.setState({
						loading: false,
					})
				})
			})
	}
	showImgExamples(imgExamples) {
		this.setState({ imgExamples, imgExamplesVisible: true })
	}
	closeImgExamples() {
		this.setState({ imgExamplesVisible: false })
	}
	uploadOnChange({ event, limit }) {
		let fileList = event.fileList;

		let filteredList = filterFileList(fileList, limit);

		if (filteredList.length >= limit) {
			this.setState({
				attachmentUploadBtnVisible: false,
			})
		} else {
			this.setState({
				attachmentUploadBtnVisible: true,
			})
		}

		return getFilePath(filteredList)
	}

	submit() {
		let form = this.props.form;
		let order_id = this.props.record.order_id;
		const { mediaModifyForm: { mediaFormList, uploadInfo } } = this.props;
		const upload_token = uploadInfo.upload_token;

		form.validateFields((err, values) => {
			if (err) {
				return
			}
			let assembledData = appealDataAssemble({
				order_id,
				upload_token,
				values,
				appealFormList: mediaFormList
			})

			this.fetchAppealReason(assembledData)
		})
	}
	fetchAppealReason(data) {
		this.setState({
			loading: true
		});

		this.props.actions.appealModify({ ...data })
			.then(() => {
				if (this.isUnmounted) {
					return false;
				}

				this.setState({
					loading: false,
				});

				this.props.closeModalUpdate();
			})
			.catch(() => {
				if (this.isUnmounted) {
					return false;
				}

				this.setState({
					loading: false,
				});

				message.error('请求出错', () => {
					this.setState({
						loading: false,
					})
				})
			})
	}
	componentWillUnmount() {
		this.isUnmounted = true;
	}
	closeModal() {
		this.props.closeModal()
	}
	//点击查看历史记录
	showHistory = () => {
		this.setState({
			historyLoading: true
		})
		if (this.state.flag === true) {
			this.props.actions.getHistoryData({ order_id: this.props.record.order_id }).then(() => {
				this.setState({
					historyDisplay: true,
					flag: false,
					historyLoading: false
				})
			})
		} else {
			this.setState({
				historyDisplay: true,
				historyLoading: false
			})
		}
	}
	//点击收起历史记录
	hideHistory = () => {
		this.setState({
			historyDisplay: false
		})
	}
	render() {
		const { form, mediaModifyForm: { mediaFormList, uploadInfo }, historyData } = this.props;

		let attachmentUploadProps = {
			...uploadProps,
			data: () => {
				return {
					token: uploadInfo.upload_token
				}
			}
		};

		return (
			<Spin spinning={this.state.loading} >
				<h3>媒介修改内容</h3>

				<Form>
					<div className="ant-row ant-form-item">
						<div className="ant-col-2 ant-form-item-label">
							<label className="ant-form-item-required" title="已更正内容">
								已更正内容
							</label>
						</div>

						<div className="ant-col-22 ant-form-item-control-wrapper">
							<Row className='appeal-head' type="flex" justify="start">
								<Col
									span={2}
								>
									平台
								</Col>
								<Col
									span={4}
								>执行结果不合格原因</Col>
								<Col
									span={3}
								>执行链接(媒介修改)</Col>
								<Col
									span={3}
								>执行截图(媒介修改)</Col>
								<Col
									span={4}
								>数据截图不合格原因</Col>
								<Col
									span={3}
								>数据截图(媒介修改)</Col>
								<Col
									span={5}
								>数据(媒介修改)</Col>
							</Row>

							{
								mediaFormList &&
								mediaFormList.map((item, index) => {
									return (
										<ReservationAppealItem
											key={item.platform_id + index}
											form={form}
											dataSource={item}
											index={index}
											showImgExamples={this.showImgExamples.bind(this)}
											uploadInfo={uploadInfo}
										/>
									)
								})
							}

						</div>
					</div>

					<AppealReason
						form={form}
						appealLabel='媒介修改说明'
						formItemLayout={formItemLayout}
						field='rehandle_illustration'
						validator={validateAppealReason}
					/>

					<ScreenShotUpload
						formItemLayout={formItemLayout}
						form={form}
						label="附件"
						extra="仅支持jpg、jpeg、png、gif格式的图片上传，单附件大小<=5MB，最多3张"
						field="attachments"
						required={false}
						uploadProps={attachmentUploadProps}
						beforeUpload={beforeUpload}
						uploadBtnVisible={this.state.attachmentUploadBtnVisible}
						limit={3}
						uploadOnChange={this.uploadOnChange.bind(this)}
						validator={(rule, value, cb) => cb()}
					/>
					<Divider />
					{
						this.state.historyDisplay == false ?
							<div className="checkHistory" onClick={this.showHistory}>
								查看历史记录
							<Icon type="arrow-down" />
							</div>
							:
							<div className="checkHistory" onClick={this.hideHistory}>
								收起历史记录
							<Icon type="arrow-up" />
							</div>
					}
					<div className="history-box">
						<Spin spinning={this.state.historyLoading}></Spin>
						{
							this.state.historyDisplay == true ?
								<div>
									<GetQcHistory content={{ data: historyData }} />
								</div>
								: null
						}
					</div>

				</Form>

				<ShowImgExamples
					visible={this.state.imgExamplesVisible}
					imgExamples={this.state.imgExamples}
					closeModal={this.closeImgExamples.bind(this)}
				/>

				<div className="btnCenter">
					<Button type="primary" className="btn" onClick={this.submit.bind(this)}>提交</Button>
					<Button type="primary" className="btn" onClick={this.closeModal.bind(this)}>取消</Button>
				</div>

			</Spin >

		)
	}
}

MediaModify.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		mediaModifyForm: state.reservationReducers.mediaModifyForm,
		historyData: state.reservationReducers.historyData
	}
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...reservationAction
	}, dispatch)
})

export default connect(
	mapStateToProps,//redux和react连接起来
	mapDispatchToProps
)(Form.create()(MediaModify))
