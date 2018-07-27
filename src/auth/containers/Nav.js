import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
// import { browserHistory } from 'react-router'

import AuthModal from '../components/AuthModal'
import NavForm from '../components/NavForm'
import { Table, Button, Popconfirm, message } from 'antd';
import * as navAction from '../actions/nav'
import { getVisibleSourceRule } from '../reducers/nav'
import AppInfo from '../components/AppInfo'
import api from '../../api/index'

import './auth.less'

class NavType extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			modalType: '',
			loading: false
		}
	}
	componentWillMount() {
		this.setState({ loading: true })
		this.props.actions.getNavList({ app_id: '', page: 1 });
		api.get('/rbac/getAppInfo').then((response) => {
			this.setState({
				applist: response.data,
				loading: false
			});
		});
	}
	edit(id) {
		this.setState({ loading: true })
		this.props.actions.getNavParam({ type: 'edit', editId: id })
		this.props.actions.getNavDetail(id).then(() => {
			this.setState({ loading: false })
			this.showModal('AuthModal');
		})
	}
	async newSourceRules() {
		this.setState({ loading: true })
		await this.props.actions.getNavParam({ type: 'new', editId: '' })
		this.showModal('AuthModal');
		this.setState({ loading: false })
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
			this.props.actions.addNav(values).then((response) => {
				this.closeModal();
				if (response.code == 200) {
					message.success(response.message);

					this.props.actions.getNavList({ app_id: this.state.appId, page: 1 });
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
			delete values.parent_id
			delete values.level
			values.id = this.props.getNavParam.editId;
			this.props.actions.updateNav(values).then((response) => {
				this.closeModal();
				if (response.code == 200) {
					message.success(response.message);

					this.props.actions.getNavList({ app_id: this.state.appId, page: 1 });
				} else {
					message.error(response.message)
				}
			});
		});
	}
	async deleteNavItem(id) {
		this.setState({ loading: true })
		this.props.actions.deleteNav(id).then((response) => {
			if (response.code == 200) {
				message.success(response.message);
				this.props.actions.getNavList({ app_id: this.state.appId, page: 1 });
				this.setState({ loading: false })
			} else {
				message.error(response.message)
			}

		})
	}
	handleAppChange(value) {
		this.setState({
			appId: value,
		});
		this.props.actions.getNavList({ app_id: value, page: 1 });
	}
	render() {
		const { navList = [] } = this.props;

		const getSubsList = (parentId = 0) => {
			return navList.filter(function (item) {
				return item.parent_id == parentId
			})
		}

		const _getRowClassName = (record) => {
			let subs = getSubsList(record.id)
			return subs.length ? '' : 'Hello--hide-expand'
		}
		const columns = [
			{
				title: '应用',
				dataIndex: 'app_name',
				key: 'app_name',
				width: '140px'
			}, {
				title: '导航名称',
				dataIndex: 'name',
				key: 'name',
				width: '140px'
			}, {
				title: '唯一标识',
				dataIndex: 'unique_name',
				key: 'unique_name',
				width: '140px'
			}, {
				title: '级别',
				dataIndex: 'level',
				key: 'level',
				width: '140px'
			}, {
				title: '链接',
				dataIndex: 'url',
				key: 'url',
				width: '140px'
			}, {
				title: '创建时间',
				dataIndex: 'time',
				key: 'time',
				width: '140px'
			}, {
				title: '操作',
				key: 'action',
				render: (text, record) => {
					return <div>
						<Button type="primary" onClick={this.edit.bind(this, record.id)}>修改</Button>
						{
							record.is_have_child == 0 ?
								<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteNavItem.bind(this, record.id)}>
									<Button className="NavGroup_delete" type="primary">删除</Button>
								</Popconfirm> : null
						}
					</div>
				},
				width: '220px'
			}
		];
		const { getNavDetail = {}, getNavParam = {} } = this.props;
		//const { getNavDetail = {}, getNavParam = {}, pagination } = this.props;
		//let that = this;
		// let paginationObj = {
		// 	onChange: (current) => {
		// 		that.props.actions.getNavList({ app_id: that.state.appId, page: current });
		// 	},
		// 	total: pagination.totalCount,
		// 	pageSize: pagination.perPage,
		// 	current: pagination.currentPage,
		// }
		const getRows = (record) => {
			let subs = getSubsList(record.id)
			if (subs.length > 0) {
				return <Table
					rowKey={record => (record.parent_id + '' + record.id)}
					columns={columns}
					dataSource={subs}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					pagination={false}
					showHeader={false}
				/>
			} else {
				return
			}

		}
		return (
			<div className="sourceRules_box">
				<AppInfo applist={this.state.applist} onChange={this.handleAppChange.bind(this)} />
				<Button type="primary" className="sourceRules_new" onClick={this.newSourceRules.bind(this)}>新增</Button>
				<Table
					rowKey={record => (record.parent_id + '' + record.id)}
					columns={columns}
					dataSource={getSubsList()}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					pagination={false}
					loading={this.state.loading}
				/>
				<AuthModal
					visible={this.state.modalType === 'AuthModal'}
					onCancel={this.handleCancel.bind(this)}
					onNew={this.handleCreate.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					type={getNavParam.type}
				>
					{
						getNavParam.type === 'edit' ?
							<NavForm
								ref={form => this.form = form}
								detail={getNavDetail}
								type={getNavParam.type}
								applist={this.state.applist}
							>
							</NavForm> :
							<NavForm
								ref={form => this.form = form}
								type={getNavParam.type}
								applist={this.state.applist}
							>
							</NavForm>
					}

				</AuthModal>
			</div>
		)
	}
}

NavType.propTypes = {
	actions: PropTypes.shape({

	}),
	navList: PropTypes.array.isRequired,
	getNavDetail: PropTypes.object.isRequired,
	pagination: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	navList: getVisibleSourceRule(state.auth.navList),
	getNavDetail: state.auth.getNavDetail,
	getNavParam: state.auth.getNavParam,
	pagination: state.auth.navPagination

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...navAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavType)

