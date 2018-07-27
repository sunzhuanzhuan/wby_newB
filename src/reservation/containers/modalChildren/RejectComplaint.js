import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as reservationAction from '../../actions/reservation'
import { Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

class RejectComplaint extends Component {
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
				values.order_id = this.props.record.order_id;
				this.props.actions.rejectedByInspector(values).then(() => {
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
			}
		});
	}
	render() {
		const { form, visible, record, formItemLayout } = this.props;
		const { getFieldDecorator } = form
		let title = `驳回投诉 
		【订单号：${record.order_id}  
		账号名称：${record.account_name}  
		平台：${record.platform_name}】`
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
					<FormItem label="驳回理由" {...formItemLayout}>
						{getFieldDecorator("rejection_reason", {
							rules: [{
								required: true, message: '请输入驳回理由'
							}, {
								validator: this.validateAppealReason,
								message: '驳回理由不能超过1000个字'
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

RejectComplaint.propTypes = {
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
)(Form.create()(RejectComplaint))

