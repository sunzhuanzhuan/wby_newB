import React from 'react'
import { Button, Form, Select, Input, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './EditField.css'
import { getDetail, fieldEdit } from '../../actions/fieldEdit'
const FormItem = Form.Item;
const Option = Select.Option;
// 修改
const AmendForm = Form.create()(
	(props) => {
		const { visible, onCancel, onCreate, form, data = {}, typechange, sourceVisible } = props;
		const { getFieldDecorator } = form;
		return (
			<Modal
				visible={visible}
				title='修改'
				okText='修改'
				onCancel={onCancel}
				onOk={onCreate}
				typechange={typechange}
				sourceVisible={sourceVisible}
				cancelText="取消"
			>
				<Form layout="horizontal">
					<FormItem label="字段key">
						{getFieldDecorator('field_key', {
							rules: [{ message: '请输入字段key' }],
							initialValue: data.field_key
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="字段名称">
						{getFieldDecorator('field_name', {
							rules: [{ message: '请输入字段名称' }],
							initialValue: data.field_name
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="字段映射关系">
						{getFieldDecorator('field_relation', {
							rules: [{ message: '请输入字段映射关系' }],
							initialValue: data.field_relation
						})(
							<Input />
						)}
					</FormItem>
					<FormItem
						label="字段来源"
						hasFeedback
					>
						{getFieldDecorator('field_type', {
							rules: [
								{ message: '请选择字段来源' },
							],
							initialValue: data.field_type
						})(
							<Select onChange={typechange}>
								<Option value="1">平台</Option>
								<Option value="2">评估</Option>
							</Select>
						)}
					</FormItem>
					<FormItem label="字段来源地址" style={sourceVisible}>
						{getFieldDecorator('source_url', {
							rules: [{ message: '请输入字段来源地址' }],
							initialValue: data.source_url
						})(
							<Input />
						)}
					</FormItem>
					<FormItem
						label="字段属性"
						hasFeedback
					>
						{getFieldDecorator('field_attribute', {
							rules: [
								{ message: '请选择字段属性' },
							],
							initialValue: data.field_attribute
						})(
							<Select>
								<Option value="1">订单</Option>
								<Option value="2">账号</Option>
								<Option value="3">评估</Option>
							</Select>
						)}
					</FormItem>
					<FormItem
						label="字段处理判断类型"
						hasFeedback
					>
						{getFieldDecorator('field_dealtype', {
							rules: [
								{ message: '请选择字段处理判断类型' },
							],
							initialValue: data.field_dealtype
						})(
							<Select>
								<Option value="1">时间类型</Option>
								<Option value="2">人名类型</Option>
								<Option value="3">手抄数据类型</Option>
								<Option value="4">图片地址类型</Option>
								<Option value="5">是否类型</Option>
							</Select>
						)}
					</FormItem>
				</Form>
			</Modal>
		);
	}
);
class Amend extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			fieldInfo: {},
			sourceVisible: {
				display: 'none'
			}
		}
	}

	showModal(id) {
		this.setState({ visible: true });
		this.props.actions.getDetail(id);
	}
	handleCancel() {
		this.setState({ visible: false });
		this.form.resetFields();
	}
	// 提交
	handleCreate() {
		const { filedAmendDetail } = this.props;
		const form = this.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (JSON.stringify(values) === "{}") {
				message.warning('没有做出任何修改');
			} else {
				const data = { filedAmendDetail };
				const dataObject = data.filedAmendDetail;
				if (values.field_key === undefined) {
					values.field_key = dataObject.field_key
				}
				if (values.field_name === undefined) {
					values.field_name = dataObject.field_name
				}
				if (values.field_relation === undefined) {
					values.field_relation = dataObject.field_relation
				}
				if (values.field_type === undefined) {
					values.field_type = dataObject.field_type
				}
				if (values.field_attribute === undefined) {
					values.field_attribute = dataObject.field_attribute
				}
				if (values.field_dealtype === undefined) {
					values.field_dealtype = dataObject.field_dealtype
				}
				if (values.source_url === undefined) {
					values.source_url = dataObject.source_url
				}
				values.id = this.props.id;
				this.props.actions.fieldEdit(values, values.id);
				form.resetFields();
				this.setState({ visible: false });
			}
		});
	}
	// 提交结束
	saveFormRef(form) {
		this.form = form;
	}
	typechange(value) {
		if (value === "1") {
			this.setState({
				sourceVisible: {
					display: 'block'
				}
			})
		} else {
			this.setState({
				sourceVisible: {
					display: 'none'
				}
			})
		}
	}
	render() {
		const { filedAmendDetail } = this.props;
		return (
			<div>
				<Button type="primary" onClick={this.showModal.bind(this, this.props.id)} className='EditField-amend'>修改</Button>
				<AmendForm
					ref={this.saveFormRef.bind(this)}
					visible={this.state.visible}
					onCancel={this.handleCancel.bind(this)}
					onCreate={this.handleCreate.bind(this)}
					data={filedAmendDetail}
					typechange={this.typechange.bind(this)}
					sourceVisible={this.state.sourceVisible}
				/>
			</div>
		);
	}
}
// 修改结束
Amend.propTypes = {
	actions: PropTypes.shape({
		getDetail: PropTypes.func.isRequired,
		fieldEdit: PropTypes.func.isRequired
	})
}

const mapStateToProps = (state) => ({
	filedAmendDetail: state.orderReducers.filedAmendDetail
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getDetail, fieldEdit
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Amend)
