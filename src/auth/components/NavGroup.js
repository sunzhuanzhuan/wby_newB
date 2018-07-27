import React, { Component } from 'react'
import { Form, InputNumber, Select } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class NavGroups extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	render() {
		let { form, type, navlist = [], detail = {} } = this.props;
		const { getFieldDecorator } = form;
		const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 8 }, };
		const initVal = type == 'add' ? {} : detail;
		navlist = navlist || []
		return (
			<Form layout='horizontal'>
				{
					type == "add" ?
						<FormItem label="导航名称" {...formItemLayout}>
							{getFieldDecorator('id', {
								rules: [{
									required: true,
									message: '请选择导航',
								}]

							})(
								<Select
									showSearch
									style={{ width: 200 }}
									placeholder="请选择导航"
								>
									{navlist.map(d => <Option value={d.id} key={d.id}>{d.name}</Option>)}
								</Select>
							)}
						</FormItem>
						:
						<FormItem label="导航名称" {...formItemLayout}>
							<span> {detail.name} </span>
						</FormItem>
				}

				<FormItem label="权重" {...formItemLayout}>
					{getFieldDecorator('sort_priority', {
						rules: [{
							required: true,
							message: '请输入权重',
						}],
						initialValue: initVal.sort_priority
					})(
						<InputNumber min={1} placeholder="请输入权重" />
					)}
				</FormItem>

			</Form>
		)
	}
}

export default Form.create()(NavGroups);
