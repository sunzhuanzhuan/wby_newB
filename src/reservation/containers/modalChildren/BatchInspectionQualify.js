import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as reservationAction from '../../actions/reservation'
import { Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class BatchInspectionQualify extends Component {
	constructor(props) {
		super(props)
		this.state = {
			btnloading: false
		}
	}
	componentWillMount() {
		this.props.form.resetFields()
	}
	//驳回理由不超过1000字
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
	//确认
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				this.setState({
					btnloading: true
				})
				values.order_id = [...this.props.orderIds]
				confirm({
					title: '确定批量质检合格?',
					onOk: () => {
						this.props.actions.batchInspectionQuailfy(values).then(() => {
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
			}
		});
	}
	render() {
		const { form, visible, formItemLayout } = this.props;
		const { getFieldDecorator } = form
		let title = "批量合格"
		return (
			<Modal
				title={title}
				visible={visible}
				onOk={this.handleOk}
				onCancel={this.props.handleCancel}
				width="70%"
				okText="提交"
				confirmLoading={this.state.btnloading}
				destroyOnClose={true}
				maskClosable={false}
			>
				<Form layout="horizontal" onSubmit={this.handleOk}>
					<FormItem label="备注" {...formItemLayout}>
						{getFieldDecorator("remark", {
							rules: [{
								validator: this.validateAppealReason,
								message: '备注不能超过1000个字'
							}]
						})(
							<TextArea
								autosize={{ minRows: 2, maxRows: 6 }} />
						)}
					</FormItem>
				</Form>
			</Modal>
		)
	}
}

BatchInspectionQualify.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = () => {
	return {

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
)(Form.create()(BatchInspectionQualify))

