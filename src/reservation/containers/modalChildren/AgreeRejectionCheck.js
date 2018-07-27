import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import { ComplainCheckReasons } from '../../components/unquilfyReasons/ComplainCheckReasons'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Button, Modal } from 'antd';
import './modalChildren.less'
const FormItem = Form.Item;
const confirm = Modal.confirm;


class AgreeRejectionCheck extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			btnloading: false
		}
	}
	componentWillMount() {
		this.props.actions.getAgreeRejectionCheckData({ order_id: this.props.record.order_id }).then(() => {
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
	//同意驳回
	confirmRejection = () => {
		confirm({
			title: '确认同意驳回?',
			onOk: () => {
				this.setState({
					btnloading: true
				})
				this.props.actions.approveRejection({ order_id: this.props.record.order_id }).then(() => {
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
	//拒绝驳回
	refuseRejection = () => {
		this.props.closeModal()
		let record = this.props.record;
		this.props.showReservationModal(record, "refuseRejection")
	}
	render() {
		const { record, agreeRejectionCheckData, formItemLayout } = this.props;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					agreeRejectionCheckData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: agreeRejectionCheckData.execution_content }}
					/>
				}
				<Divider />
				<h3>投诉内容</h3>
				<Form>
					<ComplainCheckReasons
						reasons={agreeRejectionCheckData.reasons}
						record={this.props.record}
						form={this.props.form}
						formItemLayout={formItemLayout}
					/>
					<FormItem
						label="备注"
						{...formItemLayout}
					>
						<div>{agreeRejectionCheckData.comment}</div>
					</FormItem>
					<FormItem
						label="附件"
						{...formItemLayout}
					>
						{
							agreeRejectionCheckData.attachments && agreeRejectionCheckData.attachments.map((item, index) => {
								return <a key={index} href={item} target="_blank">
									<img src={item} width="50px" height="50px" />
								</a>
							})
						}
					</FormItem>
					<Divider />
					<h3>投诉驳回</h3>
					<FormItem
						label="驳回理由"
						{...formItemLayout}
					>
						<div>{agreeRejectionCheckData.rejectedComment}</div>
					</FormItem>
					<div className="btnCenter">
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.confirmRejection}
						>同意驳回</Button>
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.refuseRejection}
						>拒绝驳回</Button>
					</div>
				</Form>
			</Spin >

		)
	}
}

AgreeRejectionCheck.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		agreeRejectionCheckData: state.reservationReducers.agreeRejectionCheckData
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
)(Form.create()(AgreeRejectionCheck))

