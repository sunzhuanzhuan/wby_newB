import React, { Component } from 'react'
import { TreeSelect } from 'antd';
import "./AdminTree.less";
const TreeNode = TreeSelect.TreeNode;
class Tree extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	renderTreeNodes = (data) => {
		return data.map((item) => {
			if (item.subs) {
				return (
					<TreeNode
						title={item.zh_name}
						key={item.id}
						value={item.id}
					//dataRef={item}
					>
						{this.renderTreeNodes(item.subs)}
					</TreeNode>
				);
			}
			return <TreeNode
				key={item.id}
				title={item.zh_name}
				value={item.id} />;
		});
	}
	render() {
		const { treeProps, treelist = [] } = this.props
		return <TreeSelect {...treeProps} multiple className='tree-admin-select'>
			{this.renderTreeNodes(treelist)}
		</TreeSelect>

	}
}

export default Tree;
