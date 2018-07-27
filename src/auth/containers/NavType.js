import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import AuthModal from '../components/AuthModal'
import NavTypeForm from '../components/NavType'
import { Table, Button, Popconfirm, message } from 'antd';
import * as navTypeAction from '../actions/navType'
import { getVisibleSourceRule } from '../reducers/navType'
import api from '../../api/index'
import AppInfo from '../components/AppInfo'
import qs from "qs";
import './auth.less'

class NavType extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			modalType: '',
			loading: false,
			appId: ''
		}
	}
	async componentWillMount() {
		this.setState({ loading: true })
		await this.props.actions.getNavTypeList({ app_id: '', page: 1 });
		api.get('/rbac/getAppInfo').then((response) => {
			this.setState({
				loading: false,
				applist: response.data,
			});
		});
	}
	edit(id) {
		this.setState({ loading: true })
		this.props.actions.getNavTypeParam({ type: 'edit', editId: id });
		this.props.actions.getNavTypeDetail(id).then(() => {
			this.setState({ loading: false })
			this.showModal('AuthModal');
		})
	}
	newSourceRules() {
		this.props.actions.getNavTypeParam({ type: 'new', editId: '' });
		this.showModal('AuthModal');
	}
	showModal(modalType) {
		this.setState({ modalType });
	}
	handleCancel() {
		this.closeModal();
	}
	closeModal() {
		this.setState({ modalType: '' })
		this.form.resetFields()
	}
	handleCreate() {
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			this.setState({ loading: true })
			this.closeModal();
			this.props.actions.addNavType(values).then((response) => {
				if (response.code == 200) {
					message.success(response.message)
					this.props.actions.getNavTypeList({ app_id: this.state.appId, page: 1 }).then((response) => {
						if (response.code == 200) {
							this.setState({ loading: false })

						}
					})
				} else {
					message.error(response.message)
				}

			});

		});
	}
	handleEdit() {
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			values.id = this.props.getNavTypeParam.editId;
			this.setState({ loading: true })
			this.closeModal();
			this.props.actions.updateNavType(values).then((response) => {
				if (response.code == 200) {
					message.success(response.message)
					this.props.actions.getNavTypeList({ app_id: this.state.appId, page: 1 }).then((response) => {
						if (response.code == 200) {
							this.setState({ loading: false })

						}
					})
				} else {
					message.error(response.message)
				}

			});
		});
	}
	jump(href, record) {
		const params = {
			id: record.id,
			app_id: record.app_id
		}
		//修改了push的方式
		this.props.history.push({
			pathname: href,
			search: '?' + qs.stringify(params)
		})
	}
	async deleteNavTypeAction(id) {
		this.setState({ loading: true })
		await this.props.actions.deleteNavType(id)
		await this.props.actions.getNavTypeList({ app_id: this.state.appId, page: 1 })
		this.setState({ loading: false })
	}
	handleAppChange(value) {
		this.setState({
			appId: value,
		});
		this.props.actions.getNavTypeList({ app_id: value, page: 1 });
	}
	render() {
		const columns = [
			{
				title: '应用',
				dataIndex: 'app_name',
				key: 'app_name',
				width: '140px',
				render: (text, record) => (
					<div className="NavType_jump" type="primary" onClick={this.jump.bind(this, '/auth/navGroup', record)} style={{ color: '#1DA57A' }}>{text}</div>
				),
			}, {
				title: '导航名称',
				dataIndex: 'name',
				key: 'name',
				width: '200px'
			}, {
				title: '唯一名称',
				dataIndex: 'unique_name',
				key: 'unique_name',
				width: '200px'
			}, {
				title: '描述',
				dataIndex: 'description',
				key: 'description',
			}, {
				title: '操作',
				key: 'action',
				render: (text, record) => (
					<div>
						<Button type="primary" onClick={this.edit.bind(this, record.id)}>修改</Button>
						<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteNavTypeAction.bind(this, record.id)}>
							<Button className="NavGroup_delete" type="primary">删除</Button>
						</Popconfirm>
					</div>
				),
				width: '220px'
			}
		];
		const { navTypeList, getNavTypeDetail = {}, getNavTypeParam = {}, pagination } = this.props;
		let paginationObj = {
			onChange: (current) => {
				this.props.actions.getNavTypeList({ page: current, app_id: this.state.appId });
			},
			total: pagination.totalCount,
			pageSize: pagination.perPage,
			current: pagination.currentPage || 1,
		}
		return (
			<div className="sourceRules_box">
				<AppInfo applist={this.state.applist} onChange={this.handleAppChange.bind(this)} />
				<Button type="primary" className="sourceRules_new" onClick={this.newSourceRules.bind(this)}>新增</Button>
				<Table rowKey={record => record.id} dataSource={navTypeList} columns={columns} pagination={paginationObj} loading={this.state.loading} />
				<AuthModal
					visible={this.state.modalType === 'AuthModal'}
					onCancel={this.handleCancel.bind(this)}
					onNew={this.handleCreate.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					type={getNavTypeParam.type}
				>
					{
						getNavTypeParam.type === 'edit' ?
							<NavTypeForm
								ref={form => this.form = form}
								detail={getNavTypeDetail}
								type={getNavTypeParam.type}
								applist={this.state.applist}
							>
							</NavTypeForm> :
							<NavTypeForm
								ref={form => this.form = form}
								type={getNavTypeParam.type}
								applist={this.state.applist}
							>
							</NavTypeForm>
					}

				</AuthModal>
			</div>
		)
	}
}

// NavType.propTypes = {
// 	actions: PropTypes.shape({

// 	}),
// 	navTypeList: PropTypes.array.isRequired,
// 	getNavTypeDetail: PropTypes.object.isRequired,
// 	getNavTypeParam: PropTypes.object.isRequired,
// 	pagination: PropTypes.object.isRequired
// }

const mapStateToProps = (state) => ({
	navTypeList: getVisibleSourceRule(state.auth.navTypeList),
	getNavTypeDetail: state.auth.getNavTypeDetail,
	getNavTypeParam: state.auth.getNavTypeParam,
	pagination: state.auth.navTypePagination
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...navTypeAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavType)
