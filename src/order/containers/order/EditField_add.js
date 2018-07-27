import React from 'react'
import { Button, Form, Select, Input, Modal } from 'antd';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './EditField.css'
import { fieldAdd } from '../../actions/fieldEdit'
const FormItem = Form.Item;
const Option = Select.Option;
// 新增
const CollectionCreateForm = Form.create()(
	(props) => {
		const { visible, onCancel, onCreate, form, typeChange, sourceVisible } = props;
		const { getFieldDecorator } = form;
		return (
			<Modal
				visible={visible}
				title='新增'
				okText='新增'
				onCancel={onCancel}
				onOk={onCreate}
				sourceVisible={sourceVisible}
			>
				<Form layout="horizontal">
					<FormItem label="字段key">
						{getFieldDecorator('field_key', {
							rules: [{ required: true, message: '请输入字段key' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="字段名称">
						{getFieldDecorator('field_name', {
							rules: [{ required: true, message: '请输入字段名称' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="字段映射关系">
						{getFieldDecorator('field_relation', {
							rules: [{ required: true, message: '请输入字段映射关系' }],
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
								{ required: true, message: '请选择字段来源' },
							],
						})(
							<Select onChange={typeChange}>
								<Option value="1">平台</Option>
								<Option value="2">评估</Option>
							</Select>
						)}
					</FormItem>
					{
						sourceVisible.display === 'block' ?
							<FormItem label="字段来源地址" style={sourceVisible}>
								{getFieldDecorator('source_url', {
									rules: [{ required: true, message: '请输入字段来源地址' }],
								})(
									<Input />
								)}
							</FormItem> : ''
					}
					<FormItem
						label="字段属性"
						hasFeedback
					>
						{getFieldDecorator('field_attribute', {
							rules: [
								{ required: true, message: '请选择字段属性' },
							],
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
								{ required: true, message: '请选择字段处理判断类型' },
							],
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
class Popout extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			fieldInfo: {},
			sourceVisible: {
				display: 'none'
			}
		};
	}
	showModal() {
		this.setState({ visible: true });
		this.form.resetFields();
	}
	handleCancel() {
		this.setState({ visible: false });
		this.form.resetFields();
	}
	// 提交
	handleCreate() {
		const form = this.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (values.source_url === undefined) {
				values.source_url = "";
				this.props.actions.fieldAdd(values);
			} else {
				this.props.actions.fieldAdd(values);
			}
			form.resetFields();
			this.setState({ visible: false });
		});
	}
	// 提交结束
	saveFormRef(form) {
		this.form = form;
	}
	typeChange(value) {
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
		return (
			<div>
				<Button type="primary" onClick={this.showModal.bind(this, this.props.id)} className='EditField-add'>新增</Button>
				<CollectionCreateForm
					ref={this.saveFormRef.bind(this)}
					visible={this.state.visible}
					onCancel={this.handleCancel.bind(this)}
					onCreate={this.handleCreate.bind(this)}
					typeChange={this.typeChange.bind(this)}
					sourceVisible={this.state.sourceVisible}
					sourceRequired={this.state.sourceRequired}
				/>
			</div>
		);
	}
}
// 新增结束
Popout.propTypes = {
	actions: PropTypes.shape({
		fieldAdd: PropTypes.func.isRequired
	})
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		fieldAdd
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Popout)
