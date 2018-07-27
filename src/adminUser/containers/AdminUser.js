import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Spin, message } from 'antd'
import {
	getAdminUserList, deleteAdminUserList, getUserGroup, flushSaleList, getDepartmentList,
	getJobList, getJobTypeList, resetAuthorizations
} from '../actions/adminUser'
import FilterAdminUser from './FilterAdminUser'
import AdminUserList from './AdminUserList'
import { getVisibleAdminUser } from '../reducers/adminUser'

class AdminUser extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			searchValue: {}
		}
		this.changeSpin.bind(this)
		this.changeSearchValue.bind(this)
	}
	componentWillMount() {
		//获取路径参数
		this.changeSpin()
		const params = this.props.location.query
		this.props.actions.getAdminUserList({ ...params }).then(() => {
			this.changeSpin()
		});
		//查询用户组
		this.props.actions.getUserGroup();
		//查询部门
		this.props.actions.getDepartmentList()
		//查询岗位
		//this.props.actions.getJobList({ is_show_department: 1 })
		//查询岗位类型
		this.props.actions.getJobTypeList()
	}
	changeSpin = () => {
		const { loading } = this.state
		this.setState({
			loading: !loading
		})
	}
	changeSearchValue = (searchValue) => {
		this.setState({ searchValue })
	}
	resetAuthorizations = () => {
		this.props.actions.resetAuthorizations().then((response) => {
			if (response.code == 200) {
				message.success(response.message)
			}
		})
	}
	render() {

		const {
			userGroupOption = [
				{ user_group_id: 1, user_group_name: '用户组一' },
				{ user_group_id: 2, user_group_name: '用户组二' },
				{ user_group_id: 3, user_group_name: '用户组三' }
			],
			adminUserList,
			actions,
			byId,
			departmentList,
			jobList,
			jobTypeList
		} = this.props
		return (
			<fieldset>
				<legend>用户管理</legend>
				<Spin spinning={this.state.loading}>
					{/* <Row>
					<Col span={12}>
						<h3>用户管理</h3>
					</Col>
					<Col span={12}>
						<Button type='primary' style={{ float: 'right' }} onClick={() => {
							this.props.actions.flushSaleList()
						}}>刷新销售列表</Button>
					</Col>
				</Row> */}
					<FilterAdminUser
						userGroupOption={userGroupOption}
						getAdminUserList={actions.getAdminUserList}
						changeSpin={this.changeSpin}
						getJobList={actions.getJobList}
						departmentList={departmentList}
						jobList={jobList}
						jobTypeList={jobTypeList}
						changeSearchValue={this.changeSearchValue}
						resetAuthorizations={this.resetAuthorizations}
					/>
					<AdminUserList
						searchValue={this.state.searchValue}
						getAdminUserList={actions.getAdminUserList}
						adminUserList={adminUserList}
						byId={byId}
						changeSpin={this.changeSpin}
						deleteAdminUserList={actions.deleteAdminUserList}
					/>

				</Spin>
			</fieldset>
		)
	}

}
AdminUser.propTypes = {
	actions: PropTypes.shape({
		getAdminUserList: PropTypes.func.isRequired,
	})
}

const mapStateToProps = (state) => ({
	adminUserList: getVisibleAdminUser(state.adminUserList),
	userGroupOption: state.adminUserList.userGroupOption,
	byId: state.adminUserList.byId,
	departmentList: state.adminUserList.departmentList,
	jobList: state.adminUserList.jobList,
	jobTypeList: state.adminUserList.jobTypeList,
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getAdminUserList,
		deleteAdminUserList,
		getUserGroup,
		flushSaleList,
		getDepartmentList,
		getJobList,
		getJobTypeList,
		resetAuthorizations
	}, dispatch)
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AdminUser);
