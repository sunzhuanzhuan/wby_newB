import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as action from "../action";
//react-router改成了react-router-do引用
import { Link } from 'react-router-dom'
//config
import { addKeys } from "../constans/manageConfig";
//less
import "./contractManage.less";
//antd
import { Table, Button, Input, Row, Col, Form, Select, notification } from "antd";
import { timestampToTime } from "../constans/utils";
//滚动条
import Scolltable from "../../components/Scolltable";
const FormItem = Form.Item;
const Option = Select.Option;

class extractManage extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			hasDetail: false,
			optionParams: {}
		}
	}
	async componentWillMount() {
		await this.props.actions.gettApplyList();
		await this.props.actions.getAuthorizations();
		let { author } = this.props.withdraw;
		let selectObj = author.find(item => item.rule === "bool");
		let hasDetail = false;
		if (selectObj) {
			hasDetail = selectObj.permissions['flash.apply-detail.button'];
		} else {
			notification.error({
				message: '加载出错，刷新试试'
			})
		}
		this.setState({
			loading: false,
			hasDetail
		});
	}
	handleSearch = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			let values = fieldsValue;
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
			this.setState({ optionParams: values })
			this.props.actions.gettApplyList(values);
		});
	}
	render() {
		let { order_status, getApplyList, getApplyData } = this.props.withdraw;
		addKeys(getApplyList);
		getApplyList.map(item => {
			item['create_time'] = (timestampToTime(item['created_time']));
		});

		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};
		const strConfig = {
			rules: [{ type: 'string', required: false }]
		}
		const extractManageConfig = [
			{
				title: '提现单号',
				dataIndex: 'id',
				key: 'id',
				width: 100,
				align: 'center',
				fixed: 'left',
				render: (text, { id }) => {
					return <Link to={`/extractManage/applyDetail?id=${id}`}>{text}</Link>
				}
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				align: 'center',
				fixed: 'left',
				render: (text, { status }) => {
					return order_status[status];
				}
			},
			{
				title: '主账号名',
				dataIndex: 'identity_name',
				key: 'identity_name',
				width: 150,
				align: 'center',
			},
			{
				title: '订单总额',
				dataIndex: 'order_total_amount',
				key: 'order_total_amount',
				width: 150,
				align: 'center',
			},
			{
				title: '质检总额',
				dataIndex: 'qc_write_off',
				key: 'qc_write_off',
				width: 100,
				align: 'center',
			},
			{
				title: '利息总额',
				dataIndex: 'service_amount',
				key: 'service_amount',
				width: 100,
				align: 'center',
			},
			{
				title: '手续费总额',
				dataIndex: 'service_fee',
				key: 'service_fee',
				width: 100,
				align: 'center',
			},
			{
				title: '提现总额',
				dataIndex: 'payment_amount',
				key: 'payment_amount',
				width: 150,
				align: 'center',
			},
			{
				title: '包含订单',
				dataIndex: 'order_num',
				key: 'order_num',
				width: 80,
				align: 'center',
			},
			{
				title: '备注',
				dataIndex: 'comment',
				key: 'comment',
				align: 'center',
				width: '244px',
				// className: 'withdraw_text_overflow',
				render: (text, { comment }) => {
					if (comment && comment.length > 30) {
						return <div title={comment}>
							{comment.slice(0, 29) + '...'}
						</div>
					} else {
						return comment
					}
				}
			},
			{
				title: '申请时间',
				dataIndex: 'create_time',
				key: 'create_time',
				width: 200,
				align: 'center',
			}
		];
		const extractManageNoDetailConfig = [
			{
				title: '提现单号',
				dataIndex: 'id',
				key: 'id',
				width: 100,
				align: 'center',
				fixed: 'left',
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				width: 100,
				align: 'center',
				fixed: 'left',
				render: (text, { status }) => {
					return order_status[status];
				}
			},
			{
				title: '主账号名',
				dataIndex: 'identity_name',
				key: 'identity_name',
				width: 150,
				align: 'center',
			},
			{
				title: '订单总额',
				dataIndex: 'order_total_amount',
				key: 'order_total_amount',
				width: 150,
				align: 'center',
			},
			{
				title: '质检总额',
				dataIndex: 'qc_write_off',
				key: 'qc_write_off',
				width: 100,
				align: 'center',
			},
			{
				title: '利息总额',
				dataIndex: 'service_amount',
				key: 'service_amount',
				width: 100,
				align: 'center',
			},
			{
				title: '手续费总额',
				dataIndex: 'service_fee',
				key: 'service_fee',
				width: 100,
				align: 'center',
			},
			{
				title: '提现总额',
				dataIndex: 'payment_amount',
				key: 'payment_amount',
				width: 150,
				align: 'center',
			},
			{
				title: '包含订单',
				dataIndex: 'order_num',
				key: 'order_num',
				width: 80,
				align: 'center',
			},
			{
				title: '备注',
				dataIndex: 'comment',
				key: 'comment',
				align: 'center',
				width: '244px',
				// className: 'withdraw_text_overflow',
				render: (text, { comment }) => {
					if (comment && comment.length > 30) {
						return <div title={comment}>
							{comment.slice(0, 29) + '...'}
						</div>
					} else {
						return comment
					}
				}
			},
			{
				title: '申请时间',
				dataIndex: 'create_time',
				key: 'create_time',
				width: 200,
				align: 'center',
			}
		];
		let columns = this.state.hasDetail ? extractManageConfig : extractManageNoDetailConfig;
		let { optionParams } = this.state;
		let paginationObj = {
			onChange: (current) => {
				this.props.actions.gettApplyList({ page: current, ...optionParams });
			},
			total: getApplyData.total,
			pageSize: getApplyData.per_page,
			current: getApplyData.current_page,
			showQuickJumper: true
		}
		return <div className='contractManage'>
			<Form className='contractManage-search-form'>
				<Row>
					<Col span={8}>
						<FormItem label='主账号名：' {...formItemLayout}>
							{getFieldDecorator('identity_name', strConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<FormItem label='状态：' {...formItemLayout}>
							{getFieldDecorator('status', { initialValue: '' })(
								<Select style={{ width: 240 }}>
									<Option value="">不限</Option>
									<Option value="1">待审核</Option>
									<Option value="2">待打款</Option>
									<Option value="3">已打款</Option>
									<Option value="4">审核失败</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={8}>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>搜索</Button>
					</Col>
				</Row>
			</Form>
			<Scolltable scrollClassName='.ant-table-body' widthScroll={1504}>
				<Table className='topGap' scroll={{ x: 1504 }} columns={columns} dataSource={getApplyList} pagination={paginationObj} loading={this.state.loading} />
			</Scolltable>
		</div>
	}
}
const extractManager = Form.create()(extractManage);
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...action }, dispatch)
});
export default connect(state => ({ ...state }), mapDispatchToProps)(extractManager)
