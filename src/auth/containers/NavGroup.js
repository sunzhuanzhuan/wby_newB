import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'

import CommonModal from '../components/CommonModal'
import NavGroups from '../components/NavGroup'
import { Table, Button, Popconfirm, message } from 'antd';
import './auth.less'
import { getVisibleNavGroup } from '../reducers/navGroup'
import * as navGroupAction from '../actions/navGroup'
import api from '../../api/index'
import qs from "qs";
class NavGroup extends Component {
	constructor(props) {
		super(props)
		//修改了获取值的方式
		const search = qs.parse(props.location.search.substring(1))
		this.state = {
			//categoryId: props.location.state.id,
			categoryId: search.id,
			visible: false,
			type: 'add',
			deatil: {},
			title: '',
			sort: ''
		}
	}
	componentWillMount() {
		//修改了获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		this.props.actions.getNavGroupList(search);
		//this.props.actions.getNavGroupList(this.props.location.state);

	}
	// 添加导航
	addNav(record) {
		//修改获取值的方式
		const search = qs.parse(this.props.location.search.substring(1))
		let level = record.level ? record.level + 1 : 1
		api.get('/rbac/getNavigationList?level=' + level + '&parent_id=' + record.id + '&app_id=' + search.app_id).then((response) => {
			this.setState({
				type: 'add',
				title: '添加导航排序',
				okText: '提交',
				navlist: response.data,
				sourceTypeList: this.props.sourceTypeList,
				detail: record || {}
			});
			this.showModal('CommonModal');
		});

	}
	// 修改导航
	editNav(record) {
		this.setState({
			type: 'edit',
			title: '修改导航排序',
			okText: '提交',
			detail: record
		})
		this.showModal('CommonModal');
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
	handleAdd() {
		const search = qs.parse(this.props.location.search.substring(1))

		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			let tmp = {
				parent_id: this.state.detail.id || 0,
				category_id: this.state.categoryId,
				navigation_id: values.id,
				sort_priority: values.sort_priority
			}
			let params = []
			params.push(tmp)
			this.props.actions.addNavigationCombinationsAction(params).then((response) => {
				if (response.code == 200) {
					message.success(response.message);
					this.closeModal();
					this.props.actions.getNavGroupList(search);
				} else {
					message.error(response.message)
				}
			});

		});
	}
	handleEdit() {

		this.form.validateFields(async (err, values) => {
			if (err) {
				return;
			}
			let params = {
				id: this.state.detail.combination_id,
				sort_priority: values.sort_priority
			}
			const search = qs.parse(this.props.location.search.substring(1))
			await this.props.actions.updateNavigationCombinationsAction(params);
			this.props.actions.getNavGroupList(search);
			this.closeModal();
		});

	}
	deleteNav(id) {
		const search = qs.parse(this.props.location.search.substring(1))
		// console.log('search', search)
		this.props.actions.deleteNavigationAction(id).then((response) => {
			if (response.code == 200) {
				message.success(response.message);
				this.props.actions.getNavGroupList(search);
			} else {
				message.error(response.message)
				this.props.actions.getNavGroupList(search);
			}
		})
	}
	render() {

		const { navGroupList = [] } = this.props;

		const getSubsList = (parentId = 0) => {
			return navGroupList.filter(function (item) {
				return item.parent_id == parentId
			})
		}

		const _getRowClassName = (record) => {
			let subs = getSubsList(record.id)
			return subs.length ? '' : 'Hello--hide-expand'
		}
		const columns = [
			{
				title: '导航名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: <span>权重</span>,
				dataIndex: 'sort_priority',
				key: 'sort_priority',
				sortOrder: 'descend',
				sorter: (a, b) => a.sort_priority - b.sort_priority,
			},
			{
				title: '操作',
				dataIndex: 'action',
				width: '300px',
				key: 'action',
				render: (text, record) => (
					<div>
						<Button type="primary" onClick={this.editNav.bind(this, record)}>修改</Button>
						{
							record.is_have_child == 0 ?
								<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteNav.bind(this, record.combination_id)}>
									<Button className="NavGroup_delete" type="primary">删除</Button>
								</Popconfirm> : null
						}
						<Button type="primary" className="NavGroup_delete" onClick={this.addNav.bind(this, record)}>添加子导航</Button>
					</div>
				),
			}
		];
		const getRows = (record) => {

			let subs = getSubsList(record.id)
			if (subs) {
				return <Table
					rowKey={record => (record.parent_id + '' + record.id)}
					columns={columns}
					dataSource={subs}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					pagination={false}
					showHeader={false}
				/>
			}

		}

		return (
			<div>
				<Button type="primary" className="NavGroup_add" onClick={this.addNav.bind(this)}>添加一级导航</Button>
				<Table
					rowKey={record => (record.parent_id + '' + record.id)}
					columns={columns}
					dataSource={getSubsList()}
					rowClassName={_getRowClassName}
					expandedRowRender={getRows}
					pagination={false}
				/>
				<CommonModal
					visible={this.state.modalType === 'CommonModal'}
					onCancel={this.handleCancel.bind(this)}
					onNew={this.handleAdd.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					type={this.state.type}
					okText={this.state.okText}
				>
					<NavGroups
						ref={form => this.form = form}
						title={this.state.title}
						type={this.state.type}
						navlist={this.state.navlist}
						sourceTypeList={this.state.sourceTypeList}
						detail={this.state.detail}
					>
					</NavGroups>
				</CommonModal>
			</div>
		)
	}
}

// NavGroup.propTypes = {
// 	actions: PropTypes.shape({
// 		getNavGroupList: PropTypes.func.isRequired
// 	}),
// 	navGroupList: PropTypes.array.isRequired,
// 	sourceTypeList: PropTypes.array.isRequired,

// }

const mapStateToProps = (state) => ({
	navGroupList: getVisibleNavGroup(state.auth.navGroupList),
	sourceTypeList: state.auth.getSourceTypeList,
	// navGroupList: getNavGroupSubs(getVisibleNavGroup(state.auth.navGroupList))
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...navGroupAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NavGroup)

