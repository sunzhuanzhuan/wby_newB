import React, { Component } from 'react'
import { Button, Table, notification, Divider, Popconfirm, message } from 'antd';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
	getDetail, getAllDetail, tempEdit,
	getOrderFields, updateOrderFields,
	updateFieldName, clearCheckedFiled,
	clearInfo, getTempList, tempDel, tempAdd
} from '../../actions/temp'

import AmendFormModal from '../../components/order/AmendFormModal'
import AmendForm from '../../components/order/AmendForm'
const { setTimeout } = window;

const ButtonGroup = Button.Group;

class TempList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			visible: false,
			source: 'create',
			// tempInfo: {},
			noData: {
				display: 'none'
			},
			sourceVisible: {
				display: 'none'
			},
			modalType: '',
			tab: 'order',
			cursorSortedIndex: []
		}
		this.moveItem = this.moveItem.bind(this)
	}
	// 删除模板
	tempDel(id) {
		this.props.actions.tempDel(id);
	}
	componentWillMount() {
		this.props.actions.getTempList();
	}
	handleOk() {
		this.setState({ loading: true });
		setTimeout(() => {
			this.setState({ loading: false, visible: false });
		}, 3000);
	}
	handleCancel() {
		this.closeModal();
		this.clearCheckedFiled();
		this.clearInfo();
	}

	saveFormRef(form) {
		this.form = form;
	}
	showModal(modalType) {
		this.setState({ modalType });
		this.getSortedIndex(this.props.tempInfo.order)
	}
	closeModal() {
		this.form.resetFields();
		this.setState({
			modalType: '',
			tab: 'order',
			cursorSortedIndex: []
		})
		document.getElementsByClassName('ant-modal-body')[0].scrollTop = 0
	}

	editField(id) {
		this.setState({ currentId: id, source: 'edit' })
		this.props.actions.getDetail(id).then(() => {
			this.showModal('AmendFormModal');
		});
		this.props.actions.getOrderFields(id);
	}

	newField() {
		this.setState({ source: 'create' })
		this.props.actions.getAllDetail().then(() => {
			this.showModal('AmendFormModal');
		});
	}

	getFieldByIds(ids) {
		const { orderFieldsByIds } = this.props;
		return ids.map(id => {
			const { field_name } = orderFieldsByIds[id];
			return { id, field_name }
		})
	}

	clearCheckedFiled() {
		this.props.actions.clearCheckedFiled();
	}
	clearInfo() {
		this.props.actions.clearInfo();
	}
	// 提交
	handleCreate() {
		const { currentId } = this.state;
		this.clearCheckedFiled();
		this.clearInfo();
		this.form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (JSON.stringify(values) === "{}") {
				notification.success({
					message: '提示',
					description: '没有进行任何操作',
				})
			} else {
				// if (currentId) {
				const { describe, template_name } = values;
				const _values = {
					describe,
					template_name,
					order: this.getFieldByIds(this.state.cursorSortedIndex)
				}
				if (currentId) {
					_values.id = currentId;
					this.props.actions.tempEdit(_values, currentId).then(() => {
						this.props.actions.getTempList().then(() => {
							message.success('提交成功');
						});
					});
				} else {
					this.props.actions.tempAdd(_values).then(() => {
						this.props.actions.getTempList().then(() => {
							message.success('提交成功');
						});
					})
				}
				this.form.resetFields();
				this.closeModal();
			}
		});
	}
	tabsChange(tab) {
		this.setState({ tab })
	}
	/**
	 *
	 * @param targetIndex 目标元素的下表
	 * @param startIndex 开始拖动的元素下标
	 */
	moveItem(targetIndex, startIndex) {
		let { cursorSortedIndex } = this.state;
		let startItem = cursorSortedIndex.splice(startIndex, 1)[0];
		cursorSortedIndex.splice(targetIndex, 0, startItem);


		this.setState({
			cursorSortedIndex
		})
	}
	getSortedIndex(order) {
		let orderFieldsId = order
			? order.map(item => item.id)
			: this.state.cursorSortedIndex;

		this.setState({
			cursorSortedIndex: orderFieldsId
		})
	}
	render() {
		const { tempInfo, orderFields, checkedFields } = this.props;
		let { templateList } = this.props;

		let checkedFieldsIds = [], checkedFieldsObjects = [];
		for (const key in checkedFields) {
			if (checkedFields.hasOwnProperty(key)) {
				const element = checkedFields[key];
				checkedFieldsIds = checkedFieldsIds.concat(element);
			}
		}
		checkedFieldsObjects = this.getFieldByIds(checkedFieldsIds);

		const columns = [{
			title: '模板名称',
			dataIndex: 'template_name',
			key: 'template_name',
		}, {
			title: '模板描述',
			dataIndex: 'describe',
			key: 'describe',
		}, {
			title: '操作',
			dataIndex: 'temp_tools',
			key: 'temp_tools',
			render: (text, record) => {
				return record.is_default === 1 || record.is_default === null
					? <ButtonGroup>
						<Button type="primary" onClick={this.editField.bind(this, record.id)} className='EditField-amend'>修改</Button>
						<Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No" onConfirm={this.tempDel.bind(this, record.id)}>
							<Button>删除</Button>
						</Popconfirm>
					</ButtonGroup>
					: null

			}
		}];
		return (
			<div>
				<Button type="primary" onClick={this.newField.bind(this)}>新建模板</Button>
				<Divider />
				<Table columns={columns} dataSource={templateList} />
				<AmendFormModal
					visible={this.state.modalType === 'AmendFormModal'}
					noData={this.state.noData}
					sourceVisible={this.state.sourceVisible}
					onCancel={this.handleCancel.bind(this)}
					onCreate={this.handleCreate.bind(this)}
					source={this.state.source}
				>
					<AmendForm
						ref={form => this.form = form}
						data={tempInfo}
						orderFields={orderFields}
						checkedFields={checkedFields}
						checkedFieldsObjects={checkedFieldsObjects}
						updateOrderFields={this.props.actions.updateOrderFields.bind(this)}
						updateFieldName={(id, name) => this.props.actions.updateFieldName(id, `${name}`)}
						noData={this.state.noData}
						tab={this.state.tab}
						tabsChange={this.tabsChange.bind(this)}
						orderFieldsByIds={this.props.orderFieldsByIds}
						cursorSortedIndex={this.state.cursorSortedIndex}
						moveItem={this.moveItem}
					></AmendForm>
				</AmendFormModal>
			</div>
		)
	}
}

TempList.propTypes = {
	actions: PropTypes.shape({
		getTempList: PropTypes.func.isRequired,
		tempDel: PropTypes.func.isRequired,
		getDetail: PropTypes.func.isRequired,
		tempEdit: PropTypes.func.isRequired,
		getOrderFields: PropTypes.func,
		getAllDetail: PropTypes.func.isRequired
	}),
	templateList: PropTypes.array,
	tempInfo: PropTypes.object,
	id: PropTypes.number
}

const mapStateToProps = (state) => ({
	tempList: state.orderReducers.tempList,
	templateList: state.orderReducers.templateList,
	tempInfo: state.orderReducers.tempInfo,
	orderFields: state.orderReducers.orderFields,
	orderFieldsByIds: state.orderReducers.orderFieldsByIds,
	checkedFields: state.orderReducers.checkedFields
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getTempList, tempDel, tempEdit, getDetail,
		getOrderFields, updateOrderFields, updateFieldName, getAllDetail,
		clearCheckedFiled, clearInfo, tempAdd
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TempList)

