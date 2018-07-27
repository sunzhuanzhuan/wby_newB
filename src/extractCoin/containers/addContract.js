import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as action from "../action";
//config
import { addKeys } from "../constans/manageConfig";
//react-router
//import { browserHistory } from "react-router";
//component
import AddOrder from "./addOrder";
//antd
import { Form, Row, Col, Input, Button, Table, message } from "antd";
//less
import "./contractManage.less";
import qs from "qs";
const FormItem = Form.Item;
const { TextArea } = Input;
class contractAdd extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false,
			loading: true
		}
	}
	async componentWillMount() {

		let query = qs.parse(this.props.location.search.substring(1));
		let { getContractsOrderList, setContractsOrderList } = this.props.actions;
		if (query.contract_id) {
			await getContractsOrderList({ contract_id: query.contract_id, page_no: 1 });
			let { contract_no, memo } = this.props.withdraw.contractsOrderMsg;
			this.props.form.setFieldsValue({ 'contract_no': contract_no });
			this.props.form.setFieldsValue({ 'memo': memo });
		} else {
			await setContractsOrderList([]);
		}
		this.setState({
			loading: false
		});
	}
	hasErrors = (fieldsError) => {
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}
	handleOrderVisible = () => {
		this.setState({
			visible: true
		})
	}
	handleCancel = () => {
		this.setState({
			visible: false
		})
	}
	handleDel = async (order_id) => {
		const hide = message.loading('删除中...', 0);
		let { delContractsOrder, getContractsOrderList } = this.props.actions;
		let query = qs.parse(this.props.location.search.substring(1));
		if (query.contract_id) {
			await delContractsOrder({ contract_order_id: order_id }, hide);
			hide();
			getContractsOrderList({ contract_id: query.contract_id, page_no: 1 });
		} else {
			let arr = this.props.withdraw.getContractsOrderList;
			let ary = arr.filter(item => item.order_id !== order_id);
			await this.props.actions.setContractsOrderList(ary);
			hide();
		}
	}
	handleSubmit = async (e) => {
		const hide = message.loading('提交中...', 0);
		e.preventDefault();
		let query = qs.parse(this.props.location.search.substring(1));
		let { getContractsOrderList } = this.props.withdraw;
		let { postContractsAdd, postContractsEdit } = this.props.actions;
		let values = {}, order_ids = [];
		getContractsOrderList.forEach(item => {
			order_ids.push(item.order_id);
		});
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			delete fieldsValue['orderList'];
			Object.keys(fieldsValue).forEach(item => {
				if (!fieldsValue[item]) {
					delete fieldsValue[item];
				}
			})
			values = fieldsValue;
		});
		let editObj = { 'contract_id': query.contract_id, 'contract_no': values['contract_no'], 'order_ids': order_ids, 'memo': values['memo'] };
		let addObj = { 'contract_no': values['contract_no'], 'order_ids': order_ids, 'memo': values['memo'] };
		let res = Object.keys(query).contract_id ? await postContractsEdit(editObj, hide) : await postContractsAdd(addObj, hide);
		if (res.error) {
			return
		}
		hide();
		//修改了push的方式
		this.props.history.push('/contractManage');
		//browserHistory.push('/contractManage');
	}

	render() {
		const { getFieldDecorator, getFieldsError, getFieldValue } = this.props.form;
		let { getContractsOrderList, contractsOrderData } = this.props.withdraw;
		addKeys(getContractsOrderList);
		// if (getContractsOrderList.length > 1) {
		// 	getContractsOrderList.sort((a, b) => {
		// 		a = a['created_time'].split(" ")[0].replace(/-/g, "");
		// 		b = b['created_time'].split(" ")[0].replace(/-/g, "");
		// 		return b - a;
		// 	})
		// }

		// const formItemLayout = {
		// 	labelCol: { span: 4 },
		// 	wrapperCol: { span: 20 },
		// };
		const commentLayout = {
			labelCol: { span: 1 },
			wrapperCol: { span: 23 },
		}
		const contractNumConfig = {
			rules: [{ type: 'string', required: true, max: 20, message: '请输入合同单号,合同单号最多可录入20个字符 !' }]
		};
		const commentConfig = {
			rules: [{ required: false }]
		}
		const dialogProps = {
			visible: this.state.visible,
			visibleCall: () => {
				this.setState({ visible: false });
			}
		}
		const addContractConfig = [
			{
				title: '编号',
				dataIndex: 'key',
				key: 'key',
				align: 'center',
				render: (text, { key }) => {
					return key + 1
				}
			},
			{
				title: '主账号名称',
				dataIndex: 'identity_name',
				key: 'identity_name',
				align: 'center',
			},
			{
				title: '订单ID',
				dataIndex: 'order_id',
				key: 'order_id',
				align: 'center',
			},
			{
				title: '订单名称',
				dataIndex: 'requirement_name',
				key: 'requirement_name',
				align: 'center',
			},
			{
				title: '订单总额',
				dataIndex: 'price',
				key: 'price',
				align: 'center',
			},
			{
				title: '订单创建时间',
				dataIndex: 'create_time',
				key: 'create_time',
				align: 'center',
			},
			{
				title: '操作',
				dataIndex: 'action',
				align: 'center',
				render: (text, { order_id }) => {
					return <span>
						<a href='#' onClick={() => {
							this.handleDel(order_id);
						}}>删除</a>
					</span>
				}
			}
		];
		let query = qs.parse(this.props.location.search.substring(1));
		let contractOrderPagination = {
			onChange: (current) => {
				this.props.actions.getContractsOrderList({ contract_id: query.contract_id, page_no: current })
			},
			total: contractsOrderData.total,
			pageSize: contractsOrderData.per_page,
			current: contractsOrderData.current_page,
			showQuickJumper: true
		}
		return <div className='contractManage'>
			<Form>
				<Row type="flex" justify="start">
					<Col span={8}>
						<FormItem label='合同单号：'>
							{getFieldDecorator('contract_no', contractNumConfig)(
								<Input placeholder="请输入合同单号" />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span={2}>
						<FormItem label='选择订单' className='special-item' >
							<Button type='primary' onClick={() => {
								this.handleOrderVisible();
							}}>添加订单</Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
			<Table className='topGap' columns={addContractConfig} dataSource={getContractsOrderList} pagination={contractOrderPagination} loading={this.state.loading} />
			<Form className='topGap'>
				<Row>
					<Col span={24}>
						<FormItem label='备注：' {...commentLayout}>
							{getFieldDecorator('memo', commentConfig)(
								<TextArea placeholder="可输入合同备注" rows={4} maxLength={200} />
							)}
						</FormItem>
					</Col>
				</Row>
				<Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Button style={{ marginRight: '20px' }} size='large' onClick={() => {
							//修改了push的方式
							this.props.history.push("/contractManage")
							//browserHistory.push("/contractManage")
						}}>取消</Button>
						<Button type='primary' size='large' disabled={!getFieldValue('contract_no') || this.hasErrors(getFieldsError()) || getContractsOrderList.length < 1} onClick={this.handleSubmit}>提交</Button>
					</Col>
				</Row>
			</Form>
			{this.state.visible ? <AddOrder {...dialogProps} /> : null}
		</div >
	}
}
const addContract = Form.create()(contractAdd);
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(state => ({ ...state }), mapDispatchToProps)(addContract);
