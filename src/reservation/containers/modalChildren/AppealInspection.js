import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import AppealContent from '../../components/readOnlyContent/AppealContent'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Button, Icon } from 'antd';

import './AppealInspeation.less'
import './modalChildren.less'

class AppealInspection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			historyDisplay: false,
			flag: true,
			historyLoading: false,
			btnloading: false
		}
	}
	componentWillMount() {
		let order_id = this.props.record.order_id;
		this.props.actions.getAppealInspectionData({ order_id })
			.then(() => {
				if (this.isUnmounted) {
					return false;
				}
				this.setState({
					loading: false,
				})
			}).catch(() => {
				if (this.isUnmounted) {
					return false;
				}
				message.error('数据获取失败', () => {
					this.setState({
						loading: false,
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
	//合格
	quilfy = () => {
		this.setState({
			btnloading: true
		})
		this.props.actions.appealQualifiedByInspector({ order_id: this.props.record.order_id }).then(() => {
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
	//不合格
	unquilfy = () => {
		this.props.closeModal()
		let record = this.props.record;
		this.props.showReservationModal(record, "appealInspectionUnqualify")
	}
	render() {
		const { record, appealInspectionData, historyData } = this.props;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					appealInspectionData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: appealInspectionData.execution_content }}
					/>
				}
				<Divider />
				<h3>申诉内容</h3>
				<Form>
					{
						appealInspectionData.data_execution_results && <AppealContent
							content={appealInspectionData.data_execution_results}
							comment={appealInspectionData.comment}
							attachments={appealInspectionData.attachments}
							weiExecutionImg={record.wei_execution_img}
						/>
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
							onClick={this.quilfy}
						>合格</Button>
						<Button className="btn" type="primary" loading={this.state.btnloading}
							onClick={this.unquilfy}
						>不合格</Button>
					</div>
				</Form>
			</Spin >

		)
	}
}

AppealInspection.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		appealInspectionData: state.reservationReducers.appealInspectionData,
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
)(Form.create()(AppealInspection))

