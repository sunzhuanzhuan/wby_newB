import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ExecuteContentDetail from '../../components/readOnlyContent/ExecuteContent'
import DataExecutionResultsForMediaModify from '../../components/unquilfyReasons/DataExecutionResultsForMediaModify'
import GetQcHistory from '../../components/readOnlyContent/GetQcHistory'
import DataExecutionResults from '../../components/unquilfyReasons/DataExecutionResults'
import * as reservationAction from '../../actions/reservation'
import { Divider, Spin, message, Form, Button, Icon } from 'antd';
import './modalChildren.less'
import '../../components/readOnlyContent/attachments.css'

class MediaModifyCheck extends Component {
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
		let order_id = this.props.record.order_id;
		this.props.actions.getMediaModifyCheckData({ order_id })
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

	/**
	 *
	 * @param status 当前状态 16：媒介修改，14：过期为申诉
	 * @param data 需要渲染的数据
	 * @returns 返回对应的component
	 */
	getUnqualifiedComponent(status, data) {
		return {
			'16': <DataExecutionResultsForMediaModify
				executionResult={data.data_execution_results.filter(item => item.is_qualified === 2)}
				comment={data.comment}
				weiExecutionImg={this.props.record.wei_execution_img}
				chargeRatio={data.charge_ratio}
				title={data.title}
			/>,
			'14': <DataExecutionResults
				executionResult={data.data_execution_results}
				comment={data.comment}
				weiExecutionImg={this.props.record.wei_execution_img}
				chargeRatio={data.charge_ratio}
				attachments={data.attachments}
				title={data.title}
			/>
		}[status]
	}
	MediaModify() {
		this.props.closeModal();
		let record = { ...this.props.record };
		this.props.showReservationModal(record, "mediaModify")
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
		const { record, mediaModifyCheckData, historyData } = this.props;
		return (
			<Spin spinning={this.state.loading} >
				<h3>执行内容</h3>
				{
					mediaModifyCheckData.execution_content && <ExecuteContentDetail
						platform_name={record.platform_name}
						content={{ data: mediaModifyCheckData.execution_content }}
					/>
				}
				<Divider />
				<h3>质检内容</h3>
				<Form>
					{
						mediaModifyCheckData.data_execution_results
						&& this.getUnqualifiedComponent(mediaModifyCheckData.status, mediaModifyCheckData)

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
							onClick={this.MediaModify.bind(this)}
						>
							修改
							</Button>
					</div>
				</Form>
			</Spin >

		)
	}
}

MediaModifyCheck.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => {
	return {
		mediaModifyCheckData: state.reservationReducers.mediaModifyCheckData,
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
)(Form.create()(MediaModifyCheck))

