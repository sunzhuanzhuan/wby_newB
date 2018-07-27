import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Modal, Tree, Button } from 'antd';
import { getUserTree } from '../actions/adminUser'
import "./AdminTree.less";

const TreeNode = Tree.TreeNode;
class AdminTree extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
		}

	}
	changeVisible = () => {
		const { visible } = this.state
		this.setState({ visible: !visible })
		this.props.actions.getUserTree()
	}
	// onSelect = (selectedKeys, info) => {
	// 	console.log('selected', selectedKeys, info);
	// }
	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.subs) {
				return (
					<TreeNode
						title={`${item.username}-->${item.real_name}-->${item.user_group_name_desc}`}
						key={item.user_id}
						dataRef={item}>
						{this.renderTreeNodes(item.subs)}
					</TreeNode>
				);
			}
			return <TreeNode
				key={item.user_id}
				title={`${item.username}-->${item.real_name}-->${item.user_group_name_desc}`} />;
		});
	}
	render() {
		const { userTreeList } = this.props
		const roleTree = userTreeList && userTreeList || [{
			real_name: 'hanyi',
			user_id: 'main:view',
			username: '韩毅',
			user_group_name_desc: '超级管理员'
		},
		{
			real_name: 'shanshan',
			user_id: 'documents',
			username: '姗姗',
			user_group_name_desc: '媒介组长',
			subs: [
				{
					real_name: 'lanping',
					user_id: 'documents:view',
					username: '兰萍',
					user_group_name_desc: '媒介经理组',
				},
				{
					real_name: 'shanshan',
					user_id: 'documents1',
					username: '姗姗2',
					user_group_name_desc: '媒介组长2',
					subs: [
						{
							real_name: 'lanping',
							user_id: 'documents:view1',
							username: '兰萍1',
							user_group_name_desc: '媒介经理组1',
						},
						{
							real_name: 'lizi',
							user_id: 'documents:agent1',
							username: '栗子1',
							user_group_name_desc: '媒介经理组1',
						}]
				}]
		}]
		return (
			<span>
				<Button type="primary" onClick={this.changeVisible}>用户树状图</Button>
				<Modal
					title='用户树状图'
					visible={this.state.visible}
					onCancel={this.changeVisible}
					className='noFooterModel'
					maskClosable={false}
				>
					<Tree
						showLine
						defaultExpandedKeys={['0-0-0']}
					// onSelect={this.onSelect}
					>
						{this.renderTreeNodes(roleTree)}
					</Tree>

				</Modal>
			</span>
		)
	}
}

const mapStateToProps = (state) => ({
	userTreeList: state.adminUserList.userTreeList
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getUserTree
	}, dispatch)
})
export default (connect(
	mapStateToProps,
	mapDispatchToProps
)(AdminTree))
// export default (Form.create()(AddAdminUser))
