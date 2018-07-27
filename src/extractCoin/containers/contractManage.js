import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as action from "../action";
//react-router改成了react-router-do引用
import { Link } from "react-router-dom";
//rangeConfig
import { addKeys } from "../constans/manageConfig";
//less
import "./contractManage.less";
//antd
import { Table, Button, Input, Row, Col, Form, DatePicker, Modal, message } from "antd";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;


class contract extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			contract_no: '',
			loading: true,
			hasDetail: false
		}
	}
	async componentWillMount() {
		await this.props.actions.getContractsList();
		this.setState({
			loading: false,
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
			})
			this.props.actions.getContractsList(values);
			// let ary = this.props.withdraw.contractsList;
			// let arr = filterItem(ary, values);
			// this.props.actions.setContractsList(arr);
		});
	}
	handleCancel = () => {
		this.setState({
			visible: false
		})
	}
	handleModal = (id) => {
		this.setState({
			visible: true,
			id: id
		})
	}
	handleDel = async (id) => {
		const hide = message.loading('删除中...', 0);
		let { delContract, getContractsList } = this.props.actions;
		await delContract({ contract_id: id }, hide);
		// let ary = this.props.withdraw.setContractsList;
		// ary = ary.filter(item => item.id !== id);
		// setContractsList(ary);
		this.setState({
			visible: false,
			id: ''
		});
		hide();
		getContractsList();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let { visible, id, loading } = this.state;
		let { setContractsList, contractsListData } = this.props.withdraw;
		addKeys(setContractsList);
		// if (setContractsList.length > 1) {
		// 	setContractsList.sort((a, b) => {
		// 		a = a['created_time'].split(" ")[0].replace(/-/g, "");
		// 		b = b['created_time'].split(" ")[0].replace(/-/g, "");
		// 		return b - a;
		// 	})
		// }
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};
		const contractNumConfig = {
			rules: [{ type: 'string', required: false }],
		};
		const adminUserConfig = {
			rules: [{ type: 'string', required: false }],
		};
		const rangeConfig = {
			rules: [{ type: 'array', required: false }],
		};
		const contractConfig = [
			{
				title: '编号',
				dataIndex: 'id',
				key: 'id',
				align: 'center',
			},
			{
				title: '合同号',
				dataIndex: 'contract_no',
				key: 'contract_no',
				align: 'center',
			},
			{
				title: '包含订单',
				dataIndex: 'order_num',
				key: 'order_num',
				align: 'center',
			},
			{
				title: '包含订单总额',
				dataIndex: 'sum_price',
				key: 'sum_price',
				align: 'center',
			},
			{
				title: '备注',
				dataIndex: 'memo',
				key: 'memo',
				align: 'center',
			},
			{
				title: '操作人',
				dataIndex: 'admin_username',
				key: 'admin_username',
				align: 'center',
			},
			{
				title: '创建时间',
				dataIndex: 'created_time',
				key: 'created_time',
				align: 'center',
			},
			{
				title: '操作',
				dataIndex: 'action',
				key: 'action',
				align: 'center',
				render: (text, { id }) => {
					return <span>
						<Link to={`/contractManage/addContract?contract_id=${id}`}>编辑</Link>&nbsp;&nbsp;&nbsp;&nbsp;
						<a href='javascript:;' onClick={() => {
							this.handleModal(id)
						}}>删除</a>
					</span >
				}
			}
		];
		let contractPagination = {
			onChange: (current) => {
				this.props.actions.gettApplyList({ page_no: current });
			},
			total: contractsListData.total,
			pageSize: contractsListData.per_page,
			current: contractsListData.current_page,
			showQuickJumper: true
		};
		return <div className='contractManage'>
			<Form className='contractManage-search-form' onSubmit={this.handleSearch}>
				<Row gutter={40}>
					<Col span={8}>
						<FormItem label='合同号：'  {...formItemLayout}>
							{getFieldDecorator('contract_no', contractNumConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem label='操作人：'  {...formItemLayout}>
							{getFieldDecorator('admin_username', adminUserConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={4} style={{ textAlign: 'right', marginRight: '20px' }}>
						<Button type="primary" htmlType="submit" >搜索</Button>
					</Col>
				</Row>
				<Row gutter={40}>
					<Col span={8}>
						<FormItem {...formItemLayout} label="创建时间：">
							{getFieldDecorator('created_time', rangeConfig)(
								<RangePicker placeholder={["开始时间", "结束时间"]} />
							)}
						</FormItem>
					</Col>
				</Row>
			</Form>
			<Link to='/contractManage/addContract'>
				<Button type='primary' className='addBtn'>添加合同</Button>
			</Link>
			<Table className='amazing-table' columns={contractConfig} pagination={contractPagination}
				dataSource={setContractsList} loading={loading} />
			<Modal title='警告' visible={visible} onCancel={this.handleCancel}
				style={{ top: 200 }}
				footer={[
					<Button key="back" onClick={this.handleCancel}>取消</Button>,
					<Button key="submit" type="primary" onClick={() => {
						this.handleDel(id)
					}}>确定</Button>
				]}
			>
				<p>是否删除合同号，删除合同号将导致预提现审核失败</p>
			</Modal>
		</div >
	}
}
const contractManage = Form.create()(contract);


const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(state => ({ ...state }), mapDispatchToProps)(contractManage)
