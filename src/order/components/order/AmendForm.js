import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { Form, Input, Checkbox, Row, Col, Tabs, Divider } from 'antd';
import EditInput from '../order/EditInput'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane
const CheckboxGroup = Checkbox.Group

class AmendForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			checkedFields: {},
			hoverIndex: ''
		}
	}
	onChange(checkedValues, type) {
		this.setState({
			checkedFields: {
				[type]: checkedValues
			}
		})

		this.props.updateOrderFields(type, checkedValues)
	}
	handleSelectedField(e) {
		let selected = Number(e.target.value);
		let { cursorSortedIndex } = this.props;

		let index = cursorSortedIndex.indexOf(selected);

		//如果在已选列表中存在就删除此项，
		index > -1
			? cursorSortedIndex.splice(index, 1)
			: cursorSortedIndex.push(selected);
	}
	hasSortedIndexAndOrderFields(sorted, order) {
		return sorted.length && Object.keys(order).length
	}
	setHoverIndex(index) {
		console.log(index)
		this.setState({
			hoverIndex: index
		})
	}
	render() {
		const { data = {}, noData, form, orderFields, checkedFields: _checkedFields, cursorSortedIndex, orderFieldsByIds, moveItem } = this.props;
		const { getFieldDecorator } = form;
		const tabs = [
			{ title: '订单基本信息', name: "order" },
			{ title: '账号基本信息', name: "account" },
			{ title: '评估基本信息', name: "assess" }
		]
		return (
			<div>
				<Form layout="horizontal">
					<Row gutter={16}>
						<Col span={8}>
							<FormItem style={{ fontWeight: '600' }} label="模板名称">
								{getFieldDecorator('template_name', {
									rules: [{ required: true, message: '请输入模板名称' }],
									initialValue: data.template_name
								})(
									<Input placeholder='请输入模板名称' />
								)}
							</FormItem>
						</Col>
						<Col span={16}>
							<FormItem style={{ fontWeight: '600' }} label="模板描述">
								{getFieldDecorator('describe', {
									rules: [{ required: true, message: '请输入模板描述' }],
									initialValue: data.describe
								})(
									<Input placeholder='请输入模板描述' />
								)}
							</FormItem>
						</Col>
					</Row>
					<p style={{ margin: '25px 0 0', fontWeight: '600', color: 'rgba(0, 0, 0, 0.85)' }}>选择字段：</p>
					<Tabs activeKey={this.props.tab} animated={false} onTabClick={this.props.tabsChange}>
						{tabs.map((item) => {
							const _fields = orderFields[item.name] || []

							return <TabPane tab={item.title} key={item.name}>
								<FormItem>
									{getFieldDecorator(item.name, {
										initialValue: _checkedFields[item.name] || [],
										rules: [{ required: false, message: '请勾选要导出的字段' }]
									})(
										<CheckboxGroup onChange={(checkedValues) => this.onChange(checkedValues, item.name)}>
											{
												_fields.map(record => {
													return <Checkbox style={{ width: '220px' }} key={record.id} value={record.id} onClick={(e) => this.handleSelectedField(e)}>{record.field_name}</Checkbox>
												})
											}
										</CheckboxGroup>
									)}
								</FormItem>
							</TabPane>
						})}
					</Tabs>
					<Divider orientation="left">即将导出的项（单击项，可以修改导出名称）</Divider>
					<FormItem onChange={this.onChange.bind(this)}>
						<Row type="flex" justify="start" gutter={16}>
							{
								this.hasSortedIndexAndOrderFields(cursorSortedIndex, orderFieldsByIds) ?
									cursorSortedIndex.map((item, index) => {
										return <Col key={item}>
											<EditInput
												id={item}
												index={index}
												dataId={item}
												text={
													orderFieldsByIds[item]
														? orderFieldsByIds[item]['field_name']
														: ''
												}
												updateFieldName={(newField) => this.props.updateFieldName(item, newField)}
												moveItem={moveItem}
												setHoverIndex={this.setHoverIndex.bind(this)}
												className={index === this.state.hoverIndex
													? 'hover_item'
													: ''
												}
											/>
										</Col>
									}) : null
							}
						</Row>
					</FormItem>

				</Form>
				<div className='EditField-noData' style={noData}>没有进行任何修改</div>
			</div >
		)
	}
}

export default Form.create()(DragDropContext(HTML5Backend)(AmendForm));
