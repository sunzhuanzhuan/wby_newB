import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import DataExecutionResults from '../../components/unquilfyReasons/DataExecutionResults'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Button, Modal, Icon } from 'antd';
import './modalChildren.less'

const confirm = Modal.confirm;



class AppealCheck extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			flag: true,
			historyLoading: false,
			historyDisplay: false
		}
	}
	componentWillMount() {
		this.props.actions.getAppealCheckData({ order_id: this.props.record.order_id }).then(() => {
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
	//点击申诉
	appeal() {
		this.props.closeModal();
		let record = { ...this.props.record };
		this.props.showReservationModal(record, 'appeal')
	}
	//同意质检结果
	appealWaive() {
		let order_id = this.props.record.order_id;
		this.setState({
			loading: true
		});
		confirm({
			title: '确定同意质检结果?',
			onOk: () => {
				this.props.actions.fetchAppealWaive({ order_id })
					.then(() => {
						this.setState({
							loading: false
						});

						this.props.closeModalUpdate()
					})
					.catch(() => {
						message.error("操作失败", () => {
							this.setState({
								loading: false
							})
						})
					})
			},
			onCancel: () => {
				this.setState({
					loading: false
				})
			}
		});

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
		const { record, appealCheckData, historyData } = this.props;

		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					appealCheckData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: appealCheckData.execution_content }}
					/>
				}
				<Divider />
				<h3>质检内容</h3>
				<Form>
					{
						appealCheckData.data_execution_results && <DataExecutionResults
							executionResult={appealCheckData.data_execution_results}
							chargeRatio={appealCheckData.charge_ratio}
							attachments={appealCheckData.attachments}
							comment={appealCheckData.comment}
							weiExecutionImg={record.wei_execution_img}
							title={appealCheckData.title}
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
						<Button
							type="primary"
							className="btn"
							onClick={this.appealWaive.bind(this)}
							loading={this.state.loading}
						>
							同意质检结果
							</Button>
						<Button
							type="primary"
							className="btn"
							onClick={this.appeal.bind(this)}
							loading={this.state.loading}
						>
							申诉
							</Button>
					</div>
				</Form>
			</Spin >

		)
	}
}

AppealCheck.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		appealCheckData: state.reservationReducers.appealCheckData,
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
)(Form.create()(AppealCheck))

