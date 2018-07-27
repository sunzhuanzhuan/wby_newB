import React, { Component } from 'react'
import { Table, Button, Modal } from 'antd';
import { Link } from "react-router-dom";
//import BusinessEdit from "./BusinessEdit";
import "./business.less";
//跟进记录
import FollowRecordForm from "./FollowRecordForm";
import VerticalAlignTable from "./VerticalAlignTable";
import FollowRecordTableShow from "./FollowRecordTableShow";
const confirm = Modal.confirm;

// reactNodeTitle = (title) => React.createElement('h2', { id: 'li1' }, title);
// reactNodeDetail = (detail) => React.createElement('span', { id: 'li2' }, detail);
// reactElement(title, detail) = React.createElement(reactNodeTitle(title), reactNodeDetail(detail))
class BusinessTable extends Component {
	constructor(props) {
		super(props)
		this.state = {
			pagination: {
				total: 0,
				current: 1,
				pageSize: 20,
			},
			loading: false
		}
	}

	render() {
		const {
			businessOpportunity,
			showModal,
			history,
			selectList,
			recoverBusinessOpportunity,
			saleCRM_business_table_operatin_button,
			onCancel,
			addFollowUp,
			seachAllValue } = this.props;
		//重新跟进弹窗
		function showConfirm(id) {
			confirm({
				title: '重新跟进商机',
				content: <div style={{ width: 160, margin: '29px auto 12px', paddingRight: 10 }}>确定重新跟进该商机吗？</div>,
				onOk() {
					recoverBusinessOpportunity({ id: id });
					seachAllValue()
				},
				onCancel() {
					seachAllValue()
				},
			});
		}
		function modelTitle(title, detail) {
			return <div>
				<h4 style={{ float: 'left', paddingRight: 5 }}>{title}</h4>
				<div style={{ fontWeight: 400, fontSize: 13, paddingRight: 8, opacity: 0.7 }}>商机名称：{detail}</div>
			</div>
		}
		//列表信息项
		let columns = [
			{
				title: '商机名称',
				dataIndex: 'name',
				key: 'name',
				align: 'center',
				render: (text, record) => {
					return <div>
						<Link to={`/sale/businessOpportunity/detail?id=${record.id}`}>{record.name}</Link>

					</div>
				}
			},
			{
				title: '所属公司',
				dataIndex: 'company_name',
				key: 'company_name',
				align: 'center',
				render: (text, record) => {
					return <a href={record.company_url} target="_blank">{record.company_name}</a>

				}

			},
			{
				title: '预估投放金额',
				dataIndex: 'estimate_sales_amount_name',
				key: 'estimate_sales_amount_name',
				align: 'center',
				render: (text, record) => {
					return record.estimate_sales_amount_name ? record.estimate_sales_amount_name : "-"
				}
			},
			{
				title: '商机阶段',
				dataIndex: 'status_name',
				key: 'status_name',
				render: (text, record) => {
					const title = modelTitle("终止原因", ` ${record.name}`)
					const list = [{
						title: '终止原因：',
						detail: record.termination_reason
					}, {
						title: '终止时间：',
						detail: record.termination_at
					}]
					const content = <VerticalAlignTable list={list} />

					return <div style={{ textAlign: 'center' }}>
						{record.status_name}
						{parseInt(record.status) === 5 ?
							<div>终止原因：<a onClick={() => { showModal(title, content) }}>查看</a>
							</div>
							: null}
						{parseInt(record.is_pause) === 2 ? <div className='stopMark' style={{ margin: '0px auto' }}>已暂停</div> : null}

					</div>
				}
			},
			{
				title: "最后一次跟进记录",
				dataIndex: 'termination_reason',
				key: 'termination_reason',
				render: (text, record) => <FollowRecordTableShow record={record} showModal={showModal} />
			},
			{
				title: "销售经理",
				dataIndex: 'sale_name',
				key: 'sale_name',
				align: 'center',
			},
			{
				title: "创建时间",
				dataIndex: 'created_at',
				key: 'created_at',
				align: 'center',
			},
			{
				title: "操作",
				width: 100,
				dataIndex: 'operational',
				key: 'operational',
				render: (text, record) => (<div>
					{/* 判断暂停/终止 */}
					{parseInt(record.is_pause) === 2 || parseInt(record.status) === 5 ?
						null :
						<Button type='primary' onClick={() => history.push(`/sale/businessOpportunity/add?id=${parseInt(record.id)}`)}>编辑商机</Button>}
					{/* 暂停后可以重新跟进 */}
					{parseInt(record.is_pause) === 2 ? <Button type='primary' onClick={() => showConfirm(record.id)}>重新跟进</Button> : null}
					{parseInt(record.status) !== 5 ? <Button type="primary" style={{ marginTop: 5 }} onClick={() => showModal('添加跟进记录', <FollowRecordForm businessId={record.id} company_id={record.company_id} selectList={selectList} onCancel={onCancel} addFollowUp={addFollowUp} isModal={true} />)}>添加跟进记录</Button> : <div style={{ textAlign: 'center' }}> -</div>}
				</div>
				)
			}
		].filter((item) => {
			// 根据可见性过滤操作列
			//光哥的过滤操作return !saleCRM_business_table_operatin_button && item.key !== "operational" || saleCRM_business_table_operatin_button
			return saleCRM_business_table_operatin_button ? true : item.key !== "operational"
		})

		return (
			<div>
				<Table
					rowKey={record => record.id}
					columns={columns}
					dataSource={businessOpportunity.list}
					className='business-table'
					bordered={true}
					pagination={{
						current: parseInt(businessOpportunity.page),
						pageSize: 20,
						total: parseInt(businessOpportunity.count),
						onChange: page => {
							this.props.onPaginationChange(page)
							this.props.onchangePage(page)
						}
					}}
				/>
			</div>
		)
	}
}
export default BusinessTable;
