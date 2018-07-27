import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as action from "../action";
//rangeConfig
import { addOrderConfig, addKeys } from "../constans/manageConfig";
//less
import "./contractManage.less";
//antd
import { Table, Button, Input, Row, Col, Form, DatePicker, Modal } from "antd";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class OrderList extends React.Component {
	constructor() {
		super();
		this.state = {
			selectedRows: [],
			loading: true
		}
	}
	async componentWillMount() {
		await this.props.actions.getOrderAdd();
		this.setState({
			loading: false
		});
	}
	handleSearch = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			let rangeValue = [], values = {};
			if (fieldsValue['created_time']) {
				rangeValue = fieldsValue['created_time'];
				values = {
					...fieldsValue,
					'from_created_time': rangeValue[0].format('YYYY-MM-DD'),
					'to_created_time': rangeValue[1].format('YYYY-MM-DD')
				};
			} else {
				values = { ...fieldsValue };
			}
			delete values['created_time'];
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
			this.props.actions.getOrderAdd(values);
		});
	}
	handleSubmit = () => {
		this.props.actions.getSelectedRows(this.state.selectedRows);
		this.props.visibleCall();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let { getOrderList } = this.props.withdraw;
		addKeys(getOrderList);
		if (getOrderList.length > 1) {
			getOrderList.sort((a, b) => {
				a = a['create_time'].split(" ")[0].replace(/-/g, "");
				b = b['create_time'].split(" ")[0].replace(/-/g, "");
				return b - a;
			})
		}
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};
		const rangeConfig = {
			rules: [{ type: 'array', required: false }],
		};
		const strConfig = {
			rules: [{ type: 'string', required: false }]
		}
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({ selectedRows });
				// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			getCheckboxProps: record => ({
				disabled: record.order_id == '33047',
			}),
		};
		const footer = [
			<Button key="back" onClick={this.props.visibleCall}>取消</Button>,
			<Button key="submit" type="primary" onClick={this.handleSubmit}>提交</Button>
		];
		// let orderPagination = {
		// 	onChange: (current) => {
		// 		this.props.actions.gettApplyList({ page_no: current });
		// 	},
		// 	total: getOrderData.limit,
		// 	pageSize: getOrderData.per_page,
		// 	current: getOrderData.page_no,
		// 	showQuickJumper: true
		// }
		return <Modal className='contractManage' title='添加订单' width='1000px' visible={this.props.visible} onCancel={this.props.visibleCall} footer={footer}>
			<Form className='contractManage-search-form'>
				<Row gutter={40}>
					<Col span={10}>
						<FormItem label='主账号名：'  {...formItemLayout}>
							{getFieldDecorator('identity_name', strConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={10}>
						<FormItem label="创建时间：" {...formItemLayout} >
							{getFieldDecorator('created_time', rangeConfig)(
								<RangePicker placeholder={["开始时间", "结束时间"]} />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={40}>
					<Col span={10}>
						<FormItem label='订单ID：'  {...formItemLayout}>
							{getFieldDecorator('order_id', strConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={10}>
						<FormItem label='订单名称：'  {...formItemLayout}>
							{getFieldDecorator('requirement_name', strConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col style={{ textAlign: 'right', marginRight: '20px' }}>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
					</Col>
				</Row>
			</Form>
			<Table className='topGap' columns={addOrderConfig} dataSource={getOrderList} rowSelection={rowSelection} pagination={{ pageSize: 10 }} loading={this.state.loading} />
		</Modal>
	}
}
const AddOrder = Form.create()(OrderList);
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(state => ({ ...state }), mapDispatchToProps)(AddOrder)
