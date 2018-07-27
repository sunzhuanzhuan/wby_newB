import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
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

const OrderInquireModal = Form.create()(
	(props) => {
		const { visible, onCancel, onCreate, form, count, values } = props;
		const { getFieldDecorator, validateFields, resetFields } = form;
		let { tempList = [] } = props
		const onOk = () => {
			validateFields((err, values) => {
				if (!err) {
					resetFields();
					onCreate(values)
				}
			})
		}

		return (
			<Modal
				visible={visible}
				title="查询结果"
				cancelText="取消"
				okText="确认"
				onCancel={onCancel}
				onOk={onOk}
				count={count}
				values={values}
				tempList={tempList}
			>
				<Form layout="vertical">
					<h3>{`总共查询到${count}条订单，是否确认导出？`}</h3>
					<div className="OrderInquireModal_filename">
						<FormItem label="选择导出模板" {...formItemLayout}>
							{getFieldDecorator('templateId', {
								rules: [{ required: true, message: '请选择导出模板' }],
							})(
								<Select
									showSearch
									style={{ width: 350 }}
									placeholder="请选择导出模板"
									optionFilterProp="children"
									filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									{tempList.map((item) => {
										return <Option key={item.id} value={item.id}>{item.template_name}</Option>
									})}
								</Select>
							)}
						</FormItem>
						<div className="hintbox">如无模板，可以<a href="tempList">创建新模板</a></div>
						<FormItem
							label="文件名称"
							help='请输入名称，不超过20个字，只能输入汉字、字母、数字、"-"或以上四项组合'
							{...formItemLayout}
						>
							{getFieldDecorator('fileName', {
								rules: [{
									pattern: /^[\da-zA-Z\u4e00-\u9fa5-]+$/, message: '请输入名称，不超过20个字，只能输入汉字、字母、数字、"-"或以上四项组合'
								}, {
									required: true, message: '请输入文件名称'
								}, {
									required: true, max: 20, message: '不得超过20个字'
								}],
							})(
								<Input placeholder="请填写Excel文件名" className="OrderInquireModal_input" />
							)}
						</FormItem>
					</div>
				</Form>
			</Modal>
		);
	}
);

export default OrderInquireModal;
