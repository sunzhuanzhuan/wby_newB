import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Tabs, Spin, message, Divider } from 'antd';
import BusinessStage from "../components/business/BusinessStage";
import FollowRecordForm from "../components/business/FollowRecordForm";
import FollowRecordList from "../components/business/FollowRecordList";
import "./BusinessOpportunity.less";
import * as business from "../actions";
import qs from "qs";
import { Link } from "react-router-dom";
const TabPane = Tabs.TabPane;

class BusinessOpportunityDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoading: true
		}
	}
	componentDidMount = () => {
		//滚动条置顶
		document.getElementById('app-content-children-id').scrollTop = 0
		this.props.actions.getSelect()
		const id = qs.parse(this.props.location.search.substring(1)).id
		this.props.actions.getBoInfo({ id: id }).then(() => {
			this.setState({
				isLoading: false
			})
			this.props.actions.getFollowUpList({ item_id: this.props.boInfo.id, item_type: 2, page: 1 })
		})
	}

	theQueryAgain = () => {
		const id = qs.parse(this.props.location.search.substring(1)).id
		if (id > 0) {
			this.props.actions.getBoInfo({ id: id })
			this.props.actions.getFollowUpList({ item_id: this.props.boInfo.id, item_type: 2, page: 1 })
		}
	}
	addFollowUp = (values) => {
		const id = qs.parse(this.props.location.search.substring(1)).id
		this.props.actions.addFollowUp(values).then(() => {
			this.props.actions.getFollowUpList({ item_id: this.props.boInfo.id, item_type: 2, page: 1 })
			this.props.actions.getBoInfo({ id: id })
		}).catch(() => {
			message.error("操作失败")
		})
	}
	//分页
	changePage = (page) => {
		this.props.actions.getFollowUpList({ item_id: this.props.boInfo.id, item_type: 2, page: page })
	}
	render() {
		const isShowStage = true
		const { selectList, boInfo, actions, history, authVisibleList, followUpList } = this.props
		const { isLoading } = this.state
		//销售CRM-->商机列表-->商机页面-->商机详情-->添加跟进记录可见性
		const saleCRM_business_detail_follow_add = authVisibleList['saleCRM.business.detail.follow.add']
		//销售CRM-->商机列表-->商机页面-->商机详情-->操作按钮可见性
		const saleCRM_business_detail_operating_button = authVisibleList['saleCRM.business.detail.operating.button']
		const stageProps = {
			boInfo: boInfo,
			pauseBo: actions.pauseBo,
			stopBo: actions.stopBo,
			history,
			theQueryAgain: this.theQueryAgain,
			saleCRM_business_detail_operating_button: saleCRM_business_detail_operating_button,
			recoverBusinessOpportunity: actions.recoverBusinessOpportunity,
		}
		return (
			<div className='businessdetail'>
				<Spin spinning={isLoading}>
					<p><Link to='/sale/businessOpportunity'>商机列表</Link>{">商机详情"}</p>
					<Row>
						商机名称：{boInfo.name}
						<Divider type="vertical" />所属公司：<a href={boInfo.company_url} target="_blank">{boInfo.company_name}</a>
						<Divider type="vertical" />销售经理：{boInfo.sale_name}
						<Divider type="vertical" />预估投放金额：{boInfo && boInfo.estimate_sales_amount_name || '-'}
						<Divider type="vertical" />最后跟进时间：{boInfo.record_at}
					</Row>

					<Row gutter={8} style={{ marginTop: 6 }}>
						<Col span={isShowStage ? 16 : 24}>
							<Tabs defaultActiveKey="1">
								<TabPane tab="商机阶段" key="1"><BusinessStage {...stageProps} /></TabPane>
							</Tabs>
						</Col>
						<Col span={isShowStage ? 8 : 0} >
							{/* <Row className='detail-title'>
							<div className='title-bottom'>跟进记录</div>
						</Row> */}
							<Tabs defaultActiveKey="1">
								<TabPane tab="跟进记录" key="1" className="follow-displayBox">
									{saleCRM_business_detail_follow_add && boInfo.status !== 5 ?
										<div className='follow-box follow-box-addbox'>
											<FollowRecordForm
												addFollowUp={this.addFollowUp}
												selectList={selectList}
												company_id={boInfo.company_id}
												businessId={boInfo.id}
												status={boInfo.status} />
										</div> : null}
									<div className='follow-box follow-box-Listbox'>
										<FollowRecordList
											changePage={this.changePage}
											followUpList={followUpList} />
									</div>
								</TabPane>
							</Tabs>

						</Col>
					</Row>
				</Spin>
			</div>
		)
	}
}

BusinessOpportunityDetail.propTypes = {
	actions: PropTypes.shape({
	})
}

const mapStateToProps = (state) => ({
	selectList: state.saleCRMReducers.selectList,
	boInfo: state.saleCRMReducers.boInfo,
	followUpList: state.saleCRMReducers.followUpList,
	authVisibleList: state.authorizationsReducers.authVisibleList
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...business
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessOpportunityDetail)

