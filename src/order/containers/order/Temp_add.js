import React from 'react'
import { Button, Form, Input, Modal, Checkbox, Row, Col } from 'antd';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './EditField.css'
import { tempAdd, getAllDetail } from '../../actions/temp'
const FormItem = Form.Item;
// 新建模板
const CollectionCreateForm = Form.create()(
	(props) => {
		const { visible, onCancel, onCreate, data = {}, form, sourceVisible } = props;
		const { getFieldDecorator } = form;
		return (
			<Modal
				visible={visible}
				title='创建模板'
				okText='创建'
				onCancel={onCancel}
				onOk={onCreate}
				sourceVisible={sourceVisible}
			>
				<Form layout="horizontal">
					<FormItem label="模板名称">
						{getFieldDecorator('template_name', {
							rules: [{ required: true, message: '请输入模板名称' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="模板描述">
						{getFieldDecorator('describe', {
							rules: [{ required: true, message: '请输入模板描述' }],
						})(
							<Input />
						)}
					</FormItem>
					<FormItem label="字段选择">
						{getFieldDecorator('order', {
							rules: [{ required: true, message: '选择导出的项' }],
						})(
							<Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
								<Row>
									{
										data.order ?
											data.order.map(function (item, index) {
												return <Col key={index} span={8}><Checkbox value={item.field_name}> {item.field_name}</Checkbox></Col>
											}) : ''
									}
								</Row>
							</Checkbox.Group>
						)}
					</FormItem>
				</Form>
			</Modal>
		);
	}
);
function onChange(/*checkedValues*/) {
	// console.log('checked = ', checkedValues);

}
class Popout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			tempAllInfo: {},
			sourceVisible: {
				display: 'none'
			}
		}
	}
	showModal() {
		this.setState({ visible: true });
	}
	handleCancel() {
		this.setState({ visible: false });
	}
	// 提交
	handleCreate() {
		// const { tempAllInfo } = this.props;
		const form = this.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			if (values.source_url == undefined) {
				values.source_url = "";
				this.props.actions.tempAdd(values);
			} else {
				this.props.actions.tempAdd(values);
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
		if (value == 1) {
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
		const { tempAllInfo } = this.props;
		return (
			<div>
				<Button type="primary" onClick={this.showModal.bind(this, this.props.id)} className=''>新建模板</Button>
				<CollectionCreateForm
					ref={this.saveFormRef.bind(this)}
					visible={this.state.visible}
					onCancel={this.handleCancel.bind(this)}
					onCreate={this.handleCreate.bind(this)}
					typeChange={this.typeChange.bind(this)}
					sourceVisible={this.state.sourceVisible}
					sourceRequired={this.state.sourceRequired}
					data={tempAllInfo}
				/>
			</div>
		);
	}
}
// 新增结束
Popout.propTypes = {
	actions: PropTypes.shape({
		tempAdd: PropTypes.func.isRequired,
		getAllDetail: PropTypes.func.isRequired
	})
}

const mapStateToProps = (state) => ({
	tempAllInfo: state.orderReducers.tempAllInfo
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		tempAdd, getAllDetail
	}, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Popout)
