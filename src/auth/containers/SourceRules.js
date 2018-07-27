import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'

import AuthModal from '../components/AuthModal'
import SourceRule from '../components/SourceRule'
import { getVisibleSourceRule } from '../reducers/sourceRules'
import { Table, Button, Popconfirm } from 'antd';

import * as sourceRulesAction from '../actions/sourceRules'

import './auth.less'

class SourceRules extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			modalType: '',
			loading: false,
			submitLoading: false
		}
	}
	async componentWillMount() {
		this.setState({ loading: true });
		await this.props.actions.getList();
		this.setState({ loading: false })
	}
	edit(id) {
		this.setState({ loading: true });
		this.props.actions.transParam({ type: 'edit', editId: id })
		this.props.actions.getItemDetail(id).then(() => {
			this.setState({ loading: false });
			this.showModal('AuthModal');
		});
	}
	newSourceRules() {
		this.props.actions.transParam({ type: 'new', editId: '' })
		this.showModal('AuthModal');
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
	handleCreate() {
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			this.setState({ submitLoading: true })
			this.props.actions.addSourceRuleAction(values).then((response) => {
				if (response.code == 200) {
					this.props.actions.getList();
					this.closeModal();
					this.setState({ loading: false });

				}

			});
		});
	}
	async deleteSourceRule(id) {
		this.setState({ loading: true });
		await this.props.actions.deleteSourceRuleAction(id);
		this.setState({ loading: false });
	}
	handleEdit() {
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			values.id = this.props.sourceRulesParam.editId;
			this.props.actions.updateSourceRules(values);
			this.closeModal();
		});
	}
	render() {
		const { sourceRulesList, sourceRulesDetail = {}, sourceRulesParam = {} } = this.props;
		const columns = [
			{
				title: '名称',
				dataIndex: 'show_name',
				key: 'show_name'
			},
			{
				title: '类名',
				dataIndex: 'class_name',
				key: 'class_name'
			},
			{
				title: '描述',
				dataIndex: 'description',
				key: 'description'
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				width: '200px',
				render: (text, record) => (
					<span>
						<Button type="primary" onClick={this.edit.bind(this, record.id)}>修改</Button>
						<Popconfirm title="确定要删除吗？" okText="确定" cancelText="取消" onConfirm={() => this.deleteSourceRule(record.id)}>
							<Button className="NavGroup_delete" type="primary">删除</Button>
						</Popconfirm>
					</span>
				)
			}
		];
		return (
			<div className='sourceRules_box'>
				<Button type='primary' style={{ marginBottom: '10px' }} onClick={this.newSourceRules.bind(this)}>新建</Button>
				<Table dataSource={sourceRulesList} columns={columns} loading={this.state.loading} rowKey={record => record.id} />
				<AuthModal
					visible={this.state.modalType === 'AuthModal'}
					onCancel={this.handleCancel.bind(this)}
					onNew={this.handleCreate.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					type={sourceRulesParam.type}
				>
					{
						sourceRulesParam.type === "edit" ?
							<SourceRule
								ref={form => this.form = form}
								detail={sourceRulesDetail}
								loading={this.state.submitLoading}
							>
							</SourceRule> :
							<SourceRule
								ref={form => this.form = form}
								loading={this.state.submitLoading}
							>
							</SourceRule>
					}
				</AuthModal>
			</div>
		)
	}
}

// SourceRules.propTypes = {
// 	actions: PropTypes.shape({
// 		getList: PropTypes.func.isRequired
// 	}),
// 	sourceRulesList: PropTypes.array.isRequired,
// 	sourceRulesDetail: PropTypes.array.isRequired,
// 	sourceRulesParam: PropTypes.array.isRequired
// }

const mapStateToProps = (state) => ({
	sourceRulesList: getVisibleSourceRule(state.auth.sourceRulesList),
	sourceRulesDetail: state.auth.sourceRulesDetail,
	sourceRulesParam: state.auth.sourceRulesParam

})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...sourceRulesAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SourceRules)

