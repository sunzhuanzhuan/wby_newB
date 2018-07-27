import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import ActiveInspectionReasons from '../../components/unquilfyReasons/ActiveInspectionReasons'
import { WBYUploadFile } from 'wbyui'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Input, Modal, Button } from 'antd';
import './modalChildren.less'
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class ActiveInspection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			reasons: [],
			num: 0,
			previewVisible: false,
			previewImage: '',
			btnloading: false
		}
	}
	componentWillMount() {
		this.props.actions.getActiveInspectionData({ order_id: this.props.record.order_id }).then(() => {
			if (this.isUnmounted) {
				return false;
			}
			this.setState({
				loading: false,
				reasons: [...this.props.activeInspectionData.data_execution_results]
			})
		}).catch(() => {
			if (this.isUnmounted) {
				return false;
			}
			message.error("数据获取失败", () => {
				this.setState({
					loading: false
				})
			})
		})
	}
	componentWillUnmount() {
		this.isUnmounted = true;
	}
	// 不合格原因的事件
	// 1.checkbox的change事件
	checkboxChange = (platform_id, id, type, e) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		let checkednum = this.state.num;
		if (e.target.checked == true) {
			item[type].find(item => item.id == id).checked = 1;
			checkednum += 1;
		} else if (e.target.checked == false) {
			item[type].find(item => item.id == id).checked = 2;
			checkednum -= 1;
		}
		if (checkednum == 0) {
			this.setState({
				reasons: [...this.state.reasons],
				num: checkednum
			}, () => {
				this.props.form.validateFields(['charge_ratio'], { force: true })
			})
		} else {
			this.setState({
				reasons: [...this.state.reasons],
				num: checkednum
			})
		}
	}
	// 2.清空不合格原因
	clearUnqulifyReasons = (platform_id) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		let checkednum = this.state.num;
		item["execution_result_reasons"].forEach(it => {
			if (it.checked == 1) {
				checkednum -= 1;
				it.checked = 2;
			}
		})
		item["data_screenshot_reasons"].forEach(it => {
			if (it.checked == 1) {
				checkednum -= 1;
				it.checked = 2;
			}
		})
		if (checkednum == 0) {
			this.setState({
				reasons: [...this.state.reasons],
				num: checkednum
			}, () => {
				this.props.form.validateFields(['charge_ratio'], { force: true })
			})
		} else {
			this.setState({
				reasons: [...this.state.reasons],
				num: checkednum
			})
		}
	}
	// 3.输入其他原因
	inputOtherReasons = (platform_id, type, e) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		item[type].find(it => it.id == 1).comment = e.target.value;
		this.setState({
			reasons: [...this.state.reasons]
		})
	}
	// 不合格原因的事件结束
	//上传相关事件
	onPreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}
	handleCancel = () => this.setState({ previewVisible: false })
	//上传相关事件结束
	//备注不超过1000字
	validateAppealReason(rule, value, cb) {
		if (value == undefined) {
			cb()
		} else {
			let len = value.replace(/(^\s+)|(\s+$)/g, '').length;
			if (len > 1000) {
				cb([new Error(rule.message)])
			} else {
				cb()
			}
		}
	}
	//提交
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let data = {}
			data.order_id = this.props.record.order_id
			data.remark = values.remark
			if (this.state.num == 0) {
				this.setState({
					btnloading: true
				})
				//合格
				confirm({
					title: '确定该订单质检合格?',
					onOk: () => {
						this.props.actions.qualifiedByInspector(data).then(() => {
							this.props.closeModalUpdate()
							this.setState({
								btnloading: false
							})
						}).catch(() => {
							message.error("操作失败", () => {
								this.setState({
									btnloading: false
								})
							})
						})
					},
					onCancel: () => {
						this.setState({
							btnloading: false
						})
					}
				});
			} else {
				//不合格
				this.props.form.validateFields(['charge_ratio'], { force: true }, (err) => {
					if (err) {
						return;
					}
					this.setState({
						btnloading: true
					})
					data.reasons = this.state.reasons.map(item => {
						return item.reasons
					})
					if (values.attachments) {
						data.attachments = values.attachments.map(item => {
							return item.filepath
						})
					} else {
						data.attachments = []
					}
					data.charge_ratio = values.charge_ratio
					data.upload_token = this.props.activeInspectionData.upload_info.upload_token
					this.props.actions.unqualifiedByInspector(data).then(() => {
						this.props.closeModalUpdate()
						this.setState({
							btnloading: false
						})
					}).catch(() => {
						message.error("操作失败", () => {
							this.setState({
								btnloading: false
							})
						})
					})
				})
			}
		})
	}
	render() {
		const { record, activeInspectionData, form, formItemLayout } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					activeInspectionData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: activeInspectionData.execution_content }}
					/>
				}
				<Divider />
				<h3>质检内容</h3>
				<Form onSubmit={this.handleSubmit}>
					<ActiveInspectionReasons
						data_execution_results={this.state.reasons}
						form={this.props.form}
						record={record}
						checkboxChange={this.checkboxChange}
						validateAppealReason={this.validateAppealReason}
						clearUnqulifyReasons={this.clearUnqulifyReasons}
						inputOtherReasons={this.inputOtherReasons}
						formItemLayout={formItemLayout}
					></ActiveInspectionReasons>
					<FormItem label="质检员备注" {...formItemLayout}>
						{getFieldDecorator("remark", {
							rules: [{
								validator: this.validateAppealReason, message: '质检员备注不能超过1000个字'
							}]
						})(
							<TextArea
								autosize={{ minRows: 2, maxRows: 6 }} />
						)}
					</FormItem>
					{
						activeInspectionData.upload_info && <FormItem label="附件"
							extra="仅支持jpg、jpeg、png、gif格式的图片上传，单附件大小<=5MB，最多3张"
							{...formItemLayout}
						>
							{getFieldDecorator("attachments")(
								<WBYUploadFile
									tok={{
										token: activeInspectionData.upload_info.upload_token,
										upload_url: activeInspectionData.upload_info.upload_url
									}}
									len={3}
									size={5}
									multiple={true}
									accept="image/jpeg,image/jpg,image/png,image/gif"
									disabled={this.state.num == 0 ? true : false}
									onPreview={this.onPreview}
								/>
							)}
							<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
							</Modal>
						</FormItem>
					}
					<FormItem label="扣款比例" {...formItemLayout}>
						{getFieldDecorator("charge_ratio", {
							rules: [{
								required: this.state.num == 0 ? false : true, message: '请输入扣款比例'
							}, {
								pattern: /^(100(\.0{1,2})?|([1-9]\d|\d)(\.\d{1,2})?)$/,
								message: '扣款比例应该限制在0~100之间'
							}]
						})(
							<label className='chargeRatioBoxContianer'>
								<Input disabled={this.state.num == 0 ? true : false} />
							</label>
						)}
					</FormItem>
					<div className="btnCenter">
						<Button className="btn" type="primary" htmlType="submit"
							loading={this.state.btnloading}
						>提交</Button>
						<Button className="btn" type="primary"
							loading={this.state.btnloading}
							onClick={() => this.props.closeModal()}
						>取消</Button>
					</div>
				</Form>
			</Spin >
		)
	}
}

ActiveInspection.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		activeInspectionData: state.reservationReducers.activeInspectionData
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
)(Form.create()(ActiveInspection))

