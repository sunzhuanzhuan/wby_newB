import React from 'react';
import { Checkbox, Pagination } from 'antd';
import "./index.less";

class WBYTableFooter extends React.Component {
	state = {
		plainOptions: this.props.data.map(item => item.key),
		selectedRowKeys: [],
		indeterminate: false,
		checkAll: false
	};

	setChangeState = (selectedRowKeys) => {
		const { plainOptions } = this.state;
		this.setState({
			selectedRowKeys,
			indeterminate:
				!!selectedRowKeys.length && selectedRowKeys.length < plainOptions.length,
			checkAll: selectedRowKeys.length === plainOptions.length
		});
	}

	onCheckAllChange = e => {
		this.props.onChange(e);
	};
	render() {
		const { plainOptions } = this.state;
		const { selectedRowKeys = [], title } = this.props;

		const indeterminate = !!selectedRowKeys.length && selectedRowKeys.length < plainOptions.length;
		const checkAll = selectedRowKeys.length === plainOptions.length;
		return (
			<div className='wby-table-footer'>
				<div className='wby-table-footer-left'>
					<Checkbox
						indeterminate={indeterminate}
						onChange={this.onCheckAllChange}
						checked={checkAll}
					>{title || "全选"}</Checkbox>
				</div>
				<div className='wby-table-footer-right'>
					<Pagination {...this.props.pagination} />
				</div>
			</div>
		);
	}
}

export default WBYTableFooter;
