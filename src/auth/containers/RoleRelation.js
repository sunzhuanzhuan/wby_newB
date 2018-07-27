import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import qs from 'qs'
import api from '../../api/index'
import RoleType from '../components/RoleRelation'
import CommonModal from '../components/CommonModal'
import { getVisibleRoleRelation } from '../reducers/roleRelation'
import { Table, Button, Input, message } from 'antd';
import * as roleRelationAction from '../actions/roleRelation'
import AppInfo from '../components/AppInfo'
import './auth.less'
const Search = Input.Search;

class RoleRelation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roleRelationList: [],
			type: '',
			detail: {},
			checkedList: [],
			name: ''
		}
	}
	componentWillMount() {
		this.props.actions.getRoleRelationList({ app_id: '', page: 1, username: '' });
		api.get('/rbac/getAppInfo').then((response) => {
			this.setState({
				applist: response.data,
			});
		});
	}
	handleUpdate() {

		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let params = {
				id: this.state.detail.id,
				app_id: this.state.detail.app_id,
				user_id: this.state.detail.user_id,
				creator: this.state.detail.user_id,
				role_id: values.role_id
			};
			this.props.actions.updateRoleRelationAction(params);
		});
		this.closeModal();
	}
	update(record) {

		api.get('/rbac/getRolesList?app_id=' + record.app_id).then((response) => {

			this.setState({
				type: 'update',
				detail: record,
				checkedList: record.role_id,
				roleList: response.data.rows
			});
			this.showModal('CommonModal');
		})
	}
	showModal(modalType) {
		this.setState({ modalType });
	}
	handleCancel() {
		this.closeModal();
	}
	closeModal() {
		this.setState({ modalType: '' });
		this.form.resetFields();
	}
	jump(href, record) {
		const params = {
			app_id: record.app_id,
			id: record.user_id
		};
		//修改了push的方式
		this.props.history.push({
			pathname: href,
			search: '?' + qs.stringify(params)
		})
	}
	handleAppChange(value) {
		this.setState({
			appId: value,
		}, () => {
			this.props.actions.getRoleRelationList({ app_id: value, page: 1, username: '' });
		});

	}
	//搜索的方法
	search(value) {
		this.props.actions.getRoleRelationList({ app_id: this.state.appId, page: 1, username: value });
	}
	//搜索
	handleSearch(value) {
		this.setState({ name: value })
		this.search(value)
	}
	//回车事件
	handleSearchEnter(e) {
		this.setState({ name: e.target.value })
		this.search(e.target.value)
	}
	//清空缓存
	deleteCache() {
		this.props.actions.deleteCache().then((response) => {
			if (response.code == 200) {
				message.success(response.message)
			} else {
				message.error(response.message)
			}
		})
	}
	render() {
		const { roleRelationList, pagination } = this.props;
		let paginationObj = {
			onChange: (current) => {
				this.props.actions.getRoleRelationList({ app_id: this.state.appId, page: current, username: this.state.name });
			},
			total: pagination.totalCount,
			pageSize: pagination.perPage,
			current: pagination.currentPage,
		}
		const columns = [
			{
				title: '用户',
				dataIndex: 'username',
				key: 'username'
			},
			{
				title: '应用',
				dataIndex: 'app_name',
				key: 'app_name'
			},
			{
				title: '角色',
				dataIndex: 'roles_zh_name',
				key: 'roles_zh_name',
			},
			{
				title: '操作',
				dataIndex: 'operate',
				key: 'operate',
				align: 'center',
				render: (text, record) => (

					<span>
						<Button type="primary" onClick={this.jump.bind(this, '/auth/authority', record)} style={{ marginLeft: '8px', marginRight: '8px' }}>查看权限</Button>

						<Button type="primary" onClick={this.update.bind(this, record)}>修改</Button>
					</span>
				)
			}
		];
		return (
			<div className='RoleRelation_box' >
				<div style={{ overflow: 'hidden', width: '300px', float: 'right' }}>
					<Button type="primary" onClick={this.deleteCache.bind(this)} style={{ float: 'left', }}>清空缓存</Button>
					<Search
						placeholder="搜索用户名"
						onSearch={this.handleSearch.bind(this)}
						onPressEnter={this.handleSearchEnter.bind(this)}
						style={{ width: 200, float: 'right', marginBottom: '10px' }}
						enterButton
					/>
				</div>
				<AppInfo applist={this.state.applist} onChange={this.handleAppChange.bind(this)} />
				{/*<Button type='primary' className='RoleRelation_new' onClick={this.newRoleRelation.bind(this)}>新建</Button>*/}
				< Table
					dataSource={roleRelationList}
					columns={columns}
					pagination={paginationObj}
				/>

				<CommonModal
					visible={this.state.modalType === 'CommonModal'}
					onCancel={this.handleCancel.bind(this)}
					onEdit={this.handleUpdate.bind(this)}
					type={this.state.type}
					okText={"确认修改"}
					title={"用户角色修改"}
				>
					<RoleType
						ref={form => this.form = form}
						detail={this.state.detail}
						roleList={this.state.roleList}
						checkedFields={this.state.checkedList}
					>
					</RoleType>
				</CommonModal>

			</div>
		)
	}
}

// RoleRelation.propTypes = {
// 	actions: PropTypes.shape({
// 		getRoleRelationList: PropTypes.func.isRequired,
// 	}),
// 	roleRelationList: PropTypes.array.isRequired,
// 	pagination: PropTypes.object.isRequired
// }


const mapStateToProps = (state) => ({
	roleRelationList: getVisibleRoleRelation(state.auth.roleRelationList),
	pagination: state.auth.roleRelationPagination
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...roleRelationAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RoleRelation)


