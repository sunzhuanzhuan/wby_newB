import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import { ComplainCheckReasons } from '../../components/unquilfyReasons/ComplainCheckReasons'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Input, Button } from 'antd';
import './modalChildren.less'
const FormItem = Form.Item;

class Complain extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			btnloading: false
		}
	}
	componentWillMount() {
		this.props.actions.getComplainData({ order_id: this.props.record.order_id }).then(() => {
			if (this.isUnmounted) {
				return false;
			}
			this.setState({
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
	//确认投诉
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					btnloading: true
				})
				let data = {}
				data.charge_ratio = values.charge_ratio
				data.order_id = this.props.record.order_id
				this.props.actions.confirmedByInspector(data).then(() => {
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
		})
	}
	//修改投诉
	modifyComplaint = () => {
		this.props.closeModal()
		let record = this.props.record;
		this.props.showReservationModal(record, "modifyComplaint")
	}
	render() {
		const { record, complainData, form, formItemLayout } = this.props;
		const { getFieldDecorator } = form
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					complainData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: complainData.execution_content }}
					/>
				}
				<Divider />
				<h3>投诉内容</h3>
				<Form onSubmit={this.handleSubmit}>
					<ComplainCheckReasons
						reasons={complainData.reasons}
						record={this.props.record}
						form={this.props.form}
						formItemLayout={formItemLayout}
					/>
					<FormItem
						label="投诉备注"
						{...formItemLayout}
					>
						<div>{complainData.comment}</div>
					</FormItem>
					<FormItem
						label="附件"
						{...formItemLayout}
					>
						{
							complainData.attachments && complainData.attachments.map((item, index) => {
								return <a key={index} href={item} target="_blank">
									<img src={item} width="50px" height="50px" />
								</a>
							})
						}
					</FormItem>
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
					<div className="btnCenter">
						<Button className="btn" type="primary" htmlType="submit" loading={this.state.btnloading}>确认投诉</Button>
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.modifyComplaint}
						>修改投诉</Button>
						<a className="btn specialBtn" onClick={() => this.props.showRejectComplaint()} disabled={this.state.btnloading}>驳回投诉</a>
					</div>
				</Form>
			</Spin >
		)
	}
}

Complain.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		complainData: state.reservationReducers.complainData
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
)(Form.create()(Complain))

