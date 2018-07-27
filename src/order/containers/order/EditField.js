import React, { Component } from 'react'
import { Table, Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getFieldList, fieldDelete } from '../../actions/fieldEdit'
import Popout from './EditField_add'
import Amend from './EditField_edit'
import './EditField.css'

class EditField extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fieldList: []
		}
	}
	componentWillMount() {
		this.props.actions.getFieldList();
	}
	// 删除
	deleteField(id) {
		this.props.actions.fieldDelete(id);
	}
	// 删除结束
	render() {
		const { filedList } = this.props;
		const columns = [{
			title: '字段key',
			dataIndex: 'field_key',
			key: 'field_key'
		}, {
			title: '字段名称',
			dataIndex: 'field_name',
			key: 'field_name',
		}, {
			title: '操作',
			key: 'action',
			render: (text, record) => (
				<span>
					<Amend type='amend' id={record.id} />
					<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.deleteField.bind(this, record.id)}>
						<Button type="primary" className='EditField-delete'>删除</Button>
					</Popconfirm>

				</span>
			),
		}];
		return (
			<div className='EditField-box'>
				<Table columns={columns} dataSource={filedList} rowKey='id' />
				<Popout type='add' />
			</div>
		)
	}
}

EditField.propTypes = {
	actions: PropTypes.shape({
		getFieldList: PropTypes.func.isRequired,
		fieldDelete: PropTypes.func.isRequired
	}),
	filedList: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
	filedList: state.orderReducers.filedList
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getFieldList, fieldDelete
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditField)

