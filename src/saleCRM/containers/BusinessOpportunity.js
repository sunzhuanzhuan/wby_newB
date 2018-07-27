import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col, Modal, Button, Spin } from 'antd';
import './BusinessOpportunity.less';
//统计
import BusinessCount from "../components/business/BusinessCount";
//搜索
import BusinessSearch from "../components/business/BusinessSearch";
//引入列表
import BusinessTable from "../components/business/BusinessTable";
import qs from "qs";
//跟进记录
//import FollowRecordForm from "../components/business/FollowRecordForm";
//action
import * as business from "../actions";
class BusinessOpportunity extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			showModalTitle: null,
			showModalContent: null,
			isLoading: true,
			pageNow: 1
		}
		this.company_name = qs.parse(props.location.search.substring(1)).company_name
		this.showModal.bind(this)
		this.onCancel.bind(this)

	}
	componentDidMount = () => {
		this.props.actions.getSelect().then(() => {
			this.props.actions.getSalesManager()
		})
		this.props.actions.getBoList({ company_name: this.company_name }).then(() => {
			this.setState({
				isLoading: false
			})
		});
	}
	showModal = (type, content) => {
		this.setState({
			visible: true,
			showModalTitle: type,
			showModalContent: content
		})
	}
	onCancel = () => {
		this.setState({
			visible: false,

		})
	}
	onOk = () => {
		this.onCancel()
	}
	onPaginationChange = (page) => {
		const values = this.businessSearchForm.getFieldsValue();
		const dateComponents = ["start_created_at", "end_created_at", "start_record_at", "end_record_at"]
		dateComponents.forEach(item => {
			if (values[item]) {
				values[item] = values[item].format("YYYY-MM-DD HH:mm:ss")
			}
		})
		this.props.actions.getBoList({ ...values, page, limit: 20 })
	}
	addFollowUp = (value) => {
		this.props.actions.addFollowUp(value).then(() => {
			this.onPaginationChange(this.state.pageNow)
			this.onCancel()
		})
	}
	seachAllValue = () => {
		const { pageNow } = this.state
		const values = this.businessSearchForm.getFieldsValue();
		const dateComponents = ["start_created_at", "end_created_at", "start_record_at", "end_record_at"]
		dateComponents.forEach(item => {
			if (values[item]) {
				values[item] = values[item].format("YYYY-MM-DD HH:mm:ss")
			}
		})
		this.props.actions.getBoList({ ...values, page: pageNow, limit: 20 })
	}
	onchangePage = (pageNow) => {
		this.setState({ pageNow })
	}
	changeLoading = () => {
		const { isLoading } = this.state
		this.setState({ isLoading: !isLoading })
	}
	render() {
		const { selectList, history, businessOpportunity, actions, authVisibleList } = this.props
		const { statistics } = businessOpportunity;
		const { visible, showModalTitle, showModalContent, isLoading } = this.state
		//添加按钮的可见权限
		const saleCRM_business_add_button = authVisibleList['saleCRM.business.add.button']
		//table操作按钮的可见权限
		const saleCRM_business_table_operatin_button = authVisibleList['saleCRM.business.table.operatin.button']
		const tableProps = {
			showModal: this.showModal,
			selectList: selectList,
			history: history,
			businessOpportunity,
			onPaginationChange: this.onPaginationChange,
			recoverBusinessOpportunity: actions.recoverBusinessOpportunity,
			saleCRM_business_table_operatin_button: saleCRM_business_table_operatin_button,
			onCancel: this.onCancel,
			addFollowUp: this.addFollowUp,
			onchangePage: this.onchangePage,
			seachAllValue: this.seachAllValue
		}

		const searchProps = {
			selectList: selectList,
			onSearch: actions.getBoList,
			company_name: this.company_name,
			changeLoading: this.changeLoading
		}
		return (
			<div>
				<Spin spinning={isLoading}>
					<Row>
						<Col span={2}><h2>商机列表</h2></Col>
						<Col span={2}>
							{saleCRM_business_add_button ?
								<Button type='primary' onClick={() => history.push('/sale/businessOpportunity/add')}>添加商机</Button>
								: null
							}</Col>
					</Row>
					<Row>
						<fieldset className='fieldset_css'>
							<legend>统计</legend>
							<BusinessCount statistics={statistics} />
						</fieldset>
					</Row>
					<Row className='row-box-margin'>
						<fieldset className='fieldset_css'>
							<legend>搜索</legend>
							<BusinessSearch ref={el => this.businessSearchForm = el} {...searchProps} />
						</fieldset>
					</Row>
					<Row className='row-box-margin'>共&nbsp;{businessOpportunity && businessOpportunity.count + '' || '0'}&nbsp;条数据</Row>
					<Row className='row-box-margin'>

						<BusinessTable {...tableProps} />

					</Row>
					<Modal
						visible={visible}
						title={showModalTitle}
						onCancel={this.onCancel}
						className='noModalButton'
						maskClosable={false}
					>
						{showModalContent}
					</Modal>
				</Spin>
			</div>
		)
	}
}

BusinessOpportunity.propTypes = {
	actions: PropTypes.shape({

	})
}

const mapStateToProps = (state) => ({
	selectList: state.saleCRMReducers.selectList,
	businessOpportunity: state.saleCRMReducers.boList,
	authVisibleList: state.authorizationsReducers.authVisibleList,

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...business
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BusinessOpportunity)

