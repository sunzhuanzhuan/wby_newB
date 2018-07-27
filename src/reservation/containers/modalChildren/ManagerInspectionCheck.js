import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import { ManagerReasonsAppeal } from '../../components/unquilfyReasons/ManagerReasonsAppeal'
import { ManagerReasonsAppealShorter } from '../../components/unquilfyReasons/ManagerReasonsAppealShorter'
import { ManagerReasonsMediaModify } from '../../components/unquilfyReasons/ManagerReasonsMediaModify'
import { ManagerReasonsComplaint } from '../../components/unquilfyReasons/ManagerReasonsComplaint'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Button, Modal, Icon } from 'antd';
import './modalChildren.less'
const FormItem = Form.Item;
const confirm = Modal.confirm;


class ManagerInspectionCheck extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			historyLoading: false,
			historyDisplay: false,
			flag: true,
			btnloading: false
		}
	}
	componentWillMount() {
		this.props.actions.getManagerInspectionCheckData({ order_id: this.props.record.order_id }).then(() => {
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
	//质检合格
	quailfy = () => {
		this.setState({
			btnloading: true
		})
		confirm({
			title: '确定该订单质检合格?',
			onOk: () => {
				this.props.actions.qualifiedByManager({ order_id: this.props.record.order_id }).then(() => {
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
	//质检不合格
	unqualify = () => {
		this.props.closeModal()
		let record = this.props.record;
		this.props.showReservationModal(record, "managerInspectionUnquailfy")
	}
	render() {
		const { record, managerInspectionCheckData, historyData, formItemLayout } = this.props;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					managerInspectionCheckData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: managerInspectionCheckData.execution_content }}
					/>
				}
				<Divider />
				<Form>
					{
						managerInspectionCheckData.type == 3 ?
							<div>
								<h3>质检内容</h3>
								<ManagerReasonsAppeal
									form={this.props.form}
									reasons={managerInspectionCheckData.data_execution_results}
									record={record}
									formItemLayout={formItemLayout}
								/>
								{
									managerInspectionCheckData.comment ?
										<FormItem
											label={managerInspectionCheckData.title}
											{...formItemLayout}
										>
											{managerInspectionCheckData.comment}
										</FormItem> : null
								}
								{
									managerInspectionCheckData.charge_ratio ?
										<FormItem
											label="扣款比例"
											{...formItemLayout}
										>
											{managerInspectionCheckData.charge_ratio}%
										</FormItem> : null
								}
							</div> : null
					}
					{
						managerInspectionCheckData.type == 2 ?
							<div>
								<h3>申诉内容</h3>
								<ManagerReasonsAppealShorter
									form={this.props.form}
									reasons={managerInspectionCheckData.data_execution_results}
									record={record}
									formItemLayout={formItemLayout}
								/>
								<FormItem
									label="申诉理由"
									{...formItemLayout}
								>
									{managerInspectionCheckData.comment}
								</FormItem>
								<FormItem
									label="附件"
									{...formItemLayout}
								>
									{managerInspectionCheckData.attachments &&
										managerInspectionCheckData.attachments.map((item, index) => {
											return <a href={item} key={index} target="_blank">
												<img width="50px" height="50px" src={item} />
											</a>
										})}
								</FormItem>
								{
									managerInspectionCheckData.charge_ratio ?
										<FormItem
											label="扣款比例"
											{...formItemLayout}
										>
											{managerInspectionCheckData.charge_ratio}%
										</FormItem> : null
								}
							</div>
							: null
					}
					{
						managerInspectionCheckData.type == 4 ?
							<div>
								<h3>媒介修改内容</h3>
								<ManagerReasonsMediaModify
									form={this.props.form}
									reasons={managerInspectionCheckData.data_execution_results}
									record={record}
									formItemLayout={formItemLayout}
								/>
								{
									managerInspectionCheckData.comment ?
										<FormItem
											label={managerInspectionCheckData.title}
											{...formItemLayout}
										>
											{managerInspectionCheckData.comment}
										</FormItem> : null
								}
								<FormItem
									label="附件"
									{...formItemLayout}
								>
									{managerInspectionCheckData.attachments &&
										managerInspectionCheckData.attachments.map((item, index) => {
											return <a href={item} key={index} target="_blank">
												<img width="50px" height="50px" src={item} />
											</a>
										})}
								</FormItem>
								{
									managerInspectionCheckData.charge_ratio ?
										<FormItem
											label="扣款比例"
											{...formItemLayout}
										>
											{managerInspectionCheckData.charge_ratio}%
										</FormItem> : null
								}
							</div> : null
					}
					{
						managerInspectionCheckData.type == 1 ?
							<div>
								<h3>质检内容</h3>
								<ManagerReasonsComplaint
									form={this.props.form}
									reasons={managerInspectionCheckData.data_execution_results}
									record={record}
									formItemLayout={formItemLayout}
								/>
								{
									managerInspectionCheckData.comment ?
										<FormItem
											label={managerInspectionCheckData.title}
											{...formItemLayout}
										>
											{managerInspectionCheckData.comment}
										</FormItem> : null
								}
								<FormItem
									label="附件"
									{...formItemLayout}
								>
									{managerInspectionCheckData.attachments &&
										managerInspectionCheckData.attachments.map((item, index) => {
											return <a href={item} key={index} target="_blank">
												<img width="50px" height="50px" src={item} />
											</a>
										})}
								</FormItem>
								{
									managerInspectionCheckData.charge_ratio ?
										<FormItem
											label="扣款比例"
											{...formItemLayout}
										>
											{managerInspectionCheckData.charge_ratio}%
										</FormItem> : null
								}
							</div> : null
					}
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
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.quailfy}
						>合格</Button>
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.unqualify}
						>不合格</Button>
						<a className="btn specialBtn"
							disabled={this.state.btnloading}
							onClick={() => this.props.showPauseModal()}
						>暂停</a>
					</div>
				</Form>
			</Spin >

		)
	}
}

ManagerInspectionCheck.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		managerInspectionCheckData: state.reservationReducers.managerInspectionCheckData,
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
)(Form.create()(ManagerInspectionCheck))

