import React from "react";
import { timestampToTime } from "../constans/utils";
export const contractConfig = [
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
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '包含订单总额',
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '备注',
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '操作人',
		dataIndex: '',
		key: '',
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
		dataIndex: '',
		align: 'center',
		render: () => {
			return <span>
				<a href='/contractManage/addContract'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
				<a href='#'>删除</a>
			</span>
		}
	}

];
export const addContractConfig = [
	{
		title: '编号',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '主账号名称',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单ID',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单名称',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单总额',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单创建时间',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},

]
export const addOrderConfig = [
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
]
export const applyDetailConfig = [
	{
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
	},
	{
		title: '订单号',
		dataIndex: 'order_id',
		key: 'order_id',
		align: 'center',
		render: (text, record) => {
			return <a href={record.detail_url} target='_blank'>{record.order_id}</a>
		}
	},
	{
		title: '执行完成时间',
		dataIndex: 'order_end_time',
		key: 'order_end_time',
		align: 'center',
		render: (text, { order_end_time }) => {
			return timestampToTime(order_end_time);
		}
	},
	{
		title: '预计服务时间（天）',
		dataIndex: 'expect_service_cycle',
		key: 'expect_service_cycle',
		align: 'center',
	},
	{
		title: '订单金额',
		dataIndex: 'order_amount',
		key: 'order_amount',
		align: 'center',
	},
	{
		title: '质检金额',
		dataIndex: 'qc_write_off',
		key: 'qc_write_off',
		align: 'center',
	},
	{
		title: '利息',
		dataIndex: 'expect_service_amount',
		key: 'expect_service_amount',
		align: 'center',
	},
	{
		title: '手续费',
		dataIndex: 'service_fee',
		key: 'service_fee',
		align: 'center',
	},
	{
		title: '预计可提金额',
		dataIndex: 'expect_payment_amount',
		key: 'expect_payment_amount',
		align: 'center',
	}
]
export const applyDetailAreadyConfig = [
	{
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
	},
	{
		title: '订单号',
		dataIndex: 'order_id',
		key: 'order_id',
		align: 'center',
		render: (text, record) => {
			return <a href={record.detail_url} target='_blank'>{record.order_id}</a>
		}
	},
	{
		title: '执行完成时间',
		dataIndex: 'order_end_time',
		key: 'order_end_time',
		align: 'center',
		render: (text, { order_end_time }) => {
			return timestampToTime(order_end_time);
		}
	},
	{
		title: '服务时间（天）',
		dataIndex: 'service_cycle',
		key: 'service_cycle',
		align: 'center',
	},
	{
		title: '订单金额',
		dataIndex: 'order_amount',
		key: 'order_amount',
		align: 'center',
	},
	{
		title: '质检金额',
		dataIndex: 'qc_write_off',
		key: 'qc_write_off',
		align: 'center',
	},
	{
		title: '利息',
		dataIndex: 'service_amount',
		key: 'service_amount',
		align: 'center',
	},
	{
		title: '手续费',
		dataIndex: 'service_fee',
		key: 'service_fee',
		align: 'center',
	},
	{
		title: '可提金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
	}
];
export const addKeys = (ary) => {
	ary.forEach((item, index) => {
		item['key'] = index;
	})
};
export const filterItem = (ary, valueObj) => {
	let arr = [];
	ary.forEach(item => {
		Object.keys(valueObj).forEach(key => {
			if (valueObj[key]) {
				if (key === 'created_time') {
					let str = item[key].split(" ")[0].replace(/-/g, "");
					(str >= valueObj[key][0] && str <= valueObj[key][1]) ? arr.push(item) : null;
				} else {
					item[key].includes(valueObj[key].toString()) ? arr.push(item) : null;
				}
			}

		})
	})
	return arr;
}
