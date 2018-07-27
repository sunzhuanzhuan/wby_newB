import React, { Component } from "react";
import { Tabs } from "antd";
import AssociateInvoiceTable from "./AssociateInvoiceTable";

const TabPane = Tabs.TabPane;

class CompleteTabs extends Component {

	render() {
		let config = {
			title: "已开发票", name: 'invoiced', key: 'invoice_id', columns: [
				{
					title: '发票号',
					dataIndex: 'invoice_number',
					align: 'center',
					render: (id) => {
						return id;
					}
				}, {
					title: '特殊申请单ID',
					dataIndex: 'invoice_application_id',
					align: 'center',
					render: (id, { invoice_application_link }) => {
						return <a href={invoice_application_link}>{id}</a>;
					}
				}, {
					title: '发票抬头',
					dataIndex: 'invoice_title',
					align: 'center',
					render: (text) => {
						return <span>{text || '-'}</span>
					}
				}, {
					title: '发票金额',
					dataIndex: 'amount',
					align: 'center',
					render: (text) => {
						return <span>{text || '-'}</span>
					}
				}, {
					title: '可关联金额',
					dataIndex: 'invoice_amount',
					align: 'center',
					render: (num) => num ? num.toFixed(2) : '-'
				}, {
					title: '发票类型',
					dataIndex: 'invoice_type_display',
					align: 'center',
					render: (text) => text || '-'
				}, {
					title: '开票时间',
					dataIndex: 'invoice_make_out_time',
					align: 'center',
					render: (time) => time || '-'
				}
			]
		}
		// let { isConsumption, isRecharge } = this.props;
		return (
			<Tabs defaultActiveKey='Invoiced' type="card">
				<TabPane tab={config.title} key={config.name}>
					<AssociateInvoiceTable
						position="bottom"
						typeDetail={config}
					/>
				</TabPane>
			</Tabs>
		);
	}
}
export default CompleteTabs;
