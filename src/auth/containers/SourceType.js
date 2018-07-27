import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AuthModal from '../components/AuthModal'
import SourceType from '../components/SourceType'
import { Table, Button, Popconfirm } from 'antd';
import { getVisibleSourceRule } from '../reducers/sourceType'
import * as sourceTypeAction from '../actions/sourceType'

import './auth.less'

class SourceRules extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			modalType: '',
			loading: false,
		}
	}
	async componentWillMount() {
		this.setState({ loading: true })
		await this.props.actions.getList();
		await this.props.actions.getSourceRuleList();
		this.setState({ loading: false })
	}
	edit(id) {
		this.setState({ loading: true })
		this.props.actions.transSourceTypeParam({ type: 'edit', editId: id })
		this.props.actions.getSourceTypeDetail(id).then(() => {
			this.setState({ loading: false })
			this.showModal('AuthModal');
		})
	}
	newSourceRules() {
		this.props.actions.transSourceTypeParam({ type: 'new', editId: '' })
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
			this.props.actions.addSourceType(values).then((response) => {
				this.closeModal();
				if (response.code == 200) {
					this.setState({ loading: true })
					this.props.actions.getList().then(() => {
						this.setState({ loading: false })
					})
				}
			});
		});
	}
	handleEdit() {
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			values.id = this.props.getSourceTypeParam.editId;
			this.props.sourceTypeList.map((item) => {
				if (item.resourceRule_show_name == values.rule_id) {
					values.rule_id = item.rule_id
				}
			})

			this.props.actions.updateSourceType(values).then((response) => {
				this.closeModal();
				if (response.code == 200) {
					this.setState({ loading: true })
					this.props.actions.getList().then(() => {
						this.setState({ loading: false })
					})
				}
			});

		});
	}
	async deleteSourceTypeItem(id) {
		this.setState({ loading: true })
		await this.props.actions.deleteSourceType(id)
		this.setState({ loading: false })
	}
	render() {
		const { sourceTypeList, getRuleList, getSourceTypeDetail = {}, getSourceTypeParam = {} } = this.props;
		const columns = [
			{
				title: '类型名称',
				dataIndex: 'name',
				key: 'name',
				width: '200px'
			}, {
				title: '唯一标识',
				dataIndex: 'unique_name',
				key: 'unique_name',
				width: '200px'
			}, {
				title: '规则',
				dataIndex: 'resourceRule_show_name',
				key: 'resourceRule_show_name',
				width: '140px'
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
						<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteSourceTypeItem.bind(this, record.id)}>
							<Button type="primary" className="NavGroup_delete">删除</Button>
						</Popconfirm>
					</div>
				),
				width: '220px'
			}
		];
		return (
			<div className="sourceRules_box">
				<Button type="primary" style={{ marginBottom: '10px' }} onClick={this.newSourceRules.bind(this)}>新增</Button>
				<Table dataSource={sourceTypeList} columns={columns} loading={this.state.loading} rowKey={(record) => record.id} />
				<AuthModal
					visible={this.state.modalType === 'AuthModal'}
					onCancel={this.handleCancel.bind(this)}
					onNew={this.handleCreate.bind(this)}
					onEdit={this.handleEdit.bind(this)}
					type={getSourceTypeParam.type}
				>
					{
						getSourceTypeParam.type === "edit" ?
							<SourceType
								ref={form => this.form = form}
								detail={getSourceTypeDetail}
								type={getSourceTypeParam.type}
								sourceRuleList={getRuleList}
							>
							</SourceType> :
							<SourceType
								ref={form => this.form = form}
								type={getSourceTypeParam.type}
								sourceRuleList={getRuleList}
							>
							</SourceType>
					}

				</AuthModal>
			</div>
		)
	}
}

SourceRules.propTypes = {
	actions: PropTypes.shape({
		getList: PropTypes.func.isRequired
	}),
	sourceTypeList: PropTypes.array.isRequired,
	getSourceTypeDetail: PropTypes.object.isRequired,
	getSourceTypeParam: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	sourceTypeList: getVisibleSourceRule(state.auth.sourceTypeList),
	getRuleList: state.auth.getRuleList,
	getSourceTypeDetail: state.auth.getSourceTypeDetail,
	getSourceTypeParam: state.auth.getSourceTypeParam
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		...sourceTypeAction
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SourceRules)

