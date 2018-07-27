import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import { ManagerInspectionUnquailfyReasons } from '../../components/unquilfyReasons/ManagerInspectionUnquailfyReasons'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import { WBYUploadFile } from 'wbyui'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, Form, message, Input, Button, Modal, Icon } from 'antd';
import './modalChildren.less'

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class ManagerInspectionUnquailfy extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			reasons: [],
			btnloading: false,
			reasonsRequire: false,
			previewVisible: false,
			previewImage: '',
			historyDisplay: false,
			flag: true,
			historyLoading: false
		}
	}
	componentWillMount() {
		this.props.actions.getManagerInspectionUnquilfyData({ order_id: this.props.record.order_id })
			.then(() => {
				if (this.isUnmounted) {
					return false;
				}
				this.setState({
					reasons: [...this.props.managerInspectionUnquilfyData.reasons],
					loading: false
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
	//不合格原因组件事件
	//1.checkbox点击事件
	checkboxChange = (platform_id, id, type, e) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		if (e.target.checked == true) {
			item[type].find(item => item.id == id).checked = 1;
			this.setState({
				reasonsRequire: false
			}, () => {
				this.props.form.validateFields(['reasons'], { force: true })
			})
		} else if (e.target.checked == false) {
			item[type].find(item => item.id == id).checked = 2;
		}
		this.setState({
			reasons: [...this.state.reasons]
		})
	}
	//2.其他原因的填写
	inputOtherReasons = (platform_id, type, e) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		item[type].find(it => it.id == 1).comment = e.target.value;
		this.setState({
			reasons: [...this.state.reasons]
		})
	}
	//3.清空不合格原因
	clearUnqulifyReasons = (platform_id) => {
		let item = this.state.reasons.find(item =>
			item.platform_id == platform_id).reasons;
		item["execution_result_reasons"].forEach(it => {
			if (it.checked == 1) {
				it.checked = 2;
			}
		})
		item["data_screenshot_reasons"].forEach(it => {
			if (it.checked == 1) {
				it.checked = 2;
			}
		})
		this.setState({
			reasons: [...this.state.reasons]
		})
	}
	//不合格原因组件事件结束
	//备注不能超过1000个字
	validateAppealReason = (rule, value, cb) => {
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
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let flag = false;
			this.state.reasons.forEach(item => {
				item.reasons.data_screenshot_reasons.forEach(it => {
					if (it.checked == 1) {
						flag = true
					}
				})
				item.reasons.execution_result_reasons.forEach(it => {
					if (it.checked == 1) {
						flag = true
					}
				})
			})
			if (flag == false) {
				this.setState({
					reasonsRequire: true
				}, () => {
					this.props.form.validateFields(['reasons'], { force: true })
					return;
				})
			} else {
				this.setState({
					reasonsRequire: false,
					btnloading: true
				}, () => {
					this.props.form.validateFields(['reasons'], { force: true })
				})
				values.order_id = this.props.record.order_id
				values.reasons = this.state.reasons.map(item => {
					return item.reasons
				})
				if (values.attachments) {
					values.attachments = values.attachments.map(item => {
						return item.filepath
					})
				} else {
					values.attachments = []
				}
				values.upload_token = this.props.managerInspectionUnquilfyData.upload_info.upload_token
				confirm({
					title: '确认该订单质检不合格?',
					onOk: () => {
						this.props.actions.unqualifiedByQcLeader(values).then(() => {
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
					},
				});
			}
		})
	}
	//上传相关事件
	onPreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}
	handleCancel = () => this.setState({ previewVisible: false })
	//上传相关事件结束
	render() {
		const { record, managerInspectionUnquilfyData, form, historyData, formItemLayout } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					managerInspectionUnquilfyData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: managerInspectionUnquilfyData.execution_content }}
					/>
				}
				<Divider />
				<h3>质检内容</h3>
				<Form onSubmit={this.handleSubmit}>
					<ManagerInspectionUnquailfyReasons
						data_execution_results={this.state.reasons}
						form={this.props.form}
						record={record}
						checkboxChange={this.checkboxChange}
						inputOtherReasons={this.inputOtherReasons}
						clearUnqulifyReasons={this.clearUnqulifyReasons}
						validateAppealReason={this.validateAppealReason}
						reasonsRequire={this.state.reasonsRequire}
						formItemLayout={formItemLayout}
					/>
					<FormItem label="质检主管备注" {...formItemLayout}>
						{getFieldDecorator("remark", {
							rules: [{
								validator: this.validateAppealReason, message: '质检主管备注不能超过1000个字'
							}]
						})(
							<TextArea
								autosize={{ minRows: 2, maxRows: 6 }} />
						)}
					</FormItem>
					{
						managerInspectionUnquilfyData.upload_info && <FormItem label="附件"
							extra="仅支持jpg、jpeg、png、gif格式的图片上传，单附件大小<=5MB，最多3张"
							{...formItemLayout}
						>
							{getFieldDecorator("attachments")(
								<WBYUploadFile
									tok={{
										token: managerInspectionUnquilfyData.upload_info.upload_token,
										upload_url: managerInspectionUnquilfyData.upload_info.upload_url
									}}
									len={3}
									size={5}
									multiple={true}
									accept="image/jpeg,image/jpg,image/png,image/gif"
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
								required: true, message: '请输入扣款比例'
							}, {
								pattern: /^(100(\.0{1,2})?|([1-9]\d|\d)(\.\d{1,2})?)$/,
								message: '扣款比例应该限制在0~100之间'
							}]
						})(
							<label className='chargeRatioBoxContianer'>
								<Input />
							</label>
						)}
					</FormItem>
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

ManagerInspectionUnquailfy.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		managerInspectionUnquilfyData: state.reservationReducers.managerInspectionUnquilfyData,
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
)(Form.create()(ManagerInspectionUnquailfy))

