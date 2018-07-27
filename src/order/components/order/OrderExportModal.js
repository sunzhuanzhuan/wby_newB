import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import './FilterForm.less'
const FormItem = Form.Item;
const { Option } = Select;

const CollectionCreateForm = Form.create()((props) => {
	const { title, visible, onCancel, onCreate, form } = props;
	const { getFieldDecorator, validateFields, resetFields } = form;
	let { tempList } = props

	const onOk = () => {
		validateFields((err, values) => {
			if (!err) {
				resetFields();
				onCreate(values)
			}
		})
	}
	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 6 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 14 },
		},
	};

	return (
		<Modal
			visible={visible}
			title={title}
			cancelText="取消"
			okText="确认"
			onCancel={onCancel}
			onOk={onOk}
		>
			<Form layout="vertical">
				<FormItem label="选择导出模板" {...formItemLayout}>
					{getFieldDecorator('templateId', {
						rules: [{ required: true, message: '选择导出模板' }]
					})(<Select style={{ width: 275 }} placeholder="请选择模板" >
						{tempList.map((item) => {
							return <Option key={item.id} value={item.id}>{item.template_name}</Option>
						})}
					</Select>)}
				</FormItem>
				<div className="hintbox">如无模板，可以<a href="tempList">创建新模板</a></div>
				<FormItem label="输入订单ID" {...formItemLayout}
					help="请输入订单ID，多个ID请以空格隔开"
				>
					{getFieldDecorator('order_id', {
						rules: [{
							pattern: /^[\d\s]+$/, message: '多个ID请以空格隔开'
						}, {
							required: true, message: '请输入订单ID'
						}]
					})(
						<Input placeholder='请输入订单ID' />
					)}
				</FormItem>
				<FormItem label="导出文件命名" {...formItemLayout}
					help='请输入名称，不超过20个字，只能输入汉字、字母、数字、"-"或以上四项组合'
				>
					{getFieldDecorator('fileName', {
						rules: [{
							pattern: /^[\da-zA-Z\u4e00-\u9fa5-]+$/, message: '请输入名称，不超过20个字，只能输入汉字、字母、数字、"-"或以上四项组合'
						}, {
							required: true, message: '请输入名称'
						}, {
							required: true, max: 20, message: '不得超过20个字'
						}],
					})(<Input placeholder='请输入名称' maxLength="20" />)}
				</FormItem>
			</Form>
		</Modal>
	);
});

export default CollectionCreateForm;
